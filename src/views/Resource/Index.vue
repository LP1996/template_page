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
            <el-button type="text" size="mini" @click="showUploadDialog(row.name)">更新</el-button>
            <el-button type="text" size="mini" @click="handleViewVersion(row.name)">查看版本</el-button>
            <el-button type="text" size="mini" @click="handleDelete(row.name)">删除</el-button>
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
          <el-upload ref="addUpload" action="" :limit="1" accept=".zip" :auto-upload="false">
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传 zip 文件</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <el-button :loading="addLoading" type="primary" @click="submitAdd">确定</el-button>
        <el-button @click="hideAddDialog">取消</el-button>
      </template>
    </el-dialog>

    <el-dialog :visible.sync="updateDialogVisible" title="更新资源" @close="resetUpdateForm">
      <el-form ref="updateForm" :model="updateForm" :rules="updateFormRules">
        <el-form-item prop="description" label="更新描述">
          <el-input v-model="updateForm.description" placeholder="请输入更新描述" />
        </el-form-item>
        <el-form-item label="文件" required>
          <el-upload ref="updateUpload" action="" :limit="1" accept=".zip" :auto-upload="false">
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传 zip 文件</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <el-button :loading="updateLoading" type="primary" @click="submitUpdate">确定</el-button>
        <el-button @click="hideUpdateDialog">取消</el-button>
      </template>
    </el-dialog>

    <el-dialog :visible.sync="versionDialogVisible" title="查看版本">
      <resource-versions :type="selectTypeName" :name="wantToViewVersionResourceName" />
    </el-dialog>
  </article>
</template>

<script>
import ResourceLeftList from './ResourceLeftList.vue'
import ResourceVersions from './ResourceVersions.vue'
import { getAllResources, addResource, deleteResource, downResource } from '../../api/index'

export default {
  name: 'Resource',
  components: { ResourceLeftList, ResourceVersions },
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
      },

      updateDialogVisible: false,
      updateLoading: false,
      updateForm: {
        name: '',
        description: ''
      },
      updateFormRules: {
        description: [{ required: true, message: '资源描述不能为空', trigger: 'blur' }]
      },

      versionDialogVisible: false,
      wantToViewVersionResourceName: ''
    }
  },
  computed: {
    selectTypeName() {
      return this.selectType ? this.selectType.name : ''
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
        if (!this.$refs.addUpload.uploadFiles.length) {
          this.$message.warning('请先选择要上传的资源文件')
          return
        }
        const formData = new FormData()
        formData.append('type', this.selectType.name)
        formData.append('name', this.addForm.name)
        formData.append('description', this.addForm.description)
        formData.append('file', this.$refs.addUpload.uploadFiles[0].raw)
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
      this.$refs.addUpload.uploadFiles = []
    },

    submitUpdate() {
      this.$refs.updateForm.validate(() => {
        if (!this.$refs.updateUpload.uploadFiles.length) {
          this.$message.warning('请先选择要上传的资源文件')
          return
        }
        const formData = new FormData()
        formData.append('type', this.selectType.name)
        formData.append('name', this.updateForm.name)
        formData.append('description', this.updateForm.description)
        formData.append('file', this.$refs.updateUpload.uploadFiles[0].raw)
        this.updateResource(formData)
      })
    },
    showUploadDialog(name) {
      this.updateForm.name = name
      this.updateDialogVisible = true
    },
    hideUpdateDialog() {
      this.updateDialogVisible = false
    },
    resetUpdateForm() {
      this.updateForm = {
        name: '',
        description: ''
      }
      this.$refs.updateUpload.uploadFiles = []
    },

    handleDelete(name) {
      const h = this.$createElement
      const _this = this
      this.$prompt(
        h('p', null, [
          '请输入资源名称确定删除: ',
          h('b', null, [name])
        ]),
        '警告',
        { 
          type: 'warning',
          confirmButtonClass: 'el-button--danger',
          inputValidator(val) {
            if (val !== name) {
              return '输入与资源名不一致'
            }

            return true
          },
          beforeClose(action, instance, done) {
            if (action === 'cancel') {
              done()
              return
            }

            _this.deleteResource(name).then(done)
          }
        }
      )
    },

    handleViewVersion(name) {
      this.wantToViewVersionResourceName = name
      this.versionDialogVisible = true
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
    },
    updateResource(formData) {
      this.updateLoading = true
      addResource(formData).then(() => {
        this.$message.success('更新成功')
        this.hideUpdateDialog()
        this.getResources()
      }).finally(() => (this.updateLoading = false))
    },
    deleteResource(name) {
      return deleteResource(this.selectType.name, name).then(() => {
        this.$message.success('删除成功')
        this.getResources()
      })
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
