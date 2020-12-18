var app = new Vue({
  el: "#root",
  data: {
    filmToSearch: "",
    prefixOfFilmUrl: "https://image.tmdb.org/t/p/w220_and_h330_face/",
    filmsArray: []

  },
  methods: {
    searchFilm: function() {
      var myThis = this;
      axios
        .get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: '5f1d9b533544f75b3d29837feba9a687',
            query: myThis.filmToSearch
          }
        })
        .then(function (response) {
          myThis.filmsArray = response.data.results;
          console.log(response.data.results);
        })
    }
  }
});
