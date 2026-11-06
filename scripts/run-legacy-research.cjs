// Compatibility launcher for research-only legacy CommonJS scripts in PoseArt's ESM package.
// Isolates the loader override to this process and only within research folders.
'use strict';
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root=path.resolve(__dirname,'..');
const allowed=['run-atlas-geometry.js','build-pose-atlas.js','test-pose-atlas.js'];
const target=process.argv[2];
if(!allowed.includes(target))throw new Error('Unsupported research script: '+target);
const dirs=[path.join(root,'scripts')+path.sep,path.join(root,'audit_harness')+path.sep];
const original=Module._extensions['.js'];
Module._extensions['.js']=function(mod,filename){
  if(dirs.some(p=>filename.startsWith(p))) {
    // Call the standard CJS module compiler rather than changing package.json or runtime modules.
    return mod._compile(fs.readFileSync(filename,'utf8'),filename);
  }
  return original(mod,filename);
};
try{require(path.join(root,'scripts',target));}
finally{Module._extensions['.js']=original;}
