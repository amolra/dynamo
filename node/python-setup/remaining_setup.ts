const fs = require('fs')
const filePath = 'C:\Users\kalawants\AppData\Local\Programs\Python\Python310\Lib\site-packages\pip\_vendor\packaging'
const copy ='/python-setup/'
fs.copyFile(filePath,copy,(error: any)=>{
    if(error){
        throw error}
        else{
            console.log("file copied");
            
        }
    }
)