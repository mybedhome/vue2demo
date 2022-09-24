<template lang="">
  <div>
    <h1>detail</h1>
    <h3>{{ new Date().toGMTString() }}</h3>
    <h3 style="color: orange">{{ id }}</h3>
    <div style="height: 600px; border: 1px solid"></div>
    <router-link to="/relationList">RelationList</router-link>
    <button @click="jump">跳转</button>
  </div>
</template>
<script>
export default {
  name: "RelationDetail",
  data() {
    return {
      id: "testid",
    };
  },
  mounted() {
    console.log("detail mounted");
    console.log("params", this.$route.params);
    console.log("query", this.$route.query);
  },
  deactivated() {
    console.log("relationDetail deactivated");
  },
  activated() {
    console.log("relationDetail activated");
    this.id = this.$route.params.id;
  },
  methods: {
    jump() {
      // console.log("this", this.$route);
      this.$router.push({
        name: "RelationList",
        params: {
          id: parseInt(Math.random() * 10000),
        },
      });
    },
  },
};
</script>
<style lang="css"></style>
