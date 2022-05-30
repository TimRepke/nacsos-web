<template>
  <div class="card m-2 p-0 text-start" style="width: 20rem;">
    <div class="card-body">
      <p>
        <small class="text-muted">
          <i class="bi-calendar4-event"></i> &nbsp; {{ tweet.created_at.slice(0, 19).replace('T', ' ') }}
        </small>
        <a class="float-end" :href="`https://twitter.com/s/status/${tweet.twitter_id}`" target="_blank"
           aria-label="Tweet on Twitter">
          <!-- FIXME links to twitter ids stopped working, but they used to... -->
          <font-awesome-icon :icon="['fa-brands', 'twitter']"/>
        </a>
      </p>
      <p class="card-text" v-html="renderedStatus"></p>
    </div>
    <div class="card-footer d-flex justify-content-between">
      <small class="text-muted">
        <font-awesome-icon :icon="['fas', 'retweet']"/>
        {{ tweet.retweet_count }} &nbsp;
        <font-awesome-icon :icon="['far', 'heart']"/>
        {{ tweet.like_count }} &nbsp;
        <font-awesome-icon :icon="['fas', 'reply']"/>
        {{ tweet.reply_count }} &nbsp;
        <font-awesome-icon :icon="['fas', 'quote-left']"/>
        {{ tweet.quote_count }}
      </small>
      <small class="text-muted">
        5
      </small>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Hashtag, Mention, URL, TwitterItem as TwitterItemModel } from '@/types/items/twitter.d';

interface Replacement {
  start: number;
  end: number;
  html: string;
}

export default {
  name: 'TwitterItem',
  props: {
    tweet: {
      type: Object as PropType<TwitterItemModel>,
    },
  },
  computed: {
    renderedStatus() {
      const replacements: Replacement[] = [];
      if (this.tweet.hashtags) {
        this.tweet.hashtags.forEach((hashtag: Hashtag) => {
          replacements.push({
            start: hashtag.start,
            end: hashtag.end,
            html: `<a target="_blank" href="https://twitter.com/hashtag/${hashtag.tag}">#${hashtag.tag}</a>`,
          });
        });
      }
      if (this.tweet.mentions) {
        this.tweet.mentions.forEach((mention: Mention) => {
          replacements.push({
            start: mention.start,
            end: mention.end,
            html: `<a target="_blank" href="https://twitter.com/${mention.username}">@${mention.username}</a>`,
          });
        });
      }
      if (this.tweet.urls) {
        this.tweet.urls.forEach((url: URL) => {
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
          ret += this.tweet.status.slice(prevEnd, replacement.start);
          ret += replacement.html;
          prevEnd = replacement.end;
        });
      ret += this.tweet.status.slice(prevEnd, this.tweet.status.length);
      return ret;
    },
  },
};
</script>

<style scoped>
/deep/ a {
  text-decoration: none !important;
}
</style>
