<template>
  <div>
      <el-form :form="form" style="padding-bottom: 48px;">
        <el-form-item :label="$t('selectTheme')"   :colon="false">
          <el-select v-model="form.themeName" optionLabelProp="name">
            <el-option v-for="item in site.themes" :key="item.folder" :name="item.name" :value="item.folder">
              <div class="theme-option">
                <div class="left">
                  <div class="theme-name">{{ item.name }}</div>
                  <div class="theme-version" v-if="item.version">{{ item.version }}</div>
                </div>
                <div class="extra" v-if="item.repository">
                  <el-button @click.stop="openPage(item.repository)" type="dashed" shape="circle" size="small" icon="github"></el-button>
                </div>
              </div>
            </el-option>
            <div slot="dropdownRender" slot-scope="menu">
<!--              <v-nodes :vnodes="menu"/>-->
              <el-divider style="margin: 4px 0;" />
              <div class="p-2 flex items-center cursor-pointer" @click="openPage('https://gridea.dev/themes/')">
                <i class="ri-t-shirt-line mr-2"></i> {{ $t('moreThemes') }}
              </div>
            </div>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('siteName')"   :colon="false">
          <el-input v-model="form.siteName" />
        </el-form-item>

        <el-form-item :label="$t('siteDescription')"   :colon="false">
          <el-input type="textarea" v-model="form.siteDescription" />
          <div class="tip-text">{{ $t('htmlSupport') }}</div>
        </el-form-item>
        <el-form-item :label="$t('footerInfo')"   :colon="false">
          <el-input type="textarea" v-model="form.footerInfo" />
          <div class="tip-text">{{ $t('htmlSupport') }}</div>
        </el-form-item>
        <el-form-item :label="$t('isShowFeatureImage')"   :colon="false">
          <el-switch v-model="form.showFeatureImage" />
        </el-form-item>
        <el-form-item :label="$t('articlesPerPage')"   :colon="false">
          <el-slider v-model="form.postPageSize" :min="0" :max="50" />
        </el-form-item>
        <el-form-item :label="$t('archivesPerPage')"   :colon="false">
          <el-slider v-model="form.archivesPageSize" :min="0" :max="100" />
        </el-form-item>
        <el-form-item :label="$t('articleDefault')"   :colon="false">
          <el-radio-group name="postUrlFormat" v-model="form.postUrlFormat">
            <el-radio v-for="item in urlFormats" :key="item.value" :value="item.value">{{ item.text }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('tagDefault')"   :colon="false">
          <el-radio-group name="tagUrlFormat" v-model="form.tagUrlFormat">
            <el-radio v-for="item in urlFormats" :key="item.value" :value="item.value">{{ item.text }}</el-radio>
          </el-radio-group>
        </el-form-item>


        <el-form-item :label="$t('articleUrlPath')"   :colon="false">
          <el-radio-group name="postPath" v-model="form.postPath">
            <el-tooltip placement="bottom" title="example.com/post/xxx">
              <el-radio value="post">{{$t('default')}}</el-radio>
            </el-tooltip>
            <el-tooltip placement="bottom" title="example.com/xxx">
              <el-radio value="">{{$t('concise')}}</el-radio>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('tagUrlPath')"   :colon="false">
          <el-radio-group name="tagPath" v-model="form.tagPath">
            <el-tooltip placement="bottom" title="example.com/tag/xxx">
              <el-radio value="tag">{{$t('default')}}</el-radio>
            </el-tooltip>
            <el-tooltip placement="bottom" title="example.com/xxx">
              <el-radio value="">{{$t('concise')}}</el-radio>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>


          <el-form-item
            :label="$t('archivePathPrefix')"
            :labelCol="formLayout.label"
            :wrapperCol="formLayout.wrapper"
            :colon="false"
          >
            <el-input v-model="form.archivesPath" />
          </el-form-item>


        <el-form-item :label="$t('dateFormat')"   :colon="false">
          <el-input v-model="form.dateFormat" />
          <div><a @click.prevent="openPage('http://momentjs.cn/docs/#/displaying/format/')">Momentjs Format</a></div>
        </el-form-item>
        <el-form-item label="RSS/Feed"   :colon="false">
          <el-radio-group name="tagUrlFormat" v-model="form.feedFullText">
            <el-radio :value="true">{{$t('showFullText')}}</el-radio>
            <el-radio :value="false">{{$t('showAbstractOnly')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('numberArticlesRSS')"   :colon="false">
          <el-input-number :min="0" :max="10000" v-model="form.feedCount" />
        </el-form-item>
        <footer-box>
          <div class="flex justify-end">
            <el-button class="btn" type="primary" :disabled="invalid" @click="saveTheme">{{ $t('save') }}</el-button>
          </div>
        </footer-box>
      </el-form>
  </div>
</template>

<script setup lang="ts">
const { ipcRenderer,  shell } =require('electron')

import { useField } from 'vee-validate'
import FooterBox from '@renderer/components/FooterBox.vue'
import useSiteStore,{Site, } from '../../../store/modules/site'
import {
  UrlFormats,
  DEFAULT_POST_PAGE_SIZE,
  DEFAULT_ARCHIVES_PAGE_SIZE,
  DEFAULT_FEED_COUNT,
  DEFAULT_ARCHIVES_PATH,
  DEFAULT_POST_PATH,
  DEFAULT_TAG_PATH,
} from '@helpers/constants'
import {onMounted, reactive, toRefs} from "vue";
import {storeToRefs} from "pinia";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";

// @Component({
//   name: 'ThemeBasicSetting',
//   components: {
//     VNodes: {
//       functional: true,
//       render: (h: any, ctx: any) => ctx.props.vnodes,
//     },
//     ValidationProvider,
//     ValidationObserver,
//     FooterBox,
//   },
// })

let state=reactive({
  formLayout : {
    label: { span: 6 },
    wrapper: { span: 12 },
  },

  form : {
    themeName: '',
    postPageSize: DEFAULT_POST_PAGE_SIZE,
    archivesPageSize: DEFAULT_ARCHIVES_PAGE_SIZE,
    siteName: '',
    siteDescription: '',
    footerInfo: '',
    showFeatureImage: true,
    postUrlFormat: 'SLUG',
    tagUrlFormat: 'SLUG',
    dateFormat: 'YYYY-MM-DD',
    feedFullText: true,
    feedCount: DEFAULT_FEED_COUNT,
    archivesPath: DEFAULT_ARCHIVES_PATH,
    postPath: DEFAULT_POST_PATH,
    tagPath: DEFAULT_TAG_PATH,
  },

  lCol : { span: 5 },

  wCol : { span: 12 },

  urlFormats : UrlFormats
})
let {formLayout,lCol,wCol,urlFormats,form}=toRefs(state)
let store=useSiteStore()
let site=storeToRefs(store)
let route=useRoute()
let router=useRouter()
let {t}=useI18n()
function openPage(url: string) {
  shell.openExternal(url)
}


onMounted(() => {
  const config = site.themeConfig.value

  state.form.themeName = config.themeName
  state.form.postPageSize = config.postPageSize
  state.form.archivesPageSize = config.archivesPageSize
  state.form.siteName = config.siteName
  state.form.siteDescription = config.siteDescription
  state.form.footerInfo = config.footerInfo
  state.form.showFeatureImage = config.showFeatureImage
  state.form.postUrlFormat = config.postUrlFormat
  state.form.tagUrlFormat = config.tagUrlFormat
  state.form.dateFormat = config.dateFormat
  state.form.feedFullText = config.feedFullText
  state.form.feedCount = config.feedCount
  state.form.archivesPath = config.archivesPath
  state.form.postPath = config.postPath
  state.form.tagPath = config.tagPath
})
 function   saveTheme() {
   ipcRenderer.send('theme-save', state.form)
   ipcRenderer.once('theme-saved', async (event , result: any) => {
     await this.$bus.$emit('site-reload')
      await router.push({name: 'loading', query: {redirect: 'theme?tab=basic'}})
     this.$message.success( t('themeConfigSaved').toString())

   })
 }
</script>

<style lang="scss" scoped>

.theme-option {
  display: flex;
  justify-content: space-between;
  .theme-name {
    padding-bottom: 8px;
  }
  .theme-version {
    font-size: 12px;
    color: #ced4da;
    font-weight: lighter !important;
  }
}
</style>
