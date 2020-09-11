<template>
  <section class="menu-container">
    <!-- 工具条 -->
    <el-col class="toolbar toobar-form-left-panel">
      <el-form :inline="true" :model="toobarForm">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addDialogFormVisible=true;getApiResources()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- 列表  -->
    <el-table
      ref="menuTable"
      highlight-current-row
      @current-change="handleCurrentRowChange"
      @selection-change="handleSelectionRowChange"
      :data="menus"
      style="width: 100%;"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      v-loading="listLoading"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="#" type="index" width="80"></el-table-column>
      <el-table-column prop="name" label="菜单名称" sortable>
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column prop="route" label="路由地址" sortable></el-table-column>
      <el-table-column prop="sort" label="排序" sortable width="100"></el-table-column>
      <el-table-column prop="enabled" label="状态" sortable width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.enabled==true?'success':'danger'"
            size="medium"
          >{{scope.row.enabled==true?"正常":"禁用"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" :formatter="formatCreateTime" sortable></el-table-column>
      <el-table-column prop="remark" label="描述" sortable></el-table-column>
      <el-table-column prop="status" label="操作" width="160">
        <template slot-scope="scope" >
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增对话框 -->
    <el-dialog title="新增" :visible.sync="addDialogFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标识码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="addForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" :label-width="formLabelWidth" prop="route">
          <el-input v-model="addForm.route" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="api接口" :label-width="formLabelWidth">
          <el-select style="width: 100%;" v-model="addForm.apiResourceId" placeholder="请选择">
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
          <!-- <el-input v-model="addForm.linkUrl" autocomplete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="父级菜单" :label-width="formLabelWidth">
          <el-cascader
            :options="menus"
            :props="parentMenuProps"
            v-model="addForm.parentIds"
            popper-class="请选择"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="菜单类型" :label-width="formLabelWidth">
          <el-select v-model="addForm.typeId" placeholder="请选择类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.Name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="addForm.enabled" placeholder="请选择状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.Name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="addForm.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input-number v-model="addForm.sort" :min="0" :max="200"></el-input-number>
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
        <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标识码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="editForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" :label-width="formLabelWidth" prop="route">
          <el-input v-model="editForm.route" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="api接口" :label-width="formLabelWidth">
          <el-select style="width: 100%;" v-model="editForm.apiResourceId" placeholder="请选择">
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
          <!-- <el-input v-model="addForm.linkUrl" autocomplete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="父级菜单" :label-width="formLabelWidth">
          <el-cascader
            :options="menus"
            :props="parentMenuProps"
            v-model="editForm.parentIds"
            popper-class="请选择"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="editForm.enabled" placeholder="请选择状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.Name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="editForm.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input-number v-model="editForm.sort" :min="0" :max="200"></el-input-number>
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
import { getMenus, addMenu, editMenu, deleteMenu } from '@/api/menu'
import { getApiResources } from '@/api/apiResource'
import util from '@/utils/date'
export default {
  data() {
    return {
      menus: [],
      apiResources: [],
      listLoading: true,
      toobarForm: {},
      pageIndex: 1,
      addDialogFormVisible: false, //是否显示新增对话框
      addLoading: false, //
      addForm: {
        name: '',
        code: '',
        route: '',
        linkUrl: '',
        enabled: true,
        typeId: 1,
        apiResourceId: 0,
        parentIds: [0],
        icon: '',
        sort: 0,
        remark: '',
      },
      statusList: [
        { Name: '激活', value: true },
        { Name: '禁用', value: false },
      ],
      typeList: [
        { Name: '菜单', value: 1 },
        { Name: '按钮', value: 2 },
      ],
      addRules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        route: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
        code: [{ required: true, message: '请输入标识码', trigger: 'blur' }],
      },
      editDialogFormVisible: false, //是否显示新增对话框
      editLoading: false, //
      editForm: {
        id: 0,
        name: '',
        route: '',
        linkUrl: '',
        enabled: true,
        typeId: 1,
        apiResourceId: 0,
        parentIds: [0],
        icon: '',
        sort: 0,
        remark: '',
      },
      editRules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        route: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
      },
      formLabelWidth: '80px',
      selectionRows: [], //选中行信息
      parentMenuProps: {
        checkStrictly: true,
        label: 'name',
        value: 'id',
      },
    }
  },
  mounted() {
    this.getMenus()
  },
  methods: {
    handleEdit(index, row) {
      this.getApiResources()
      this.editDialogFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    handleDelete(index, row) {
      let { id } = row
      this.$confirm('确认删除该条记录吗？', '提示', {}).then(() => {
        deleteMenu({ id: id }).then((res) => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success',
            })
            this.getMenus()
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
    getMenus() {
      getMenus({}).then((res) => {
        this.listLoading = false
        if (res.success) {
          this.menus = res.data
        }
      })
    },
    getApiResources() {
      getApiResources({}).then((res) => {
        this.listLoading = false
        if (res.success) {
          this.apiResources = res.data
        }
      })
    },
    handleCurrentPageChange(pageIndex) {
      this.pageIndex = pageIndex
      this.getMenus()
    },
    handleCurrentRowChange(row) {
      this.$refs.menuTable.clearSelection()
      this.selectionRows = []
      this.$refs.menuTable.toggleRowSelection(row)
    },
    handleSelectionRowChange(rows) {
      this.selectionRows = rows
    },
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            let addParam = Object.assign({}, this.addForm)
            addParam.parentId = this.addForm.parentIds.pop()
            addMenu(addParam).then((res) => {
              this.addLoading = false
              if (res.success) {
                this.getMenus()
                this.$refs['addForm'].resetFields()
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
          editParam.parentId = this.editForm.parentIds.pop()
          if (editParam.id == editParam.parentId) {
            this.$message({
              message: '父级菜单不能选择自己',
              type: 'warning',
            })
            return
          }
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            editMenu(editParam).then((res) => {
              this.editLoading = false
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success',
                })
                this.$refs['editForm'].resetFields()
                this.editDialogFormVisible = false
                this.getMenus()
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
.menu-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 130px);
}
</style>
