<template>
  <div class="layout-box">
    <keep-alive>
      <transition name="fade" mode="out-in">
        <router-view v-if='$route.meta.keepAlive'/>
      </transition>
    </keep-alive>
    <transition name="fade" mode="out-in">
      <router-view v-if='!$route.meta.keepAlive'/>
    </transition>
  </div>
</template>
<script>
// import ResouresNav from './components/ResourceNav.vue';
export default {
  name: 'student-layout',
  components: {
    // ResouresNav
  },
  props: {
  },
  data() {
    return {
      navIndex: 1
    };
  }
};
</script>
<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
