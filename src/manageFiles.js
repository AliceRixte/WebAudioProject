var filesystem = require("fs");

function getAllFileNames(dir) {


    var results = [];

    filesystem.readdirSync(dir).forEach(function (file) {

        file = dir + '/' + file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isFile()) {
            results.push(file);
        }
    });

    return results;

}

function getAllSubDirNames(dir) {


    var results = [];

    filesystem.readdirSync(dir).forEach(function (file) {

        file = dir + '/' + file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results.push(file);
        }
    });

    return results;

}


function createJSONSampleSet(dir) {
    
}

function getPrefixPath(str) {
    let separated = str.split('/');
    separated.pop();
    return "/".join(separated);
}

function createJSONSampleSets(dir) {
    let sampleSets = getAllSubDirNames(dir);
    let prePath = "";
    if (sampleSets.length > 0) {
        prePath = getPrefixPath(sampleSets[0]);
    } else {
        let sampleSetNames = sampleSets.map(str => {
            let separated = str.split('/');
            return separated[separated.length - 1];
        });
        console.log(sampleSetNames);
    }



}

exports.createJSONSampleSet = createJSONSampleSet
exports.createJSONSampleSets = createJSONSampleSets