#!/usr/bin/env python3
"""PoseArt Phase 2: non-production candidate photos, visual triage, and audit exports.

Inputs are an immutable Phase 1 manifest, a Wikimedia candidate metadata sweep,
and explicitly human-readable thumbnail-screening decisions. No pose joint is edited.
"""
from __future__ import annotations

import collections
import csv
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "deliverables" / "phase2-photo-evidence"
SOURCE = OUT / "poseart-photo-candidates.json"
POSES = ROOT / "deliverables" / "poseart-manifest.json"
DECISIONS = ROOT / "docs" / "pose-research" / "photo-review-decisions.json"
BASE_ATLAS = ROOT / "deliverables" / "poseart-visual-atlas.html"


def dump_csv(dest: Path, names: list[str], rows: list[dict]) -> None:
    with dest.open("w", encoding="utf-8", newline="") as fh:
        wr = csv.DictWriter(fh, fieldnames=names, extrasaction="ignore")
        wr.writeheader()
        wr.writerows(rows)


def build() -> dict:
    raw = json.loads(SOURCE.read_text())
    manifest = json.loads(POSES.read_text())
    review = json.loads(DECISIONS.read_text())
    assert raw["summary"]["source_commit"] == manifest["sourceCommit"]
    rows = raw["rows"]
    known = {p["id"]: p for p in manifest["poses"]}
    assert len(rows) == len(known) == 745
    assert {r["pose_id"] for r in rows} == set(known)
    assert set(review["pose_reviews"]).issubset(known)

    photo_rows: list[dict] = []
    coverage_rows: list[dict] = []
    by_image: dict[int, list[str]] = collections.defaultdict(list)
    per_pose: dict[str, dict] = {}
    decisions_total = collections.Counter()
    for pose in rows:
        pid = pose["pose_id"]
        curated = review["pose_reviews"].get(pid, {})
        entries = []
        for c in pose["candidates"]:
            fid = c["commons_page_id"]
            decision = curated.get("files", {}).get(str(fid), "not_visually_screened")
            decisions_total[decision] += 1
            by_image[fid].append(pid)
            item = {
                "pose_id": pid,
                "category": pose["category"],
                "pose_title": pose["title"],
                "pose_description": pose["description"],
                "commons_page_id": fid,
                "commons_file_title": c["file_title"],
                "landing_page": c["landing_page"],
                "thumbnail_url": c["thumbnail_url"],
                "artist": c["artist"],
                "license": c["license"],
                "license_url": c["license_url"],
                "text_score": c["text_score"],
                "visual_screen": decision,
                "visual_screen_justification": curated.get("issue", "No direct visual review performed"),
                "independent_rights_verification": "pending",
                "independent_reference_approved": "no",
                "production_geometry_approved": "no",
            }
            photo_rows.append(item)
            entries.append({k: item[k] for k in [
                "commons_page_id", "commons_file_title", "landing_page", "thumbnail_url",
                "artist", "license", "license_url", "visual_screen", "text_score"
            ]})
        per_pose[pid] = {
            "candidates": entries,
            "screened": bool(curated),
            "visual_issue": curated.get("issue", "Not yet visually screened"),
            "alignment": curated.get("pose_alignment", "unreviewed"),
            "verified": 0,
        }
        coverage_rows.append({
            "pose_order": known[pid]["order"], "category": pose["category"],
            "pose_id": pid, "title": pose["title"],
            "description": pose["description"],
            "four_original_schematic_views": 4,
            "commons_text_candidates": len(entries),
            "candidate_shortfall_to_three": max(0, 3-len(entries)),
            "independent_photos_verified": 0,
            "visual_review": "screened" if curated else "pending",
            "geometry_release": "blocked",
        })

    assert len(photo_rows) == raw["summary"]["total_candidate_associations"] == 274
    assert sum(r["independent_photos_verified"] for r in coverage_rows) == 0
    assert sum(r["four_original_schematic_views"] for r in coverage_rows) == 2980

    dump_csv(OUT / "745-pose-coverage-ledger.csv", list(coverage_rows[0]), coverage_rows)
    dump_csv(OUT / "candidate-photo-adjudication-ledger.csv", list(photo_rows[0]), photo_rows)
    proposal_rows = [{"research_id":p["id"],"category":p["category"],
                      "title":p["name"],"description":p["description"],
                      "rationale":p["why"],"requirements":"; ".join(p["requirements"]),
                      "live_catalog_member":"no", "photo_verified":"no"}
                     for p in manifest["proposed"]]
    dump_csv(OUT / "eight-unpromoted-pose-proposals.csv", list(proposal_rows[0]), proposal_rows)
    reused = [
        {"commons_page_id": fid, "linked_pose_ids": ids, "total_associations": len(ids)}
        for fid, ids in by_image.items() if len(ids) > 1
    ]
    reused.sort(key=lambda item: (-item["total_associations"], item["commons_page_id"]))
    audit = {
        "source_commit": manifest["sourceCommit"],
        "total_pose_records": len(coverage_rows),
        "total_candidate_associations": len(photo_rows),
        "unique_commons_files": len(by_image),
        "reused_file_associations": len(photo_rows) - len(by_image),
        "files_reused_across_poses": len(reused),
        "reused_files": reused,
        "visual_decisions": dict(decisions_total),
        "poses_visually_screened": len(review["pose_reviews"]),
        "independently_verified_photo_references": 0,
        "shortfall_to_3_per_pose_before_validation": sum(
            r["candidate_shortfall_to_three"] for r in coverage_rows),
        "shortfall_after_validation": 2235,
        "validation_gates": review["approval_gates"],
        "notes": [
            "Four schematic yaw views of a single inferred pose do not count as independent reference photos.",
            "Four photos of the same subject/session/camera image are not automatically four independent sources.",
            "No screen result is a production or legal permission signoff.",
            "A Commons free-license metadata field is a discovery lead, not independent licensing clearance.",
        ],
    }
    (OUT / "source-reuse-and-gates.json").write_text(json.dumps(audit, indent=2), encoding="utf8")

    # Overlay a complete, navigable metadata photo ledger onto the Phase 1 4-view atlas.
    atlas = BASE_ATLAS.read_text(encoding="utf8")
    payload = json.dumps({
        "summary": audit, "rows": per_pose,
        "proposed": manifest["proposed"],
    }, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")
    injected = '<script id="photo-evidence" type="application/json">' + payload + '</script>\n'
    assert atlas.count('<script id="atlas-data"') == 1
    atlas = atlas.replace('<script id="atlas-data"', injected + '<script id="atlas-data"', 1)
    atlas = atlas.replace(
        "const D=JSON.parse(document.getElementById('atlas-data').textContent);let page=0;",
        "const D=JSON.parse(document.getElementById('atlas-data').textContent);"
        "const E=JSON.parse(document.getElementById('photo-evidence').textContent);let page=0;",
        1,
    )
    atlas = atlas.replace(
        "function card(p){",
        """function photoPanel(p){
  const evidence=E.rows[p.id],photos=evidence.candidates;
  const label=photos.length+' Commons candidates / 0 approved';
  const items=photos.map((c,i)=>'<div class="photo-item"><a href="'+escape(c.landing_page)+'" target="_blank" rel="noopener noreferrer"><img loading="lazy" referrerpolicy="no-referrer" src="'+escape(c.thumbnail_url)+'" alt="Unverified photo candidate '+(i+1)+' for '+escape(p.title)+'"></a><div class="photo-caption"><strong>'+escape(c.commons_file_title)+'</strong><br>'+escape(c.artist)+' · '+escape(c.license)+'<br><span class="screen '+(c.visual_screen.startsWith('reject')?'rejected':c.visual_screen==='strong_photo_analogue'?'promising':'')+'">'+escape(c.visual_screen.replaceAll('_',' '))+'</span></div></div>').join('');
  const warning=evidence.screened?'<div class="photo-issue"><strong>Visual screen:</strong> '+escape(evidence.visual_issue)+'</div>':'<div class="photo-issue">Not visually checked: apparent title similarity is not photographic pose validation.</div>';
  return '<section class="photo-evidence"><h3>Photographic evidence · '+label+'</h3><div class="photo-gallery">'+(items||'<p>None found in the initial Commons sweep. Additional manual and catalog searches required.</p>')+'</div>'+warning+'</section>';
}
function card(p){""",
        1,
    )
    assert atlas.count("+'</div></article>';}") == 1
    atlas = atlas.replace("+'</div></article>';}", "+'</div>'+photoPanel(p)+'</article>';}", 1)
    atlas = atlas.replace(
        "<h1>PoseArt: The Pose Atlas</h1>",
        "<h1>PoseArt: Photographic Evidence &amp; Pose Atlas</h1>",
        1,
    )
    atlas = atlas.replace(
        "Complete title, instruction and joint-configuration inventory. Four original, reproducible 3D-derived schematic views per pose. Photo-source discovery is clearly separated from vetted photographic evidence.",
        "745 title/description records, 2,980 generated rig views and 274 Commons image leads. Each image has a source page, license metadata, and an explicit visual-review status. Not one photo or new geometry is approved for production.",
        1,
    )
    atlas = atlas.replace(
        "<div class=\"toolbar\">",
        '<div class="photo-summary"><strong>Phase 2 checkpoint:</strong> 745 of 745 poses searched; 274 candidate links across 116 poses (231 unique files); 48 poses with at least three candidates; 10 poses individually screened; <strong>0 approved photos</strong>. The evidence target is 2,235–2,980 independent photographic references. Proposed additions remain eight, not live.</div>\n<div class="toolbar">',
        1,
    )
    css = """
.photo-summary{margin:15px 0 19px;border-left:5px solid #956231;padding:13px 16px;background:#fff1dd;color:#553d22}
.photo-evidence{margin-top:17px;padding-top:11px;border-top:2px solid #d7e4df}
.photo-evidence h3{font:600 16px/1.3 system-ui;margin:5px 0 10px}
.photo-gallery{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
.photo-item{min-width:0;background:#f8f6f0;border:1px solid #e0ded7;border-radius:7px;overflow:hidden}
.photo-item img{width:100%;height:130px;object-fit:contain;display:block;background:#e5e5df}
.photo-caption{font-size:10px;overflow-wrap:anywhere;padding:6px;line-height:1.35;color:#53635e}
.photo-caption strong{font-size:10px;color:#284842}
.screen{display:inline-block;margin-top:4px;font-weight:700;color:#8b6225}.screen.rejected{color:#ad433f}.screen.promising{color:#246e59}
.photo-issue{font-size:12px;line-height:1.5;margin-top:8px;padding:9px;background:#f9efdf;border-radius:6px;color:#684d29}
@media(max-width:600px){.photo-gallery{grid-template-columns:repeat(2,minmax(0,1fr))}}
"""
    atlas = atlas.replace('</style>', css+'</style>', 1)
    assert "function photoPanel(p)" in atlas and "const E=JSON.parse" in atlas
    dest = OUT / "poseart-phase2-evidence-atlas.html"
    dest.write_text(atlas, encoding="utf8")
    return {**audit, "atlas_bytes": dest.stat().st_size,
            "category_coverage": raw["summary"]["category_coverage"]}


if __name__ == "__main__":
    print(json.dumps(build(), indent=2)[:7000])
