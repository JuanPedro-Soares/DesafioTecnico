angular.module('bibliotecaApp', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        template: '<initial-page></initial-page>'
      })
      .when('/login', {
        template: '<login></login>'
      })
      .when('/cadastro', {
        template: '<cadastro></cadastro>'
      })
      .otherwise({ redirectTo: '/' });
  })
  .run(function($rootScope, $location, AuthService) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (next.$$route && next.$$route.originalPath === '/' && !AuthService.isLoggedIn()) {
        event.preventDefault();
        $location.path('/login');
      }

    });
  });
