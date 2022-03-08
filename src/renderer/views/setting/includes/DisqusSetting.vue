<template>
  <div>
    <el-form-item label=" "    :colon="false">
      <a @click.prevent="openPage('https://github.com/SukkaW/DisqusJS')">DisqusJS Document</a>
    </el-form-item>
    <el-form-item label="shortname"     :colon="false">
      <el-input v-model="form.shortname"></el-input>
    </el-form-item>
    <el-form-item label="apikey"   :colon="false">
      <el-input v-model="form.apikey"></el-input>
    </el-form-item>
    <el-form-item label="api"   :colon="false">
      <el-input v-model="form.api" placeholder="default: https://disqus.skk.moe/disqus/"></el-input>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { ipcRenderer, IpcRendererEvent, shell } from 'electron'
import {siteStore} from "@store/site";
import {storeToRefs} from "pinia";
import {onMounted, reactive, toRefs} from "vue";
function openPage(url: string) {
  shell.openExternal(url)
}
let store=siteStore()
let {site}=storeToRefs(store)
let state=reactive({
  form : {
    shortname: '',
    api: '',
    apikey: '',
  }
})
let {form}=toRefs(state)
onMounted(() => {
  const { disqusSetting } = site.commentSetting

  state.form.shortname = disqusSetting.shortname
  state.form.api = disqusSetting.api
  state.form.apikey = disqusSetting.apikey
})
</script>


<style lang="scss" scoped>
</style>
