(function () {


    var module = angular.module('safeApply', []);

    module.factory('safeApply',
        function () {
            return function (fn,scope) {
                var phase = scope.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    scope.$apply(fn);
                }
            }
        });
}());