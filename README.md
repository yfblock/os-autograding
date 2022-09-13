# 自动评分系统

## 使用方法
需要在github仓库中建立.github/classroom文件夹,在此文件夹中创建以.js为结尾的js文件，并提供judge接口，样例如下：
目前是基于已有输出来进行判断
```javascript
let points = {
    test1: [0, 2],
    test2: [0, 2],
    test3: [0, 2]
}

function judge(outputFile) {
    if(outputFile.indexOf('test file success')>=0) {
        points.test1[0] += points.test1[1];
        points.test3[0] += points.test3[1]/2;
    }
    return points;
}

module.exports.judge = judge;
```

points的key为单项测试名称，后面的数组，第一个数为得到的分数，第二个数为当前这个测试的分数。

eg: 可以存在多个js文件来进行多个测试。

需要在autograding里设置信息
```json
{
    "outputFile": "qemu_output.txt", // 执行结果输出文件, 必选
    "externalFile": "handleResult.js"   // 外置脚本，在成绩处理完毕时可做操作，可选，如果没有可删除此项
}
```
handleResult.js 文件

```javascript
async function run({points, availablePoints}, { log, github, axios }) {
    // let github = require("@actions/github")
    // let request = require("request");
    // console.log(request);
    // console.log(github);
    // log("github actor: ", github.actor)
    log(github.actor);
    log(axios.get);
    
    const get = (url,params)=>{
        params = params || {};
        return new Promise((resolve,reject)=>{
            // axiso 自带 get 和 post 方法
            axios.get(url,{
                params,
            }).then(res=>{
                if(res.data.status===0){
                    resolve(res.data);
                }else{
                    alert(res.data.msg)
                }
            }).catch(error=>{
                log('网络异常');
            })
        })
    }
    let data = await get("url");
    console.log(data);
}

module.exports.run = run;
```