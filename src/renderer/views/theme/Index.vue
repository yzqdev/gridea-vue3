<template>
  <div class="">
    <el-tabs class="menu-tab"   v-model="currentTab" forceRender :animated="false">
      <el-tab-pane :label="$t('basicSetting')" name="basicSetting" key="basic">
        <basic-setting></basic-setting>
      </el-tab-pane>
      <el-tab-pane :label="$t('customConfig')" name="customConfig" key="custom">
        <custom-setting></custom-setting>
      </el-tab-pane>
      <el-tab-pane :label="$t('faviconSetting')" name="faviconSetting" key="favicon">
        <favicon-setting></favicon-setting>
      </el-tab-pane>
      <el-tab-pane :label="$t('avatarSetting')" name="avatarSetting" key="avatar">
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
import {onMounted, reactive, ref, toRefs} from "vue";
import {useRoute,useRouter} from 'vue-router';
let router=useRouter()
let route=useRoute()
let state=reactive({
  currentTab:'basicSetting'
})
let {currentTab}=toRefs(state)
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
