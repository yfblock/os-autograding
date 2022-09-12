

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