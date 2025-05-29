angular.module('bibliotecaApp')
  .service('AuthService', [
    '$http', '$window',
    function($http, $window) {
      let apiUrl = 'https://68364957664e72d28e405aec.mockapi.io/usuarios/usuarios';
      this._loadUsers = function() {
        return $http.get(apiUrl)
          .then(res => res.data);
      };

      this.login = function(user, pass) {
        return this._loadUsers().then(users => {
          const match = users.find(u => u.username === user && u.password === pass);
          if (match) {
            $window.localStorage.setItem('isLogged', 'true');
            $window.localStorage.setItem('id', match.id);
            
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
          userData = { username: user, password: pass,favoritos:[] }
          return $http.post(apiUrl, userData)
            .then(() => true)
            .catch(() => false);
        });
      };

      this.isLoggedIn = function() {
        return $window.localStorage.getItem('isLogged') === 'true';
      };

      this.logout = function() {
        $window.localStorage.removeItem('id');
        $window.localStorage.removeItem('isLogged');
      };
    }
  ]);
