<template>
  <div id="app">
    <div id="nav">
      <router-link to="/calculator">Calculator</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import 'styles/main';

#app {
  max-width: 960px;
  margin: 0 auto;
}
</style>
