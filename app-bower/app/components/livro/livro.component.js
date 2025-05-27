angular.module('bibliotecaApp')
  .component('livro', {
    bindings: {
      info: '<'
    },
    templateUrl: 'components/livro/livro.template.html',
    controller: function() {
      let main = this;
      main.showModal = false;
      main.abrirModal = function() {
      main.showModal = true;
      };
      main.truncate = function(text, length) {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
      };

      main.getCapa = function() {
        return main.info.cover_i
          ? 'https://covers.openlibrary.org/b/id/' + main.info.cover_i + '-M.jpg'
          : '../assets/Livro-sem-capa.png';
      };
    },
     controllerAs: 'main'
     
  });
