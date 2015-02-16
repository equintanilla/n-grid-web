(function () {
    var module = angular.module('draggable', ['safeApply']);


    var draggableFunction = function (safeApply, draggableService) {
        return {
            scope: {
                onDragStart: '&',
                onDragOver: '&',
                onDrop: '&',
                onDragEnd: '&',
                elementData: '='
            },
            restrict: 'A',
            link: function (scope, element, attrs) {

                var el = element[0];
                var onDragStartFunction = scope.onDragStart();
                var onDropFunction = scope.onDrop();
                var onDragOverFunction = scope.onDragOver();
                var onDragEndFunction = scope.onDragEnd();

                el.ondragstart =
                    function (e) {
                        safeApply(function () {
                            draggableService.setSourceData(scope.elementData);
                            if (onDragStartFunction) {
                                onDragStartFunction(e, scope.elementData);
                            }

                        }, scope);
                    };
                el.ondrop = function (e) {

                    safeApply(function () {
                        if (e.preventDefault) {
                            e.preventDefault();
                        }
                        draggableService.setTargetData(scope.element);
                        onDropFunction(e, draggableService.getSourceData(), scope.elementData);
                    }, scope);
                };

                el.ondragover = function (e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    if (onDragOverFunction) {
                        safeApply(function () {
                            onDragOverFunction(e, scope.elementData);
                        }, scope);
                    }
                };


                el.ondragenter = function (e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                };


                el.ondragend =
                    function (e) {
                        safeApply(function () {

                            if (onDragEndFunction) {
                                onDragEndFunction( e, scope.elementData, draggableService.getTargetData());
                            }
                            draggableService.clear();

                        }, scope);
                    }
            }

        }
    };
    var draggableService = function () {
    };
    draggableService.prototype.setSourceData = function (sourceData) {
        this.sourceData = sourceData;

    };
    draggableService.prototype.getSourceData = function () {
        return this.sourceData;

    };
    draggableService.prototype.setTargetData = function (targetData) {
        this.targetData = targetData;

    };
    draggableService.prototype.getTargetData = function () {
        return this.targetScope;

    };
    draggableService.prototype.clear = function () {
        this.setSourceData(null);
        this.setTargetData(null);

    };

    module.service('draggableService', draggableService);
    module.directive('draggable', ['safeApply', 'draggableService', draggableFunction]);


})();



