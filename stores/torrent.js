import { defineStore } from 'pinia'
import { Loading, QSpinnerGears } from 'quasar'
import { useNotification } from '~/composables/notification.js'
const { showNotification } = useNotification()
import { useMovieStore } from './movie'
export const useTorrentStore = defineStore({
  id: 'torrent',
  state: () => {
    return {
      results: [],
      pagination: {
        sortBy: 'primary_release_date.desc',
        descending: true,
        page: 1,
        rowsPerPage: 40,
        rowsNumber: 20 // specifying this determines pagination is server-side
      }
    }
  },
  actions: {
    async searchMagnet (payload) {
      const movieStore = useMovieStore()
      Loading.show({ message: 'Loading', spinner: QSpinnerGears })

      try {
        const currentMovie = movieStore.currentMovie
        const res = await api.get('/magnetdl_search?title=' + currentMovie.title + '&year=' + currentMovie.release_date.slice(0, 4) + '&page=' + payload.pagination.page)
        this.results = res.data.results
        this.pagination.rowsNumber = res.data.total_rows
        this.pagination = payload.pagination
        Loading.hide()
      } catch (error) {
        Loading.hide()
        showNotification({ message: error.message, type: 'error' })
      }
    }
  }

})
