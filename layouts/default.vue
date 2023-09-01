<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '~/stores/user'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const route = useRoute()
const essentialLinks = [
  {
    title: 'Movies',
    icon: 'movie',
    link: '/movies'
  },
  {
    title: 'Shows',
    icon: 'tv',
    link: '/shows'
  }
]

const menuLinks = [
  {
    title: 'Explore',
    icon: 'movie',
    link: '/movies'
  },
  {
    title: 'Ranks',
    icon: 'star',
    link: '/movie_ranks'
  },
  {
    title: 'Suggestions',
    icon: 'lightbulb_circle',
    link: '/movie_suggestions'
  },
  {
    title: 'My Movies',
    icon: 'face',
    link: '/my_movies'
  },
  {
    title: 'Calendar',
    icon: 'calendar_month',
    link: '/movies_calendar'
  }

]
const miniState = ref(true)
const link = ref('/movies')
const { currentUser } = storeToRefs(useUserStore())
const { signOut } = useUserStore()

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

const showFilters = computed(() => {
  return route.name === 'movies' ||
          route.name === 'Home' ||
          route.name === 'my_movies' ||
          route.name === 'my_movies'
})

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleRightDrawer () {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
function drawerClick (e) {
  miniState.value = !miniState.value

  e.stopPropagation()
}

</script>
<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-dark text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title />
        <div v-if="currentUser">
          <q-avatar
            size="40px"
            class="cursor-pointer"
          >
            <q-img :src="currentUser.data.image_url" />
            <q-menu
              transition-show="flip-right"
              transition-hide="flip-left"
            >
              <q-list style="min-width: 100px">
                <q-item clickable>
                  <q-item-section>Profile</q-item-section>
                </q-item>

                <q-separator />
                <q-item
                  clickable
                  class="bg-primary text-white"
                >
                  <q-item-section @click="signOut()">
                    Logout
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-avatar>
        </div>
        <q-btn
          class="cursor-pointer q-mr-md"
          v-if="!currentUser.data.email"
          clickable
          tag="a"
          :to="'/sign_in'"
          dense
          flat
          round
        >
          Login
        </q-btn>

        <q-btn
          dense
          flat
          round
          icon="build"
          class="cursor-pointer q-mx-md"
          clickable
          tag="a"
          :to="'/settings'"
        />

        <q-btn
          dense
          flat
          round
          icon="tune"
          @click="toggleRightDrawer"
          v-if="showFilters"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      class="bg-black text-white"
    >
      <q-list
        bordered
        padding
        class="rounded-borders "
      >
        <q-item
          v-for="linkItem in menuLinks"
          :key="linkItem.name"
          clickable
          v-ripple
          tag="a"
          :to="linkItem.link"
          :active="link === linkItem.title"
          @click="link = linkItem.title"
          active-class="text-primary"
        >
          <q-item-section avatar>
            <q-icon
              color="white"
              :name="linkItem.icon"
            />
          </q-item-section>
          <q-item-section>
            <p class="text-bold q-mt-md">
              {{ linkItem.title }}
            </p>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer
      v-if="showFilters"
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      class="bg-grey-3"
      :mini="miniState"

      :width="300"
      :breakpoint="800"
      @click="drawerClick"
    >
      <MoviesFilters
        v-if="showFilters"
      />
    </q-drawer>

    <q-page-container>
      <NuxtPage />
    </q-page-container>

    <q-footer
      class="bg-dark"
    >
      <q-toolbar class="flex-center">
        <div class="row q-gutter-md ">
          <SharedEssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>


