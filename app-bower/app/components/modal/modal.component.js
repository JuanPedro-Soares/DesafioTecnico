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
         console.log(main.info)
        if (typeof main.onClose === 'function') {
          main.onClose();  
        }
      };
    },
  controllerAs: 'main'
  });