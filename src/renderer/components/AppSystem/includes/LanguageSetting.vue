<template>
  <div class="mb-4 py-4 border-b border-gray-200">
    <div class="text-base font-medium mb-4">{{ $t('language') }}</div>
    <el-form>
      <el-form-item :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
        <el-radio-group name="currentLanguage" v-model="currentLanguage">
          <el-radio value="zhHans">简体中文</el-radio>
          <el-radio value="en">English</el-radio>
          <el-radio value="zh_TW">繁體中文</el-radio>
          <el-radio value="fr_FR">Français</el-radio>
          <el-radio value="ja_JP">日本語</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
        <el-button type="primary" @click="saveLanguage">{{ $t('save') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";

let formLayout = {
  label: {span: 5},
  wrapper: {span: 12},
}

let currentLanguage = ref('zhHans')
onMounted(() => {
  currentLanguage.value = localStorage.getItem('language') || 'zhHans'
})


function saveLanguage() {
  localStorage.setItem('language', currentLanguage.value)
  this.$root.$i18n.locale = currentLanguage.value
}
</script>

<style lang="scss" scoped>
</style>
