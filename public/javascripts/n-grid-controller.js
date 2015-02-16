/**
 * *
 * @param $scope
 * @param $window
 * @param $log
 * @param $timeout
 * @param {ngrid.NGridService} nGridService
 * @param{draggableService} draggableService
 * @constructor
 */
ngrid.NGridController = function NGridController($scope,
                                                 $window,
                                                 $log,
                                                 $timeout,
                                                 nGridService,
                                                 draggableService) {
    this.$scope = $scope;
    this.nGridService = nGridService;
    this.draggableService = draggableService;
    this.$log = $log;

    var parsedUrl = nGridService.parseUrl($window.location.pathname);
    this.n = parsedUrl.n;
    this.page = parsedUrl.page;
    this.nGridObject = new ngrid.NGridObject(this.n, this.page);
    this.getNGrid();
    this.$timeout = $timeout;
    this.reloadPromise = null;
    $scope.$on('$destroy', angular.bind(this, function () {
        if (this.reloadPromise) {
            this.$timeout.cancel(this.reloadPromise);

        }

    }));

    this.spawnDelayedReload();
};
ngrid.NGridController.prototype.getNGrid = function () {
    this.nGridService.get(this.page, angular.bind(this, this.onSuccessfulGettingNGrid), angular.bind(this, this.onFailingGettingNGrid));
};
ngrid.NGridController.prototype.getNGridReload = function () {
    this.nGridService.get(this.page, angular.bind(this, this.onSuccessfulNGridReload), angular.bind(this, this.onFailingGettingNGrid));
};

ngrid.NGridController.prototype.onCellClick = function (cell) {
    this.nGridService.mark(this.page, new ngrid.NGridCoordinate(cell.row, cell.column), !cell.show, angular.bind(this, this.onSuccessfulMark), angular.bind(this, this.onFailingMark))
};

ngrid.NGridController.prototype.onSuccessfulGettingNGrid = function (response) {
    var nGridObject = ngrid.NGridObject.fromServerResponse(response);
    this.grid = nGridObject.grid;
    this.nGridObject.grid = this.grid;
};
ngrid.NGridController.prototype.onSuccessfulNGridReload = function (response) {
    this.reloadFromNGridObject(ngrid.NGridObject.fromServerResponse(response));
    this.spawnDelayedReload();
};

ngrid.NGridController.prototype.onFailingGettingNGrid = function (error) {
    this.$log.warn(error);
};


ngrid.NGridController.prototype.onFailingNGridReload = function (error) {
    this.onFailingGettingNGrid(error);
    this.spawnDelayedReload();

};
ngrid.NGridController.prototype.spawnDelayedReload = function () {
    this.reloadPromise = this.$timeout(angular.bind(this, this.getNGridReload), ngrid.NGridController.TIMEOUT);
};

ngrid.NGridController.prototype.onFailingGettingNGrid = function (error) {
    this.$log.warn(error);
};

ngrid.NGridController.prototype.onSuccessfulMark = function (response) {
    this.handleNewState(response);
};

ngrid.NGridController.prototype.onFailingMark = function (error) {
    this.$log.warn(error);
    this.handleNewState(error);
};

ngrid.NGridController.prototype.onSuccessfulMove = function (response) {
    this.handleNewState(response);
};

ngrid.NGridController.prototype.onFailingMove = function (error) {
    this.$log.warn(error);
    this.handleNewState(error);
};

ngrid.NGridController.prototype.handleNewState = function (responseOrError) {
    if (responseOrError.newState) {
        this.reloadFromNGridObject(ngrid.NGridObject.fromServerResponse(responseOrError.newState));
    }
};

ngrid.NGridController.prototype.reloadFromNGridObject = function (newGridObject) {
    var currentNGridObject = this.nGridObject;
    var stateDiff = currentNGridObject.calculateStateDiff(newGridObject);
    for (var i = 0; i < stateDiff.length; i++) {
        var currentNewGridCell = stateDiff[i];
        var currentOldGridCell = currentNGridObject.grid[currentNewGridCell.row][currentNewGridCell.column];
        currentOldGridCell.show = currentNewGridCell.show;

    }
};

ngrid.NGridController.prototype.onDragStart = function (e) {

};

ngrid.NGridController.prototype.onDragDrop = function () {
    var controller = this;
    return angular.bind(controller, function (event, sourceData, targetData) {
        this.nGridService.move(this.page,
            new ngrid.NGridCoordinate(sourceData.row, sourceData.column),
            new ngrid.NGridCoordinate(targetData.row, targetData.column),
            angular.bind(this, this.onSuccessfulMove),
            angular.bind(this, this.onFailingMove)
        );
    });
};


ngrid.NGridController.prototype.onDragEnd = function () {

};

ngrid.NGridController.TIMEOUT = 10 *1000; //ms
ngrid.NGridController.INJECTS = ['$scope', '$window', '$log', '$timeout', 'nGridService', 'draggableService', ngrid.NGridController];

