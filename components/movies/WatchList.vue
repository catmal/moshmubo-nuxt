<script setup>
import { date } from 'quasar'
import { useRouter } from 'vue-router'
import { useMovieStore } from '~/stores/movie'
import { storeToRefs } from 'pinia'
import { onMounted, ref, defineAsyncComponent } from 'vue'

const router = useRouter()
const { watchListMovies, pagination } = storeToRefs(useMovieStore())
const { loadUserMovies, loadMovie } = useMovieStore()
const showing = ref(false)
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
  await loadUserMovies({ pagination: payload.pagination, watchlist: true })
}

function show (payload) {
  loadMovie(payload.id)
  const name = payload.title.split(' ').join('_').toLowerCase()
  router.push({ name: 'Movie', params: { name, tmdb_id: payload.tmdb_id } })
}

onMounted(async () => {
  await request({ pagination: pagination.value, watchlist: true })
})
</script>

<template>
  <q-page>
    <div class="row">
      <div class="col-12">
        <MoviesUserMoviesSorting />

        <q-table
          v-if="watchListMovies.length > 0"
          :rows="watchListMovies"
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
                @click="show(props.row.attributes)"
              >
                <q-img
                  :src="poster(props.row.attributes.poster_path)"
                  height="300"
                >
                  <div class="absolute-bottom text-subtitle2 text-center text-bold">
                    {{ props.row.attributes.title }} ({{ date.formatDate(props.row.attributes.release_date, 'YYYY') }})
                    <q-separator />
                    <div class="row q-gutter-md q-mt-sm">
                      <q-badge
                        size="md"
                        color="positive"
                      >
                        <h3>{{ props.row.attributes.vote_average }}</h3>
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

    <q-dialog
      v-model="showing"
      persistent
      class="full-width"
    >
      <q-card
        style="height: 85vh; width: 1200px; max-width: 95vw; overflow-y: hidden;"
      >
        <Suspense>
          <template #default>
            <MoviePage @cancel="showing = false" />
          </template>
          <template #fallback>
            Loading
          </template>
        </Suspense>
      </q-card>
    </q-dialog>
  </q-page>
</template>


