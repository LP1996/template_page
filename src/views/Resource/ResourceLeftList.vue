<template>
  <ul v-loading="">
    <li 
      v-for="type in listData" 
      :key="type.name"
      :class="{ active: selectValue && (type.name === selectValue.name) }"
      class="list-item"
      @click="handleItemClick(type)"
    >
      {{ type.name }}
    </li>
  </ul>
</template>

<script>
import { getAllTypes } from '../../api/index'

export default {
  name: 'ResourceLeftList',
  props: {
    value: {
      required: true,
      validator(val) {
        return val instanceof Object || val === null
      }
    }
  },
  data() {
    return {
      loading: false,
      listData: [],
      selectValue: null
    }
  },
  created() {
    this.getAllTypes()
  },
  methods: {
    handleItemClick(type) {
      this.selectValue = type
      this.$emit('input', type)
    },

    getAllTypes() {
      this.loading = true
      getAllTypes().then(types => {
        this.listData = types

        // 默认选中第一个
        if (types.length) {
          this.selectValue = types[0]
        }

        // 触发 v-model
        this.$emit('input', types[0] || null)
      }).finally(() => (this.loading = false))
    }
  }
}
</script>

<style scoped>
.list-item {
  padding: 5px 10px;
  font-size: 14px;
  color: #444;
  cursor: pointer;
}

.list-item:hover {
  background-color: #f0f0f0;
}

.list-item.active {
  color: #fff;
  background-color: #409eff;
}
</style>
