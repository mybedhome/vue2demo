<template>
  <el-form ref="form">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名">
        <template slot-scope="scope">
          <el-form-item
            :prop="'name_' + scope.$index"
            :ref="'name_' + scope.$index"
          >
            <el-input v-model="scope.row.name"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄">
        <template slot-scope="scope">
          <el-form-item
            :prop="'age_' + scope.$index"
            :ref="'age_' + scope.$index"
          >
            <el-input v-model="scope.row.age"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="validateAll">提交</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        // 独立的表格数据
        { name: "", age: "" },
      ],
    };
  },
  methods: {
    validateAll() {
      let valid = true;

      // 手动校验每一行的表单项
      this.tableData.forEach((row, index) => {
        const nameItem = this.$refs["name_" + index][0]; // 获取姓名表单项
        const ageItem = this.$refs["age_" + index][0]; // 获取年龄表单项

        // 校验姓名
        nameItem.validate((res) => {
          if (!res) {
            valid = false;
          }
        });

        // 校验年龄
        ageItem.validate((res) => {
          if (!res) {
            valid = false;
          }
        });
      });

      // 这里需要确保所有的校验都完成后再判断 valid
      if (valid) {
        this.$message.success("校验通过!");
      } else {
        this.$message.error("校验失败!");
      }
    },
  },
};
</script>
