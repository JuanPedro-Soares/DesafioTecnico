angular.module('bibliotecaApp')
  .service('LivroService', function($http, $q) {
    this.buscar = function(query, subgenero, page = 1, filtroSelecionado) {
      console.log(query)
      const urlBase = 'https://openlibrary.org/search.json?limit=12&page=' + page;
      const params = [];

      if (query) {
        const campo = filtroSelecionado === 'Autor' ? 'author' : 'title';
        params.push(campo + '=' + encodeURIComponent(query));
      }
      if (subgenero) {
        params.push('subject=' + encodeURIComponent(subgenero));
      }
      if (!params.length) {
        return $q.resolve({ livros: [], numFound: 0 });
      }

      const url = urlBase + '&' + params.join('&');

      return $http.get(url)
        .then(resp => {
          const docs = (resp.data.docs || []).filter(l => l.title && l.key);
          const numFound = resp.data.numFound;

          const promessas = docs.map(livro => {
            const ia = Array.isArray(livro.ia) ? livro.ia : [];
            const isbnRaw = ia.find(item => item.startsWith('isbn_'));
            livro.isbn = isbnRaw ? isbnRaw.replace(/^isbn_/, '') : null;

            return $http.get(`https://openlibrary.org${livro.key}.json`)
              .then(det => {
                const desc = det.data.description;
                livro.resumo = desc
                  ? (typeof desc === 'string' ? desc : (desc.value || null))
                  : null;
                return livro;
              })
              .catch(() => {
                livro.resumo = null;
                return livro;
              });
          });

          return $q.all(promessas)
            .then(livrosComResumo => ({
              livros: livrosComResumo,
              numFound
            }));
        })
        .catch(err => {
          console.error('Erro geral na busca de livros:', err);
          return $q.reject(err);
        });
    };
  });
