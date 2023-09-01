import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()

    const firebaseConfig = {
        apiKey: "AIzaSyAywmHG-FSYUOpzb18osmHlaVQHmrJaGHo",
        authDomain: "moshmubo.firebaseapp.com",
        projectId: "moshmubo",
        // storageBucket: config.FB_STORAGE_BUCKET,
        // messagingSenderId: config.FB_MESSAGING_SENDER_ID,
        appId: "1:623498869671:web:7f341c1eaee8e114a41482",
        // measurementId: config.FB_MEASUREMENT_ID
    };

    const app = initializeApp(firebaseConfig)

    const analytics = getAnalytics(app)
    const auth = getAuth(app)
    nuxtApp.vueApp.provide('auth', auth)
    nuxtApp.provide('auth', auth)


    auth.onAuthStateChanged(async (user) => {
        console.log(auth.currentUser)
    });
})