<template>
  <div>
    <el-form :form="form" style="padding-bottom: 48px;">
      <el-form-item :label="$t('platform')" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
        <el-radio-group name="commentPlatform" v-model="form.commentPlatform">
          <el-radio value="gitalk">Gitalk</el-radio>
          <el-radio value="disqus">Disqus</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('isShowComment')" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
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
const { ipcRenderer,  } =require('electron')
import {IpcRendererEvent} from 'electron';
import GitalkSetting from './GitalkSetting.vue'
import DisqusSetting from './DisqusSetting.vue'
import FooterBox from '../../../components/FooterBox/Index.vue'
import {onMounted, reactive, ref, toRef} from "vue";
import {siteStore} from "@store/site";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";
let form=reactive({
  commentPlatform: 'gitalk',
  showComment: false,
})
let {t}=useI18n()
let gitalkSetting=ref(null)
let disqusSetting=ref(null)
const store = siteStore()
 function submit() {
   const form = {
     ...this.form,
     gitalkSetting: this.$refs.gitalkSetting.form,
     disqusSetting: this.$refs.disqusSetting.form,
   }
   console.log('click comment setting save', form)
   ipcRenderer.send('comment-setting-save', form)
   ipcRenderer.once('comment-setting-saved', (event: IpcRendererEvent, result: any) => {
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
