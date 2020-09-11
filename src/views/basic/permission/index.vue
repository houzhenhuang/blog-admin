<template>
  <section class="permis-box">
    <el-card class="role-box">
      <div slot="header" class="clearfix">
        <span>角色列表</span>
        <el-button
          style="float: right; padding: 3px 0"
          :loading="loadingRole"
          type="text"
          @click="refresh"
        >{{loadingRoleName}}</el-button>
      </div>
      <div
        v-for="role in roles"
        :key="role.id"
        @click="selRole(role.id)"
        :class="[`text`,`item`,{'active':role.id==roleId}]"
      >{{ role.name }}</div>
    </el-card>
    <el-card class="menu-box">
      <div slot="header" class="clearfix">
        <span>权限列表</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="savePermis"
          :loading="loadingSave"
        >{{loadingSaveName}}</el-button>
      </div>
      <div class="block">
        <el-tree
          :data="moduleOperations"
          show-checkbox
          node-key="id"
          ref="permisTree"
          default-expand-all
          :expand-on-click-node="true"
          :check-strictly="true"
        >
          <span class="permis-tree-node" slot-scope="{ data }">
            <span>{{data.name}}</span>
            <span>
              <el-checkbox-group v-model="permisOperations">
                <el-checkbox
                  v-for="opera in data.operations"
                  :key="opera.id"
                  :label="opera.id"
                >{{opera.name}}</el-checkbox>
              </el-checkbox-group>
            </span>
          </span>
        </el-tree>
      </div>
    </el-card>
  </section>
</template>

<script>
import { getRoles } from '@/api/role'
import { getPermissions } from '@/api/permission'
import { getRolePermissions, saveRolePermission } from '@/api/rolePermission'
export default {
  data() {
    return {
      loadingSave: false,
      loadingSaveName: '保存',
      loadingRole: false,
      loadingRoleName: '刷新',
      roles: [],
      roleId: 1,
      moduleOperations: [],
      permisModules: [3, 5], //权限菜单
      permisOperations: [1], //功能权限
    }
  },
  mounted() {
    this.loadingRole = true
    this.loadingRoleName = '加载中...'
    this.loadingSave = true
    this.loadingSaveName = '加载中...'
    this.getRoles()
  },
  methods: {
    selRole(roleId) {
      this.roleId = roleId
      this.getRolePermissions()
    },
    refresh() {
      this.getRoles()
    },
    savePermis() {
      // let checkedNodes = this.$refs.permisTree.getCheckedNodes();
      // let permisIds = [];
      // checkedNodes.map(node => {
      //   permisIds.push(node.id);
      //   let parentNode = this.$refs.permisTree.getNode(node.parentId);
      //   while (parentNode != null) {
      //     if (permisIds.indexOf(parentNode.data.id) <= -1) {
      //       permisIds.push(parentNode.data.id);
      //     }
      //     parentNode = this.$refs.permisTree.getNode(parentNode.data.parentId);
      //   }
      // });
      let checkedKeys = this.$refs.permisTree.getCheckedKeys()
      this.saveRolePermission(checkedKeys.concat(this.permisOperations))
    },
    getRoles() {
      getRoles({}).then((res) => {
        this.loadingRole = false
        this.loadingRoleName = '刷新'
        if (res.success) {
          this.roles = res.data
          this.roleId = res.data[0].id

          this.getPermissions()
        }
      })
    },
    getPermissions() {
      getPermissions({}).then((res) => {
        if (res.success) {
          this.moduleOperations = res.data
          this.getRolePermissions()
        }
      })
    },
    getRolePermissions() {
      getRolePermissions({ roleId: this.roleId }).then((res) => {
        this.loadingSave = false
        this.loadingSaveName = '保存'
        if (res.success) {
          this.$refs.permisTree.setCheckedKeys(res.data.permissionMenuIds)
          this.permisOperations = res.data.permissionOperationIds
        }
      })
    },
    saveRolePermission(permisIds) {
      this.loadingSave = true
      this.loadingSaveName = '保存中...'
      saveRolePermission({
        roleId: this.roleId,
        permissionIds: permisIds,
      }).then((res) => {
        this.loadingSave = false
        this.loadingSaveName = '保存'
        if (res.success) {
          this.getRolePermissions()
          this.$message({
            message: res.message,
            type: 'success',
          })
        } else {
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.role-box,
.menu-box {
  height: 100%;
  float: left;
  // position: absolute;
}
.role-box {
  width: 30%;
  .item {
    cursor: pointer;
    padding: 10px 10px;
  }
  .item:hover {
    background: #ebf5ff;
  }
}
.active {
  background: #ebf5ff;
}
.menu-box {
  width: 70%;
  right: 0;
  .permis-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.el-tree-node__content {
  height: auto;
}
</style>
