<template>
  <div>
    <el-form :form="form" style="padding-bottom: 48px;">
      <el-form-item :label="$t('platform')" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
        <el-radio-group name="platform" v-model="form.platform">
          <el-radio value="github">Github Pages</el-radio>
          <el-radio value="coding">Coding Pages</el-radio>
          <el-radio value="sftp">SFTP</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('domain')" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
        <el-input-group compact>
          <el-select v-model="protocol" style="width: 96px">
            <el-option value="https://">https://</el-option>
            <el-option value="http://">http://</el-option>
          </el-select>
          <el-input v-model="form.domain" placeholder="mydomain.com" style="width: calc(100% - 96px);" />
        </el-input-group>
      </el-form-item>
      <template v-if="['github', 'coding'].includes(form.platform)">
        <el-form-item :label="$t('repository')" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
          <el-input v-model="form.repository" />
        </el-form-item>
        <el-form-item :label="$t('branch')" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
          <el-input v-model="form.branch" placeholder="master" />
        </el-form-item>
        <el-form-item :label="$t('username')" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item :label="$t('email')" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item v-if="form.platform === 'coding'" :label="$t('tokenUsername')" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
          <el-input v-model="form.tokenUsername" />
        </el-form-item>
        <el-form-item :label="$t('token')" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
          <el-input :type="passVisible ? '' : 'password'" v-model="form.token">
            <el-icon class="icon" slot="addonAfter" :type="passVisible ? 'eye-invisible' : 'eye'" @click="passVisible = !passVisible" />
          </el-input>
        </el-form-item>
        <el-form-item label="CNAME" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
          <el-input v-model="form.cname" placeholder="mydomain.com" />
        </el-form-item>
      </template>
      <template v-if="['sftp'].includes(form.platform)">
        <el-form-item label="Port" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
          <el-input-number v-model="form.port" />
        </el-form-item>
        <el-form-item label="Server" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
          <el-input v-model="form.server" />
        </el-form-item>
        <el-form-item label="Username" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="Connect Type" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
          <el-radio-group name="remoteType" v-model="remoteType">
            <el-radio value="password">Password</el-radio>
            <el-radio value="key">SSH Key</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Password" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false" v-if="remoteType === 'password'">
          <el-input v-model="form.password" :type="passVisible ? '' : 'password'">
            <el-icon class="icon" slot="addonAfter" :type="passVisible ? 'eye-invisible' : 'eye'" @click="passVisible = !passVisible" />
          </el-input>
        </el-form-item>
        <el-form-item label="Private Key Path" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false" :help="$t('privateKeyTip')" v-else>
          <el-input v-model="form.privateKey" />
        </el-form-item>
        <el-form-item label="Remote Path" :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false" :help="$t('remotePathTip')">
          <el-input v-model="form.remotePath" />
        </el-form-item>
      </template>
      <footer-box>
        <div class="flex justify-between">
          <el-button :disabled="!canSubmit" :loading="detectLoading" @click="remoteDetect" style="margin-right: 16px;">{{ $t('testConnection') }}</el-button>
          <el-button :disabled="!canSubmit" @click="submit" type="primary">{{ $t('save') }}</el-button>
        </div>
      </footer-box>
    </el-form>
  </div>
</template>

<script setup lang="ts">
const { ipcRenderer } = require("electron");
import {  IpcRendererEvent } from 'electron'
import FooterBox from '../../../components/FooterBox/Index.vue'
import { ISetting } from '../../../interfaces/setting'
import {computed, onMounted, reactive, toRefs, watch, watchEffect} from "vue";
import {useI18n} from "vue-i18n";
let {t}=useI18n()
let state=reactive({
  protocol:'https://',
  form:{
    platform: 'github',
    domain: '',
    repository: '',
    branch: '',
    username: '',
    email: '',
    tokenUsername: '',
    token: '',
    cname: '',
    port: '22',
    server: '',
    password: '',
    privateKey: '',
    remotePath: '',
  }, remoteType : 'password',detectLoading:false
})
let {protocol,form ,remoteType,detectLoading}=toRefs(state)
function submit() {
  // const formValid = this.checkFormValid()
  // if (!formValid) { return false }

  const form = {
    ...this.form,
    domain: `${state.protocol}${state.form.domain}`,
  }

  if (state.remoteType === 'password') {
    form.privateKey = ''
  } else {
    form.password = ''
  }

  ipcRenderer.send('setting-save', form)
  ipcRenderer.once('setting-saved', (event: IpcRendererEvent, result: any) => {
    this.$bus.$emit('site-reload')
    this.$message.success( t('basicSettingSuccess').toString())

  })
}
async function remoteDetect() {
  const form = {
    ...this.form,
    domain: `${this.protocol}${this.form.domain}`,
  }

  ipcRenderer.send('setting-save', form)
  ipcRenderer.once('setting-saved', () => {
    ipcRenderer.send('app-site-reload')
    ipcRenderer.once('app-site-loaded', () => {
      this.detectLoading = true
      ipcRenderer.send('remote-detect')

      ipcRenderer.once('remote-detected', (event: IpcRendererEvent, result: any) => {
        console.log('检测结果', result)
        this.detectLoading = false
        if (result.success) {
          this.$message.success(this.$t('connectSuccess').toString())

        } else {
          this.$message.error(this.$t('connectFailed').toString())

        }
      })
    })
  })
}
onMounted(() => {
  const { form, site: { setting } } = state
  console.log('setting', setting)
  Object.keys(form).forEach((key: string) => {
    if (key === 'domain') {
      const protocolEndIndex = setting[key].indexOf('://')
      if (protocolEndIndex !== -1) {
        form[key] = setting[key].substring(protocolEndIndex + 3)
       state.protocol = setting[key].substring(0, protocolEndIndex + 3)
      }
    } else {
      form[key] = setting[key]
    }
  })

  if (form.privateKey) {
    state.remoteType = 'key'
  }
})

const canSubmit=computed( () => {

  const baseValid = state.form.domain
      && state.form.repository
      && state.form.branch
      && state.form.username
      && state.form.token
  const pagesPlatfomValid = baseValid && (state.form.platform === 'github' || (state.form.platform === 'coding' && state.form.tokenUsername))

  const sftpPlatformValid = ['sftp'].includes(state.form.platform)
      && state.form.port
      && state.form.server
      && state.form.username
      && state.form.remotePath
      && (state.form.password || state.form.privateKey)

  return pagesPlatfomValid || sftpPlatformValid
})
watch (()=>state.form,() => {

    state.form.token = state.form.token.trim()

},{deep:true})

let formLayout = {
  label: { span: 6 },
  wrapper: { span: 12 },
}
</script>


<style lang="scss" scoped>
.icon {
  cursor: pointer;
}
</style>
