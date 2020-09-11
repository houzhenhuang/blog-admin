<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
body {
  background: #f6f8f9;
}
.toobar-form-left-panel {
  display: flex;
  justify-content: flex-start;
}
.toobar-form-right-panel {
  display: flex;
  justify-content: flex-end;
}
.el-form-item {
  margin: 5px;
  .el-input__inner {
    height: 32px;
    line-height: 32px;
    border-radius: 2px;
  }
  .el-form-item__content {
    line-height: 32px;
  }
  .el-button {
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 2px;
  }
}
.el-table th {
  padding: 0;
}
.el-table td {
  padding: 7.5px;
}
.el-table-column--selection .cell {
  padding-left: 2.5px;
  padding-right: 0;
}
.footerToolbar {
  text-align: center;
}
</style>
<script>
export default {
  name: 'App',
}
</script>
