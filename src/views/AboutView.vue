<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>searchText: {{ searchText }}</h2>
    <input @input="debounceFn" />
    <button @click="goRelation">go relation</button>
    <button @click="goRelationList">go relationList</button>
  </div>
</template>

<script>
// import debounce from "debounce";
import { throttle } from "lodash";
export default {
  data() {
    return {
      searchText: "",
    };
  },
  created() {
    console.log("about created");
    this.debounceFn = throttle(this.onInput, 3000, {
      // trailing: true,
      // leading: false,
      // maxWait: 3000,
    });
    // this.debounceFn();
    // this.debounceFn.flush();
  },
  deactivated() {
    console.log("About deactivated");
  },
  activated() {
    console.log("About activated");
  },
  destroyed() {
    console.log("About unmounted");
  },
  methods: {
    goRelation() {
      this.$router.push({ name: "relation" });
    },
    goRelationList() {
      this.$router.push({ name: "RelationList" });
    },
    test(e) {
      this.debounceFn(e);
    },
    onInput(e) {
      const val = e ? e.target.value : Date.now();
      console.log("e.target.value", val);
      this.searchText = val;
    },
    onChange(e) {
      console.log("changed e.target.value", e.target.value);
      this.searchText = e.target.value;
    },
  },
};
</script>
