<script setup>
import { date } from 'quasar'
import { useRouter } from 'vue-router'
import { useMovieStore } from '~/stores/movie'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const router = useRouter()
const { watchedMovies, watchedMoviesPagination, watchedMoviesSortBy } = storeToRefs(useMovieStore())
const { loadUserMovies, loadMovie } = useMovieStore()
const showingOverview = ref(false)
const search = ref('')



function poster (url) {
  return'https://image.tmdb.org/t/p/original' + url
}

async function request (payload) {
  await loadUserMovies({ pagination: payload.pagination, watched: true })
}

function show (payload) {
  loadMovie(payload.tmdb_id)
  const name = payload.title.split(' ').join('_').toLowerCase()
  router.push({ name: 'movie-tmdb_id-name', params: { name, tmdb_id: payload.tmdb_id } })
}

onMounted(async () => {
  await request({ pagination: watchedMoviesPagination.value })
})

function sort(payload) {
  watchedMoviesSortBy.value = payload
  request({ pagination: watchedMoviesPagination.value })
}
</script>

<template>
  <q-page>
    <div class="row">
      <div class="col-12">
        <MoviesUserMoviesSorting :type="'watched'" @sort="sort" />

        <q-table
          v-if="watchedMovies && watchedMovies.length > 0"
          :rows="watchedMovies"
          grid
          v-model:pagination="watchedMoviesPagination"
          :filter="search"
          @request="request($event)"
          row-key="id"
          class="scroll"
          style="height: 90vh"
        >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-white bg-primary"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
          <template #item="props">
            <div
              class=" q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              >
              <q-card
                class="my-card cursor-pointer"
                @click="show(props.row.attributes)"
              >
                <q-img
                  :src="poster(props.row.attributes.poster_path)"
                  height="300"
                >
                <div class="absolute-top text-subtitle2 text-center text-bold">
                    <q-separator />
                    <MoviesActions :tmdb_id="props.row.attributes.tmdb_id" />
                  </div>
                  <div class="absolute-bottom text-subtitle2 text-center text-bold">
                    {{ props.row.attributes.title }} ({{ date.formatDate(props.row.attributes.release_date, 'YYYY') }})
                    <q-separator />
                    <div class="row q-gutter-md q-mt-sm">
                      <q-badge
                        size="md"
                        color="positive"
                      >
                        <h3>{{ props.row.attributes.rating }}</h3>
                      </q-badge>
                      <q-space />
                      <q-badge
                        class="text-bold"
                        color="dark"
                      >
                        <h3>{{ Math.round(props.row.attributes.popularity) }}</h3>
                      </q-badge>
                    </div>
                    <p v-if="showingOverview">
                      {{ props.row.attributes.overview }}
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




