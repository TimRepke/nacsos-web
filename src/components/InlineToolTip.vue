<template>
  <template v-if="!info">
    <slot/>
  </template>
  <template v-else>
    <span class="nacsos-tooltip">
      <slot/>
      <span class="nacsos-tooltiptext small">
        {{ info }}
      </span>
    </span>
  </template>
</template>

<script>

export default {
  name: 'InlineToolTip',
  props: ['info'],
};
</script>
