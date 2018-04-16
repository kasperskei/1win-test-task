<template>
  <div id="app">
    <div class="nav">
      <router-link :to="{ name: 'calculator' }">Calculator</router-link> |
      <router-link :to="{ name: 'websocket' }">Websocket</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import 'styles/main';

#app {
  margin: 0 auto;
  padding: 2.5rem 1.5rem;

  .nav {
    margin: 0 auto;
    margin-bottom: 1rem;
    width: fit-content;
  }
}

.router-link-active {
  color: $secondary;
}
</style>
