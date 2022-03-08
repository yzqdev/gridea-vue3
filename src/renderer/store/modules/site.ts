import {IPost} from '../../interfaces/post'
import {ITag} from '../../interfaces/tag'
import {ITheme} from '../../interfaces/theme'
import {IMenu} from '../../interfaces/menu'
import {ISetting, ICommentSetting} from '../../interfaces/setting'
import {
    DEFAULT_POST_PAGE_SIZE,
    DEFAULT_ARCHIVES_PAGE_SIZE,
    DEFAULT_FEED_COUNT,
    DEFAULT_ARCHIVES_PATH,
    DEFAULT_POST_PATH,
    DEFAULT_TAG_PATH,
} from '@helpers/constants'
import {defineStore} from "pinia";
import store from "@renderer/store";

const {ipcRenderer} = require('electron')

export interface Site {
    appDir: string
    config: any
    posts: IPost[]
    tags: ITag[]
    menus: IMenu[]
    themeConfig: ITheme
    themeCustomConfig: any
    currentThemeConfig: any
    themes: string[]
    setting: ISetting
    commentSetting: ICommentSetting
}


// const actions  = {
//   updatePosts({ commit }, posts: IPost[]) {
//     commit('updatePosts', posts)
//   },
//   updateSite({ commit }, siteData: Site) {
//     console.log('siteData:', siteData)
//     commit('updateSite', siteData)
//   },
// }

export const useStore = defineStore({
    id: 'site',
    state: (): Site => ({
        appDir: '',
        config: {},
        posts: [],
        tags: [{
            name: "string",
            used: true,
            slug: "string"
        }],
        menus: [],
        themeConfig: {
            themeName: '',
            postPageSize: DEFAULT_POST_PAGE_SIZE,
            archivesPageSize: DEFAULT_ARCHIVES_PAGE_SIZE,
            siteName: '',
            siteDescription: '',
            footerInfo: 'Powered by Gridea',
            showFeatureImage: true,
            postUrlFormat: 'SLUG',
            tagUrlFormat: 'SLUG',
            dateFormat: 'YYYY-MM-DD',
            feedCount: DEFAULT_FEED_COUNT,
            feedFullText: true,
            archivesPath: DEFAULT_ARCHIVES_PATH,
            postPath: DEFAULT_POST_PATH,
            tagPath: DEFAULT_TAG_PATH,
        },
        themeCustomConfig: {},
        currentThemeConfig: {},
        themes: [],
        setting: {
            platform: 'github',
            domain: '',
            repository: '',
            branch: '',
            username: '',
            email: '',
            tokenUsername: '',
            token: '',
            cname: '',
            port: '22',
            server: '',
            password: '',
            privateKey: '',
            remotePath: '',
        },
        commentSetting: {
            showComment: false,
            commentPlatform: 'gitalk',
            gitalkSetting: {
                clientId: '',
                clientSecret: '',
                repository: '',
                owner: '',
            },
            disqusSetting: {
                api: '',
                apikey: '',
                shortname: '',
            },
        },
    })
    ,

    actions: {
        updateSite(siteData?: Site) {
            console.log(`%c这是sitedata`, `color:red;font-size:16px;background:transparent`)
            console.log('data', siteData)
            const siteFolder = JSON.parse(localStorage.getItem("sourceFolder"));

            ipcRenderer.send("app-site-reload", {siteFolder});
            ipcRenderer.once(
                "app-site-loaded",
                (event, result: Site) => {
                    console.log(result);
                    // store.updateSite(JSON.parse(localStorage.getItem("sourceFolder")));
                }
            );
            this.appDir = siteData.appDir
            this.posts = siteData.posts
            this.tags = siteData.tags
            this.menus = siteData.menus
            this.config = siteData.config
            this.themeConfig = siteData.themeConfig
            this.themeConfig.postUrlFormat = siteData.themeConfig.postUrlFormat || 'SLUG'
            this.themeConfig.tagUrlFormat = siteData.themeConfig.tagUrlFormat || 'SLUG'
            this.themeConfig.dateFormat = siteData.themeConfig.dateFormat || 'YYYY-MM-DD'
            this.themeConfig.postPageSize = siteData.themeConfig.postPageSize || DEFAULT_POST_PAGE_SIZE
            this.themeConfig.archivesPageSize = siteData.themeConfig.archivesPageSize || DEFAULT_ARCHIVES_PAGE_SIZE
            this.themeConfig.feedCount = siteData.themeConfig.feedCount || DEFAULT_FEED_COUNT
            this.themeConfig.feedFullText = (typeof siteData.themeConfig.feedFullText) === 'undefined' ? true : siteData.themeConfig.feedFullText // from > 0.8.0
            this.themes = siteData.themes
            this.setting = siteData.setting
            this.commentSetting = siteData.commentSetting
            this.themeCustomConfig = siteData.themeCustomConfig
            this.currentThemeConfig = siteData.currentThemeConfig
        },
        updatePosts(posts: IPost[]) {
            this.posts = posts
        },
    },
})
export default function useSiteStore() {
    return useStore(store)
}

