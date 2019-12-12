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

function getAllSubdirNames(dir) {


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

exports.getAllFileNames = getAllFileNames