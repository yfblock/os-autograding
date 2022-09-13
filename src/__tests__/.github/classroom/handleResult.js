function run({points, availablePoints}, { log, github, request }) {
    // let github = require("@actions/github")
    // let request = require("request");
    // console.log(request);
    // console.log(github);
    // log("github actor: ", github.actor)
    log(github.actor);
    log(request.post);
}

module.exports.run = run;