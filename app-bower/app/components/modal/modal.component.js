angular.module('bibliotecaApp')
  .component('modal', {
    bindings: {
      show: '<',
      onClose: '&',
      info: '<'
    },
    templateUrl: 'components/modal/modal.template.html',
    controller: function() { 
        const main = this;
      main.fecharModal = function() {
        main.show = false;
          main.onClose();  
        
      };
    },
  controllerAs: 'main'
  });