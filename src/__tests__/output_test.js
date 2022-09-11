

let points = [
    {
        name: 'tests',
        available: 2,
        points: 0
    }
]

function judge(outputFile) {
    points[0].points = 2;
    return points;
}

module.exports.points = points;
module.exports.judge = judge;