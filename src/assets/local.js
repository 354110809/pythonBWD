//本地存储的用户信息
export const setInfo = (url)=>{
  //如果没有queryString不写入 
   if(url.indexOf('?')==-1)return;
   let result = url.split("params=")[1];
   //本地存储用户信息
   localStorage.setItem('user',result);
}

//获取用户信息
export const getInfo = ()=>{
  let result = JSON.parse(unescape(localStorage.getItem('user')));
  return result;
}

