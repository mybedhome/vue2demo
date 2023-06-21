<template lang="">
  <div>
    <h1>detail</h1>
    <h3>{{ new Date().toGMTString() }}</h3>
    <h3 style="color: orange">{{ id }}:{{ value }}</h3>
    <div style="height: 100px; border: 1px solid"></div>
    <router-link to="/relationList">RelationList</router-link>
    <button @click="jump">跳转</button>
    <button @click="jumpParent">跳转到relation父级路由</button>
  </div>
</template>
<script>
export default {
  name: "RelationDetail",
  data() {
    return {
      id: "testid",
      value: "",
    };
  },
  mounted() {
    console.log("detail mounted");
    console.log("params", this.$route.params);
    console.log("query", this.$route.query);
    this.value = this.$route.params.id;
  },
  deactivated() {
    console.log("relationDetail deactivated");
  },
  activated() {
    console.log("relationDetail activated");
    this.id = this.$route.params.id;
  },
  methods: {
    jumpParent() {
      this.$router.push({
        name: "relation",
      });
    },
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
