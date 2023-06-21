<template lang="zh-cn">
  <div>
    <ul>
      <li class="item" v-for="(item, index) in lists" :key="index" @click="jumpDetail(item)">{{item.text}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "RelationList",
  data() {
    return {
      lists: [{ text: "111" }, { text: "222" }, { text: "333" }],
    };
  },
  methods: {
    jumpDetail(item) {
      this.$router.push({
        name: "RelationDetail",
        params: { id: item.text },
        query: {
          flag: "yes",
        },
      });
    },
  },
  created() {
    console.log("relationlist created");
  },
  mounted() {
    console.log("relationlist mounted");
  },
  destroyed() {
    console.log("relativeList unmounted");
  },
  deactivated() {
    console.log("relativeList deactivated");
  },
  activated() {
    console.log("relationList activated");
  },
};
</script>
<style lang="css">
.item {
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #efefef;
  cursor: pointer;
}
</style>
