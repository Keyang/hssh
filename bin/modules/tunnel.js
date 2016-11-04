module.exports={
  setup:function(program){
    program.option("-L <local_port:host:port>", "Tunnel to remote / forward remote port to local");
  },
  result:function(program){
    var t=program.L;
    if (t && t.split(":").length !=3){
      throw("Invalid tunnel argumet. "+t);
    }else{
      return t;
    }
  }

}