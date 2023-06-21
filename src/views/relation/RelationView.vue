<template>
  <div>
    <div>这是RelationView的视图-{{ parseInt(Math.random() * 100000) }}</div>
    <!-- <keep-alive :include="['RelationList']">
      <router-view />
    </keep-alive> -->
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    console.log("RelativeView created");
  },
  mounted() {
    console.log("RelativeView mounted");
  },
  updated() {
    console.log("RelationView updated");
  },
  deactivated() {
    console.log("RelationView deactivated");
  },
  activated() {
    console.log("RelationView activated");
  },
};
</script>
