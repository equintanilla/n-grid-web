var express = require('express');
var router = express.Router();
var nGridService = require(global.__base + '/services/ngridservice');
var pages = {};
router.get('/', function (req, res, next) {
    var pageName = req.query.page;
    var paramsNotFound = getParamsNotFound({page: pageName});
    if (paramsNotFound.length > 0) {

        res.status(400);
        res.send({errorCode: 'required_params_missing', fields: paramsNotFound});
        return;
    }

    var parsedPathName = nGridService.parsePathName(pageName);

    if (!isValidPageName(parsedPathName)) {
        res.status(400);
        res.send({errorCode: 'invalid_page_name'});
        return;

    }

    var n = Number(parsedPathName.n);
    var grid = null;
    if (!pages[pageName]) {
        grid = nGridService.initializeNGrid(n);
        pages[pageName] = grid;


    } else {
        grid = pages[pageName];

    }
    res.send(nGridService.buildGridResponseObject(grid, pageName, n));
});

router.post('/mark', function (req, res, next) {
        var pageName = req.body.page;
        var parsedPathName = nGridService.parsePathName(pageName);
        if (!isValidPageName(parsedPathName)) {
            res.status(400);
            res.send({errorCode: 'invalid_page_name'});
            return;

        }
        var row = req.body.row;
        var column = req.body.column;
        var value = !!req.body.value;
        var n = parsedPathName.n;
        if (!pages[pageName]) {
            res.status(400);
            res.send({errorCode: 'page_unknown'});
            return;

        }
        var paramsNotFound = getParamsNotFound({row: row, column: column, page: pageName, value: value});
        if (paramsNotFound.length > 0) {

            res.status(400);
            res.send({errorCode: 'required_params_missing', fields: paramsNotFound});
            return;
        }
        if (row >= n || column >= n) {

            res.status(400);
            res.send({errorCode: 'out_of_bounds'});
            return;
        }
        var pageGrid = pages[pageName];
        var currentServerValue = pageGrid[row][column];
        if (value === currentServerValue) {
            res.status(400);
            res.send({
                errorCode: 'already_marked',
                newState: nGridService.buildGridResponseObject(pageGrid, pageName, n)
            });
            return;
        }
        pageGrid[row][column] = !pageGrid[row][column];
        res.send({newState: nGridService.buildGridResponseObject(pageGrid, pageName, n)});
    }
)
;

router.post('/move', function (req, res, next) {
    var pageName = req.body.page;
    var parsedPathName = nGridService.parsePathName(pageName);
    if (!isValidPageName(parsedPathName)) {
        res.status(400);
        res.send({errorCode: 'invalid_page_name'});
        return;

    }
    var fromRow = req.body.fromRow;
    var fromColumn = req.body.fromColumn;
    var toRow = req.body.toRow;
    var toColumn = req.body.toColumn;

    var n = parsedPathName.n;
    if (!pages[pageName]) {
        res.status(400);
        res.send({errorCode: 'page_unknown'});
        return;

    }
    var paramsNotFound = getParamsNotFound({
        fromRow: fromRow,
        fromColumm: fromColumn,
        toRow: toRow,
        toColumn: toColumn,
        page: pageName
    });
    if (paramsNotFound.length > 0) {

        res.status(400);
        res.send({errorCode: 'required_params_missing', fields: paramsNotFound});
        return;
    }

    if (fromRow >= n || fromColumn >= n || toColumn >= n || toRow >= n) {

        res.status(400);
        res.send({errorCode: 'out_of_bounds'});
        return;
    }
    var pageGrid = pages[pageName];
    var currentFromValue = pageGrid[fromRow][fromColumn];
    var currentToValue = pageGrid[toRow][toColumn];
    if (currentFromValue !== true || currentToValue !== false) {
        res.status(400);
        res.send({
            errorCode: 'invalid_move_action',
            newState: nGridService.buildGridResponseObject(pageGrid, pageName, n)
        });
        return;

    }
    pageGrid[fromRow][fromColumn] = false;
    pageGrid[toRow][toColumn] = true;
    res.send({newState: nGridService.buildGridResponseObject(pageGrid, pageName, n)});
});

var isValidPageName = function (parsedPathName) {
    return (typeof parsedPathName.n !== 'number' && !isNaN(parsedPathName.n)) || typeof parsedPathName.page !== 'string';

};
var getParamsNotFound = function (params) {
    var paramsNotFound = [];
    for (var paramName in params) {
        var paramValue = params[paramName];
        if (paramValue === undefined || paramValue === null) {
            paramsNotFound.push(paramName);

        }

    }
    return paramsNotFound;

};


module.exports = router;
