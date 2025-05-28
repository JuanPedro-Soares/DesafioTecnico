angular.module("bibliotecaApp").component("cadastro", {
  templateUrl: "components/cadastro/cadastro-page.template.html",
  controller: [
    "AuthService",
    "$location",
    function (AuthService, $location, ) {
      const main = this;
      main.username = "";
      main.password = "";
      main.successMessage = "";
      main.errorMessage = "";
      main.goToLogin = function () {
        $location.path("/login");
      };
      main.togglePassword = function () {
        main.showPassword = !main.showPassword;
        const input = document.getElementById("passwordInput");
        if (input) {
          input.type = main.showPassword ? "text" : "password";
        }
      };
      main.cadastrar = function ($event) {
        if ($event) $event.preventDefault();
        main.successMessage = "";
        main.errorMessage = "";

        if (!main.username || !main.password) {
          main.errorMessage = "Preencha todos os campos.";
          return;
        }
        AuthService.register(main.username, main.password)
          .then(function (success) {
            if (success) {
              main.successMessage =
                "Cadastro realizado com sucesso! Você será redirecionado para o login.";
                main.goToLogin();           
              
            } else {
              main.errorMessage = "Usuário já existe ou erro ao cadastrar.";
            }
          })
          .catch(function () {
            main.errorMessage = "Erro no cadastro. Tente novamente.";
          });
      };
    },
  ],
  controllerAs: "main",
});
