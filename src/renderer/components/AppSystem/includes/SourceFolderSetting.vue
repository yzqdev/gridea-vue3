<template>
  <div class="mb-4 py-4 border-b border-gray-200">
    <div class="text-base font-medium mb-4">{{ $t("sourceFolder") }}</div>
    <el-form>
      <el-form-item
        :labelCol="formLayout.label"
        :wrapperCol="formLayout.wrapper"
        :colon="false"
      >
        <el-input v-model="currentFolderPath" read-only>
          <i
            slot="addonAfter"
            class="zwicon-folder-open px-2"
            @click="handleFolderSelect"
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item
        :labelCol="formLayout.label"
        :wrapperCol="formLayout.wrapper"
        :colon="false"
      >
        <el-button type="primary" @click="save">{{ $t("save") }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
const {ipcRenderer,app,dialog} =require('electron')
import {useSiteStore} from "@store/site";
import {storeToRefs} from "pinia";
import {onMounted, reactive, toRefs} from "vue";
let store=useSiteStore()
let site=storeToRefs(store)

let state=reactive({
  formLayout : {
    label: { span: 5 },
    wrapper: { span: 12 },
  },

  currentFolderPath : "-"
})
let {formLayout,currentFolderPath}=toRefs(state)
function save() {
  ipcRenderer.send("app-source-folder-setting", state.currentFolderPath);
  ipcRenderer.once(
      "app-source-folder-set",
      (event , data: any) => {
        if (data) {
          this.$message.success(this.$t("saved").toString());
          this.$bus.$emit("site-reload");
          app.relaunch();
          app.quit();
        } else {
          this.$message.error(this.$t("saveError").toString());
        }
      }
  );
}


async function handleFolderSelect() {
  const res = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"],
  });
  if (res.filePaths.length > 0) {
   state.currentFolderPath = res.filePaths[0].replace(/\\/g, "/");
  }
}
 onMounted(() => {
   state.currentFolderPath = site.appDir.value;
 })
</script>

<style lang="scss" scoped>

.folder-btn {
  padding: 0 8px;
}
</style>
