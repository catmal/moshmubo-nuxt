import { defineStore } from 'pinia'
import { useNotification } from '~/composables/notification.js'
const { showNotification } = useNotification()
export const useMovieStore = defineStore({
  id: 'movie',
  state: () => {
    return {
      currentMovie: {
        title: '',
        release_date: '',
        facts: [],
        credits: [],
        plot_recap: '',
        watched: false
      },
      movies: {
        movies: []
      },
      genres: [],
      curiousFacts: [],
      quotes: [],
      credits: [],
      similarMovies: [],
      collectionMovies: [],
      watchReasons: [],
      ratingTopics: {},
      watchedMovies: [],
      watchedMoviesSortBy: '',
      watchListMovies: [],
      movieRankLines: [],
      movieRanks: [],
      currentMovieRank: {},
      suggestions: [],
      loadingSuggestions: false,
      loadingQuotes: false,
      loadingFacts: false,
      loadingCollectionMovies: false,
      loadingRatingTopics: false,
      loadingWatchReasons: false,
      loadingSimilarMovies: false,
      loadingPlot: false,
      pagination: {
        sortBy: 'primary_release_date.desc',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20 // specifying this determines pagination is server-side
      },
      watchedMoviesPagination: {
        sortBy: 'release_date',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20 // specifying this determines pagination is server-side
      },
      watchedMoviesFilters: {
        yearMax: 2024,
        yearMin: 1930,
        ratingMin: 6,
        ratingMax: 10,
        voteCountMin: 200,
        sortString: 'primary_release_date.desc',
        genres: []
      },
      filters: {
        yearMax: 2024,
        yearMin: 1930,
        ratingMin: 6,
        ratingMax: 10,
        voteCountMin: 200,
        sortString: 'primary_release_date.desc',
        genres: []
      }
    }
  },
  getters: {
    selectedMovie: (state) => state.currentMovie,
  },
  actions: {
    async loadMovies (payload) {
      const genres = this.filters.genres.length > 0 ? this.filters.genres.join('|') : ''
      try {
        const res = await useFetch('http://localhost:3000/api/v1/movies/' +
          '?sort=' + this.filters.sortString +
          '&descending=' + payload.pagination.descending +
          '&page=' + payload.pagination.page +
          '&per_page=' + payload.pagination.rowsPerPage +
          '&min_year=' + this.filters.yearMin +
          '&max_year=' + this.filters.yearMax +
          '&min_rating=' + this.filters.ratingMin +
          '&max_rating=' + this.filters.ratingMax +
          '&min_vote_count=' + this.filters.voteCountMin +
          '&genres=' + genres

        )
        this.pagination = payload.pagination
        this.movies = res.data.value.results
        this.pagination.rowsNumber = res.data.total_results
      } catch (error) {
        showNotification({ message: error.message, type: 'error' })
      }
    },
    async loadGenres () {
      try {
        const res = await useFetch('http://localhost:300/movie_genres')
        this.genres = res.data.value
      } catch (error) {
        showNotification({ message: error.message, type: 'error' })
      }
    },
    async loadMovieSuggestions (genres, customText) {
      try {
        const { data, pending, error, refresh } = await useFetch('http://localhost:3000/movies_suggestions?genres=' + { genres } + '&custom_text=' + customText)
        this.suggestions = data.value.data
        this.loadingSuggestions = pending
      } catch (error) {
        showNotification({ message: error.message, type: 'error' })
      }
    },
    async loadMovie (id) {
      try {
        const { data, error, pending } = await useApiFetch("movies/" + id)
        this.currentMovie = data.value.data.attributes
      } catch (error) {
        showNotification({ message: error.message, type: 'error' })
      }
    },
    async setWatchedMovie (payload) {
      const res = await $fetch('http://localhost:3000/api/v1/set_watched_movie', {
        method: 'POST',
        body: {
          'tmdb_id': payload.id,
        }
      })
      if (res.watched) {
        showNotification({ message: 'Movie set as watched!', type: 'success' })
      } else {
        showNotification({ message: 'Movie set as unwatched!', type: 'success' })
      }
      if (payload.type === 'current') {
        this.currentMovie.watched = res.watched
      } else if (payload.type === 'similar') {
        const index = this.similarMovies.findIndex(x => x.attributes.id === payload.id)
        const movie = this.similarMovies[index]
        movie.attributes.watched = res.watched
        this.similarMovies.splice(index, 1, movie)
      } else if (payload.type === 'collection') {
        const index = this.collectionMovies.findIndex(x => x.attributes.id === payload.id)
        const movie = this.collectionMovies[index]
        movie.attributes.watched = res.watched
        this.collectionMovies.splice(index, 1, movie)
      }
    },
    async setWatchListMovie (payload) {
      const res = await $fetch('http://localhost:3000/api/v1/set_watchlist_movie', {
        method: 'POST',
        body: {
          'tmdb_id': payload.id,
        }
      })
      if (res.watchlist) {
        showNotification({ message: 'Movie added to watchlist!', type: 'success' })
      } else {
        showNotification({ message: 'Movie removed from whatchlist!', type: 'success' })
      }
      if (payload.type === 'current') {
        this.currentMovie.watchlist = res.watchlist
      } else if (payload.type === 'similar') {
        const index = this.similarMovies.findIndex(x => x.attributes.id === payload.id)
        const movie = this.similarMovies[index]
        movie.attributes.watchlist = res.watchlist
        this.similarMovies.splice(index, 1, movie)
      } else if (payload.type === 'collection') {
        const index = this.collectionMovies.findIndex(x => x.attributes.id === payload.id)
        const movie = this.collectionMovies[index]
        movie.attributes.watchlist = res.watchlist
        this.collectionMovies.splice(index, 1, movie)
      }

    },
    async loadSimilarMovies (id) {
      const { data, pending, error, refresh } = await useApiFetch('movies/' + id + '/similar_movies')
      this.loadingSimilarMovies = pending
      this.similarMovies = data.value.data
    },
    async loadCuriousFacts (id) {
      const { data, pending, error, refresh } = await useApiFetch('movies/' + id + '/curious_facts')
      this.loadingFacts = pending
      this.curiousFacts = data.value.data

    },
    async loadQuotes (id) {
      const { data, pending, error, refresh } = await useApiFetch('movies/' + id + '/quotes')
      this.loadingQuotes = pending
      this.quotes = data

    },
    async loadCredits (id) {
      this.loadingCredits = true
      const { data, pending, error, refresh } = await useApiFetch('movies/' + id + '/credits')
      this.credits = data.value
      this.loadingCredits = pending
    },
    async loadCollection (id) {
      const { data, pending, error, refresh } = await useApiFetch('collections/' + id)
      this.loadingCollectionMovies = pending
      console.log(data)
      this.collectionMovies = data.value.data

    },
    async loadMovieWatchReasons (id) {
      const { data, pending, error, refresh } = await useApiFetch('movies/' + id + '/watch_reasons')
      this.loadingWatchReasons = pending
      this.watchReasons = data.value

    },
    async loadContentRating (id) {
      const { data, pending, error, refresh } = await useApiFetch('movies/' + id + '/content_rating')
      this.loadingRatingTopics = pending
      this.ratingTopics = data.value.rating_topics
      this.currentMovie.content_rating_info = data.value.content_rating_info
      this.currentMovie.content_rating = data.value.content_rating
      this.currentMovie.suggested_audience = data.value.content_rating

    },
    async loadUserMovies (payload) {
      const { data, pending, error, refresh } = await useApiFetch('user_movies', {
        query: {
          watched: payload.watched,
          watchlist: payload.watchlist,
          page: payload.pagination.page,
          per_page: payload.pagination.rowsPerPage,
          sort_by: watchedMoviesSortBy,
          descending: payload.pagination.descending
        }
      })
      if (payload.watched === true) {
        this.watchedMovies = data.value.data
        this.watchedMoviesPagination = payload.pagination
        this.watchedMoviesPagination.rowsNumber = data.value.meta.rows
      } else {
        this.watchListMovies = data.value.data
        this.watchListMoviesPagination = payload.pagination
        this.watchListMoviesPagination.rowsNumber = data.value.meta.rows
      }
    },
    async loadPlotRecap (id) {
      const { data, pending, error, refresh } = await useApiFetch('movies/' + id + '/plot_recap')
      this.loadingPlot = pending
      this.currentMovie.plot_recap = data.value

    },
    async loadMovieRanks (payload) {
      payload = { pagination: {} }
      const { data, pending, error, refresh } = await useApiFetch('movie_ranks')
      this.movieRanks = data.value.data
    },
    async loadMovieRank (id) {
      try {
        const { data, pending, error, refresh } = await useApiFetch('movie_ranks/' + id)
        this.currentMovieRank = data.value.data
      } catch (error) {
        showNotification({ message: error.message, type: 'error' })
      }
    },
    async loadMovieRankLines (id) {
      const { data, pending, error, refresh } = await useApiFetch('movie_ranks/' + id + '/movie_rank_lines', {})
      this.movieRankLines = data.value.data
    },

  }
})
