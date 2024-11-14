<script setup lang="ts">
interface TightDataFrame {
  index: number[];
  columns: string[];
  data: (string | boolean | number | null)[][];
  index_names: (string | null)[];
  column_names: (string | null)[];
}

defineProps<{ df: TightDataFrame }>();
</script>

<template>
  <div class="table-responsive" style="max-height: 30rem">
    <table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th></th>
          <th v-for="col in df.columns" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in df.data" :key="i">
          <th>{{ df.index[i] }}</th>
          <td v-for="(cell, j) in row" :key="j">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
