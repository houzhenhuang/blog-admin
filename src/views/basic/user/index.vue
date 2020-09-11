<template>
  <section class="user-container">
    <!-- 工具条 -->
    <el-row>
      <el-col :span="12" class="toobar-form-left-panel">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="addDialogFormVisible=true">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="handleDisRole()">为用户分配角色</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" class="toobar-form-right-panel">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="toobarForm.keyworld" placeholder="昵称/登录名" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="getUsers()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table
      ref="userTable"
      highlight-current-row
      @current-change="handleCurrentRowChange"
      @selection-change="handleSelectionRowChange"
      v-loading="listLoading"
      :data="users"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="#" type="index" width="80"></el-table-column>
      <el-table-column prop="userName" label="用户名" />
      <!-- <el-table-column prop="realName" label="姓名" /> -->
      <el-table-column prop="roles" label="角色" sortable>
        <template slot-scope="scope">
          <el-tag v-for="role in scope.row.roles" :key="role" size="medium">
            {{
            role
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt width="30" height="30" />
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status == 1 ? 'success' : 'danger'"
            size="medium"
          >{{ scope.row.status == 1 ? '男' : '女' }}</el-tag>
        </template>
      </el-table-column>>
      <el-table-column prop="birthday" label="出生日期" :formatter="formatBirth" />
      <el-table-column prop="status" label="状态" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status==1?'success':'danger'"
            size="medium"
          >{{scope.row.status==1?"正常":"禁用"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
        :page-size="pageResult.pageSize"
        :total="pageResult.totalCount"
      ></el-pagination>
    </el-row>
    <!-- 新增对话框 -->
    <el-dialog title="新增" :visible.sync="addDialogFormVisible" :close-on-click-modal="true">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="realName">
          <el-input v-model="addForm.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="addForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addForm.password" show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日" :label-width="formLabelWidth" prop="birthday">
          <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birthday"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="addForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="addLoading">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="更新" :visible.sync="editDialogFormVisible" :close-on-click-modal="true">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="realName">
          <el-input v-model="editForm.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="editForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.status">
            <el-radio class="radio" :label="1">正常</el-radio>
            <el-radio class="radio" :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日" :label-width="formLabelWidth" prop="birthday">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birthday"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="editForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="addLoading">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="为用户分配角色"
      :visible.sync="disRoleDialogVisible"
      :close-on-click-modal="true"
      width="622px"
    >
      <el-transfer
        v-model="userRoles"
        :data="roles"
        :titles="['角色列表', '用户角色']"
        :props="{key:'id',label:'name'}"
      ></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="disRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="disRoleSubmit" :loading="disRolesLoading">提 交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getUsersByPage, addUser, editUser, deleteUser } from '@/api/user'
import { getRoles } from '@/api/role'
import { getRolesByUser, disRole } from '@/api/userRole'
import util from '@/utils/date'
export default {
  data() {
    return {
      users: [],
      toobarForm: {
        keyworld: '',
      },
      pageResult: {},
      pageIndex: 1,
      listLoading: true,
      addDialogFormVisible: false, //是否显示新增对话框
      addLoading: false, //
      addForm: {
        //新增表单
        realName: '',
        userName: '',
        password: '',
        sex: 1,
        age: 18,
        birthday: '',
        address: '',
      },
      addRules: {
        //新增表单规则
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        birthday: [{ required: true, message: '请填写生日', trigger: 'blur' }],
      },
      editDialogFormVisible: false, //是否显示编辑对话框
      editLoading: false, //更新时加载loading
      editForm: {
        id: 0,
        realName: '',
        userName: '',
        status: 1,
        sex: 1,
        age: 0,
        birthday: '',
        address: '',
      },
      editRules: {
        //新增表单规则
        realName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        userName: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
        ],
        birthday: [{ required: true, message: '请填写生日', trigger: 'blur' }],
      },
      formLabelWidth: '80px',
      selectionRows: [], //选中行信息
      disRoleDialogVisible: false, //分配角色
      disRolesLoading: false,
      roles: [],
      userRoles: [],
    }
  },
  mounted() {
    this.getUsers()
    this.getRoles()
  },
  methods: {
    getUsers() {
      const data = {
        pageIndex: this.pageIndex,
        keyworld: this.toobarForm.keyworld,
      }
      getUsersByPage(data).then((res) => {
        this.listLoading = false
        if (res.success) {
          let pageResult = res.data
          this.users = pageResult.data
          let { totalCount, pageIndex, pageCount, pageSize } = pageResult
          this.pageResult = { totalCount, pageIndex, pageCount, pageSize }
        }
      })
    },
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            addUser(this.addForm).then((res) => {
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success',
                })
                this.$refs['addForm'].resetFields()
                this.addDialogFormVisible = false
                this.getUsers()
              }
              this.addLoading = false
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
            editUser(this.editForm).then((res) => {
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success',
                })
                this.$refs['editForm'].resetFields()
                this.editDialogFormVisible = false
                this.getUsers()
              }
              this.editLoading = false
            })
          })
        }
      })
    },
    disRoleSubmit() {
      let { id } = this.selectionRows[0]
      let data = {
        userId: id,
        roleIds: this.userRoles,
      }
      disRole(data).then((res) => {
        if (res.success) {
          this.$message({
            message: res.message,
            type: 'success',
          })
          this.disRoleDialogVisible = false
          this.getUsers()
          this.getRoles()
        }
      })
    },
    getRoles() {
      getRoles({}).then((res) => {
        if (res.success) {
          this.roles = res.data
        }
      })
    },
    getRolesByUser(userId) {
      getRolesByUser({ userId: userId }).then((res) => {
        if (res.success && res.data) {
          this.userRoles = res.data.map((item) => {
            return item.id
          })
        }
      })
    },
    handleDisRole() {
      if (this.selectionRows.length != 1) {
        this.$message({
          message: '请选择一条数据',
          type: 'error',
        })
      } else {
        this.disRoleDialogVisible = true
        this.userRoles = []
        let { id } = this.selectionRows[0]
        this.getRolesByUser(id)
      }
    },
    handleCurrentRowChange(row) {
      this.$refs.userTable.clearSelection()
      this.selectionRows = []
      this.$refs.userTable.toggleRowSelection(row)
    },
    handleSelectionRowChange(rows) {
      this.selectionRows = rows
    },
    handleEdit(index, row) {
      this.editDialogFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    handleDelete(index, row) {
      let { id } = row
      this.$confirm('确认删除该条记录吗？', '提示', {}).then(() => {
        deleteUser({ id: id }).then((res) => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success',
            })
            this.getUsers()
          } else {
          }
        })
      })
    },
    formatBirth: function (row, column) {
      return !row.birthday || row.birthday == ''
        ? ''
        : util.formatDate.format(new Date(row.birthday), 'yyyy-MM-dd')
    },
  },
}
</script>
<style scoped>
.user-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 130px);
}
</style>>
