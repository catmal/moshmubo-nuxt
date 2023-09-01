<script setup>
import { ref, defineAsyncComponent } from 'vue'

const tab = ref('watched_movies')
</script>

<template>
  <q-tabs
    v-model="tab"
    active-color="primary"
    inline-label
    align="left"
    no-caps
    narrow-indicator
  >
    <q-tab
      name="watched_movies"
      to="/movies/watched"
      label="Watched Movies"
      icon="info"
    />
    <q-tab
      name="watchlist"
      icon="bookmark"
      to="/movies/watchlist"
      label="Watchlist"
    />
    <q-space />
  </q-tabs>
  <q-tab-panels
    v-model="tab"
    animated
    swipeable
  >
    <q-tab-panel name="watched_movies">
      <MoviesWatched />
    </q-tab-panel>
    <q-tab-panel name="watchlist">
      <MoviesWatchList />
    </q-tab-panel>
  </q-tab-panels>
</template>
