var filesystem = require("fs");

function getAllFileNames {

   
    var results = [];

    filesystem.readdirSync(dir).forEach(function (file) {

        file = dir + '/' + file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isFile) {
            results.push(file);
        }
    });

    return results;

}

