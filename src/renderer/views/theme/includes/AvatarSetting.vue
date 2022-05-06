<template>
  <div>
    <el-upload
      action=""
      listType="picture-card"
      class="feature-uploader"
      :showUploadList="false"
      :beforeUpload="beforeUpload"
    >
      <div v-if="avatarPath">
        <img class="favicon-image" :src="avatarPath" width="88px" height="88px" />
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
const { ipcRenderer}=require('electron')
import {  IpcRendererEvent } from 'electron'
import * as path from 'path'
import FooterBox from '@renderer/components/FooterBox.vue'
import {onMounted, reactive, ref, toRefs} from "vue";
import {useSiteStore} from "@store/site";
import {storeToRefs} from "pinia";
let state=reactive({
  file:'',
  avatarPath:''
})
let store=useSiteStore()
//@ts-ignore
let  site  =storeToRefs(store)
let {file,avatarPath}=toRefs(state)
 function submit() {
   if (!file.value) {
     return
   }
   console.log('click avatar upload', state.file)
   ipcRenderer.send('avatar-upload', state.file.path)
   ipcRenderer.once('avatar-uploaded', (event: IpcRendererEvent, result: any) => {
     state.file = null
     this.$bus.$emit('site-reload')
     // state.avatarPath = path.join('file://',  site.appDir, 'images', `avatar.png?a=${Math.random()}`)
     this.$message.success(this.$t('avatarSettingSuccess').toString())
   })
 }
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
 onMounted(() => {
   // state.avatarPath = path.join('file://',  site.appDir, 'images', `avatar.png?a=${Math.random()}`)
 })

</script>


<style lang="scss" scoped>
.file-name {
  margin-bottom: 8px;
}
</style>
