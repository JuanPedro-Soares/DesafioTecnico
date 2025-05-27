angular.module("bibliotecaApp").component("login", {
  templateUrl: "components/login/login-page.template.html",
  controller: [
    "$location",
    "AuthService",
    function ($location, AuthService) {
      const main = this;
      main.username = "";
      main.password = "";
      main.errorMessage = "";
      main.showPassword = false;
      main.togglePassword = function () {
        main.showPassword = !main.showPassword;
        const input = document.getElementById("passwordInput");
        if (input) {
          input.type = main.showPassword ? "text" : "password";
        }
      };
      main.goToCadastro = function () {
        $location.path("/cadastro");
      };
      main.login = function () {
        main.errorMessage = "";
        AuthService.login(main.username, main.password)
          .then(function (isLogged) {
            if (isLogged) {
              $location.path("/");
            } else {
              main.errorMessage = "Usuário ou senha inválidos";
            }
          })
          .catch(function () {
            main.errorMessage = "Erro ao fazer login. Tente novamente.";
          });
      };
    },
  ],
  controllerAs: "main",
});
