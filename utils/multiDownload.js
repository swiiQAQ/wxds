function multiDownload(list,successHandler){
  promise(list).then((tempList)=>{
    successHandler(tempList);
  })
}

function promise(list, tempList){
  var tempList = [];
  return new Promise((resolve)=>{
    recursion(0, list,  tempList, resolve);
  })
}

function recursion(i, list,  tempList, resolve){
  wx.downloadFile({
    url: list[i],
    success: (res) => {
      tempList[i] = res.tempFilePath;
      if (i == list.length - 1) {
        resolve(tempList);
      }
      else {
        recursion(i + 1, list, tempList, resolve);
      }
    }
  })
}

module.exports = {
  multiDownload: multiDownload
}