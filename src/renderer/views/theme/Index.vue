<template>
  <div class="">
    <el-tabs class="menu-tab" defaultActiveKey="basic" v-model="currentTab" forceRender :animated="false">
      <el-tab-pane :tab="$t('basicSetting')" key="basic">
        <basic-setting></basic-setting>
      </el-tab-pane>
      <el-tab-pane :tab="$t('customConfig')" key="custom">
        <custom-setting></custom-setting>
      </el-tab-pane>
      <el-tab-pane :tab="$t('faviconSetting')" key="favicon">
        <favicon-setting></favicon-setting>
      </el-tab-pane>
      <el-tab-pane :tab="$t('avatarSetting')" key="avatar">
        <avatar-setting></avatar-setting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import BasicSetting from './includes/BasicSetting.vue'
import CustomSetting from './includes/CustomSetting.vue'
import FaviconSetting from './includes/FaviconSetting.vue'
import AvatarSetting from './includes/AvatarSetting.vue'
import {onMounted, ref} from "vue";
import {useRoute,useRouter} from 'vue-router';
let router=useRouter()
let route=useRoute()

  let currentTab = ref('basic')
onMounted(() => {
  const { tab } = route.query
  if (tab && typeof tab === 'string') {
    currentTab.value = tab
    console.log( currentTab.value)
  }
})


</script>

<style lang="scss" scoped>
</style>
