<script setup>
import { date } from 'quasar'
import { useRouter } from 'vue-router'
import { useMovieStore } from '~/stores/movie'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
const { loadMovies } = useMovieStore()
const router = useRouter()
const { movies, pagination } = storeToRefs(useMovieStore())
const showingOverview = ref(false)
const search = ref('')
const columns = [
  { name: 'title', align: 'center', label: 'Calories', field: 'title', sortable: true },
  { name: 'vote_average', label: 'Fat (g)', field: 'vote_average', sortable: true }
]

function poster (url) {
  return'https://image.tmdb.org/t/p/original' + url
}

async function request (payload) {
  await loadMovies(payload)
}

function show (payload) {
  const name = payload.title.split(' ').join('_').toLowerCase()
  router.push({ name: "movie-tmdb_id-name", params: { name, tmdb_id: payload.id } })
}

  await request({ pagination: pagination.value })
</script>

<template>
    <q-page>
      <div class="row">
        <div class="col-12">
          <MoviesSortingButtons />
  
          <q-table
            v-if="movies.length > 0"
            :rows="movies"
            :columns="columns"
            v-model:pagination="pagination"
            :filter="search"
            @request="request($event)"
            grid
            class="scroll"
            style="height: 80vh;"
          >
            <template #item="props">
              <div
                class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              >
                <q-card
                  class="my-card cursor-pointer"
                  @click="show(props.row)"
                >
                  <q-img
                    :src="poster(props.row.poster_path)"
                    height="300"
                  >
                    <div class="absolute-bottom text-subtitle2 text-center text-bold">
                      {{ props.row.title }} ({{ date.formatDate(props.row.release_date, 'YYYY') }})
                      <q-separator />
                      <div class="row q-gutter-md q-mt-sm">
                        <q-badge
                          size="md"
                          color="positive"
                        >
                          <h3>{{ props.row.vote_average }}</h3>
                        </q-badge>
                        <q-space />
                        <q-badge
                          class="text-bold"
                          color="dark"
                        >
                          <h3>{{ Math.round(props.row.popularity) }}</h3>
                        </q-badge>
                      </div>
                      <p v-if="showingOverview">
                        {{ props.row.overview }}
                      </p>
                    </div>
                  </q-img>
                </q-card>
              </div>
            </template>
          </q-table>
        </div>
      </div>
    </q-page>
  </template>
  
