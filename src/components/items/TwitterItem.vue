<template>
  <div class="card m-2 p-0 text-start" style="width: 20rem;">
    <div class="card-body">
      <p>
        <small class="text-muted">
          <i class="bi-calendar4-event" /> &nbsp; {{ item.created_at.slice(0, 19).replace('T', ' ') }}
        </small>
        <a
          class="float-end"
          :href="`https://twitter.com/s/status/${item.twitter_id}`"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Tweet on Twitter">
          <!-- FIXME links to twitter ids stopped working, but they used to... -->
          <font-awesome-icon :icon="['fa-brands', 'twitter']" />
        </a>
      </p>
      <p class="card-text" v-html="renderedStatus" />
    </div>
    <div class="card-footer d-flex justify-content-between">
      <small class="text-muted">
        <font-awesome-icon :icon="['fas', 'retweet']" />
        {{ item.retweet_count }} &nbsp;
        <font-awesome-icon :icon="['far', 'heart']" />
        {{ item.like_count }} &nbsp;
        <font-awesome-icon :icon="['fas', 'reply']" />
        {{ item.reply_count }} &nbsp;
        <font-awesome-icon :icon="['fas', 'quote-left']" />
        {{ item.quote_count }}
      </small>
      <small class="text-muted">
        <!-- Footer right side -->
        &nbsp;
      </small>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { TwitterItemModel, Hashtag, Mention, URL } from '@/plugins/api/api-core';
import { defineComponent } from 'vue';

interface Replacement {
  start: number;
  end: number;
  html: string;
}

export default defineComponent({
  name: 'TwitterItem',
  props: {
    item: {
      type: Object as PropType<TwitterItemModel>,
      required: true,
      default: null,
    },
  },
  computed: {
    renderedStatus() {
      const replacements: Replacement[] = [];
      if (this.item.hashtags) {
        this.item.hashtags.forEach((hashtag: Hashtag) => {
          replacements.push({
            start: hashtag.start,
            end: hashtag.end,
            html: `<a target="_blank" href="https://twitter.com/hashtag/${hashtag.tag}">#${hashtag.tag}</a>`,
          });
        });
      }
      if (this.item.mentions) {
        this.item.mentions.forEach((mention: Mention) => {
          replacements.push({
            start: mention.start,
            end: mention.end,
            html: `<a target="_blank" href="https://twitter.com/${mention.username}">@${mention.username}</a>`,
          });
        });
      }
      if (this.item.urls) {
        this.item.urls.forEach((url: URL) => {
          replacements.push({
            start: url.start,
            end: url.end,
            html: `<a target="_blank" href="${url.url_expanded}">${url.url}</a>`,
          });
        });
      }
      let ret = '';
      let prevEnd = 0;
      replacements
        .sort((a, b) => a.start - b.start)
        .forEach((replacement) => {
          // FIXME: something has to be done with the slicing offsets... sometimes they are off
          ret += this.item.text.slice(prevEnd, replacement.start);
          ret += replacement.html;
          prevEnd = replacement.end;
        });
      ret += this.item.text.slice(prevEnd, this.item.text.length);
      return ret;
    },
  },
});
</script>

<style scoped>
/deep/ a {
  text-decoration: none !important;
}
</style>
