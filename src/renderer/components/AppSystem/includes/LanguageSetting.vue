<template>
  <div class="mb-4 py-4 border-b border-gray-200">
    <div class="text-base font-medium mb-4">{{ $t('language') }}</div>
    <el-form>
      <el-form-item label-width="120px"   :colon="false">
        <el-radio-group name="currentLanguage" v-model="currentLanguage">
          <el-radio label="zhHans">简体中文</el-radio>
          <el-radio label="en">English</el-radio>

        </el-radio-group>
      </el-form-item>
      <el-form-item :labelCol="formLayout.label" :wrapperCol="formLayout.wrapper" :colon="false">
        <el-button type="primary" @click="saveLanguage">{{ $t('save') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">

import {onMounted, reactive, ref, toRefs} from "vue";

let formLayout = {
  label: {span: 5},
  wrapper: {span: 12},
}
let state=reactive({
  currentLanguage:'zhHans'
})
 let {currentLanguage}=toRefs(state)
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
