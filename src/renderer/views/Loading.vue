<template>
  <div class="loading-page">
    <img class="img" src="../assets/images/developing_code.svg" width="160px">
    {{ $t('inConfig') }}...
  </div>
</template>

<script setup  lang="ts">

 import {onMounted} from "vue";
 import {useRoute, useRouter} from 'vue-router';
const router=useRouter()
 const route=useRoute()
 onMounted(( ) => {
setTimeout(() => {
  let {redirect }=route.query;
  router.push(redirect)
}, 1000);
 })


</script>

<style lang="scss" scoped>
.loading-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  .img {
    margin-bottom: 16px;
  }
}
</style>
