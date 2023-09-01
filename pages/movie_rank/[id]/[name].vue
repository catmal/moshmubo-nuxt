<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMovieStore } from '~/stores/movie'
import { useRoute, useRouter } from 'vue-router'

const { loadMovieRankLines } = useMovieStore()
const { movieRankLines } = storeToRefs(useMovieStore())
const route = useRoute()
const router = useRouter()

function image (url) {
  return'https://image.tmdb.org/t/p/original' + url
}
function show (payload) {
  const name = payload.title.split(' ').join('_').toLowerCase()
  router.push({ name: "movie-tmdb_id-name", params: { name, tmdb_id: payload.tmdb_id } })
}
watch(route, (to) => {
  if (to.params.id) {
    const id = to.params.id
    loadMovieRankLines(id)
  }
}, { flush: 'pre', immediate: true, deep: true }
)
</script>

<template>
  <div class="q-pa-md">
    <div class="row">
        <h1>{{ route.params.name }}</h1>
      <q-space />
      <q-btn class="q-mt-md" color="positive" style="height: 30px;">Add</q-btn>


    </div>
    <div class="row">
      <div class="col-6">
        <q-list
          bordered
          class="q-pa-md"
        >
          <q-badge>AI</q-badge>
          <q-separator class="q-mt-md" />
          <q-item
            @click="show(rankLine.attributes)"
            clickable
            v-ripple
            v-for="rankLine in movieRankLines"
            :key="rankLine.id"
          >
            <q-item-section thumbnail>
              <q-avatar>
                <img :src="image(rankLine.attributes.poster_path)">
              </q-avatar>
            </q-item-section>
            <q-item-section>{{ rankLine.attributes.title }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>
