angular.module('bibliotecaApp').component('initialPage', {
  templateUrl: 'components/initial-page/initial-page.template.html', 
  controller: function($http, LivroService,$location, AuthService) {
    const main = this;

    main.query = "";
    main.pesquisado = "";
    main.livros = [];
    main.podeBuscar = false;
    main.logo = "assets/logo.jpeg";
    main.generos = [];
    main.subgenerosPorGenero = {};
    main.generoSelecionado = null;
    main.subgeneros = [];
    main.subgeneroSelecionado = null;
    main.semresultado = false;
    main.subgeneroProcurado = "";
    main.page = 1;
    main.totalPages = 1;
    main.isLoading = false;
    main.filtroSelecionado = "Título";
    main.filtro = { Filtrar: [] };
    main.blur = false;
   
    main.aplicarBlur = function(){
      main.blur=true
    }
    main.retirarBlur = function(){
      main.blur=false;
    }
    main.$onInit = function () {
      $http.get("data/filtro.json").then(
        function (response) {
          main.filtro = response.data;
        },
        function (error) {
          console.error("Erro ao carregar filtro:", error);
        }
      );

      $http.get("data/categorias.json").then(
        function (response) {
          main.generos = Object.keys(response.data);
          main.subgenerosPorGenero = response.data;
        },
        function (error) {
          console.error("Erro ao carregar generos:", error);
        }
      );
    };

    main.buscar = function (page = 1) {
      main.isLoading = true;
      main.page = page;
      main.pesquisado = main.query;
      main.subgeneroProcurado = main.subgeneroSelecionado;

      LivroService.buscar(
        main.query,
        main.subgeneroSelecionado,
        main.page,
        main.filtroSelecionado
      ).then(
        function (data) {
          console.log(main.page)
          main.livros = data.livros.sort((a, b) =>
            a.title.localeCompare(b.title)
          );
          main.isLoading = false;
          main.totalPages = Math.ceil(data.numFound / 12);
        },
        function () {
          main.isLoading = false;
        }
      );
       if(main.subgeneroSelecionado === main.subgeneroProcurado && main.query === main.pesquisado){
          main.podeBuscar = false;
        }
    }; 
    
    main.irParaPaginaAnterior = function () {
      if (main.page > 1) {
        main.buscar(main.page - 1);
      }
    };

    main.irParaPaginaPosterior = function () {
      if (main.page < main.totalPages) {
        main.buscar(main.page + 1);
      }
    };

    main.atualizarEstadoBusca = function () {
      main.podeBuscar =
        (main.query && main.query.length >= 2) ||
        (main.subgeneroSelecionado !== null && main.subgeneroSelecionado !== "") || (main.generoSelecionado !== null && main.generoSelecionado !== "");
        if(main.subgeneroSelecionado === main.subgeneroProcurado && main.query === main.pesquisado){
          main.podeBuscar = false;
        }
    };

    main.limparSeDesabilitado = function () {
      if (!main.filtroSelecionado) {
        main.query = "";
        if (!main.subgeneroSelecionado || !main.generoSelecionado ) {
          main.podeBuscar = false;
        }
      }
    };

    main.atualizarSubgeneros = function () {
      main.subgeneroSelecionado = null;
      main.subgeneros = main.subgenerosPorGenero[main.generoSelecionado] || [];
      if(!main.generoSelecionado && !main.query){
        main.podeBuscar = false;
      }
    };

    main.verificarEnter = function (event) {
      if (event.which === 13 && main.podeBuscar) {
        main.buscar();
      }
    };

    main.$onInit();
  },
  controllerAs: 'main'
});
