angular.module('bibliotecaApp')
.component('livro', {
  bindings: {
    info: '<',
    onOpen: '&',
    onClose: '&',
  },
  templateUrl: 'components/livro/livro.template.html',
  controller: function($http, $window) {
    let main = this;

    main.favorito = false;
    main.showModal = false;
    main.apiUrl = 'https://68364957664e72d28e405aec.mockapi.io/usuarios/usuarios/';

    main.$onInit = function() {
      let userId = $window.localStorage.getItem('id');
      if (userId) {
        $http.get(`${main.apiUrl}${userId}`)
          .then(function(response) {
            let usuario = response.data;

            // Verifica por ID (não objeto inteiro)
            main.favorito = usuario.favoritos.some(fav => fav.cover_i === main.info.cover_i);
          })
          .catch(function(err) {
            console.error('Erro ao carregar favoritos:', err);
          });
      }
    };

    main.truncate = function(text, length) {
      if (!text) return '';
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    };

    main.getCapa = function() {
      return main.info.cover_i
        ? 'https://covers.openlibrary.org/b/id/' + main.info.cover_i + '-M.jpg'
        : '../public/assets/Livro-sem-capa.png';
    };

    main.abrirModal = function() {
      main.showModal = true;
      main.onOpen();
    };

    main.fecharModal = function() {
      main.showModal = false;
      main.onClose();
    };

    main.favoritar = function($event) {
      $event.stopPropagation(); 
      main.info.capaUrl = main.getCapa();
      main.favorito = true;

      let userId = $window.localStorage.getItem('id');
      if (!userId) {
        console.error('Nenhum usuário logado');
        return;
      }

      $http.get(`${main.apiUrl}${userId}`)
        .then(function(response) {
          let usuario = response.data;
          
          if (!usuario.favoritos.some(fav => fav.cover_i === main.info.cover_i)) {
            usuario.favoritos.push(main.info);

            $http.put(`${main.apiUrl}${userId}`, usuario)
              .catch(function(err) {
                console.error('Erro ao salvar favoritos:', err);
              });
          }
        })
        .catch(function(err) {
          console.error('Erro ao buscar usuário:', err);
        });
    };

    main.desfavoritar = function($event) {
      $event.stopPropagation(); 
      main.info.capaUrl = main.getCapa();

      let userId = $window.localStorage.getItem('id');
      main.favorito = false;

      if (!userId) {
        console.error('Nenhum usuário logado');
        return;
      }

      $http.get(`${main.apiUrl}${userId}`)
        .then(function(response) {
          let usuario = response.data;

          const index = usuario.favoritos.findIndex(fav => fav.cover_i === main.info.cover_i);
          if (index !== -1) {
            usuario.favoritos.splice(index, 1);

            $http.put(`${main.apiUrl}${userId}`, usuario)
              .catch(function(err) {
                console.error('Erro ao salvar favoritos:', err);
              });
          }
        })
        .catch(function(err) {
          console.error('Erro ao buscar usuário:', err);
        });
    };
  },
  controllerAs: 'main'
});
