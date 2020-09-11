<template>
  <section class="role-container">
    <!-- 工具条 -->
    <el-row>
      <el-col :span="12" class="toobar-form-left-panel">
        <el-form :inline="true" :model="toobarForm">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="addDialogFormVisible=true">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" class="toobar-form-right-panel">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="toobarForm.keyworld" placeholder="角色名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 列表  -->
    <el-table
      ref="roleTable"
      highlight-current-row
      @current-change="handleCurrentRowChange"
      @selection-change="handleSelectionRowChange"
      :data="roles"
      style="width: 100%"
      v-loading="listLoading"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="#" type="index" width="80"></el-table-column>
      <el-table-column prop="name" label="角色名称" sortable></el-table-column>
      <el-table-column prop="enabled" label="状态" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.enabled?'success':'danger'"
            size="medium"
          >{{scope.row.enabled?"正常":"禁用"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" :formatter="formatCreateTime" sortable></el-table-column>
      <el-table-column prop="remark" label="描述" sortable></el-table-column>
      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <el-row class="footerToolbar">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentPageChange"
        :page-size="pageResult.pageSize"
        :total="pageResult.totalCount"
      ></el-pagination>
    </el-row>

    <!-- 新增对话框 -->
    <el-dialog title="新增" :visible.sync="addDialogFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="addLoading">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="更新" :visible.sync="editDialogFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.enabled">
            <el-radio class="radio" :label="true">正常</el-radio>
            <el-radio class="radio" :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">提 交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getRolesByPage, addRole, editRole, deleteRole } from '@/api/role'
import util from '@/utils/date'
export default {
  data() {
    return {
      roles: [],
      pageResult: {},
      listLoading: true,
      toobarForm: {
        keyworld: '',
      },
      pageIndex: 1,
      addDialogFormVisible: false, //是否显示新增对话框
      addLoading: false, //
      addForm: {
        //新增表单
        name: '',
        remark: '',
      },
      addRules: {
        //新增表单规则
        name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      },
      editDialogFormVisible: false, //是否显示新增对话框
      editLoading: false, //
      editForm: {
        id: 0,
        name: '',
        enabled: true,
        remark: '',
      },
      editRules: {
        //新增表单规则
        name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      },
      formLabelWidth: '80px',
      selectionRows: [], //选中行信息
    }
  },
  mounted() {
    this.getRolesByPage()
  },
  methods: {
    handleEdit(index, row) {
      this.editDialogFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    handleDelete(index, row) {
      let { id } = row
      this.$confirm('确认删除该条记录吗？', '提示', {}).then(() => {
        deleteRole({ id: id }).then((res) => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success',
            })
            this.getRolesByPage()
          } else {
          }
        })
      })
    },
    formatCreateTime: function (row, column) {
      return !row.createTime || row.createTime == ''
        ? ''
        : util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd')
    },
    getRolesByPage() {
      let data = {
        pageIndex: this.pageIndex,
        keyworld: this.toobarForm.keyworld,
      }
      getRolesByPage(data).then((res) => {
        this.listLoading = false
        if (res.success) {
          let pageResult = res.data
          this.roles = pageResult.data
          let { totalCount, pageIndex, pageCount, pageSize } = pageResult
          this.pageResult = { totalCount, pageIndex, pageCount, pageSize }
        }
      })
    },
    onSearch() {
      this.getRolesByPage()
    },
    handleCurrentPageChange(pageIndex) {
      this.pageIndex = pageIndex
      this.getRolesByPage()
    },
    handleCurrentRowChange(row) {
      this.$refs.roleTable.clearSelection()
      this.selectionRows = []
      this.$refs.roleTable.toggleRowSelection(row)
    },
    handleSelectionRowChange(rows) {
      this.selectionRows = rows
    },
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            addRole(this.addForm).then((res) => {
              this.addLoading = false
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success',
                })
                this.$refs['addForm'].resetFields()
                this.addDialogFormVisible = false
                this.getRolesByPage()
              }
            })
          })
        }
      })
    },
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            editRole(this.editForm).then((res) => {
              this.editLoading = false
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success',
                })
                this.$refs['editForm'].resetFields()
                this.editDialogFormVisible = false
                this.getRolesByPage()
              } else {
              }
            })
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.role-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 130px);
}
</style>
