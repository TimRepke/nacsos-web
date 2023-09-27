<template>
  <div class="text-start">
    <h4>
      <font-awesome-icon :icon="['fa-brands', 'twitter']" />
      Twitter Query Setup
    </h4>

    <form class="row g-3">
      <div class="col-md-10">
        <label for="twitterQuery" class="form-label"
          ><code>query</code>&nbsp;
          <a
            href="https://developer.twitter.com/en/docs/twitter-api/tweets/counts/integrate/build-a-query"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Help"
          >
            <font-awesome-icon :icon="['fas', 'circle-question']" class="text-muted" />
          </a>
        </label>
        <input
          type="text"
          id="twitterQuery"
          class="form-control"
          :class="{ 'is-valid': !v$.config.query.$error, 'is-invalid': v$.config.query.$error }"
          v-model="config.query"
          :disabled="!editable"
          required
        />
        <div class="invalid-feedback" v-if="v$.config.query.$error">
          {{ errorsToString(v$.config.query) }}
        </div>
      </div>

      <div class="col-md-3">
        <label for="twitterMaxResults" class="form-label"
          ><code>max_results</code>&nbsp;
          <a
            href="https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-all"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Help"
          >
            <font-awesome-icon :icon="['fas', 'circle-question']" class="text-muted" />
          </a>
        </label>
        <input
          type="text"
          id="twitterMaxResults"
          class="form-control"
          :class="{ 'is-valid': !v$.config.max_results.$error, 'is-invalid': v$.config.max_results.$error }"
          v-model="config.max_results"
          :disabled="!editable"
        />
        <div class="invalid-feedback" v-if="v$.config.max_results.$error">
          {{ errorsToString(v$.config.max_results) }}
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <label for="twitterNextToken" class="form-label"
          ><code>next_token</code>&nbsp;
          <a
            href="https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/paginate"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Help"
          >
            <font-awesome-icon :icon="['fas', 'circle-question']" class="text-muted" />
          </a>
        </label>
        <input
          type="text"
          id="twitterNextToken"
          class="form-control"
          :class="{ 'is-valid': !v$.config.next_token.$error, 'is-invalid': v$.config.next_token.$error }"
          v-model="config.next_token"
          :disabled="!editable"
        />
        <div class="invalid-feedback" v-if="v$.config.next_token.$error">
          {{ errorsToString(v$.config.next_token) }}
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <label for="twitterSinceId" class="form-label"
          ><code>since_id</code>&nbsp;
          <a
            href="https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-all"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Help"
          >
            <font-awesome-icon :icon="['fas', 'circle-question']" class="text-muted" />
          </a>
        </label>
        <input
          type="text"
          id="twitterSinceId"
          class="form-control"
          :class="{ 'is-valid': !v$.config.since_id.$error, 'is-invalid': v$.config.since_id.$error }"
          v-model="config.since_id"
          placeholder="Tweet ID"
          :disabled="!editable"
        />
        <div class="invalid-feedback" v-if="v$.config.since_id.$error">
          {{ errorsToString(v$.config.since_id) }}
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <label for="twitterUntilId" class="form-label"
          ><code>until_id</code>&nbsp;
          <a
            href="https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-all"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Help"
          >
            <font-awesome-icon :icon="['fas', 'circle-question']" class="text-muted" />
          </a>
        </label>
        <input
          type="text"
          id="twitterUntilId"
          class="form-control"
          :class="{ 'is-valid': !v$.config.until_id.$error, 'is-invalid': v$.config.until_id.$error }"
          placeholder="Tweet ID"
          v-model="config.until_id"
          :disabled="!editable"
        />
        <div class="invalid-feedback" v-if="v$.config.until_id.$error">
          {{ errorsToString(v$.config.until_id) }}
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <label for="twitterStartTime" class="form-label"
          ><code>start_time</code>&nbsp;
          <a
            href="https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-all"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Help"
          >
            <font-awesome-icon :icon="['fas', 'circle-question']" class="text-muted" />
          </a>
        </label>
        <input
          type="text"
          id="twitterStartTime"
          class="form-control"
          :class="{ 'is-valid': !v$.config.start_time.$error, 'is-invalid': v$.config.start_time.$error }"
          placeholder="YYYY-MM-DDTHH:mm:ssZ"
          v-model="config.start_time"
          :disabled="!editable"
        />
        <div class="invalid-feedback" v-if="v$.config.start_time.$error">
          {{ errorsToString(v$.config.start_time) }}
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <label for="twitterEndTime" class="form-label"
          ><code>end_time</code>&nbsp;
          <a
            href="https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-all"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Help"
          >
            <font-awesome-icon :icon="['fas', 'circle-question']" class="text-muted" />
          </a>
        </label>
        <input
          type="text"
          id="twitterEndTime"
          class="form-control"
          v-model="config.end_time"
          :disabled="!editable"
          placeholder="YYYY-MM-DDTHH:mm:ssZ"
          :class="{ 'is-valid': !v$.config.end_time.$error, 'is-invalid': v$.config.end_time.$error }"
        />
        <div class="invalid-feedback" v-if="v$.config.end_time.$error">
          {{ errorsToString(v$.config.end_time) }}
        </div>
      </div>

      <div class="col-md-4">
        <label for="twitterSortOrder" class="form-label"
          ><code>sort_order</code>&nbsp;
          <a
            href="https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-all"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Help"
          >
            <font-awesome-icon :icon="['fas', 'circle-question']" class="text-muted" />
          </a>
        </label>
        <select
          class="form-select"
          id="twitterSortOrder"
          aria-describedby="twitterSortOrder"
          v-model="config.sort_order"
          :disabled="!editable"
        >
          <option value="relevancy">Relevance</option>
          <option value="recency">Recency</option>
        </select>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import useVuelidate from "@vuelidate/core";
import type { BaseValidation, ValidationRule } from "@vuelidate/core";
import { required, between, alphaNum, integer } from "@vuelidate/validators";
import type { ImportConfigTwitter } from "@/plugins/api/api-core";

const isValidISO8601: ValidationRule = {
  $validator(value: string): boolean {
    // first, check whether value is set
    if (!value) {
      return false;
    }

    // see if value matches regex
    const iso8601 = /^(2\d{3})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/m; // YYYY-MM-DDTHH:mm:ssZ
    const matches = iso8601.exec(value);
    if (!matches || matches.length !== 7) {
      return false;
    }

    // convert match groups to date and check if converting it back results in the same value
    const date = new Date(
      Date.UTC(
        parseInt(matches[1], 10), // year
        parseInt(matches[2], 10) - 1, // month
        parseInt(matches[3], 10), // date
        parseInt(matches[4], 10), // hours
        parseInt(matches[5], 10), // minutes
        parseInt(matches[6], 10), // seconds
      ),
    );
    return `${date.toISOString().slice(0, 19)}Z` === value;
  },
  $message: "Wrong data format. Needs YYYY-MM-DDTHH:mm:ssZ",
};

const isValidSortOrder: ValidationRule = {
  $validator(value?: ImportConfigTwitter.sort_order) {
    return value !== undefined;
  },
  $message: "Not a valid sort order",
};

export default defineComponent({
  name: "ConfigTwitter",
  emits: ["configChanged"],
  props: {
    existingConfig: {
      type: Object as PropType<ImportConfigTwitter>,
      required: true,
      default: null,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    const config: ImportConfigTwitter = this.existingConfig
      ? this.existingConfig
      : ({
          query: "",
          max_results: undefined,
          next_token: undefined,
          since_id: undefined,
          until_id: undefined,
          sort_order: "recency",
          start_time: undefined,
          end_time: undefined,
        } as ImportConfigTwitter);
    if (!this.existingConfig) {
      this.$emit("configChanged", config);
    }
    return {
      config,
    };
  },
  validations() {
    return {
      config: {
        query: { required, $autoDirty: true },
        max_results: { integer, between: between(10, 500), $autoDirty: true },
        next_token: { alphaNum, $autoDirty: true },
        since_id: { integer, $autoDirty: true },
        until_id: { integer, $autoDirty: true },
        sort_order: { isValidSortOrder, $autoDirty: true },
        start_time: { isValidISO8601, $autoDirty: true },
        end_time: { isValidISO8601, $autoDirty: true },
      },
    };
  },
  methods: {
    errorsToString(field: BaseValidation) {
      return field.$errors.map((error) => error.$message).join("; ");
    },
  },
  watch: {
    config: {
      handler(newValue: ImportConfigTwitter) {
        this.$emit("configChanged", newValue);
      },
      deep: true,
    },
  },
});
</script>

<style scoped></style>
