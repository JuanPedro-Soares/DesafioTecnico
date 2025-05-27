angular.module('bibliotecaApp')
  .service('AuthService', [
    '$http', '$window',
    function($http, $window) {
      this._loadUsers = function() {
        return $http.get('http://localhost:4001/usuarios')
          .then(res => res.data);
      };

      this.login = function(user, pass) {
        return this._loadUsers().then(users => {
          const match = users.find(u => u.username === user && u.password === pass);
          if (match) {
            $window.localStorage.setItem('isLogged', 'true');
            return true;
          }
          return false;
        });
      };

      this.register = function(user, pass) {
        return this._loadUsers().then(users => {
          if (users.find(u => u.username === user)) {
            return false;
          }
          return $http.post('http://localhost:4001/usuarios', { username: user, password: pass,favoritos:[] })
            .then(() => true)
            .catch(() => false);
        });
      };

      this.isLoggedIn = function() {
        return $window.localStorage.getItem('isLogged') === 'true';
      };

      this.logout = function() {
        $window.localStorage.removeItem('isLogged');
      };
    }
  ]);
