import { Notify } from 'quasar'

export function useNotification () {
  function showNotification (payload) {

    Notify.create({
      position: 'bottom-right',
      timeout: 500,
      message: payload.message ? payload.message : '',
      color: payload.type && payload.type === 'success' ? 'positive' : 'negative',

    })
  }
  return {
    showNotification
  }
}
