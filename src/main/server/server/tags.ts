import shortid from 'shortid'
import Model from './model'
import { ITag } from './interfaces/tag'
import slug from '@helpers/slug'
import { UrlFormats } from '@helpers/enums'

export default class Tags extends Model {
  public async saveTags() {
    await this.$posts.read()

    const posts = this.$posts.data['posts']
    let list: any = []
    posts.forEach((post: any) => {
      if (Array.isArray(post.data.tags)) {
        list = list.concat(post.data.tags)
      }
    })
    list = Array.from(new Set([...list]))
    await this.$theme.read()
    const themeConfig = this.$theme.data['config']
    const tagUrlFormat = themeConfig.tagUrlFormat || UrlFormats.Slug

    await this.$posts.read()

    let existUsedTags = this.$posts.data['tags'].filter({ used: true })

    // If you delete an article after using a tag, there may be a tag unused state.
    existUsedTags = existUsedTags.map((tag: ITag) => {
      return {
        ...tag,
        used: list.includes(tag.name),
      }
    })

    const unusedTags = this.$posts.data['tags'].filter({ used: false })

    // The tag of the imported article is newly used
    const newUsedTags = list
      .filter((item: any) => !existUsedTags.find((tag: ITag) => tag.name === item))
      .map((item: any) => {
        const foundItem = unusedTags.find((tag: ITag) => tag.name === item)
        if (foundItem) {
          // remove from unusedTags
          const foundItemIndex = unusedTags.indexOf(foundItem)
          unusedTags.splice(foundItemIndex, 1)

          return {
            ...foundItem,
            used: true,
          }
        }

        return {
          name: item,
          slug: tagUrlFormat === UrlFormats.Slug ? slug(item) : shortid.generate(),
          used: true,
        }
      })

    const tags = [...newUsedTags, ...existUsedTags, ...unusedTags]
    await this.$posts.read()
    this.$posts.data['tags']=tags
    await this.$posts.write()
  }

  async list() {
    await this.saveTags()
    await this.$posts.read()
    const tags =   this.$posts.data['tags']
    return tags
  }

  public async saveTag(tag: ITag) {
    await this.$posts.read()
    const tags =   this.$posts.data['tags']
    if (typeof tag.index === 'number' && tag.index >= 0) {
      tags[tag.index] = tag
    } else {
      tags.push(tag)
    }
    this.$posts.data['tags']=tags
    await this.$posts.write()
    return tags
  }

  public async deleteTag(tagValue: string) {
    await this.$posts.read()
    this.$posts.data['tags'].name=''
    let tag=this.$posts.data.write()
    // const tag = await this.$posts.get('tags').remove({ name: tagValue }).write()
    return tag
  }
}
