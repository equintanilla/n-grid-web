var nGridService = {};
nGridService.N_GRID_URL_REGEX = new RegExp('^\/*[^?]*\/([0-9]+)');


nGridService.parsePathName = function (pathname) {
    var regexResult = nGridService.N_GRID_URL_REGEX.exec(pathname);
    return {
        page: regexResult[0],
        n: regexResult[1]
    }


};

nGridService.initializeNGrid = function (n) {
    var grid = [];
    for (var i = 0; i < n; i++) {
        grid[i] = [];
        var row = grid[i];
        for (var j = 0; j < n; j++) {
            row[j] = false;
        }

    }
    return grid;

};
nGridService.buildGridResponseObject = function (grid, name, n) {
    return {grid: grid, name: name, n: n};

};


module.exports = nGridService;