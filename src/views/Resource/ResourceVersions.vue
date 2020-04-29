<template>
  <el-table v-loading="loading" :data="tableData">
    <el-table-column prop="type" label="操作类型" align="center" />
    <el-table-column prop="date" label="操作日期" min-width="100px" align="center" />
    <el-table-column prop="description" label="操作描述" align="center" />
    <el-table-column prop="filename" label="版本资源名" align="center" />
    <el-table-column label="操作" align="center" >
      <template v-slot="{ row }">
        <el-button type="text" size="mini" @click="downResource(row.filename)">下载</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getResourceVersion, downResource } from '../../api/index'

export default {
  name: 'ResourceVersions',
  props: {
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tableData: [],
      loading: false  
    }
  },
  watch: {
    name: {
      immediate: true,
      handler(newVal) {
        if (!newVal) {
          return
        }

        this.getResourceVersion(this.type, newVal)
      }
    }
  },
  methods: {
    getResourceVersion(type, name) {
      this.loading = true
      getResourceVersion(type, name)
        .then(versions => { this.tableData = versions })
        .finally(() => (this.loading = false))
    },
    downResource(version) {
      downResource(this.type, this.name, version).then(blob => {
        const a = document.createElement('a')
        const url = URL.createObjectURL(blob)
        a.download = `${version}`
        a.href = url
        a.click()
      })
    }
  }
}
</script>

<style scoped>

</style>
