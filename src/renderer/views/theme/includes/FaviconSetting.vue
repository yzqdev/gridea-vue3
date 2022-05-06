<template>
  <div>
     <el-upload
      action=""
      listType="picture-card"
      class="feature-uploader"
      :showUploadList="false"
      :beforeUpload="beforeUpload"
    >
      <div v-if="faviconPath">
        <img class="favicon-image" :src="faviconPath" width="88px" height="88px" />
      </div>
      <div v-else>
        <el-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </el-upload>
    <div class="tip-text" v-if="file">
      {{ file.path }}
    </div>
    <footer-box>
      <div class="flex justify-end">
        <el-button type="primary" @click="submit">{{ $t('save') }}</el-button>
      </div>
    </footer-box>
  </div>
</template>

<script setup lang="ts">
const {ipcRenderer} =require('electron')
import {   IpcRendererEvent } from 'electron'
import   path from 'path'
import FooterBox from '@renderer/components/FooterBox.vue'
import {onMounted, reactive, toRefs} from "vue";
import {useSiteStore} from "@store/site";
import {storeToRefs} from "pinia";

let state=reactive({
  file:null,
  faviconPath:''
})
let store=useSiteStore()
let site=storeToRefs(store)
let {file,faviconPath}=toRefs(state)
function beforeUpload(file: any) {
  if (!file) {
    return
  }
  const isImage = file.type.indexOf('image') !== -1
  if (!isImage) {
    return
  }
  if (file && isImage) {
    state.file = file
  }
  return false
}

function submit() {
  if (!state.file) {
    return
  }
  console.log('click favicon upload', state.file)
  ipcRenderer.send('favicon-upload', state.file.path)
  ipcRenderer.once('favicon-uploaded', (event: IpcRendererEvent, result: any) => {
    state.file = null
    this.$bus.$emit('site-reload')
    // state.faviconPath = path.join('file://',  site.appDir, `favicon.ico?a=${Math.random()}`)
    this.$message.success(this.$t('faviconSettingSuccess').toString())
  })
}
 onMounted(() => {
   // state.faviconPath = path.join('file://',  site.appDir, `favicon.ico?a=${Math.random()}`)
 })
</script>


<style lang="scss" scoped>
.file-name {
  margin-bottom: 8px;
}
</style>
