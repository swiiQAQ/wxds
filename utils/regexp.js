var idCardReg = idCard =>{
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if(reg.test(idCard)){
    return true
  }
  else{
    return false
  }
}

module.exports = {
  idCardReg : idCardReg
}