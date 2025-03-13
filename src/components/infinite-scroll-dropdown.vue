<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :multiple="multiple"
    :disabled="disabled"
    :clearable="clearable"
    :loading="loading"
    @focus="handleFocus"
    @change="handleChange"
    @visible-change="handleVisibleChange"
    :filterable="true"
    :filter-method="remoteMethod"
    @keyup.enter.native="handleEnter"
    popper-class="virtual-select-dropdown"
  >
    <div class="virtual-select-wrapper" v-if="options.length > 0">
      <virtual-list
        style="height: 250px; overflow-y: auto"
        ref="virtualList"
        :data-key="dataKey"
        :data-sources="options"
        :data-component="optionComponent"
        :estimate-size="34"
        :keeps="20"
        :extra-props="{
          valueKey,
          labelKey,
        }"
        @tobottom="handleToBottom"
      />
    </div>
    <el-option v-else :value="'loading'" :label="noDataText" disabled />
  </el-select>
</template>

<script>
import VirtualList from "vue-virtual-scroll-list";
// import { debounce } from "lodash";
import { h } from "vue";

export default {
  name: "VirtualSelect",
  components: {
    VirtualList,
  },
  props: {
    value: {
      type: [String, Number, Array],
      default: "",
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    noDataText: {
      type: String,
      default: "暂无数据",
    },
    fetchMethod: {
      type: Function,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 20,
    },
    valueKey: {
      type: String,
      default: "value",
    },
    labelKey: {
      type: String,
      default: "label",
    },
  },
  data() {
    return {
      selectedValue: this.value,
      options: [],
      loading: false,
      keyword: "",
      page: 1,
      hasMore: true,
      dataKey: "id",
      optionComponent: {
        props: {
          source: {
            type: Object,
            required: true,
          },
          valueKey: {
            type: String,
            required: true,
          },
          labelKey: {
            type: String,
            required: true,
          },
        },
        render() {
          return h("el-option", {
            props: {
              value: this.source[this.valueKey],
              label: this.source[this.labelKey],
            },
          });
        },
      },
    };
  },
  watch: {
    value(val) {
      this.selectedValue = val;
    },
    selectedValue(val) {
      this.$emit("input", val);
    },
  },
  created() {
    // this.remoteMethod = debounce(this.fetchData, 300);
    this.remoteMethod = () => {};
  },
  methods: {
    handleEnter(evt) {
      console.log("enter", evt.target.value);
      this.page = 1;
      this.fetchData(evt.target.value);
    },
    async handleVisibleChange(visible) {
      console.log("visible", visible);
      if (visible && this.$refs.virtualList) {
        // 如果有选中值，滚动到第一个选中项的位置
        const hasValue = Array.isArray(this.selectedValue)
          ? this.selectedValue.length > 0
          : !!this.selectedValue;
        if (hasValue) {
          // 预加载下一页的数据
          await this.handleToBottom();
          this.$refs.virtualList.reset();
          const selectedValues = Array.isArray(this.selectedValue)
            ? this.selectedValue
            : [this.selectedValue];
          const firstSelectedIndex = this.options.findIndex((item) =>
            selectedValues.includes(item[this.valueKey])
          );
          console.log("firstSelectedIndex", firstSelectedIndex);

          if (firstSelectedIndex > -1) {
            this.selectedPosition = firstSelectedIndex;
            this.$nextTick(() => {
              this.$refs.virtualList.scrollToIndex(firstSelectedIndex);
            });
          }
        } else {
          this.$refs.virtualList.reset();
        }
      }
    },
    async fetchData(query = "") {
      if (!this.hasMore && this.keyword === query) return;

      this.keyword = query;
      this.loading = true;

      try {
        const result = await this.fetchMethod({
          page: this.page,
          pageSize: this.pageSize,
          keyword: this.keyword,
        });
        console.log("result=", result);
        if (this.page === 1) {
          this.options = result.data || [];
        } else {
          this.options = [...this.options, ...(result.data || [])];
        }

        this.hasMore = (result.data || []).length === this.pageSize;
      } catch (error) {
        console.error("Failed to fetch options:", error);
      } finally {
        this.loading = false;
      }
    },
    handleFocus() {
      if (this.options.length === 0) {
        this.page = 1;
        this.fetchData();
      }
    },
    handleChange(value) {
      this.$emit("change", value);
    },
    async handleToBottom() {
      if (!this.loading && this.hasMore) {
        this.page += 1;
        await this.fetchData(this.keyword);
      }
    },
  },
};
</script>

<style>
.virtual-select-dropdown {
  padding: 0 !important;
}

/* .virtual-select-wrapper {
  height: 100%;
  max-height: 274px;
} */
.virtual-select-wrapper {
  height: 164px;
  overflow: auto;
}
</style>
