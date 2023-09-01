<script setup>
import { onMounted } from 'vue'
import { useMovieStore } from '~/stores/movie'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
const router = useRouter()

const { loadMovieRanks } = useMovieStore()
const { movieRanks } = storeToRefs(useMovieStore())

onMounted(async () => {
  await loadMovieRanks({ rankType: 'genre', pagination: {} })
})

function show (payload) {
  router.push({ name: 'movie_rank-id-name', params: { id: payload.id, name: payload.attributes.name } })
}
</script>

<template>
  <q-card-section>
    <h1>Ranks</h1>
    <div class="row q-col-gutter-sm q-mt-md">
      <div class="col-12">
        <h3>Genre Ranks</h3>
      </div>
      <div
        v-for="rank in movieRanks"
        :key="rank.attributes.name"
        class="col-3"
      >
        <q-btn
          class="full-width text-bold"
          @click="show(rank)"
        >
          {{ rank.attributes.name }}
        </q-btn>
      </div>
    </div>
  </q-card-section>
</template>
