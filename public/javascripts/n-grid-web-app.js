(function () {
    angular.module('nGridWebApp', ['draggable','safeApply'])
        .service('nGridService', ['$http', ngrid.NGridService])
        .controller('nGridController',  ngrid.NGridController.INJECTS)
    ;
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['nGridWebApp']);
    });
})();
