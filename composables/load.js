import { Loading, QSpinnerGears } from 'quasar'
import { useNotification } from '~/composables/notification.js'
const { showNotification } = useNotification()
import { ref } from 'vue'

export function useLoadItems () {
  const response = ref()
  async function loadItems (list, payload) {
    Loading.show({ message: 'Loading', spinner: QSpinnerGears })
    try {
      const res = await useFetch('http://localhost:3000/' + list +
        '?sort_by=' + (payload.pagination.sortBy ? payload.pagination.sortBy : '') +
        '&page=' + (payload.pagination.page ? payload.pagination.page : '') +
        '&descending=' + (payload.pagination.descending ? payload.pagination.descending : '') +
        '&per_page=' + (payload.pagination.rowsPerPage ? payload.pagination.rowsPerPage : '') +
        '&search=' + (payload.filter ? payload.filter : '') +
        '&min_year=' + (payload.min_date ? payload.min_date : '') +
        '&max_year=' + (payload.max_date ? payload.max_date : '') +
        '&min_rating=' + (payload.min_rating ? payload.min_rating : '') +
        '&max_rating=' + (payload.max_rating ? payload.max_rating : '') +
        '&min_vote_count=' + (payload.min_vote_count ? payload.min_vote_count : '') +
        '&rank_type=' + (payload.rankType ? payload.rankType : '') +
        '&watched=' + (payload.watched ? payload.watched : '') +
        '&watchlist=' + (payload.watchlist ? payload.watchlist : '')

      )
      response.value = res.data
      Loading.hide()
    } catch (error) {
      Loading.hide()
      showNotification({ message: error.response.data.message, type: 'error' })
    }
  }
  return {
    loadItems,
    fetchedResponse: response
  }
}
