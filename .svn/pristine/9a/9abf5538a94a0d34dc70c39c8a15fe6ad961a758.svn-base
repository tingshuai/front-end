export const notifiMsg = (type,msg)=>{
    let title,icon;
       if(type === 'warn'){
          title = '警告';
          icon = "https://s1.ax1x.com/2018/06/16/CvKRIA.png"
       }else if(type === 'error'){
          title = '错误';
          icon = "https://s1.ax1x.com/2018/06/16/CvKfPI.png"
       }else if(type === 'success'){
          title = '成功'
          icon = 'https://s1.ax1x.com/2018/06/16/CvMrYn.png'
       }
        if (window.Notification){ 
           window.Notification.requestPermission((stauts)=>{
               if(stauts==='granted'){
                 let notf =  new Notification(title,{
                    body:msg,
                    icon:icon
                  })
                 setTimeout(() => {
                    notf.close();  
                 }, 1500);
               }
           })   
        }
}
export const groupMsg = (groupname,msg,groupImg)=>{
        if (window.Notification){ 
           window.Notification.requestPermission((stauts)=>{
               if(stauts==='granted'){
                let notf = new Notification(groupname,{
                    body:msg,
                    icon:groupImg
                  })
                  setTimeout(() => {
                     notf.close();  
                  }, 1500);
               }
           })   
        }
}