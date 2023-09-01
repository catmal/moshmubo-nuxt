<script setup>
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { useMovieStore } from '~/stores/movie'
import { storeToRefs } from 'pinia'
import { date } from 'quasar'

const { loadGenres, loadMovieSuggestions } = useMovieStore()
const { genres, suggestions, loadingSuggestions } = storeToRefs(useMovieStore())
const selected = ref([])
const customText = ref('')
function poster (url) {
  return'https://image.tmdb.org/t/p/original' + url
}
onMounted(async () => {
  await loadGenres()
})
</script>

<template>
  <q-card-section>
    <h1>
      Suggestions
      <q-badge class="q-pa-sm text-bold">
        AI
      </q-badge>
    </h1>
    <div class="row q-col-gutter-sm">
      <div class="col-12">
        <p>Get suggestion for 10 movies following criteria below</p>
      </div>
      <q-select
        label="Genres"
        v-model="selected"
        use-chips
        multiple
        input-debounce="0"
        :options="genres"
        option-label="name"
        option-value="name"
        @update:model-value="request"
        style="width: 300px"
        class="q-mb-md"
      />
    </div>
    <SharedTextInput
      v-model="customText"
      outlined
      label="Custom text"
      placeholder="The movies should include UFO elements"
    />
    <div class="row">
      <q-space class="q-my-md" />
      <q-btn
        v-if="!loadingSuggestions"
        class="q-my-md"
        color="positive"
        @click="loadMovieSuggestions(selected, customText), selected = []"
      >
        Generate
      </q-btn>
    </div>
    <q-separator />
    <div
      v-if="loadingSuggestions"
      class="text-center full-width"
      style="margin-top: 100px"
    >
      <q-spinner
        color="primary"
        size="3em"
      />
      <h3>Generating your suggestions</h3>
    </div>
    <div v-if="!loadingSuggestions">
      <q-card
        class="q-mt-md"
        v-for="movie in suggestions"
        :key="movie.tmdb_id"
      >
        <q-card-section horizontal>
          <q-img
            class="col-2"
            :src="poster(movie.poster_path)"
          />

          <q-card-section>
            <h3> {{ movie.title }}</h3>
            <div class="row q-gutter-sm q-mt-md">
              <q-badge
                class="q-pa-sm text-bold"
                flat
              >
                {{ movie.runtime }} min
              </q-badge>
              <q-space />
              <q-badge
                class="q-pa-sm text-bold"
                flat
              >
                {{ movie.rating }}
              </q-badge>
              <q-badge
                class="q-pa-sm text-bold"
                flat
              >
                {{ movie.popularity }}
              </q-badge>
            </div>
            <p class="text-bold q-my-md">
              {{ movie.tagline }}
            </p>
            {{ movie.overview }}
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <div class="row q-gutter-md">
            <q-btn color="primary">
              Plot
            </q-btn>
            <q-btn color="primary">
              Why to watch
            </q-btn>
            <q-btn color="primary">
              Curious facts
            </q-btn>
            <q-btn color="primary">
              Quotes
            </q-btn>
          </div>
        </q-card-actions>
      </q-card>
    </div>
  </q-card-section>
</template>
