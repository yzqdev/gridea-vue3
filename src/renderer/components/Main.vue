<template>
  <el-layout>
    <el-layout-sider
        class="sider"
        :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }"
    >
      <div class="top-container">
        <div class="logo">
          <img class="img" src="../assets/logo.png" />
        </div>
        <el-menu
            mode="inline"
            :default-active="'/articles'"
            @click="clickMenu"
        >
          <el-menu-item :route="menu.router"   v-for="menu in sideMenus" :index="menu.router">
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
              class="ri-equalizer-line text-base"
              @click="systemModalVisible = true"
          ></i>
          <i
              class="ri-earth-line web-btn"
              @click="goWeb"
              v-if="site.setting.domain"
          ></i>
          <el-tooltip :title="`🌟 ${$t('starSupport')}`">
            <i class="ri-github-line text-base" @click="handleGithubClick"></i>
          </el-tooltip>
        </div>
      </div>
    </el-layout-sider>
    <el-layout class="right-container">
      <div class="content">
        <keep-alive exclude="Loading,Theme">
          <router-view></router-view>
        </keep-alive>
      </div>
    </el-layout>

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
        placement="bottom"
        height="100%"
        @close="systemModalVisible = false"
        :visible="systemModalVisible"
    >
      <app-system />
    </el-drawer>
  </el-layout>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, onMounted, reactive, toRefs} from "vue";
const { ipcRenderer,   shell } = require("electron")
import axios from "axios";
import AppSystem from "./AppSystem/Index.vue";
import ISnackbar from "../interfaces/snackbar";
import {Site, siteStore} from "../store/modules/site";
import pkg from "../../../package.json";
import markdown from "@main/server/server/plugins/markdown";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";


let state=reactive({



  version : (pkg as any).version,

  drawer : true,

  publishLoading : false,

  hasUpdate : false,

  newVersion : "",

  syncErrorModalVisible : false,

  updateModalVisible : false,

  systemModalVisible : false,

  updateContent : "",

  logModalVisible : false,

  log:  {},
})
let { version,drawer,publishLoading,hasUpdate,newVersion,syncErrorModalVisible,systemModalVisible,updateContent,updateModalVisible,log,logModalVisible}=toRefs(state)
 let router=useRouter()
let route=useRoute()
let {t}=useI18n()
let store:any=siteStore()
let site=storeToRefs(store)
let  currentRouter=computed(() => {
    return  route.path;
})


onBeforeMount(() => {
    this.$bus.$on("site-reload", () => {
       reloadSite();
    });
     checkUpdate();

    ipcRenderer.on("log-error", (event: any, result: any) => {
      state.log = result;
      state.logModalVisible = true;
    });
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
  // @ts-ignore
  // if (window.Headway) {
  //   // @ts-ignore
  //   Headway.init(config);
  // }
})
  // @see https://docs.headwayapp.co/widget for more configuration options.



let sideMenus=computed(() => {
 return [
    {
      icon: "ri-article-line",
      text:  t("article"),
      count:  site.posts.length,
      router: "/articles",
    },
    {
      icon: "ri-menu-2-line",
      text:  t("menu"),
      count:  site.menus.length,
      router: "/menu",
    },
    {
      icon: "ri-price-tag-3-line",
      text:  t("tag"),
      count:  site.tags.length,
      router: "/tags",
    },
    {
      icon: "ri-t-shirt-line",
      text:  t("theme"),
      router: "/theme",
    },
    {
      icon: "ri-server-line",
      text:  t("remote"),
      router: "/setting",
    },
  ]
})


  // @Action("site/updateSite") updateSite!: (siteData: Site) => void;



 function clickMenu(e: any) {
  console.log(e )
     // router.push(e.key);
  }

function  reloadSite() {
    const siteFolder = localStorage.getItem("sourceFolder") || "";

    ipcRenderer.send("app-site-reload", { siteFolder });
    ipcRenderer.once(
        "app-site-loaded",
        (event , result: Site) => {
          console.log(result);
          store.updateSite(result);
        }
    );
  }

function  preview() {
    ipcRenderer.send("html-render");



    ipcRenderer.once(
        "html-rendered",
        (event , result: any) => {
          // this.$message.success(`🎉  ${this.$t('renderSuccess')}`)


          ipcRenderer.send("app-preview-server-port-get");
          ipcRenderer.once(
              "app-preview-server-port-got",
              (portGotEvent , port: number | string | null) => {
                if (!port && typeof port !== "number") {
                  this.$message.config({
                    top: "36px",
                  });
                  this.$message.open({
                    content: (h ) => {
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
                  this.openInBrowser(`http://localhost:${port}`);
                }
              }
          );
        }
    );
  }

function  publish() {
    const { setting } = this.site;
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
        (event , result: any) => {
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

function  openInBrowser(url: string) {
    shell.openExternal(url);
  }

function goWeb() {
    if (this.site.setting.domain) {


      shell.openExternal(this.site.setting.domain);
    }
  }

function  handleGithubClick() {

    this.openInBrowser("https://github.com/getgridea/gridea");
  }

    async function  checkUpdate() {
    const res = await axios.get(
        "https://api.github.com/repos/getgridea/gridea/releases/latest"
    );
    if (res.status === 200) {
      this.newVersion = res.data.name;
      const latestVersion = res.data.name
          .substring(1)
          .split(".")
          .map((item: string) => parseInt(item, 10));
      const currentVersion = this.version
          .split(".")
          .map((item: string) => parseInt(item, 10));
      this.updateContent = markdown.render(res.data.body);

      for (let i = 0; i < currentVersion.length; i += 1) {
        if (currentVersion[i] > latestVersion[i]) {
          this.hasUpdate = false;
          break;
        }
        if (currentVersion[i] < latestVersion[i]) {
          this.hasUpdate = true;
          break;
        }
      }

      if (this.hasUpdate) {
        // this.$message.success(`🔥  ${this.$t('newVersionTips')}`, 8)
        this.updateModalVisible = true;
      }
    }
  }

</script>

<style lang="scss" scoped>
@import "../assets/styles/var.scss";

.logo {
  min-height: 64px;
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 32px 0 16px;
  h3 {
    color: $primary-color;
    font-size: 18px;
    transform: translateY(8px);
    // background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(250, 250, 250, 1)), to(rgba(255, 255, 255, 0.4)));
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
  }
  .img {
    width: 64px;
    height: 64px;
    border-radius: 16px;
  }
}
.sider {
  background: $primary-bg;
  // background: linear-gradient(to bottom, #434343, #000000);
  &::-webkit-scrollbar {
    width: 0;
  }
}


.bottom-container {
  padding: 24px 32px 8px;
  button {
    margin: 8px 0;
  }
}

.right-container {
  background: #fff;
  margin-left:  208px;
  padding: 8px 16px 8px 8px;
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 208px;
  right: 0px;
}
.version-container {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  align-items: center;
  position: relative;
  font-size: 12px;
  &.version-dot {
    &:before {
      content: "";
      display: block;
      width: 4px;
      height: 4px;
      background: red;
      border-radius: 2px;
      position: absolute;
      top: 51%;
      left: -12px;
      transform: translateY(-50%);
    }
  }
}

.preview-btn {
  border-radius: 20px;
  background: #fff;
  transition: all 0.3s;
  &:hover {
    background: #fafafa;
  }
}

.sync-btn {
  border-radius: 20px;
  background: linear-gradient(
      124deg,
      rgba(65, 70, 75, 1) 0%,
      rgba(0, 0, 0, 1) 100%
  );
  color: #bababa;
  border: none;
  transition: all 0.3s;
  &:hover {
    background: linear-gradient(
        124deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 100%
    );
    border: none;
  }
}

.web-btn {
  font-size: 16px;
  cursor: pointer;
  &:hover {
    color: $link-color;
  }
}

.nav-text {
  font-weight: normal;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  .number {
    font-weight: lighter;
  }
}

.menu-icon {
  font-size: 17px;
  margin-right: 8px;
  font-weight: 400;
}

:deep(.version-info) {
    code {
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    font-size: 85%;
    margin: 0;
    padding: 0.2em 0.4em;
  }
    blockquote {
    border-left: 0.25em solid #dfe2e5;
    color: #6a737d;
    padding: 0 1em;
  }
   ul,
  ol {
    padding: 0;
    list-style-type: none;
    font-size: 14px;
    margin: 30px 20px;

    ul,
    ol {
      margin: 20px 20px 10px;
    }
  }

    li {
    line-height: 1.2;
  }

    ul > li {
    display: table-row;

    &:before {
      content: "\25CF";
      color: #fad849;
      padding-right: 10px;
      display: table-cell;
    }

    + li:before {
      padding-top: 10px;
    }
  }

    ol {
    counter-reset: ordered-counter;
    > li {
      counter-increment: ordered-counter;
      display: table-row;

      &:before {
        content: counter(ordered-counter);
        color: #fad849;
        padding-right: 10px;
        display: table-cell;
        text-align: right;
      }

      + li:before {
        padding-top: 10px;
      }
    }
  }
}

.download-container {
  text-align: center;
  padding: 16px 0;
  background: #fafafa;
}
</style>
