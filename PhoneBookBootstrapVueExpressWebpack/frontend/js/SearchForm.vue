<script>
export default {
  name: "SearchForm",

  props: {
    inputSearchingStringValue: String
  },

  methods: {
    updateSearchString(event) {
      this.$emit('updateSearchString', event.target.value);
      this.$emit("update:inputSearchingStringValue", event.target.value);
    },

    onSubmit(event) {
      event.preventDefault();
    },

    clearInput() {
      this.$emit('updateSearchString', "");
      this.$emit("update:inputSearchingStringValue", "");
    }
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="mb-3">
    <div class="row">
      <div class="col-md-3">
        <input id="search" type="text" class="form-control" placeholder="Поиск"
               @input="updateSearchString"
               :value="inputSearchingStringValue"
        >
      </div>
      <div v-if="inputSearchingStringValue.trim().length !== 0" class="col-md-3">
        <button type="button" @click="clearInput" class="btn btn-secondary">Отмена</button>
      </div>
    </div>
  </form>
</template>