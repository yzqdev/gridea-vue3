<template>
  <div class="mb-4 py-4 border-b border-gray-200">
    <div class="text-base font-medium mb-4">{{ $t("version") }}</div>
    <div>{{ version }}</div>
    <a href="https://gridea.dev" target="_blank"> Gridea</a>
  </div>
</template>

<script setup lang="ts">
import pkg from "../../../../../package.json";
import {onMounted, reactive} from "vue";
function  saveLanguage() {
  localStorage.setItem("language", this.currentLanguage);
  this.$root.$i18n.locale = this.currentLanguage;
}

let state=reactive({
  formLayout : {
    label: { span: 5 },
    wrapper: { span: 12 },
  },

  version: (pkg as any).version,

  currentLanguage : "zhHans"
})
 onMounted(() => {
   state.currentLanguage = localStorage.getItem("language") || "zhHans";
 })
</script>

<style lang="scss" scoped></style>
