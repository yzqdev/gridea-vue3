<template>
  <title-bar />
  <el-config-provider :locale="i18nt">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ElConfigProvider } from "element-plus";
import { i18n } from "./i18n";
import TitleBar from "./components/common/TitleBar.vue";
localStorage.setItem('sourceFolder','')
const i18nt = computed(() => i18n.global.messages[i18n.global.locale].el);
</script>

<style lang="scss">

/* Global CSS */
body {
  background: #fff;
  color: #555;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: #fff;
}
/*滚动条两端的箭头*/
::-webkit-scrollbar-button {
  display: none;
}
::-webkit-scroll-track {
  display: none;
}
::-webkit-scrollbar-track-piece {
  display: none;
}

::-webkit-scrollbar-thumb {
  background-color: #eee;
  opacity: 0.7;
  border-radius: 4px;
}

::-webkit-scrollbar-corner {
  display: none;
}
::-webkit-resizer {
  display: none;
}

.github {
  font-size: 16px;
  margin-left: 16px;
  cursor: pointer;
}

.logo {
  user-select: none;
}

.application {
  font-family: PingFang SC, -apple-system, SF UI Text, Lucida Grande, STheiti,
  Microsoft YaHei, sans-serif !important;
}
</style>
