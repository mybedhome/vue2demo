<template>
  <div class="app-container">
    <h2>无限分页加载的虚拟滚动下拉框</h2>

    <div class="form-item">
      <label>选择用户:</label>
      <infinite-scroll-dropdown
        v-model="selectedUser"
        placeholder="请选择用户"
        :label-key="'lastName'"
        :value-key="'lastName'"
        :multiple="true"
        :fetch-method="fetchUsers"
        @change="handleUserChange"
      />
    </div>

    <div class="selected-info" v-if="selectedUser">
      <p>已选择的用户ID: {{ selectedUser }}</p>
    </div>
  </div>
</template>

<script>
import InfiniteScrollDropdown from "../components/infinite-scroll-dropdown.vue";
import testData from "../components/data.json";
export default {
  components: {
    InfiniteScrollDropdown,
  },
  data() {
    return {
      selectedUser: [],
      userList: [],
      testData,
    };
  },
  mounted() {
    this.fetchUsers({ page: 1, pageSize: 20, queryText: "Cook" }).then(
      (res) => {
        this.userList = res.data;
        // this.selectedUser = [this.userList[0].lastName];
      }
    );
  },
  methods: {
    fetchData() {
      const url = "https://dummyjson.com/users/search";
      // const url = 'https://dummyjson.com/users?limit=5&skip=10&select=firstName,age'
      return fetch(url).then((res) => res.json());
    },
    // 模拟从服务器获取用户数据
    async fetchUsers({ page, pageSize, queryText }) {
      // 在实际应用中，这里应该是一个API调用
      console.log(`Fetching users: page ${page}, pageSize ${pageSize}`);
      const url = `https://dummyjson.com/users/search?q=${queryText}&limit=${pageSize}&skip=${
        (page - 1) * pageSize
      }&select=lastName,age`;
      const data = await fetch(url).then((res) => res.json());
      console.log("data", data);
      return {
        data: data.users,
        total: data.total,
      };
    },

    handleUserChange(value) {
      console.log("Selected user changed:", value);
    },
  },
};
</script>

<style>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.form-item label {
  width: 100px;
  text-align: right;
  margin-right: 10px;
}

.selected-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
