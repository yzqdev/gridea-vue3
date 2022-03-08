<template>
  <div
    class="article-update-page"
    :class="{ 'is-entering': entering }"
    v-if="visible"
    @mousemove="handlePageMousemove"
  >
    <div class="page-title" ref="pageTitle">
      <el-row type="flex" justify="end">
        <el-tooltip placement="bottom" :title="$t('back')">
          <div class="op-btn" tabindex="0" @click="close">
            <i class="zwicon-arrow-left"></i>
          </div>
        </el-tooltip>
        <el-tooltip placement="bottom" :title="$t('saveDraft')">
          <div
            class="op-btn"
            tabindex="0"
            :class="{ disabled: !canSubmit }"
            @click="saveDraft"
          >
            <i class="zwicon-checkmark"></i>
          </div>
        </el-tooltip>
        <el-tooltip placement="bottom" :title="$t('save')">
          <div
            class="op-btn save-btn"
            tabindex="0"
            :class="{ disabled: !canSubmit }"
            @click="savePost"
          >
            <i class="zwicon-checkmark"></i>
          </div>
        </el-tooltip>
      </el-row>
    </div>
    <div class="page-content">
      <div class="editor-wrapper">
        <el-input
          class="post-title"
          size="large"
          :placeholder="$t('title')"
          v-model="form.title"
          @change="handleTitleChange"
          @keydown="handleInputKeydown"
        ></el-input>
        <monaco-markdown-editor
          ref="monacoMarkdownEditor"
          v-model="form.content"
          @keydown="handleInputKeydown"
          :isPostPage="true"
          class="post-editor"
        ></monaco-markdown-editor>
        <div class="footer-info">
          {{ $t("writingIn") }}
          <a @click.prevent="openPage('https://gridea.dev')" class="link"
            >Gridea</a
          >
        </div>

        <div class="right-tool-container">
          <el-popover placement="left" trigger="click">
            <template slot="content">
              <div class="post-stats">
                <div class="item">
                  <h4>{{ $t("words") }}</h4>
                  <div class="number">{{ postStats.wordsNumber }}</div>
                </div>
                <div class="item">
                  <h4>{{ $t("readingTime") }}</h4>
                  <div class="number">{{ postStats.formatTime }}</div>
                </div>
              </div>
            </template>
            <div class="op-btn" @click="handleInfoClick">
              <i class="zwicon-info-circle"></i>
            </div>
          </el-popover>
          <el-popover placement="left" trigger="click">
            <template slot="content">
              <EmojiCard @select="handleEmojiSelect" />
            </template>
            <div class="op-btn" @click="handleEmojiClick">
              <i class="zwicon-smile"></i>
            </div>
          </el-popover>
          <el-tooltip placement="left" :title="$t('insertImage')">
            <div class="op-btn" @click="insertImage">
              <i class="zwicon-image"></i>
            </div>
          </el-tooltip>
          <el-tooltip placement="left" :title="$t('insertMore')">
            <div class="op-btn" @click="insertMore">
              <i class="zwicon-more-v"></i>
            </div>
          </el-tooltip>
          <el-tooltip placement="left" :title="$t('postSettings')">
            <div class="op-btn" @click="handlePostSettingClick">
              <i class="zwicon-cog"></i>
            </div>
          </el-tooltip>
          <el-tooltip placement="left" :title="`${$t('preview')} [Ctrl + P]`">
            <div
              class="op-btn"
              v-shortkey="['ctrl', 'p']"
              @shortkey="shortPreviewPost"
              @click="previewPost"
            >
              <i class="zwicon-eye"></i>
            </div>
          </el-tooltip>
        </div>
        <div class="right-bottom-tool-container">
          <el-popover placement="leftBottom" trigger="click">
            <template slot="content">
              <div class="keyboard-tip">💁‍♂️ 编辑区域右键能弹出快捷菜单哦</div>
              <div class="keyboard-container">
                <div
                  class="item"
                  v-for="(item, index) in shortcutKeys"
                  :key="index"
                >
                  <el-divider class="keyboard-group-title" orientation="left">{{
                    item.name
                  }}</el-divider>
                  <div class="list">
                    <div
                      class="list-item"
                      v-for="(listItem, listIndex) in item.list"
                      :key="listIndex"
                    >
                      <div class="list-item-title">{{ listItem.title }}</div>
                      <div>
                        <span
                          v-for="(keyCode, keyIndex) in listItem.keyboard"
                          :key="keyIndex"
                        >
                          <code>{{ keyCode }}</code>
                          <span
                            v-if="keyIndex !== listItem.keyboard.length - 1"
                          >
                            +
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="op-btn">
              <i class="zwicon-keyboard"></i>
            </div>
          </el-popover>
        </div>
      </div>

      <el-drawer
        :visible="previewVisible"
        @close="previewVisible = false"
        width="800"
        :wrapStyle="{
          height: 'calc(100% - 108px)',
          overflow: 'auto',
          paddingBottom: '108px',
          zIndex: 1025,
        }"
        title=" "
      >
        <img
          class="preview-feature-image"
          v-if="featureType === 'DEFAULT' && form.featureImage.path"
          :src="form.featureImage.path"
          alt=""
        />
        <img
          class="preview-feature-image"
          v-if="featureType === 'EXTERNAL' && form.featureImagePath"
          :src="form.featureImagePath"
          alt=""
        />
        <h1 class="preview-title">{{ form.title }}</h1>
        <div class="preview-date">
          {{ form.date.format(site.themeConfig.dateFormat) }}
        </div>
        <div class="preview-tags">
          <span class="tag" v-for="(tag, index) in form.tags" :key="index">
            {{ tag }}
          </span>
        </div>
        <div class="preview-container" ref="previewContainer"></div>
      </el-drawer>

      <el-drawer
        :title="$t('postSettings')"
        :visible="postSettingsVisible"
        @close="postSettingsVisible = false"
        width="400"
        :wrapStyle="{
          height: 'calc(100% - 108px)',
          overflow: 'auto',
          paddingBottom: '108px',
          zIndex: 1025,
        }"
      >
        <el-collapse v-model="activeKey" class="post-settings" :bordered="false">
          <el-collapse-panel header="URL" key="1">
            <el-input
              v-model="form.fileName"
              @change="handleFileNameChange"
            ></el-input>
          </el-collapse-panel>
          <el-collapse-panel :header="$t('tag')" key="2">
            <div>
              <el-select mode="tags" style="width: 100%" v-model="form.tags">
                <el-select-option v-for="tag in tags" :key="tag" :value="tag">{{
                  tag
                }}</el-select-option>
              </el-select>
            </div>
          </el-collapse-panel>
          <el-collapse-panel :header="$t('createAt')" key="3">
            <el-date-picker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              v-model="form.date"
              style="width: 100%"
            />
          </el-collapse-panel>

          <el-collapse-panel :header="$t('featureImage')" key="4">
            <el-radio-group
              style="margin-bottom: 16px"
              defaultValue="a"
              buttonStyle="solid"
              v-model="featureType"
              size="small"
            >
              <el-radio-button value="DEFAULT">{{
                $t("default")
              }}</el-radio-button>
              <el-radio-button value="EXTERNAL">{{
                $t("external")
              }}</el-radio-button>
            </el-radio-group>
            <div v-if="featureType === 'DEFAULT'">
              <el-upload
                action=""
                listType="picture-card"
                class="feature-uploader"
                :showUploadList="false"
                :beforeUpload="beforeFeatureUpload"
              >
                <div v-if="form.featureImage.path">
                  <img
                    class="feature-image"
                    :src="`file://${form.featureImage.path}`"
                    height="150"
                  />
                </div>
                <div v-else>
                  <img
                    src="../../assets/images/image_upload.svg"
                    class="upload-img"
                  />
                  <i class="zwicon-upload upload-icon"></i>
                </div>
              </el-upload>
              <el-button
                v-if="form.featureImage.path"
                type="danger"
                block
                icon="delete"
                @click="form.featureImage = {}"
              />
            </div>
            <div v-if="featureType === 'EXTERNAL'">
              <el-input v-model="form.featureImagePath"></el-input>
              <div class="tip-text">{{ $t("pathContainHttps") }}</div>
              <div class="feature-image-container" v-if="form.featureImagePath">
                <img
                  class="feature-image"
                  :src="form.featureImagePath"
                  height="150"
                />
              </div>
            </div>
          </el-collapse-panel>
          <el-collapse-panel :header="$t('hideInList')" key="5">
            <el-switch v-model="form.hideInList"></el-switch>
          </el-collapse-panel>
          <el-collapse-panel :header="$t('topArticles')" key="6">
            <el-switch v-model="form.isTop"></el-switch>
          </el-collapse-panel>
        </el-collapse>
      </el-drawer>

      <!-- 编辑器点击图片上传用 -->
      <input
        ref="uploadInput"
        class="upload-input"
        type="file"
        accept="image/*"
        @change="fileChangeHandler"
      />

      <span class="save-tip">{{ postStatusTip }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";

const { ipcRenderer,shell ,  clipboard} = require("electron");
import shortid from "shortid";
import moment from "moment";
import * as fse from "fs-extra";
import * as monaco from "monaco-editor";
import Prism from "prismjs";
import { wordCount, timeCalc } from "@helpers/words-count";
import markdown from "@main/server/server/plugins/markdown";
import MonacoMarkdownEditor from "../../components/MonacoMarkdownEditor/Index.vue";
import EmojiCard from "../../components/EmojiCard/Index.vue";
import slug from "@helpers/slug";
import { IPost } from "../../interfaces/post";
import {Site, siteStore} from "../../store/modules/site";
import { UrlFormats } from "@helpers/enums";
import shortcutKeys from "@helpers/shortcut-keys";
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {storeToRefs} from "pinia";
let {t}=useI18n()
let store=siteStore()
let {site}=storeToRefs(store)
let state=reactive({
  postSettingsVisible : false,

  previewVisible : false,

  previewPostHTML : "",

  changedAfterLastSave : false,

  entering : false,


  form : {
    title: "",
    fileName: "",
    tags: [] as string[],
    date: moment(new Date()),
    content: "",
    published: false,
    hideInList: false,
    isTop: false,
    featureImage: {
      path: "",
      name: "",
      type: "",
    },
    featureImagePath: "",
    deleteFileName: "",
  },

  featureType:   "DEFAULT",//"EXTERNAL" =,

  activeKey : ["1"],

  postStatusTip: "",


  currentPostIndex : -1,

  originalFileName : "",

  fileNameChanged :false,

})
let {postSettingsVisible,previewPostHTML,previewVisible,changedAfterLastSave,entering,form,featureType,activeKey,postStatusTip,currentPostIndex,originalFileName,fileNameChanged }=toRefs(state)



function handleEmojiSelect(emoji: any) {
  this.$refs.monacoMarkdownEditor.editor.getModel().applyEdits([
    {
      range: monaco.Range.fromPositions(
          this.$refs.monacoMarkdownEditor.editor.getPosition()
      ),
      text: emoji,
    },
  ]);
}

function previewPost() {
  this.previewVisible = true;
  setTimeout(() => {
    this.$refs.previewContainer.innerHTML = markdown.render(
        this.form.content
    );
    Prism.highlightAll();
  }, 1);

}

function buildCurrentForm() {
  const { articleFileName } = this;
  if (articleFileName) {
    this.fileNameChanged = true; // 编辑文章标题时 URL 不跟随其变化
    this.currentPostIndex = this.site.posts.findIndex(
        (item: IPost) => item.fileName === articleFileName
    );
    const currentPost = this.site.posts[this.currentPostIndex];
    this.originalFileName = currentPost.fileName;

    if (currentPost) {
      this.form.title = currentPost.data.title;
      this.form.fileName = currentPost.fileName;
      this.form.tags = currentPost.data.tags || [];
      this.form.date = moment(currentPost.data.date).isValid()
          ? moment(currentPost.data.date)
          : moment();
      this.form.content = currentPost.content;
      this.form.published = currentPost.data.published;
      this.form.hideInList = currentPost.data.hideInList;
      this.form.isTop = currentPost.data.isTop;

      if (
          currentPost.data.feature &&
          currentPost.data.feature.includes("http")
      ) {
        this.form.featureImagePath = currentPost.data.feature;
        this.featureType = "EXTERNAL";
      } else {
        this.form.featureImage.path =
            (currentPost.data.feature &&
                currentPost.data.feature.substring(7)) ||
            "";
        this.form.featureImage.name = this.form.featureImage.path.replace(
            /^.*[\\/]/,
            ""
        );
      }
    }
  } else if (this.site.themeConfig.postUrlFormat === UrlFormats.ShortId) {
    this.form.fileName = shortid.generate();
  }
}

function beforeFeatureUpload(file: any) {
  if (!file) {
    return;
  }
  const isImage = file.type.indexOf("image") !== -1;
  if (!isImage) {
    return;
  }
  if (file && isImage) {
    this.form.featureImage = {
      name: file.name,
      path: file.path,
      type: file.type,
    };
  }

  return false;
}



function shortPreviewPost(event: any) {
  if (this.previewVisible) {
    this.previewVisible = false;
    return;
  }
  this.previewPost();
}

/**
 * 单张图片上传
 */

function handleInputKeydown() {
  this.entering = true;
}

function handlePageMousemove() {
  this.entering = false;
}

function openPage(url: string) {
  shell.openExternal(url);
}

function buildFileName() {
  if (this.form.fileName !== "") {
    return;
  }

  this.form.fileName =
      this.site.themeConfig.postUrlFormat === UrlFormats.Slug
          ? slug(this.form.title)
          : shortid.generate();
}

function checkArticleUrlValid() {
  const restPosts = JSON.parse(JSON.stringify(this.site.posts));
  const foundPostIndex = restPosts.findIndex(
      (post: IPost) => post.fileName === this.form.fileName
  );

  if (foundPostIndex !== -1) {
    if (this.currentPostIndex === -1) {
      // 新增文章时文件名和其他文章文件名冲突
      return false;
    }
    restPosts.splice(this.currentPostIndex, 1);
    const index = restPosts.findIndex(
        (post: IPost) => post.fileName === this.form.fileName
    );
    if (index !== -1) {
      return false;
    }
  }

  this.currentPostIndex =
      this.currentPostIndex === -1 ? 0 : this.currentPostIndex;

  return true;
}


function formatForm(published?: boolean) {
  this.buildFileName();
  const valid = this.checkArticleUrlValid();
  if (!valid) {
    this.$message.error(t("postUrlRepeatTip").toString());
    return;
  }

  if (this.form.fileName.includes("/")) {
    this.$message.error(t("postUrlIncludeTip").toString());
    return;
  }

  // 文件名改变之后，删除原来文件
  if (
      this.form.fileName.toLowerCase() !== this.originalFileName.toLowerCase()
  ) {
    this.form.deleteFileName = this.originalFileName;
  }

  const form = {
    ...this.form,
    date: this.form.date.format("YYYY-MM-DD HH:mm:ss"),
  };
  if (this.featureType !== "EXTERNAL") {
    form.featureImagePath = "";
  }
  if (this.featureType !== "DEFAULT") {
    form.featureImage = {
      path: "",
      name: "",
      type: "",
    };
  }
  form.published =
      typeof published === "boolean" ? published : form.published;

  return form;
}
function uploadImageFiles(files: any[]) {
  ipcRenderer.send("image-upload", files);
  ipcRenderer.once("image-uploaded", (event, data: any) => {
    for (const path of data) {
      let url = `![](file://${path})`;
      url = url.replace(/\\/g, "/");

      this.$refs.monacoMarkdownEditor.editor.getModel().applyEdits([
        {
          range: monaco.Range.fromPositions(
              this.$refs.monacoMarkdownEditor.editor.getPosition()
          ),
          text: url,
        },
      ]);
    }
  });
}

function insertMore() {
  this.$refs.monacoMarkdownEditor.editor.getModel().applyEdits([
    {
      range: monaco.Range.fromPositions(
          this.$refs.monacoMarkdownEditor.editor.getPosition()
      ),
      text: "\n<!-- more -->\n",
    },
  ]);

  ga.event("Post", "Post - click-add-more", {});
}

function fileChangeHandler(e: any) {
  const file = (e.target.files || e.dataTransfer)[0];
  if (!file) {
    return;
  }
  const isImage = file.type.indexOf("image") !== -1;
  if (!isImage) {
    return;
  }
  if (file && isImage) {
    this.uploadImageFiles([
      {
        name: file.name,
        path: file.path,
        type: file.type,
      },
    ]);
  }
}
function close() {
  if (this.changedAfterLastSave) {
    this.$confirm({
      title: `${t("warning")}`,
      content: `${t("unsavedWarning")}`,
      okText: `${t("noSaveAndBack")}`,
      okType: "danger",
      cancelText: `${t("cancel")}`,
      zIndex: 2000,
      onOk: () => {
        this.$emit("close");
      },
    });
    return;
  }
  this.$emit("close");
}

function updatePostSavedStatus() {
  this.postStatusTip = `${t("savedIn")} ${moment().format("HH:mm:ss")}`;
  this.changedAfterLastSave = false;
}

function handleTitleChange(val: string) {
  if (
      !this.fileNameChanged &&
      this.site.themeConfig.postUrlFormat === UrlFormats.Slug
  ) {
    this.form.fileName = slug(this.form.title);
  }
}
function preventDefault(event: any) {
  if (event.target.tagName === "A") {
    const href = event.target.getAttribute("href");
    if (href && !href.startsWith("#")) {
      // ignore anchor link.
      event.preventDefault();
      shell.openExternal(href);
    }
  }
}

function handleFileNameChange(val: string) {
  this.fileNameChanged = !!val;
}


function saveDraft() {
  if (!this.canSubmit) return;
  const form = this.formatForm(false);

  ipcRenderer.send("app-post-create", form);
  ipcRenderer.once(
      "app-post-created",
      (event: IpcRendererEvent, data: any) => {
        this.updatePostSavedStatus();
        this.$message.success(`🎉  ${t("draftSuccess")}`);
        this.$emit("fetchData");
      }
  );

  ga.event("Post", "Post - click-save-draft", {});
}

function savePost() {
  if (!this.canSubmit) return;
  const form = this.formatForm(true);

  ipcRenderer.send("app-post-create", form);
  ipcRenderer.once(
      "app-post-created",
      (event: IpcRendererEvent, data: any) => {
        this.updatePostSavedStatus();
        this.$message.success(`🎉  ${t("saveSuccess")}`);
        this.$emit("fetchData");
      }
  );

  ga.event("Post", "Post - click-save-post", {});
}
function normalSavePost() {
  if (!this.canSubmit) return;
  const form = this.formatForm();

  ipcRenderer.send("app-post-create", form);
  ipcRenderer.once(
      "app-post-created",
      (event: IpcRendererEvent, data: any) => {
        this.updatePostSavedStatus();
        this.$emit("fetchData");
      }
  );
}


function insertImage() {
  this.$refs.uploadInput.click();
  ga.event("Post", "Post - click-insert-image", {});
}

function handlePostSettingClick() {
  this.postSettingsVisible = true;

  ga.event("Post", "Post - click-post-setting", {});
}

function handleInfoClick() {
  ga.event("Post", "Post - click-post-info", {});
}

function handleEmojiClick() {
  ga.event("Post", "Post - click-emoji-card", {});
}


onMounted(() => {
  this.buildCurrentForm();
  ipcRenderer.removeAllListeners("click-menu-save");
  ipcRenderer.on("click-menu-save", (event: IpcRendererEvent, data: any) => {
    this.normalSavePost();
  });

  this.$watch(
      "form",
      () => {
        this.changedAfterLastSave = true;
      },
      { deep: true }
  );
})
let postStats=computed((params) => {
  const reading = timeCalc(this.form.content);
  const second = Number(
      (reading.second - (reading.minius - 1) * 60).toFixed(2)
  );
  const formatTime = `${Math.floor(reading.second / 60)}m ${
      second < 60 ? second : ""
  }${second < 60 ? "s" : ""}`;

  let wordsNumber = 0;
  wordCount(this.form.content, (count: number) => {
    wordsNumber = count;
  });

  return {
    formatTime: formatTime,
    wordsNumber: Array.isArray(wordsNumber) ? 0 : wordsNumber,
  };
})
let tags=computed(() => {
  return this.site.tags.map((tag: any) => tag.name);
})
let canSubmit=computed(( ) => {
  return this.form.title && this.form.content;
})
let dateLocale=computed(() => {
  return this.$root.$i18n.locale === "zhHans" ? "zh-cn" : "en-us";
})


defineProps({
  visible:Boolean,
  articleFileName:String
})
let uploadInput=ref(null);
let image=ref(null)
let articlePage=ref(null)
let monacoMarkdownEditor=ref(null)
let previewContainer=ref(null)
let pageTitle=ref(null)

</script>

<style lang="scss" scoped>
</style>
