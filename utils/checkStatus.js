var checkStatus = function(status) {
  if (status == -1) {
    var data = {
      status: 'warn',
      text: '禁止访问',
      description: ['抱歉，您已违反规则被列入黑名单，请与客服联系。']
    }
    redirectStatus(data);
  } 
  else if (status == 0) {
    wx.redirectTo({
      url: '/pages/register/register',
    })
  }else if (status == 1) {
    var data = {
      status: 'waiting',
      text: '申请审核中...',
      description: ['您的信息正在审核', '请耐心等待并请关注手机短信通知']
    }
    redirectStatus(data);
  }  else if (status == 10) {
    var data = {
      status: 'waiting',
      text: '保证金已交',
      description: ['财务将核实您的支付情况', '通过后将已短信通知您审核结果，请耐心等待…']
    }
    redirectStatus(data);
  } else if (status == 2 || status == 11) {
    wx.redirectTo({
      url: '/pages/cashPledge/cashPledge?status=' + status,
    })
  } else if (status == 12 || status == 3) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
}

function redirectStatus(data) {
  data = JSON.stringify(data);
  wx.redirectTo({
    url: `/pages/status/status?data=${data}`,
  })
}

module.exports = {
  checkStatus: checkStatus
}