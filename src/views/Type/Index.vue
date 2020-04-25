<template>
  <el-scrollbar class="height100">
    <article class="padding10">
      <el-table v-loading="loading" :data="tableData">
        <el-table-column prop="name" label="类型名" align="center" />
        <el-table-column prop="description" label="类型描述" align="center" />
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <el-button type="text" size="mini" @click="showUpdateDialog(row)">修改名称</el-button>
            <el-button type="text" size="mini" @click="showDeleteDialog(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="addDialogVisible" title="新增类型" @close="resetForms">
        <el-input v-model="addForm.name" placeholder="请输入新的类型名称" />
        <template v-slot:footer>
          <el-button :loading="addLoading" type="primary" @click="submitAdd">确定</el-button>
          <el-button @click="hideAddDialog">取消</el-button>
        </template>
      </el-dialog>

      <el-dialog :visible.sync="updateDialogVisible" title="修改类型名称" @close="resetForms">
        <el-input v-model="updateForm.newName" placeholder="请输入新的类型名称" />
        <template v-slot:footer>
          <el-button :loading="updateLoading" type="primary" @click="submitUpdate">确定</el-button>
          <el-button @click="hideUpdateDialog">取消</el-button>
        </template>
      </el-dialog>

      <el-dialog :visible.sync="deleteDialogVisible" title="删除类型">
        <span>
          <span class="delete-warn">警告:</span> 
          删除类型是很危险的行为，会导致该类型下的所有资源文件全部被删除，如果确定需要删除，请在下方输入框输入当前类型的名称:
          <b>{{ wantToDeleteType ? wantToDeleteType.name : '' }}</b>
        </span>
        <el-input v-model="inputWantToDeleteTypeName" placeholder="输入要删除的类型名称" />
        <template v-slot:footer>
          <el-button :loading="deleteLoading" type="danger" @click="submitDelete">确定</el-button>
          <el-button @click="hideDeleteDialog">取消</el-button>
        </template>
      </el-dialog>
    </article>
  </el-scrollbar>
</template>

<script>
import { getAllTypes, addType, updateType, deleteType } from '../../api'

export default {
  name: 'Type',
  data() {
    return {
      loading: true,
      addLoading: false,
      updateLoading: false,
      deleteLoading: false,

      tableData: [],
      updateForm: {
        oldName: '',
        newName: ''
      },
      addForm: {
        name: ''
      },
      updateDialogVisible: false,
      addDialogVisible: false,

      deleteDialogVisible: false,
      wantToDeleteType: null,
      inputWantToDeleteTypeName: ''
    }
  },
  created() {
    this.getAllTypes()
  },
  methods: {
    submitUpdate() {
      const { oldName, newName } = this.updateForm
      if (!newName) {
        this.$message.warning('请输入新的类型名称')
        return
      }

      if (oldName === newName) {
        this.$message.warning('新的类型名称和旧的一致，请检查')
        return
      }

      this.updateTypeName(oldName, newName)
    },
    showUpdateDialog({ name }) {
      this.updateForm.oldName = name
      this.updateDialogVisible = true
    },
    hideUpdateDialog() {
      this.updateDialogVisible = false
    },

    submitAdd() {
      const { name } = this.addForm

      if (!name) {
        this.$message.warning('请输入要添加的类型的名称')
        return
      }

      this.addType(name)
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    hideAddDialog() {
      this.addDialogVisible = false
    },

    submitDelete() {
      const { wantToDeleteType: { name }, inputWantToDeleteTypeName } = this

      if (name !== inputWantToDeleteTypeName) {
        this.$message.warning('输入名称不一致，请检查')
        return
      }

      this.deleteType(name)
    },
    showDeleteDialog(type) {
      this.wantToDeleteType = type
      this.deleteDialogVisible = true
    },
    hideDeleteDialog() {
      this.deleteDialogVisible = false
    },
    handleDeleteDialogClose() {
      this.wantToDeleteType = null
      this.inputWantToDeleteTypeName = ''
    },

    resetForms() {
      this.updateForm = {
        oldName: '',
        newName: ''
      }
      this.addForm = { name: '' }
    },
    getAllTypes() {
      this.loading = true
      getAllTypes().then(types => {
        this.tableData = types
      }).finally(() => (this.loading = false))
    },
    addType(name) {
      this.addLoading = true
      addType(name).then(() => {
        this.getAllTypes()
        this.$message.success('添加成功')
      }).finally(() => (this.addLoading = false))
    },
    updateTypeName(oldName, newName) {
      this.updateLoading = true
      updateType(oldName, newName).then(() => {
        this.getAllTypes()
        this.$message.success('修改成功')
      }).finally(() => (this.updateLoading = false))
    },
    deleteType(name) {
      this.deleteLoading = true
      deleteType(name).then(() => {
        this.$message.success('删除成功')
        this.hideDeleteDialog()
        this.getAllTypes()
      }).finally(() => (this.deleteLoading = false))
    }
  }
}
</script>

<style scoped>

</style>
