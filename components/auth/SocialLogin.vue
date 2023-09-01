<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useUserStore } from '~/stores/user'
import { storeToRefs } from 'pinia'

const auth = getAuth()
const router = useRouter()
const provider = ref('')
const { currentUser } = storeToRefs(useUserStore())

function socialLogin (value) {
  if (value === 'facebook') {
    provider.value = new firebase.auth.FacebookAuthProvider()
  } else if (value === 'google') {
    provider.value = new GoogleAuthProvider()
  } else if (value === 'apple') {
    provider.value = new firebase.auth.OAuthProvider('apple.com')
  }
  
  signInWithPopup(auth, provider.value)
  .then((result) => {
    const user = result.user
    if (user && user.metadata) {
      this.currentUser.data = {
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber,
        email_verified: user.emailVerified,
        image_url: user.photoURL,
        last_signed_in: user.metadata.lastSignInTime
      }
      currentUser.value.token = result.user.accessToken
      currentUser.value.signedIn = true
      router.push('/')

    } else {
      this.currentUser.data = {}
      currentUser.value.signedIn = false
    }
    
  })
  .catch((error) => {
    console.log(error.message)
  })
}
</script>
<template>
  <div class="flex flex-center full-width">
    <p class="text-white text-bold">Login</p>
    <q-btn
      color="blue-8"
      class="text-bold text-white full-width q-mt-md"
      @click="socialLogin('facebook')"
    >
      Facebook
    </q-btn>
    <q-btn
      text-color="red-5"
      color="white"
      class="text-bold text-white full-width q-mt-md"
      @click="socialLogin('google')"
    >
      Google
    </q-btn>
  </div>
</template>
