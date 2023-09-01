import { defineStore } from 'pinia'
import { getAuth } from "firebase/auth";
import { Loading, date } from 'quasar'
import { UserInfo, FirebaseUser } from '~/components/models'
import { useNotification } from '~/composables/notification.js'

const { showNotification } = useNotification()
interface State {
  currentUser: UserInfo;
}

export const useUserStore = defineStore({
  id: 'user',
  persist: true,

  state: (): State => {
    return {
      currentUser: {
        token: null,
        signedIn: false,
        providers: null,
        data: {},
        backend_data: {
          name: ''
        }
      }
    }
  },

  actions: {
    fetchUser (user: FirebaseUser) {
      if (this.currentUser) {
        this.currentUser.signedIn = user !== null
        if (user && user.metadata) {
          this.currentUser.data = {
            name: user.displayName,
            email: user.email,
            phone: user.phoneNumber,
            email_verified: user.emailVerified,
            image_url: user.photoURL,
            last_signed_in: user.metadata.lastSignInTime
          }
        } else {
          this.currentUser.data = {}
        }
      }
    },
    async getMe () {
      Loading.show({ message: 'Loading user data' })
      try {
        const res = await api.get('/me')
        if (this.currentUser && this.currentUser && this.currentUser.backend_data) {
          this.currentUser.backend_data = res.data.user

          if (this.currentUser && this.currentUser.data && this.currentUser.data.last_signed_in) {
            const expiration = date.addToDate(this.currentUser.data.last_signed_in, { hours: 12 })
            const expired = expiration < new Date()
            if (expired) {
              this.signOut()
            }
          }
        }
        Loading.hide()
      } catch (error) {
        Loading.hide()
        showNotification({ message: error.message, type: 'error' })
      }
    },
    signOut () {
      const auth = getAuth()

      auth
        .signOut()
        .then(() => {
          this.$reset()
        })
    }
  }

})
