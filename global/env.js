exports.get=get;
exports.set=set;
var def={
  "SH":"bash"
};

var dynamic={

};

function get(key){
  return typeof dynamic[key]!=="undefined"?dynamic[key]:typeof process.env[key]!=="undefined"?process.env[key]:def[key];
}
function set (key,val){
   dynamic[key]=val;
}

global.env={
  get:get,
  set:set
}