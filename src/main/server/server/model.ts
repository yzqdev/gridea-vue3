import path from 'node:path'
import {Low,JSONFileSync,JSONFile}from 'lowdb'
import lodash from 'lodash'
import { BrowserWindow } from 'electron'
import { IApplicationDb, IApplication } from './interfaces/application'

export default class Model {
  appDir: string

  $setting: any

  $posts: any

  $theme: any

  db: IApplicationDb

  mainWindow: BrowserWindow

  constructor(appInstance: IApplication) {
    this.appDir = appInstance.appDir
    this.db = appInstance.db
    this.mainWindow = appInstance.mainWindow

    this.initDataStore()
  }

  private initDataStore(): void {
    class LowWithLodash<T> extends Low<T> {
      chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
    }
    const settingAdapter = new JSONFile (path.join(this.appDir, 'config/setting.json'))
    let setting=new Low(settingAdapter)
    this.$setting = setting

    const postsAdapter = new JSONFile (path.join(this.appDir, 'config/posts.json'))
    let posts=new Low(postsAdapter)
    this.$posts = posts

    const themeAdapter = new JSONFile  (path.join(this.appDir, 'config/theme.json'))
    let theme=new Low(themeAdapter)
    this.$theme = theme
  }
}
