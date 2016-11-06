module.exports={
  setup:function(pro){
    pro.option("--auth <username>:<password> Authentication username and password");
  },
  result:function(pro){
    if (pro.auth){
      var auth=pro.auth.split(":");
      var username=auth[0];
      var pwd=auth[1];
      return {
        username:username,
        password:pwd
      }
    }
  }
}