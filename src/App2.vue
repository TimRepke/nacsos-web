<template>
  <div></div>
</template>

<script lang="ts">
import { API } from "@/plugins/api";

API.ping
  .pongApiPingGet()
  .then((response) => {
    console.log('app', response);
  })
  .catch((reason) => {
    console.log('app', reason);
  });
</script>

<style lang="scss"></style>
