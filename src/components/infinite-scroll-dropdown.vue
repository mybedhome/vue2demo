<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :multiple="multiple"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="true"
    :filter-method="remoteMethod"
    v-bind="$attrs"
    @focus="handleFocus"
    @change="handleChange"
    @visible-change="handleVisibleChange"
    @keyup.enter.native="handleEnter"
    popper-class="virtual-select-dropdown"
  >
    <div v-if="localOptions.length > 0">
      <virtual-list
        style="max-height: 274px; overflow-y: auto"
        ref="virtualList"
        :data-key="valueKey"
        :data-sources="localOptions"
        :data-component="optionComponent"
        :estimate-size="34"
        :keeps="20"
        :extra-props="{
          valueKey,
          labelKey,
        }"
        footer-class="virtual-footer"
        @tobottom="handleToBottom"
      >
        <template #footer>
          <div v-if="loading && hasMore" class="bottom-loading">
            <div class="loading-spinner"></div>
          </div>
        </template>
      </virtual-list>
    </div>

    <el-option
      v-else
      :value="'loading'"
      :label="noDataText"
      disabled
      class="loading-option"
    >
      <template v-if="loading">
        <div class="loading-spinner"></div>
      </template>
      <template v-else>
        {{ noDataText }}
      </template>
    </el-option>
  </el-select>
</template>

<script>
import VirtualList from "vue-virtual-scroll-list";
// import { debounce } from "lodash";
import { h } from "vue";

function uniqBy(array, iteratee) {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.reduce((acc, current) => {
    // 使用 iteratee 函数或属性来获取当前元素的唯一标识
    const key =
      typeof iteratee === "function" ? iteratee(current) : current[iteratee];

    // 检查是否已经存在具有相同标识的元素
    if (
      !acc.some((item) => {
        const itemKey =
          typeof iteratee === "function" ? iteratee(item) : item[iteratee];
        return itemKey === key;
      })
    ) {
      acc.push(current);
    }

    return acc;
  }, []);
}

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
    fetchMethod: {
      type: Function,
      required: true,
    },
    lazy: {
      type: Boolean,
      default: true,
    },
    valueKey: {
      type: String,
      default: "id",
    },
    labelKey: {
      type: String,
      default: "name",
    },
    pageSize: {
      type: Number,
      default: 20,
    },
    options: {
      type: Array,
      default: () => [],
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
    placeholder: {
      type: String,
      default: "请选择",
    },
    noDataText: {
      type: String,
      default: "无数据",
    },
  },
  data() {
    return {
      selectedValue: this.value,
      localOptions: [],
      loading: false,
      queryText: "",
      page: 1,
      hasMore: true,
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
    options: {
      immediate: true,
      handler(val) {
        this.localOptions = uniqBy(val, this.valueKey);
      },
    },
  },
  created() {
    // 给el-select的filter-method赋一个空函数，避免本地搜索
    this.remoteMethod = () => {};
  },
  methods: {
    clearOptions() {
      this.localOptions = [];
      this.selectedValue = this.multiple ? [] : "";
    },
    handleEnter(evt) {
      this.page = 1;
      this.localOptions = [];
      this.hasMore = true;
      this.fetchData(evt.target.value);
    },
    async handleVisibleChange(visible) {
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
          const firstSelectedIndex = this.localOptions.findIndex((item) =>
            selectedValues.includes(item[this.valueKey])
          );

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
      if ((!this.hasMore && this.queryText === query) || !this.lazy) return;

      this.queryText = query;
      this.loading = true;

      try {
        const result = await this.fetchMethod({
          page: this.page,
          pageSize: this.pageSize,
          queryText: this.queryText,
        });
        const data = result.records || result.items || result.data || [];
        this.localOptions = uniqBy(
          [...this.localOptions, ...data],
          this.valueKey
        );
        this.hasMore = data.length === this.pageSize;
      } catch (error) {
        console.error("列表数据获取失败: ", error);
      } finally {
        this.loading = false;
      }
    },
    handleFocus() {
      if (this.localOptions.length === 0) {
        this.page = 1;
        this.fetchData();
      }
    },
    handleChange(value) {
      const selected = this.localOptions.filter((item) => {
        return this.multiple
          ? value.includes(item[this.valueKey])
          : item[this.valueKey] === value;
      });
      this.$emit("change", selected);
    },
    async handleToBottom() {
      if (!this.loading && this.hasMore) {
        this.page += 1;
        await this.fetchData(this.queryText);
      }
    },
  },
};
</script>

<style>
.virtual-select-dropdown {
  padding: 0 !important;
  .el-select-dropdown__list {
    padding: 0;
  }
  .el-select-dropdown__item.is-disabled {
    cursor: not-allowed;
    padding-right: 0;
  }
  .virtual-footer {
    position: relative;
  }
}
</style>

<style scoped>
.loading-option {
  padding-right: 0 !important;
  padding-left: 0 !important;
  cursor: not-allowed;
  text-align: center;
}
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  vertical-align: middle;
  display: inline-block;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.bottom-loading {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 34px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
</style>
