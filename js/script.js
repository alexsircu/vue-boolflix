var app = new Vue({
  el: "#root",
  data: {
    filmName: "",
    prefixOfFilmUrl: "https://image.tmdb.org/t/p/w220_and_h330_face/",
    placeHolderImage: "https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png",
    filmsSeriesArray: [],
    flagLanguage: "",
    genres: {},
    selectedGenre: ""
  },
  mounted: function() {

    const self = this;

    axios
      .get('https://api.themoviedb.org/3/genre/movie/list', {
        params: {
          api_key: '5f1d9b533544f75b3d29837feba9a687'
        }
      })
      .then( function(response) {
        const result = response.data.genres;
        
        result.forEach((element) => {
          self.genres[element.id] = element.name;
        });
        self.$forceUpdate();
      })

      axios
        .get('https://api.themoviedb.org/3/genre/tv/list', {
          params: {
            api_key: '5f1d9b533544f75b3d29837feba9a687'
          }
        })
        .then( function(response) {
          const result = response.data.genres;

          result.forEach((element) => {
            self.genres[element.id] = element.name;
          });
          self.$forceUpdate();
        })
  },
  methods: {
    search: function() {

      const self = this;

      self.filmsSeriesArray = [];

      // cerco il film
      axios
        .get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: '5f1d9b533544f75b3d29837feba9a687',
            query: self.filmName
          }
        })
        .then( function(response) {
          const result = response.data.results;

          // ciclo sull'array dei film
          result.forEach((element) => {
            // creo un array cast dentro al mio film
            element.cast = [];

            // per ogni film faccio richiesta del cast con id del film
            axios
              .get(`https://api.themoviedb.org/3/movie/${element.id}/credits`, {
                params: {
                  api_key: '5f1d9b533544f75b3d29837feba9a687',
                }
              })
              .then( function(response) {
                
                // pusho nell'array i primi 5 nomi del cast per ogni film
                for (let j = 0; j < 5; j++) {
                  if (response.data.cast[j]) {
                    element.cast.push(response.data.cast[j].name);
                  }
                }
                // forzo vue a fare il rendering
                self.$forceUpdate();
              })
          });
          // concateno dentro l'array dei film e delle serie i film cercati con il proprio array cast di 5 attori
          self.filmsSeriesArray = self.filmsSeriesArray.concat(result);
          self.filmsSeriesArray.sort(self.orderByPopularity);
          self.toFlagLanguage();
        }) // fine then film

        // cerco la serie tv
        axios
          .get('https://api.themoviedb.org/3/search/tv', {
            params: {
              api_key: '5f1d9b533544f75b3d29837feba9a687',
              query: self.filmName
            }
          })
          .then( function(response) {
            const result = response.data.results;

            // ciclo sull'array delle serie
            result.forEach((element) => {
              // creo un array cast dentro alla serie
              element.cast = [];

              // per ogni serie faccio richiesta del cast con id della serie
              axios
                .get(`https://api.themoviedb.org/3/tv/${element.id}/credits`, {
                  params: {
                    api_key: '5f1d9b533544f75b3d29837feba9a687',
                  }
                })
                .then( function(response) {                 
                  
                  // pusho nell'array i primi 5 nomi del cast per ogni serie
                  for (let j = 0; j < 5; j++) {
                    if(response.data.cast[j]) {
                      element.cast.push(response.data.cast[j].name);
                    }             
                  }
                  // forzo vue a fare il rendering
                  self.$forceUpdate(); 
                })
            });
            // concateno dentro l'array dei film e delle serie le serie cercate con il proprio array cast di 5 attori
            self.filmsSeriesArray = self.filmsSeriesArray.concat(result);
            self.filmsSeriesArray.sort(self.orderByPopularity);
            self.toFlagLanguage();  
          }) // fine then serie tv
    },
    averageVoteArray(vote) {
      return Math.ceil(vote / 2);
    },
    toFlagLanguage: function() {
      for (var i = 0; i < this.filmsSeriesArray.length; i++) {
        let filmLanguage = this.filmsSeriesArray[i].original_language;
        if (filmLanguage == "en") {
          this.filmsSeriesArray[i].flagLanguage = "https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Great_Britain_%281707%E2%80%931800%29.svg";
        } else if (filmLanguage == "it") {
          this.filmsSeriesArray[i].flagLanguage = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1200px-Flag_of_Italy.svg.png";
        } else if (filmLanguage == "de") {
          this.filmsSeriesArray[i].flagLanguage = "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg";
        }
      }
    },
    orderByPopularity: function (a, b) {
     return b.popularity - a.popularity;
    },
    setGenre: function (genres) {
      const self = this;
      let string = "";

      genres.forEach((element) => {
        string += self.genres[element] + ", ";
      });

      return string.substr(0, string.length-2); 
    }
  }
});
