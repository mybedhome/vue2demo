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
    :remote="true"
    :remote-method="remoteMethod"
    :filterable="true"
    popper-class="virtual-select-dropdown"
  >
    <div class="virtual-select-wrapper2" v-if="options.length > 0">
      <virtual-list
        style="height: 160px; overflow-y: auto"
        :data-key="dataKey"
        :data-sources="options"
        :data-component="optionComponent"
        :estimate-size="34"
        :keeps="20"
        :extra-props="{
          valueKey,
          labelKey,
        }"
        @tobottom="loadMore"
      />
    </div>
    <el-option v-else :value="'loading'" :label="noDataText" disabled />
  </el-select>
</template>

<script>
import VirtualList from "vue-virtual-scroll-list";
import { debounce } from "lodash";
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
      default: false,
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
    this.remoteMethod = debounce(this.fetchData, 300);
  },
  methods: {
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
    loadMore() {
      if (!this.loading && this.hasMore) {
        this.page += 1;
        this.fetchData(this.keyword);
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
