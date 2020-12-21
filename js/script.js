var app = new Vue({
  el: "#root",
  data: {
    filmToSearch: "",
    prefixOfFilmUrl: "https://image.tmdb.org/t/p/w220_and_h330_face/",
    filmsArray: [],
    averageVoteArray: []

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
        })
      self.filmToSearch = "";
    }
  }
});
