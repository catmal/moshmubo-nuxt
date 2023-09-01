<script setup>

import { date, useQuasar } from 'quasar'
import { useMovieStore } from '~/stores/movie'
import { useTorrentStore } from '~/stores/torrent'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { watch, ref } from 'vue'

const {
  currentMovie, pagination, curiousFacts, credits, collectionMovies,
  watchReasons, ratingTopics, similarMovies, loadingFacts, loadingWatchReasons,
  loadingSimilarMovies, loadingRatingTopics, loadingPlot, selectedMovie
} = storeToRefs(useMovieStore())
const {
  setWatchedMovie, setWatchListMovie, loadCuriousFacts, loadQuotes, loadCredits, loadCollection,
  loadMovie, loadMovieWatchReasons, loadContentRating, loadSimilarMovies,
  loadPlotRecap
} = useMovieStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const key = route.path

const searching = ref(false)
const { searchMagnet } = useTorrentStore()


function image (url) {
  return'https://image.tmdb.org/t/p/original' + url
}
similarMovies.value = []
curiousFacts.value = []
watchReasons.value = []
ratingTopics.value = []
collectionMovies.value = []
function request (payload) {
  searchMagnet({ pagination: payload.pagination })
  searching.value = true
}

function cancel () {
  router.go(-1)
}

function show (payload) {
  loadMovie(payload.id)
  const name = payload.title.split(' ').join('_').toLowerCase()
  router.push({ name: "movie-tmdb_id-name", params: { name, tmdb_id: payload.id } })

}
await loadMovie(route.params.tmdb_id)


watch(route, (to) => {
  if (to.params.tmdb_id) {
    const id = to.params.tmdb_id

    loadPlotRecap(route.params.tmdb_id)
    loadCredits(route.params.tmdb_id)
    loadContentRating(id)
    loadCuriousFacts(id)
    loadQuotes(id)
    loadMovieWatchReasons(id)
    loadSimilarMovies(id)
    if (currentMovie.value.belongs_to_collection && id === route.params.tmdb_id) {
      loadCollection(id)
    }
  }
}, { flush: 'pre', immediate: true, deep: true }
)

// const director = computed(() => {
//   return currentMovie.value.credits.crew.find(x => x.department === 'Directing')
// })
useSeoMeta({
  title: selectedMovie.value.title,
  ogTitle: selectedMovie.value.title,
  description: selectedMovie.value.overview,
  ogDescription: selectedMovie.value.overview,
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
useHead({
  meta: [
    { name: 'Moshmubo', content: selectedMovie.value.title }
  ],
})

</script>
<template>
  <div
    style="width: 100%; ; overflow-y: hidden;"
    :key="key"
  >
    <div
      v-if="currentMovie"
      :style="{backgroundImage: `url(${image(currentMovie.poster_path)})`}"
      class="bg-image"
      style="overflow-y: hidden;"
    >
      <div class="text-subtitle1 bg-black semi-transparent text-white">
        <div
            class="row q-gutter-md q-px-md q-pt-md"
            style="opacity: 1"
        >
        <MoviesActions @toggle_watched="setWatchedMovie({id: currentMovie.tmdb_id, type: 'current'})" 
                        :watched="currentMovie.watched"
                        @toggle_watchlist="setWatchListMovie({id: currentMovie.tmdb_id, type: 'current'})"
                        :watchlist="currentMovie.watchlist"

         />
        <q-space />
        <q-icon
        name="cancel"
        size="md"
        @click="cancel()"
        title="Close"
        class="cursor-pointer"
        />
        </div>

        <q-separator
          dark
          class="q-my-md"
        />
        <div class="row full-width q-col-gutter-md q-pb-sm">
          <div class="col-6 col-sm-6 col-xs-12">
            <h3>{{ currentMovie.title }} ({{ date.formatDate(currentMovie.release_date, 'YYYY') }})</h3>
          </div>
          <div class="col-sm-6 col-xs-12 items-end">
            <q-space />
            <q-badge
              style="height: 30px"
              class="text-bold "
              label="popularity"
            >
              <h3>{{ currentMovie.popularity }}</h3>
            </q-badge>
            <q-badge
              style="height: 30px"
              class="q-ml-sm text-bold"
              label="rating"
            >
              <h3>{{ currentMovie.rating }}</h3>
            </q-badge>
          </div>
        </div>
        <q-card-section>
          <div
            class="row q-col-gutter-md"
            :class="{ scroll: $q.platform.is.mobile }"
            style="height: 90vh; padding-bottom: 140px"
          >
            <div class="col-lg-4 col-md-6 col-xs-12">
              <q-img
                width="300px"
                :src="image(currentMovie.poster_path)"
              />
              <div class="row q-mt-sm q-gutter-sm">
                <q-badge
                  color="positive"
                  v-for="genre in currentMovie.genres"
                  :key="genre.name"
                  class="q-pa-sm"
                >
                  {{ genre }}
                </q-badge>
              </div>
              <div class="row q-mt-sm q-gutter-md">
                <q-badge class="text-bold q-pa-sm">
                  {{ currentMovie.runtime }} min
                </q-badge>
                <q-badge class="text-bold">
                  {{ currentMovie.language }}
                </q-badge>
              </div>
            </div>
            <div
              class="col-lg-8 col-md-6 col-xs-12"
              :class="{ scroll: !$q.platform.is.mobile }"
              style="height: 70vh; "
            >
              <h3
                class="
              q-mb-md"
              >
                {{ currentMovie.tagline }}
              </h3>

              <p>
                {{ currentMovie.overview }}
              </p>
              <h3
                class="q-my-md"
              >
                Plot
              </h3>
              <p
                v-if="currentMovie.plot_recap && !loadingPlot"
                class="q-mb-md"
              >
                {{ currentMovie.plot_recap }}
              </p>
              <SharedAIFeedback />
              <p v-if="!currentMovie.plot_recap && !loadingPlot">
                There is no plot recap for this movie. AI will generate it soon
              </p>
              <div
                v-if="loadingPlot"
                class="text-center full-width"
              >
                <SharedGeneratingContent />
              </div>
              <h3
                class="q-my-md"
              >
                Cast
              </h3>
              <q-virtual-scroll
                :items="credits"
                v-if=" credits.length > 0"
                virtual-scroll-horizontal
                v-slot="{ item, index }"
              >
                <div
                  :key="index"
                  :class="item.class"
                  style="width: 100px"
                  class="q-mx-md text-center"
                >
                  <q-avatar size="90px">
                    <img :src="image(item.profile_path)">
                  </q-avatar>
                  <small
                    class="q-mt-md ellipsis"
                    style="width: 90px"
                  >
                    {{ item.name }}
                  </small>
                  <q-separator />
                  <small
                    style="width: 90px"
                    class="ellipsis text-bold"
                  >
                    {{ item.character }}
                  </small>
                </div>
              </q-virtual-scroll>

              <p v-if="credits.length === 0">
                There are no credits for this movie. They will be fetched soon
              </p>
              <h3
                class="q-mt-md"
                v-if="collectionMovies.length > 0"
              >
                Collection
              </h3>
              <q-virtual-scroll
                v-if="collectionMovies && collectionMovies.length > 0"
                :items="collectionMovies"
                virtual-scroll-horizontal
                v-slot="{ item, index }"
                class="q-mt-md"
                :virtual-scroll-item-size="48"
              >
                <div
                  :key="index"
                  :class="item.class"
                  class="q-mx-md"
                >
                  <q-img
                    class="cursor-pointer"
                    @click="show(item.attributes)"
                    contain
                    width="200px"
                    height="auto"
                    :src="image(item.attributes.poster_path)"
                  >
                  <div class="absolute-top text-subtitle2 text-center text-bold">
                    <MoviesActions @toggle_watched="setWatchedMovie({id: item.attributes.id, type: 'collection'})" 
                                  :watched="item.attributes.watched" 
                                  @toggle_watchlist="setWatchListMovie({id: item.attributes.id, type: 'collection'})"
                                  :watchlist="currentMovie.watchlist"

                    />
                  </div>
                  </q-img>
                  <p
                    class="q-mt-md ellipsis text-center"
                    style="width: 200px"
                  >
                    {{ item.attributes.title }} ({{ date.formatDate(item.attributes.release_date, 'YYYY') }})
                  </p>
                </div>
              </q-virtual-scroll>
              <q-toolbar>
                <q-toolbar-title>
                  <h3 class="q-my-md">
                    Content Rating
                    <q-badge>AI</q-badge>
                  </h3>
                </q-toolbar-title>
              </q-toolbar>
              <p v-if="currentMovie.content_rating_info && !loadingRatingTopics">
                {{ currentMovie.content_rating }}
                {{ currentMovie.content_rating_info }}
                <q-separator dark />
                {{ currentMovie.suggested_audience }}
              </p>
              <p v-if="!loadingRatingTopics && !currentMovie.content_rating_info">
                There are no content rating info for this movie. AI will generate them soon
              </p>
              <div
                v-for="topic in ratingTopics"
                :key="topic.content"
              >
                - <strong>{{ topic.topic }}:</strong> {{ topic.content }}
              </div>
              <SharedAIFeedback  />
              <div
                v-if="loadingRatingTopics"
                class="text-center full-width"
              >
                <SharedGeneratingContent />
              </div>
              <div>
                <q-toolbar>
                  <q-toolbar-title>
                    <h3 class="q-my-md">
                      Curious facts
                      <q-badge>AI</q-badge>
                    </h3>
                  </q-toolbar-title>
                </q-toolbar>
                <div v-if="curiousFacts.length > 0 && !loadingFacts">
                  <div
                    v-for="fact in curiousFacts"
                    :key="fact.attributes.fact"
                  >
                    - {{ fact.attributes.fact }}
                    <SharedAIFeedback :feedback="fact.feedback" />
                    <q-separator
                      dark
                      class="q-mb-sm"
                    />
                  </div>
                </div>
                <p v-if="curiousFacts.length === 0 && !loadingFacts">
                  There are no curious facts for this movie. AI will generate them soon
                </p>
                <div
                  v-if="loadingFacts"
                  class="text-center full-width"
                >
                  <SharedGeneratingContent />
                </div>
                <MoviesQuotes />
                <q-toolbar>
                  <q-toolbar-title>
                    <h3 class="q-my-md">
                      Why to watch
                      <q-badge>AI</q-badge>
                    </h3>
                  </q-toolbar-title>
                </q-toolbar>
                <div v-if="!loadingWatchReasons">
                  <div
                    v-for="reason in watchReasons"
                    :key="reason.content"
                  >
                    - {{ reason.content }}
                    <SharedAIFeedback :feedback="fact.feedback" />
                    <q-separator
                      dark
                      class="q-mb-sm"
                    />
                  </div>
                </div>
                <p v-if="watchReasons.length === 0 && !loadingWatchReasons">
                  There are no why to watch reasons for this movie. AI will generate them soon
                </p>
                <div
                  v-if="loadingWatchReasons"
                  class="text-center full-width"
                >
                  <SharedGeneratingContent />
                </div>
                <h3
                  class="q-mt-md"
                >
                  Similar Movies
                  <q-badge>AI</q-badge>
                </h3>
                <q-virtual-scroll
                  v-if="!loadingSimilarMovies && similarMovies.length > 0"
                  :items="similarMovies"
                  virtual-scroll-horizontal
                  v-slot="{ item, index }"
                  class="q-mt-md"
                  :virtual-scroll-item-size="48"
                >
                  <div
                    :key="index"
                    :class="item.class"
                    class="q-mx-md"
                  >
                    <q-img
                      class="cursor-pointer"
                      @click="show(item.attributes)"
                      contain
                      width="200px"
                      height="auto"
                      :src="image(item.attributes.poster_path)"
                    >
                      <div class="absolute-bottom text-subtitle2 text-center text-bold">
                        <q-separator />
                        <div class="row q-gutter-md q-mt-sm">
                          <q-badge
                            size="md"
                            color="positive"
                          >
                            <h3>{{ item.attributes.rating }}</h3>
                          </q-badge>
                          <q-space />
                          <q-badge
                            class="text-bold"
                            color="dark"
                          >
                            <h3>{{ Math.round(item.attributes.popularity) }}</h3>
                          </q-badge>
                        </div>
                      </div>
                      <div class="absolute-top text-subtitle2 text-center text-bold">
                        <q-separator />
                        <MoviesActions @toggle_watched="setWatchedMovie({id: item.attributes.id, type: 'similar'})"  
                                        :watched="item.attributes.watched"  
                                        @toggle_watchlist="setWatchListMovie({id: item.attributes.id, type: 'similar'})"
                                        :watchlist="item.attributes.watchlist"
                        />
                      </div>
                    </q-img>
                    <p
                      class="q-mt-md ellipsis text-center"
                      style="width: 200px"
                    >
                      {{ item.attributes.title }} ({{ date.formatDate(item.attributes.release_date, 'YYYY') }})
                    </p>
                  </div>
                </q-virtual-scroll>
                <p v-if="!loadingSimilarMovies && similarMovies['data'] && similarMovies['data'].length === 0 && !loadingSimilarMovies">
                  There are no similar movies for this movie. AI will generate them soon
                </p>
                <div
                  v-if="loadingSimilarMovies"
                  class="text-center full-width"
                >
                  <SharedGeneratingContent />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </div>
    </div>
  </div>

  <q-dialog
    v-model="searching"
  >
    <q-card style="min-heigth: 80vh; width: 1200px; max-width: 95vw">
      <TorrentsSearchResult
        :title="currentMovie.title"
        @request="request"
      />
    </q-card>
  </q-dialog>
</template>

<style>

  .bg-image {
    background-repeat: no-repeat;
    background-size: cover;
    height: calc(100vh - 100px);
  }

  .semi-transparent {
    opacity: 0.8
  }

</style>
