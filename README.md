# 自动评分系统

## 使用方法
需要在github仓库中建立.github/classroom文件夹,在此文件夹中创建以.js为结尾的js文件，并提供judge接口，样例如下：
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