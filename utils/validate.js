
// 电话校验
var phoneReg = phone =>{
  
}

var validators={
  required: {
    rule: /.+/,
    msg: {
      common: '必填项不能为空',
      idCard0: '缺少正面照片',
      idCard1: '缺少反面照片',
      mobile: '手机号未填写',
      idCard: '身份证号码未填写',
      photo: '请上传身份证照片',
      name: '姓名未填写',
      expressDetail: '详细地址未填写',
      zipCode: true,
      area: '地区未选择',
      expire: '有效期未选择',
      colorCode: '请选择颜色',
      sizeCode: '请选择尺码',
      addressId: '请选择地址',
      num: '验证码未填写'
    }
  },
  mobile:{
    rule: /^[\d]{11}$/,
    msg: '手机号格式不正确'
  },
  idCard:{
    rule: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    msg: '身份证格式不正确'
  },
  zipCode:{
    rule: /^[\d]{6}$/,
    msg: '邮政编码格式不正确'
  }
}
//验证条件并且是否填满
var submitValidate = (properties, context) => {
  var regMsg;
  var requiredMsg;
  var result = properties.every((item) => {
    if (regValidate(item, context) !== true) {
      regMsg = validators[item].msg;
    }
    if (context.data[item] == undefined || context.data[item] == ''){
      requiredMsg = validators.required.msg[item];
    }
    return (context.data[item] !== undefined && context.data[item] !== '' && (regValidate(item, context) === true));
  });

  result = result ? true : (regMsg ? regMsg : requiredMsg);
  return result;
}
//是否填满
var validateRequired= (properties,context) =>{
  var msg;
  var result = properties.every((item)=>{
    if (context.data[item] !== undefined && context.data[item] !== '') {
      return true
    }else{
      msg = validators.required.msg[item];
    }
  });
  result = result? true : msg;
  return result;
}

//正则验证
var regValidate= (properties,context)=>{
  if (context.data[properties] && validators[properties]){
    if (validators[properties].rule.test(context.data[properties])) {
      return true
    }
    else {
      return validators[properties].msg;
    }
  }
  else{
    return true;
  }
}
var validate = (context,e) =>{
  var name = e.target.dataset.name;
  context.setData({ [name]: e.detail.value});
}

module.exports = {
  //验证条件并且是否填满
  submitValidate: submitValidate,
  //正则验证
  regValidate: regValidate,
  //是否填满
  validateRequired: validateRequired,
  validate: validate
}