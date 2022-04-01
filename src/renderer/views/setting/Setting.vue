<template>
  <div class="">
    <el-tabs class="menu-tab" v-model="activeName"  :animated="false">
      <el-tab-pane :label="$t('basicSetting')" name="basicSetting" key="1">
        <basic-setting></basic-setting>
      </el-tab-pane>
      <el-tab-pane :label="$t('commentSetting')" name="commentSetting" key="2">
        <comment-setting></comment-setting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import BasicSetting from './includes/BasicSetting.vue'
import CommentSetting from './includes/CommentSetting.vue'
import {ref} from "vue";

let activeName=ref('basicSetting')

</script>

<style lang="scss" scoped>
</style>
