import { ofetch } from 'ofetch'
import { useUserStore } from '~/stores/user'
import { storeToRefs } from 'pinia'
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((_nuxtApp) => {
    globalThis.$fetch = ofetch.create({
        onRequest ({ request, response, options }) {
            const { currentUser } = storeToRefs(useUserStore())
            if (currentUser.value.signedIn) {
                options.headers = { Authorization: `Bearer ${currentUser.value.token}` }
            } else {
                console.log('Not authenticated')
            }
        },
        async onResponse ({ request, response, options }) {
            const auth = getAuth()
            const { currentUser } = storeToRefs(useUserStore())
            if (response.status === 405) {
                const user = auth.currentUser
                if (user) {
                    user.getIdToken(true).then((token) => {
                        currentUser.value.token = token
                    })
                    retry: 1
                }
            }
        },
        onRequestError ({ error }) {
            console.error(error)
        }
    })
})