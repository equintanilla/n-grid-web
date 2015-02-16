ngrid.NGridService = function NGridService($http) {
    this.$http = $http;

};

ngrid.NGridService.prototype.get = function (url, onSuccess, onFailure) {
    this.$http.get('/ngrid/?page=' + url)
        .success(onSuccess)
        .error(onFailure)

};

ngrid.NGridService.prototype.mark = function (url, coordinate, value, onSuccess, onFailure) {
    var parsedUrl = this.parseUrl(url);
    this.$http.post('/ngrid/mark', {page: parsedUrl.page, row: coordinate.row, column: coordinate.column, value: value})
        .success(onSuccess)
        .error(onFailure)

};
ngrid.NGridService.prototype.move = function (url, fromCoordinate, toCoordinate, onSuccess, onFailure) {
    var parsedUrl = this.parseUrl(url);
    this.$http.post('/ngrid/move', {
        page: parsedUrl.page,
        fromRow: fromCoordinate.row,
        fromColumn: fromCoordinate.column,
        toRow: toCoordinate.row,
        toColumn: toCoordinate.column
    })
        .success(onSuccess)
        .error(onFailure)

};

ngrid.NGridService.prototype.parseUrl = function (url) {
    var regexResult = ngrid.NGridService.URL_REGEXP.exec(url);
    return {
        page: regexResult[0],
        n: regexResult[1]
    }

};

ngrid.NGridService.prototype.getGridArrayRepresentation = function (grid) {

    return grid;
};

ngrid.NGridService.URL_REGEXP = new RegExp('^\/*[^?]*\/([0-9]+)');

