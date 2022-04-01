<template>
  <div class="">
    <el-row type="flex" justify="end" class="tool-container">
      <el-tooltip placement="bottom" :title="$t('newMenu')">
        <div class="op-btn" tabindex="0" @click="newMenu">
          <i class="zwicon-plus"></i>
        </div>
      </el-tooltip>
    </el-row>
    <div class="content-container">
      <draggable v-model="menuList" handle=".handle" @change="handleMenuSort">
        <div
          class="menu-container flex mb-2 rounded-sm relative cursor-pointer transition-fast hover:bg-gray-100"
          v-for="(menu, index) in menuList"
          :key="index"
          @click="editMenu(menu, index)"
        >
          <div class="flex items-center pl-4 handle cursor-move">
            <i class="ri-drag-move-line"></i>
          </div>
          <div class="p-4 flex-1">
            <div class="text-base text-gray-700 mb-2">
              {{ menu.name }}
            </div>
            <div class="text-xs flex items-center">
              <div class="text-xs flex items-center px-2 rounded border bg-gray-100 border-gray-200 text-gray-500 mr-4">
                {{ menu.openType }}
                <i class="ri-external-link-line ml-2" v-if="menu.openType === 'External'"></i>
              </div>
              <div class="text-gray-300">
                {{ menu.link }}
              </div>
            </div>
          </div>
          <div class="flex items-center px-4">
            <i class="ri-delete-bin-4-line hover:text-red-700" @click.stop="deleteMenu(menu.name)"></i>
          </div>
        </div>
      </draggable>
    </div>
    <el-drawer
      title="Menu"
      width="400"
      :visible="visible"
      @close="close"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <el-form :form="form" layout="vertical">
        <el-form-item :label="$t('name')">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label=" ">
          <el-radio-group defaultValue="a" buttonStyle="solid" v-model="form.openType">
            <el-radio-button v-for="item in menuTypes" :key="item" :value="item">{{ item }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Link">
          <el-input v-model="form.link" class="link-input" placeholder="输入或从下面选择"></el-input>
          <el-select v-model="form.link">
            <el-option v-for="item in menuLinks" :key="item.value" :value="item.value">{{ item.text }}</el-option>
          </el-select>
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
        <el-button type="primary" :disabled="!canSubmit" @click="saveMenu">{{ $t('save') }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import useSiteStore from "@store/site";

const { ipcRenderer } = require("electron");
import urlJoin from 'url-join'
import Draggable from 'vuedraggable'
import { MenuTypes } from '@helpers/enums'
import { IMenu } from '../../interfaces/menu'
import { IPost } from '../../interfaces/post'
import {storeToRefs} from "pinia";
import {computed, onMounted, reactive, toRefs} from "vue";
import {useI18n} from "vue-i18n";

interface IForm {
  name: any
  index: any
  openType: string
  link: string
}
let store=useSiteStore()
let site=storeToRefs(store)
let state=reactive({
  form: {
    name: '',
    index: '',
    openType: MenuTypes.Internal,
    link: '',
  },

  menuList:   [],

  draggleList:  [],

  visible : false,

  menuTypes : MenuTypes
})
let {form,menuList,draggleList,visible,menuTypes}=toRefs(state)
let {t}=useI18n()


async function handleMenuSort() {
  ipcRenderer.send('menu-sort', state.menuList)
  ipcRenderer.once('menu-sorted', (event: IpcRendererEvent, result: any) => {
    this.$bus.$emit('site-reload')
    this.$message.success( t('menuSuccess').toString())
  })
}
function  editMenu(menu: IMenu, index: number) {
  state.visible = true
  state.form.index = index
  state.form.name = menu.name
  state.form.openType = menu.openType
  state.form.link = menu.link
}
function saveMenu() {
  ipcRenderer.send('menu-save', { ...state.form })
  ipcRenderer.once('menu-saved', (event: IpcRendererEvent, result: any) => {
    if (typeof state.form.index !== 'number') {
      state.menuList.push({ ...state.form })
    } else {
      state.menuList[state.form.index] = { ...state.form }
    }
    state.$bus.$emit('site-reload')
    state.$message.success(state.$t('menuSuccess').toString())
    state.visible = false

  })
}
async function deleteMenu(menuValue: string) {
  this.$confirm({
    title: `${ t('warning')}`,
    content: `${ t('deleteWarning')}`,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: () => {
      ipcRenderer.send('menu-delete', menuValue)
      ipcRenderer.once('menu-deleted', (event: IpcRendererEvent, result: any) => {
        const foundIndex = state.menuList.findIndex((item: IMenu) => item.name === menuValue)
        state.menuList.splice(foundIndex, 1)

        state.$bus.$emit('site-reload')
        state.$message.success(state.$t('menuDelete').toString())
        state.visible = false
      })
    },
  })
}

function newMenu() {
  state.form.name = null
  state.form.index = null
  state.form.openType = MenuTypes.Internal
  state.form.link = ''
  state.visible = true

}
let menuLinks=computed(() => {
  const { setting, themeConfig } =  site
  const posts =  site.posts.map((item: IPost) => {
    return {
      text: `📄 ${item.data.title}`,
      value: urlJoin(setting.domain, themeConfig.postPath, item.fileName),
    }
  })
  return [
    {
      text: '🏠 Homepage',
      value: setting.domain,
    },
    {
      text: '📚 Archives',
      value: urlJoin(setting.domain, themeConfig.archivesPath),
    },
    {
      text: '🏷️ Tags',
      value: urlJoin(setting.domain, 'tags'),
    },
    ...posts,
  ]
})
let canSubmit=computed(() => {
  return state.form.name && state.form.link
})
function close() {
  state.visible = false
}
onMounted(() => {
  state.menuList = [... site.menus]
})

</script>

<style lang="scss" scoped>
.link-input {
  margin-bottom: 8px;
}
.menu-icon {
  font-size: 18px;
}
.menu-container {
  box-shadow: inset 0 0 0 1px #eaeaea;
}
.menu-title {
  color: #373530;
  &:hover {
    color: #3687eb;
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
