function run(grade, availableGrade, log) {
    log(require("request"));
    let githubCore = require('@actions/github');
    log(githubCore.actor)
    log(grade, availableGrade);
}

module.exports.run = run;