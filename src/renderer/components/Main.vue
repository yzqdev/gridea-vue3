<template>
  <el-container>
    <el-aside
        class="sider"
        :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }"
    >
      <div class="top-container">
        <div class="logo">
          <img class="img" src="../assets/logo.png"/>
        </div>
        <el-menu
            mode="inline"
            :default-active="'/articles'"
            router
        >
          <el-menu-item :route="menu.router" v-for="menu in sideMenus" :index="menu.router">
            <div class="menu-item">
              <div class="flex items-center">
                <i
                    class="mr-2 text-base"
                    :class="{ [menu.icon]: true }"
                    :style="{
                    color:
                      currentRouter === menu.router ? '#f9d757' : 'inherit',
                  }"
                ></i>
                <span class="nav-text">{{ menu.text }}</span>
              </div>
              <span class="number">{{ menu.count }}</span>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="bottom-container">
        <el-button class="preview-btn" block @click="preview">
          <i class="zwicon-eye"></i>
          {{ $t("preview") }}
        </el-button>
        <el-button
            class="sync-btn"
            block
            type="primary"
            :loading="publishLoading"
            @click="publish"
        >
          <template v-if="!publishLoading">
            <i class="zwicon-deploy"></i>
            {{ $t("syncSite") }}
          </template>
        </el-button>
        <div class="version-container" :class="{ 'version-dot': hasUpdate }">
          <i
              class="zwicon-slider-circle-h text-base"
              @click="systemModalVisible = true"
          ></i>
          <i
              class="zwicon-earth  web-btn"
              @click="goWeb"
              v-if="site.setting.domain"
          ></i>
          <el-tooltip :title="`🌟 ${$t('starSupport')}`">
            <i class="ri-github-line text-base" @click="handleGithubClick"></i>
          </el-tooltip>
        </div>
      </div>
    </el-aside>
    <el-container class="right-container">
      <div class="content">
        <keep-alive exclude="Loading,Theme">
          <router-view></router-view>
        </keep-alive>
      </div>
    </el-container>

    <el-dialog
        :visible="syncErrorModalVisible"
        :footer="null"
        @cancel="syncErrorModalVisible = false"
        :maskClosable="false"
    >
      🙁 {{ $t("syncError1") }}
      <a @click="openInBrowser('https://gridea.dev/')">FAQ</a> {{ $t("or") }}
      <a @click="openInBrowser('https://github.com/getgridea/gridea/issues')"
      >Issues</a
      >
      {{ $t("syncError2") }}
    </el-dialog>

    <el-dialog
        title="🔥 New Version"
        :visible="updateModalVisible"
        :footer="null"
        @cancel="updateModalVisible = false"
        :maskClosable="false"
    >
      <div class="download-container">
        👉 <a href="https://gridea.dev">Gridea Homepage</a> |
        <a href="https://github.com/getgridea/gridea/releases"
        >Github Releases</a
        >
        👈
      </div>
      <h2>{{ newVersion }}</h2>
      <div class="version-info" v-html="updateContent"></div>
    </el-dialog>

    <!-- <el-dialog :width="900" :visible="systemModalVisible" :footer="null" @cancel="systemModalVisible = false">
      <app-system />
    </el-dialog> -->

    <el-dialog
        :width="900"
        :visible="logModalVisible"
        :footer="null"
        @cancel="logModalVisible = false"
    >
      <h2>{{ log.type }}</h2>
      <pre>
        {{ log.message }}
      </pre>
    </el-dialog>

    <el-drawer
        title=""
        direction="btt"
        height="100%"
        @close="systemModalVisible = false"
        v-model="systemModalVisible"
         size="100%"
    >
      <app-system/>
    </el-drawer>
  </el-container>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, onMounted, reactive, toRefs, watch} from "vue";

const {ipcRenderer, shell} = require("electron")
import axios from "axios";
import AppSystem from "./AppSystem/Index.vue";
import ISnackbar from "../interfaces/snackbar";
import {useSiteStore}  from "../store/modules/site";
import pkg from "../../../package.json";
// import markdown from "@main/server/server/plugins/markdown";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";


let state = reactive({


  version: (pkg as any).version,

  drawer: true,

  publishLoading: false,

  hasUpdate: false,

  newVersion: "",

  syncErrorModalVisible: false,

  updateModalVisible: false,

  systemModalVisible: false,

  updateContent: "",

  logModalVisible: false,

  log: {},
})
let {
  version,
  drawer,
  publishLoading,
  hasUpdate,
  newVersion,
  syncErrorModalVisible,
  systemModalVisible,
  updateContent,
  updateModalVisible,
  log,
  logModalVisible
} = toRefs(state)



let router = useRouter()
let route = useRoute()
let {t} = useI18n()
let store: any = useSiteStore()
let site = storeToRefs(store)
let currentRouter = computed(() => {
  return route.path;
})


onBeforeMount(() => {
  // this.$bus.$on("site-reload", () => {
  //    reloadSite();
  // });
  checkUpdate();

  ipcRenderer.on("log-error", (event: any, result: any) => {
    state.log = result;
    state.logModalVisible = true;
  });
})
onBeforeRouteUpdate((data) => {
  console.log(data)
})

onMounted(() => {
  const config = {
    selector: ".version-container",
    account: "xbrnVx",
    translations: {
      title: "Gridea News",
      readMore: "Read more",
      labels: {
        new: "News",
        improvement: "Updates",
        fix: "Fixes",
      },
      footer: "Read more 👉",
    },
  };

})


let sideMenus = computed(() => {
  return [
    {
      icon: "ri-article-line",
      text: t("article"),
      count: site.posts.length,
      router: "/articles",
    },
    {
      icon: "ri-menu-2-line",
      text: t("menu"),
      count: site.menus.length,
      router: "/menu",
    },
    {
      icon: "ri-price-tag-3-line",
      text: t("tag"),
      count: site.tags.length,
      router: "/tags",
    },
    {
      icon: "ri-t-shirt-line",
      text: t("theme"),
      router: "/theme",
    },
    {
      icon: "ri-server-line",
      text: t("remote"),
      router: "/setting",
    },
  ]
})




function clickMenu(e: any) {
  console.log(e)
  // router.push(e.key);
}

function reloadSite() {

}

function preview() {
  ipcRenderer.send("html-render");


  ipcRenderer.once(
      "html-rendered",
      (event, result: any) => {
        // this.$message.success(`🎉  ${this.$t('renderSuccess')}`)


        ipcRenderer.send("app-preview-server-port-get");
        ipcRenderer.once(
            "app-preview-server-port-got",
            (portGotEvent, port: number | string | null) => {
              if (!port && typeof port !== "number") {
                this.$message.config({
                  top: "36px",
                });
                this.$message.open({
                  content: (h) => {
                    const errStyle = {
                      display: "inline-block",
                      maxWidth: "800px",
                    };
                    return h(
                        "span",
                        {
                          style: errStyle,
                        },
                        `❌ ${this.$t("renderError")}` as any
                    );
                  },
                  icon: "",
                });
              } else {
                this.$message.success(`🎉  ${this.$t("renderSuccess")}`);
                openInBrowser(`http://localhost:${port}`);
              }
            }
        );
      }
  );
}

function publish() {
  const {setting} = this.site;
  if (
      !setting.branch &&
      !setting.domain &&
      !setting.token &&
      !setting.repository
  ) {
    this.$message.error(`🙁  ${this.$t("syncWarning")}`);
    return false;
  }

  ipcRenderer.send("site-publish");
  this.publishLoading = true;


  ipcRenderer.once(
      "site-published",
      (event, result: any) => {
        console.log(result);
        if (result.success) {
          this.$message.success(`🎉  ${this.$t("syncSuccess")}`);


        } else {
          this.syncErrorModalVisible = true;


        }
        this.publishLoading = false;
      }
  );
}

function openInBrowser(url: string) {
  shell.openExternal(url);
}

function goWeb() {
  if ( site.setting.domain) {


    shell.openExternal(this.site.setting.domain);
  }
}

function handleGithubClick() {

  this.openInBrowser("https://github.com/getgridea/gridea");
}

async function checkUpdate() {
  const res = await axios.get(
      "https://api.github.com/repos/getgridea/gridea/releases/latest"
  );
  if (res.status === 200) {
    state.newVersion = res.data.name;
    const latestVersion = res.data.name
        .substring(1)
        .split(".")
        .map((item: string) => parseInt(item, 10));
    const currentVersion = state.version
        .split(".")
        .map((item: string) => parseInt(item, 10));
    // state.updateContent = markdown.render(res.data.body);

    for (let i = 0; i < currentVersion.length; i += 1) {
      if (currentVersion[i] > latestVersion[i]) {
        state.hasUpdate = false;
        break;
      }
      if (currentVersion[i] < latestVersion[i]) {
        state.hasUpdate = true;
        break;
      }
    }

    if (state.hasUpdate) {
      // this.$message.success(`🔥  ${this.$t('newVersionTips')}`, 8)
      state.updateModalVisible = true;
    }
  }
}

</script>

<style lang="scss" scoped>
@import "Main";
</style>
