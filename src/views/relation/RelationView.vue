<template>
  <keep-alive :include="['RelationList']">
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  mounted() {
    console.log("RelativeView mounted");
  },
};
</script>
