var app = new Vue({
  el: "#root",
  data: {
    filmToSearch: "",
    prefixOfFilmUrl: "https://image.tmdb.org/t/p/w220_and_h330_face/",
    filmsArray: [],
    averageVoteArray: [],
    flagLanguage: ""

  },
  methods: {
    searchFilm: function() {
      var self = this;
      axios
        .get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: '5f1d9b533544f75b3d29837feba9a687',
            query: self.filmToSearch
          }
        })
        .then(function (response) {
          self.filmsArray = response.data.results;
          // console.log(response.data.results);

          for (var i = 0; i < self.filmsArray.length; i++) {
            let averageCeilVote = Math.ceil(self.filmsArray[i].vote_average/2);
            self.averageVoteArray.push(averageCeilVote)
          }
          self.toFlagLanguage();
        })
      self.filmToSearch = "";
    },
    toFlagLanguage: function() {
      for (var i = 0; i < this.filmsArray.length; i++) {
        let filmLanguage = this.filmsArray[i].original_language;
        if (filmLanguage == "en") {
          this.filmsArray[i].flagLanguage = "https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Great_Britain_%281707%E2%80%931800%29.svg";
        } else if (filmLanguage == "it") {
          this.filmsArray[i].flagLanguage = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1200px-Flag_of_Italy.svg.png";
        } else if (filmLanguage == "de") {
          this.filmsArray[i].flagLanguage = "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg";
        }
      }
    }
  }
});
