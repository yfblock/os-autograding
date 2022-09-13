let points = {
    'lua date.lua': [0, 1],
    'lua file_io.lua': [0, 1],
    'lua max_min.lua': [0, 1],
    'lua random.lua': [0, 1],
    'lua remove.lua': [0, 1],
    'lua round_num.lua': [0, 1],
    'lua sin30.lua': [0, 1],
    'lua sort.lua': [0, 1],
    'lua strings.lua': [0, 1],
}

function judge(outputFile) {
    outputFile.trim().split('\n').forEach((value, index) => {
        if(value.indexOf("testcase lua")==0 && value.endsWith("success")) {
            let name = value.replace('testcase', '').replace('success', '').trim();
            if(points[name]) {
                points[name][0] = points[name][1]
            }
        }
    })
    return points;
}

module.exports.judge = judge;