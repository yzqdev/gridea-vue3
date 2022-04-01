<template>
  <div>
    <el-form-item label=" " :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
      <a @click.prevent="openPage('https://github.com/gitalk/gitalk')">Gitalk Document</a>
    </el-form-item>
    <el-form-item label="Client ID" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
      <el-input v-model="form.clientId"></el-input>
    </el-form-item>
    <el-form-item label="Client Secret" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
      <el-input v-model="form.clientSecret"></el-input>
    </el-form-item>
    <el-form-item :label="$t('repository')" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
      <el-input v-model="form.repository"></el-input>
    </el-form-item>
    <el-form-item label="Owner" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
      <el-input v-model="form.owner"></el-input>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, toRefs} from "vue";
const {shell}=require('electron')
import {useSiteStore} from "@store/site";
import {storeToRefs} from "pinia";
function openPage(url: string) {
  shell.openExternal(url)
}
let store=useSiteStore()
let site=storeToRefs(store)
let state=reactive({
  form : {
    clientId: '',
    clientSecret: '',
    repository: '',
    owner: '',
  }
})
let {form}=toRefs(state)
onMounted(() => {
  const { gitalkSetting } =  site.commentSetting

  state.form.clientId = gitalkSetting.clientId
  state.form.clientSecret = gitalkSetting.clientSecret
  state.form.repository = gitalkSetting.repository
  state.form.owner = gitalkSetting.owner
})


  let formLayout = {
    label: { span: 6 },
    wrapper: { span: 12 },
  }






</script>


<style lang="scss" scoped>
</style>
