import Model from './model'
import { IMenu } from './interfaces/menu'

export default class Menus extends Model {
  async list() {
    await this.$posts.read()
    const menus = this.$posts.data['menu']
    return menus
  }

  public async saveMenu(menu: IMenu) {
    await this.$posts.read()
    const menus = this.$posts.data['menu']
    if (typeof menu.index === 'number') {
      const { index } = menu
      delete menu.index
      menus[index] = menu
    } else {
      delete menu.index
      menus.push(menu)
    }
  this.$posts.data['menus']=menus
    await this.$posts.write()
    return menus
  }

  public async saveMenus(menus: IMenu[]) {
    await this.$posts.read()
    this.$posts.data['menus']=menus
    await this.$posts.write()
    return menus
  }

  public async deleteMenu(menuValue: string) {
    await this.$posts.read()
    this.$posts.data['menus'].name=''
    let menu=this.$posts.write()
    // const menu = await this.$posts.get('menus').remove({ name: menuValue }).write()
    return menu
  }
}
