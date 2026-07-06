const fs = require('fs');
const code = fs.readFileSync('/home/user/workspace/poseart-app-v2/js/poses-data.js', 'utf8');
// Create a sandbox to eval the JS and extract POSES_LIBRARY
const vm = require('vm');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const lib = sandbox.POSES_LIBRARY;
const arr = Object.values(lib);
fs.writeFileSync('/home/user/workspace/pose_qa/poses_from_js.json', JSON.stringify(arr, null, 2));
console.log('Total poses in JS:', arr.length);
