<template>
  <div class="">
    <el-tabs class="menu-tab" defaultActiveKey="1" :animated="false">
      <el-tab-pane :tab="$t('basicSetting')" key="1">
        <basic-setting></basic-setting>
      </el-tab-pane>
      <el-tab-pane :tab="$t('commentSetting')" key="2">
<!--        <comment-setting></comment-setting>-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import BasicSetting from './includes/BasicSetting.vue'
import CommentSetting from './includes/CommentSetting.vue'


</script>

<style lang="scss" scoped>
</style>
