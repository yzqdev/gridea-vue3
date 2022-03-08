<template>
  <div>

    <el-form :form="form" style="padding-bottom: 48px;">
      <el-form-item :label="$t('platform')" :colon="false">
        <el-radio-group name="commentPlatform" v-model="form.commentPlatform">
          <el-radio label="gitalk">Gitalk</el-radio>
          <el-radio label="disqus">Disqus</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('isShowComment')"   :colon="false">
        <el-switch v-model="form.showComment" />
      </el-form-item>
      <gitalk-setting ref="gitalkSetting" v-show="form.commentPlatform === 'gitalk'"></gitalk-setting>
      <disqus-setting ref="disqusSetting" v-show="form.commentPlatform === 'disqus'"></disqus-setting>
      <footer-box>
        <div class="flex justify-end">
          <el-button @click="submit" type="primary">{{ $t('save') }}</el-button>
        </div>
      </footer-box>
    </el-form>
  </div>
</template>

<script  setup lang="ts">
const { ipcRenderer  } =require('electron')
import GitalkSetting from './GitalkSetting.vue'
import DisqusSetting from './DisqusSetting.vue'
import FooterBox from '@renderer/components/FooterBox.vue'
import {onMounted, reactive, ref, toRef, toRefs} from "vue";
import useSiteStore from "@store/site";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";
let state=reactive({
  form:{
    commentPlatform: 'gitalk',
    showComment: false,
  }
})
let {form}=toRefs(state)
let {t}=useI18n()
let gitalkSetting=ref(null)
let disqusSetting=ref(null)
const store = useSiteStore()
 function submit() {
   const form = {
     ...this.form,
     gitalkSetting: this.$refs.gitalkSetting.form,
     disqusSetting: this.$refs.disqusSetting.form,
   }
   console.log('click comment setting save', form)
   ipcRenderer.send('comment-setting-save', form)
   ipcRenderer.once('comment-setting-saved', (event , result: any) => {
     this.$bus.$emit('site-reload')
     this.$message.success( t('commentSettingSuccess').toString())

   })
 }

 onMounted(() => {
   const { commentSetting }  = storeToRefs(store)
    form.commentPlatform = commentSetting.commentPlatform
    form.showComment = commentSetting.showComment
 })

</script>


<style lang="scss" scoped>
</style>
