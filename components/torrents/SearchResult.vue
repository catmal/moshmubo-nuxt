<script setup>
import { useTorrentStore } from '~/stores/torrent'
import { storeToRefs } from 'pinia'
const emit = defineEmits(['request'])

const { results, pagination } = storeToRefs(useTorrentStore())
const columns = [
  { name: 'name', align: 'left', label: 'Title', field: 'name', sortable: true },
  { name: 'size', label: 'Size', field: 'size', sortable: true },
  { name: 'seeds', label: 'Seeds', field: 'seeds', sortable: true },
  { name: 'link', label: 'Download', field: 'link', align: 'right' }

]
</script>
<template>
  <q-table
    title="Treats"
    :rows="results"
    row-key="name"
    :columns="columns"
    v-model:pagination="pagination"
    @request="emit('request', $event)"
    :rows-per-page-options="[40]"
  >
    <template
      #body="props"
    >
      <q-tr
        :props="props"
      >
        <q-td
          key="name"
          :props="props"
        >
          <p>{{ props.row.name }}</p>
        </q-td>
        <q-td
          key="size"
          :props="props"
        >
          <p>{{ props.row.size }}</p>
        </q-td>
        <q-td
          key="seeds"
          :props="props"
        >
          <p>{{ props.row.seeds }}</p>
        </q-td>
        <q-td
          key="seeds"
          :props="props"
        >
          <q-icon
            name="download"
            size="md"
            title="Download"
            class="cursor-pointer "
            tag="a"
            :href="props.row.link"
            style="text-decoration: none"
            color="green"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>


