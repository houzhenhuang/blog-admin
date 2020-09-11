<template>
  <section>
    <el-card class="menu-box">
      <div slot="header" class="clearfix">
        <span>菜单树</span>
      </div>
      <div class="block">
        <el-tree
          :data="menus"
          node-key="id"
          ref="menusTree"
          default-expand-all
          highlight-current
          @node-click="handleMenuClick"
        >
          <span class="permis-tree-node" slot-scope="{ data }">
            <span>{{data.name}}</span>
          </span>
        </el-tree>
      </div>
    </el-card>
    <el-card class="operation-box">
      <div slot="header" class="clearfix">
        <span>功能列表</span>
        <!-- <el-form :inline="true" style="float: right; padding: 3px 0">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="handleAddOperation()">新增</el-button>
          </el-form-item>
        </el-form>-->
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="handleAddOperation"
          :loading="addOperationLoading"
        >新增</el-button>
      </div>
      <div class="block">
        <el-table
          ref="operationTable"
          highlight-current-row
          @current-change="handleCurrentRowChange"
          @selection-change="handleSelectionRowChange"
          v-loading="operationsLoading"
          :data="operations"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="#" type="index" width="80"></el-table-column>
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="code" label="标识" />
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 新增对话框 -->
    <el-dialog title="新增" :visible.sync="addDialogFormVisible" :close-on-click-modal="true">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标识码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="addForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="api接口" :label-width="formLabelWidth">
          <el-select
            style="width: 100%;"
            filterable
            v-model="addForm.apiResourceId"
            placeholder="请选择"
          >
            <el-option :key="0" :value="0" :label="'无需api'"></el-option>
            <el-option
              v-for="item in apiResources"
              :key="item.id"
              :label="item.linkUrl"
              :value="item.id"
            >
              <span style="float: left">{{ item.linkUrl }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属菜单" :label-width="formLabelWidth">
          <el-cascader
            :options="menus"
            :props="parentMenuProps"
            disabled
            v-model="selectMenuId"
            popper-class="请选择"
          ></el-cascader>
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
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标识码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="editForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="api接口" :label-width="formLabelWidth">
          <el-select
            style="width: 100%;"
            filterable
            v-model="editForm.apiResourceId"
            placeholder="请选择"
          >
            <el-option :key="0" :value="0" :label="'无需api'"></el-option>
            <el-option
              v-for="item in apiResources"
              :key="item.id"
              :label="item.linkUrl"
              :value="item.id"
            >
              <span style="float: left">{{ item.linkUrl }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属菜单" :label-width="formLabelWidth">
          <el-cascader
            :options="menus"
            :props="parentMenuProps"
            :value="editForm.menuId"
            popper-class="请选择"
          ></el-cascader>
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
import { getMenus } from '@/api/menu'
import {
  getOperationsByMenuId,
  addOperation,
  editOperation,
  deleteOperation,
} from '@/api/operation'
import { getApiResources } from '@/api/apiResource'
export default {
  data() {
    return {
      menus: [],
      operations: [],
      apiResources: [],
      operationsLoading: false,
      selectMenuId: 0,
      addDialogFormVisible: false, //是否显示新增对话框
      addLoading: false, //
      addForm: {
        name: '',
        code: '',
        menuId: 0,
        apiResourceId: 0,
      },
      addRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
      editDialogFormVisible: false, //是否显示新增对话框
      editLoading: false, //
      editForm: {
        id: 0,
        name: '',
        code: '',
        menuId: 0,
        apiResourceId: 0,
      },
      editRules: {
        name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      },
      formLabelWidth: '80px',
      parentMenuProps: {
        label: 'name',
        value: 'id',
      },
      addOperationLoading: false,
    }
  },
  mounted() {
    this.getMenus()
  },
  methods: {
    getMenus() {
      getMenus({}).then((res) => {
        // this.listLoading = false
        if (res.success) {
          this.menus = res.data
        }
      })
    },
    getOperationsByMenuId() {
      this.operationsLoading = true
      getOperationsByMenuId({ menuId: this.selectMenuId }).then((res) => {
        this.operationsLoading = false
        if (res.success) {
          this.operations = res.data
        }
      })
    },
    getApiResources() {
      getApiResources({}).then((res) => {
        if (res.success) {
          this.apiResources = res.data
        }
      })
    },
    handleMenuClick(data) {
      if (data.children == null) {
        this.selectMenuId = data.id
        this.getOperationsByMenuId()
      } else {
        this.selectMenuId = 0
      }
    },
    handleCurrentRowChange(row) {
      //   this.$refs.userTable.clearSelection()
      //   this.selectionRows = []
      //   this.$refs.userTable.toggleRowSelection(row)
    },
    handleSelectionRowChange(rows) {
      //   this.selectionRows = rows
    },
    handleAddOperation() {
      if (this.selectMenuId <= 0) {
        this.$message({
          message: '请选择菜单项',
          type: 'warning',
        })
        return
      }
      this.addDialogFormVisible = true
      this.getApiResources()
    },
    handleEdit(index, row) {
      this.editDialogFormVisible = true
      this.editForm = Object.assign({}, row)
      this.getApiResources()
    },
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            let addParam = Object.assign({}, this.addForm)
            addParam.menuId = this.selectMenuId
            addOperation(addParam).then((res) => {
              this.addLoading = false
              if (res.success) {
                this.getOperationsByMenuId()
                this.$refs['addForm'].resetFields()
                this.addForm.apiResourceId = 0
                this.addDialogFormVisible = false
                this.$message({
                  message: res.message,
                  type: 'success',
                })
              } else {
              }
            })
          })
        }
      })
    },
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let editParam = Object.assign({}, this.editForm)
          editParam.menuId = this.editForm.menuId.pop()
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            editOperation(editParam).then((res) => {
              this.editLoading = false
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success',
                })
                this.$refs['editForm'].resetFields()
                this.editForm.apiResourceId = 0
                this.editDialogFormVisible = false
                this.getOperationsByMenuId()
              }
            })
          })
        }
      })
    },
    handleDelete(index, row) {
      let { id } = row
      this.$confirm('确认删除该条记录吗？', '提示', {}).then(() => {
        deleteOperation({ id: id }).then((res) => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success',
            })
            this.getOperationsByMenuId()
          }
        })
      })
    },
  },
}
</script>

<style scoped>
.menu-box {
  float: left;
  width: 30%;
  height: 100%;
}
</style>