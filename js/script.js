const myApiKey = '5f1d9b533544f75b3d29837feba9a687';

var app = new Vue({
  el: "#root",
  data: {
    filmName: "",
    prefixOfFilmUrl: "https://image.tmdb.org/t/p/w220_and_h330_face/",
    placeHolderImage: "https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png",
    filmsSeriesArray: [],
    popularFilms: [],
    popularSeries: [],
    mostVotedFilms: [],
    mostVotedSeries: [],
    flagLanguage: "",
    genres: {},
    selectedGenre: ""
  },
  mounted: function() {

    const self = this;

    // richiesta generi dei film
    axios
      .get('https://api.themoviedb.org/3/genre/movie/list', {
        params: {
          api_key: myApiKey
        }
      })
      .then( function(response) {
        const result = response.data.genres;
        
        result.forEach((element) => {
          self.genres[element.id] = element.name;
        });
        self.$forceUpdate();
      })

      // richiesta generi serie tv
      axios
        .get('https://api.themoviedb.org/3/genre/tv/list', {
          params: {
            api_key: myApiKey
          }
        })
        .then( function(response) {
          const result = response.data.genres;

          result.forEach((element) => {
            self.genres[element.id] = element.name;
          });
          self.$forceUpdate();
        })

        //richiesta film più popolari
        axios
          .get('https://api.themoviedb.org/3/movie/popular', {
            params: {
              api_key: myApiKey
            }
          })
          .then( function(response) {
            const result = response.data.results;

            result.forEach((element) => {
              if (self.popularFilms.length < 7) {
                self.popularFilms.push(element);
              }
            });

            self.getFlag();
            // self.popularFilmsSeries.sort(self.orderByPopularity);
            // self.popularFilmsSeries = self.popularFilmsSeries.concat(result);
                     
          })

          // richiesta serie più popolari
          axios
          .get('https://api.themoviedb.org/3/tv/popular', {
            params: {
              api_key: myApiKey
            }
          })
          .then( function(response) {
            const result = response.data.results;

            result.forEach((element) => {
              if (self.popularSeries.length < 7) {
                self.popularSeries.push(element);
              }
            });

            self.getFlag();
            // self.popularFilmsSeries.sort(self.orderByPopularity);
            // self.popularFilmsSeries = self.popularFilmsSeries.concat(result);
                     
          })

          //richiesta film più votati
          axios
          .get('https://api.themoviedb.org/3/movie/top_rated', {
            params: {
              api_key: myApiKey
            }
          })
          .then( function(response) {
            const result = response.data.results;

            result.forEach((element) => {
              if (self.mostVotedFilms.length < 7) {
                self.mostVotedFilms.push(element);
              }
            });

            self.getFlag();
            // self.popularFilmsSeries.sort(self.orderByPopularity);
            // self.popularFilmsSeries = self.popularFilmsSeries.concat(result);
                     
          })

          //richiesta serie più votate
          axios
          .get('https://api.themoviedb.org/3/tv/top_rated', {
            params: {
              api_key: myApiKey
            }
          })
          .then( function(response) {
            const result = response.data.results;

            result.forEach((element) => {
              if (self.mostVotedSeries.length < 7) {
                self.mostVotedSeries.push(element);
              }
            });

            self.getFlag();
            // self.popularFilmsSeries.sort(self.orderByPopularity);
            // self.popularFilmsSeries = self.popularFilmsSeries.concat(result);
                     
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
            api_key: myApiKey,
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
                  api_key: myApiKey
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
          self.getFlag();
        }) // fine then film

        // cerco la serie tv
        axios
          .get('https://api.themoviedb.org/3/search/tv', {
            params: {
              api_key: myApiKey,
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
                    api_key: myApiKey
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
            self.getFlag();  
          }) // fine then serie tv
    },
    averageVoteArray(vote) {
      return Math.ceil(vote / 2);
    },
    getFlag(language) {
      let flag = "";

      if(language == "en") {
        flag = "https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Great_Britain_%281707%E2%80%931800%29.svg";
      } else if (language == "it") {
        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1200px-Flag_of_Italy.svg.png";
      } else if (language == "de") {
        flag = "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg";
      };

      return flag;
    },
    orderByPopularity: function (a, b) {
     return b.popularity - a.popularity;
    },
    setGenre: function (genres) {
      const self = this;
      let string = "";

      genres.forEach((element) => {
        string += self.genres[element] + ", ";
        //salvo dentro string tutti i nome associati al dato id con una virgola dopo e lo spazio
      });

      return string.substr(0, string.length-2);
      //return della stringa togliendo però gli ultimi due caratteri, quindi lo spazio e la virgola 
    }
  }
});


