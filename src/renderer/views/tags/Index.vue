<template>
  <div class="">
    <el-row type="flex" justify="end" class="tool-container">
      <el-tooltip placement="bottom" :title="$t('newTag')">
        <div class="op-btn" tabindex="0" @click="newTag">
          <i class="zwicon-plus"></i>
        </div>
      </el-tooltip>
    </el-row>
    <div class="content-container">
      <div v-for="(tag, index) in site.tags" :key="tag.name" class="tag-wrapper">
        <div class="tag" @click="tag.used ? null : updateTag(tag, index)"><i class="zwicon-price-tag text-base mr-1"></i> {{ tag.name }}</div>
        <i class="zwicon-trash delete-icon" v-if="!tag.used" @click="handleDelete(tag.name)"></i>
      </div>
    </div>
    <el-drawer
      :title="$t('tag')"
      width="400"
      :visible="visible"
      @close="close"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <el-form :form="form" layout="vertical">
        <el-form-item :label="$t('tagName')">
          <el-input v-model="form.name" @input="handleNameChange" />
        </el-form-item>
        <el-form-item label="标签 URL">
          <el-input v-model="form.slug" @input="handleSlugChange" />
        </el-form-item>
      </el-form>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <el-button
          :style="{marginRight: '8px'}"
          @click="close"
        >
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" :disabled="!canSubmit" @click="saveTag">{{ $t('save') }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
const {ipcRenderer}=require('electron')
import {   IpcRendererEvent } from 'electron'
import shortid from 'shortid'
import slug from '@helpers/slug'
import {Site, siteStore} from '../../store/modules/site'
import { UrlFormats } from '@helpers/enums'
import { ITag } from '../../interfaces/tag'
import {computed, reactive} from "vue";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";
let {t}=useI18n()
const store:any = siteStore()
let {site}=storeToRefs(store)
let state=reactive({
  visible:false,
  isUpdate : false,

  form : {
    name: null,
    slug: '',
    index: -1,
  }
,
  slugChanged : false
})
let canSubmit=computed(() => {
 return  state.form.name
})


function handleNameChange(val: string) {
  if (!state.slugChanged &&  site.themeConfig.tagUrlFormat === UrlFormats.Slug) {
    state.form.slug = slug(state.form.name)
  }
}

function handleSlugChange(val: string) {
  state.slugChanged = !!val
}

function close() {
  state.visible = false
}

function newTag() {
  state.form.name = null
  state.form.index = -1
  state.form.slug = ''
  state.visible = true
  state.isUpdate = false
  if ( site.themeConfig.tagUrlFormat === UrlFormats.ShortId) {
    state.form.slug = shortid.generate()
  }

}

function buildSlug() {
  if (state.form.slug === '') {
    if ( site.themeConfig.tagUrlFormat === UrlFormats.Slug) {
      state.form.slug = slug(state.form.name)
    }
    if ( site.themeConfig.tagUrlFormat === UrlFormats.ShortId) {
      state.form.slug = shortid.generate()
    }
  }
}

function updateTag(tag: any, index: number) {
  console.log(tag)
  state.visible = true
  state.isUpdate = true
  state.form.name = tag.name
  state.form.slug = tag.slug
  state.form.index = index
}

/**
 * 检查标签合法性
 * 若是新增，则 slug 和 name 都不允许和已有的重复
 * 若是编辑，则 slug 和 name 都不允许和已有的其他标签重复
 */
function checkTagValid() {
  const siteTags =  site.tags

  const tags = JSON.parse(JSON.stringify(siteTags))
  if (state.isUpdate) {
    tags.splice(state.form.index, 1)
  }


  const foundTagIndex = tags.findIndex((tag: ITag) => tag.name === state.form.name || tag.slug === state.form.slug)
  if (foundTagIndex !== -1) {
    return false
  }

  return true
}

function saveTag() {
   buildSlug()

  const valid =  checkTagValid()
  if (!valid) {
    state.$message.error('标签的名称或 URL 与其他标签重复')
    return
  }

  ipcRenderer.send('tag-save', { ...state.form, used: false })
  ipcRenderer.once('tag-saved', (event: IpcRendererEvent, result: any) => {
    state.$bus.$emit('site-reload')
    state.$message.success('标签已保存')
    state.visible = false

  })
}

async function  handleDelete(tagValue: string) {
  state.$confirm({
    title: `${ t('warning')}`,
    content: `${ t('deleteWarning')}`,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: () => {
      ipcRenderer.send('tag-delete', tagValue)
      ipcRenderer.once('tag-deleted', (event: IpcRendererEvent, result: any) => {
        state.$bus.$emit('site-reload')
        state.$message.success('标签已删除')
        state.visible = false
      })
    },
  })
}

</script>

<style lang="scss" scoped>
.content-container {
  background: transparent;
}

.tag-wrapper {
  display: inline-flex;
  margin-right: 24px;
  margin-bottom: 16px;
  align-items: center;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  transition: all 0.3s;
  &:hover {
    // box-shadow: 0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)!important;
    @apply shadow-lg;
  }
  .tag {
    font-size: 12px;
    margin-right: 0px;
    border-radius: 0;
    padding: 6px 16px 6px 12px;
    cursor: default;
    &:not(:last-child) {
      cursor: pointer;
      border-right: 1px solid #e8e8e8;
    }
  }
}
.delete-icon {
  padding: 4px 8px;
  &:hover {
    color: #fa5252;
    cursor: pointer;
  }
}
</style>
