ngrid.NGridObject = function NGridObject(n, name) {
    this.n = n;
    this.name = name;
    this.grid = [];
    this.initialize();
};


ngrid.NGridObject.prototype.initialize = function () {

    for (var i = 0; i < this.n; i++) {
        if (!this.grid[i]) {
            this.grid[i] = [];

        }
        var currentRow = this.grid[i];
        for (var j = 0; j < this.n; j++) {
            if (!currentRow[j]) {
                currentRow[j] = new ngrid.NGridCell(i, j, false);
            }

        }
    }
};

ngrid.NGridObject.prototype.updateGridFromArray = function (array) {
    if (array.length != this.n) {
        throw 'Invalid array';

    }
    var changed = false;
    for (var i = 0; i < this.n; i++) {
        if (!this.grid[i]) {
            this.grid[i] = [];

        }
        var currentRow = this.grid[i];
        if (currentRow.length != this.n) {
            throw 'Invalid row length';

        }
        var currentArrayRow = array[i];
        for (var j = 0; j < this.n; j++) {
            var currentCell = currentRow[j];
            var currentArrayCell = currentArrayRow[j];
            if (currentCell.show !== currentArrayCell) {
                changed = true;
                currentCell.show = !!currentArrayCell;

            }


        }
    }
    return changed;
};

ngrid.NGridObject.prototype.calculateStateDiff = function (otherNGridObject) {
    var diff = [];
    for (var i = 0; i < this.n; i++) {
        var currentRow = this.grid[i];
        var currentOtherRow = otherNGridObject.grid[i];
        for (var j = 0; j < this.n; j++) {
            var currentCell = currentRow[j];
            var currentOtherCell = currentOtherRow[j];

            if (currentCell.show !== currentOtherCell.show) {
                diff.push(currentOtherCell);

            }
        }
        

    }
    return diff;

};

ngrid.NGridObject.fromServerResponse = function (response) {
    var gridObject = new ngrid.NGridObject(response.n, response.name);
    gridObject.updateGridFromArray(response.grid);
    return gridObject;

};

/**
 * * returns a string in the form 'x__-_x_-___'
 * @returns {string}
 */
ngrid.NGridObject.prototype.toStringRepresentation = function () {
    var stringRepresentation = '';
    for (var i = 0; i < this.grid.length; i++) {
        var currentRow = this.grid[i];

        for (var j = 0; j < this.n; j++) {
            var currentValue = currentRow[j];
            if (currentValue) {
                stringRepresentation += currentValue.show ? 'x' : '_';
            }

        }
        var rowSeparator = i < this.grid.length - 1 ? '-' : '';
        stringRepresentation += rowSeparator;

    }
    return stringRepresentation;

};

ngrid.NGridObject.prototype.sameGridInformation = function (otherNGridObject) {
    return this.toStringRepresentation() === otherNGridObject.toStringRepresentation();

};

ngrid.NGridCell = function (row, column, show) {
    this.row = row;
    this.column = column;
    this.show = show;

};

ngrid.NGridCoordinate = function (row, column) {
    this.row = row;
    this.column = column;

};

