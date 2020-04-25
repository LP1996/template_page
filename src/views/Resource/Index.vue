<template>
  <article class="resource height100">
    <el-scrollbar class="resource__left-list height100">
      <resource-left-list v-model="selectType" />
    </el-scrollbar>

    <el-scrollbar class="resource__right height100 padding10">
      <div>
        <el-button type="primary" size="small" @click="showAddDialog">新增资源</el-button>
      </div>
      <el-table v-loading="loading" :data="tableData">
        <el-table-column prop="name" label="资源名" align="center" />
        <el-table-column prop="description" label="资源描述" align="center" />
        <el-table-column label="操作" align="center" >
          <template v-slot="{ row }">
            <el-button type="text" size="mini" @click="downResource(row.name)">下载</el-button>
            <el-button type="text" size="mini">更新名称</el-button>
            <el-button type="text" size="mini">查看版本</el-button>
            <el-button type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-dialog :visible.sync="addDialogVisible" title="新增资源" @close="resetAddForm">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules">
        <el-form-item prop="name" label="资源名">
          <el-input v-model="addForm.name" placeholder="请输入资源名" />
        </el-form-item>
        <el-form-item prop="description" label="资源描述">
          <el-input v-model="addForm.description" placeholder="请输入资源描述" />
        </el-form-item>
        <el-form-item label="文件" required>
          <el-upload ref="upload" action="" :limit="1" accept=".zip" :auto-upload="false">
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传 zip 文件</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <el-button type="primary" @click="submitAdd">确定</el-button>
        <el-button @click="hideAddDialog">取消</el-button>
      </template>
    </el-dialog>
  </article>
</template>

<script>
import ResourceLeftList from './ResourceLeftList.vue'
import { getAllResources, updateResource, addResource, deleteResource, downResource, getResourceVersion } from '../../api/index'

export default {
  name: 'Resource',
  components: { ResourceLeftList },
  data() {
    return {
      selectType: null,

      loading: false,
      tableData: [],

      addDialogVisible: false,
      addLoading: false,
      addForm: {
        name: '',
        description: ''
      },
      addFormRules: {
        name: [{ required: true, message: '资源名不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '资源描述不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    selectType(val) {
      if (!val) {
        this.tableData = []
        return
      }

      this.getResources()
    }
  },
  methods: {
    submitAdd() {
      this.$refs.addForm.validate().then(() => {
        if (!this.$refs.upload.uploadFiles.length) {
          this.$message.warning('请先选择要上传的资源文件')
          return
        }
        const formData = new FormData()
        formData.append('type', this.selectType.name)
        formData.append('name', this.addForm.name)
        formData.append('description', this.addForm.description)
        formData.append('file', this.$refs.upload.uploadFiles[0].raw)
        this.addResource(formData)
      })
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    hideAddDialog() {
      this.addDialogVisible = false
    },
    resetAddForm() {
      this.addForm = {
        name: '',
        description: ''
      }
      this.$refs.upload.uploadFiles = []
    },

    downResource(name) {
      downResource(this.selectType.name, name).then(blob => {
        const a = document.createElement('a')
        const url = URL.createObjectURL(blob)
        a.download = `${name}.zip`
        a.href = url
        a.click()
      })
    },
    getResources() {
      const { name } = this.selectType
      this.loading = true
      getAllResources(name).then(resources => {
        this.tableData = resources
      }).finally(() => (this.loading = false))
    },
    addResource(formData) {
      this.addLoading = true
      addResource(formData).then(() => {
        this.$message.success('新增成功')
        this.hideAddDialog()
        this.getResources()
      }).finally(() => (this.addLoading = false))
    }
  }
}
</script>

<style scoped>
.resource {
  display: flex;
  overflow: hidden;
}

.resource__left-list {
  flex-shrink: 0;
  width: 200px;
  border: 1px solid #e5e5e5;
  margin-right: 20px;
}

/deep/.resource__left-list .el-scrollbar__view {
  padding-top: 5px;
}

.resource__right {
  flex: 1;
}
</style>
