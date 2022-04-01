<template>
  <div class="post-card" v-if="posts && posts.length > 0">
    <div class="item-container" v-for="(post, index) in posts" :key="index">
      <div @click="handleClick(post)">{{ post.data.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  posts:Array
})

let select=defineEmits(['select'])
function handleClick(post) {
  select('select',post.link)
}

</script>

<style lang="scss" scoped>
.post-card {
  max-height: 480px;
  overflow: scroll;
  margin: -15px;
}
.item-container {
  margin: 4px;
  padding: 2px;
  border-radius: 2px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #fafafa;
  }
}
</style>
