<script setup>
import { useMovieStore } from '~/stores/movie'
import { storeToRefs } from 'pinia'
const { quotes, loadingQuotes } = storeToRefs(useMovieStore())

</script>

<template>
  <q-toolbar>
    <q-toolbar-title>
      <h3 class="q-my-md">
        Quotes
        <q-badge>AI</q-badge>
      </h3>
    </q-toolbar-title>
  </q-toolbar>
  <div v-if="quotes && quotes.length > 0 && !loadingQuotes">
    <div
      v-for="quote in quotes"
      :key="quote.quote"
    >
      - {{ quote.quote }} -
      <SharedAIFeedback />
      <q-separator
        dark
        class="q-mb-sm"
      />
    </div>
  </div>
  <div
    v-if="loadingQuotes"
    class="text-center full-width"
  >
    <q-spinner
      color="primary"
      size="3em"
    />
    <p class="text-bold">
      Generating content
    </p>
  </div>
  <p v-if="quotes && quotes.length === 0 && !loadingQuotes">
    There are no  quotes for this movie. AI will generate them soon
  </p>
</template>
