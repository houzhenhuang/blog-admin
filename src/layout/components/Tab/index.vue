<template>
  <div class="tabs-container">
    <el-tabs
      v-model="tabActiveName"
      @tab-click="handleClick"
      @tab-remove="removeTab"
      @contextmenu.prevent.native="openMenu(this, $event)"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.meta.title"
        :label="tab.title"
        :name="tab.fullPath"
        :closable="tab.fullPath == '/home' ? false : true"
      >
        <span slot="label">
          <svg-icon v-show="tab.fullPath == '/home'" icon-class="home" />
          &nbsp;{{ tab.meta.title }}
        </span>
      </el-tab-pane>
    </el-tabs>
    <!-- 不能放tabs里面，不然会渲染多次router-view，使得vue组件的生命周期执行多次 -->
    <app-main />
    <ul
      v-show="visible"
      class="contextmenu"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li>
        <i
          class="el-icon-refresh-right"
          @click="refreshSelectedTab(selectedTab)"
        />刷新
      </li>
      <div class="el-divider el-divider--horizontal">
        <!---->
      </div>
      <li>
        <span>关闭</span>
      </li>
      <li><i class="el-icon-more" />关闭其它</li>
      <!---->
      <li><i class="el-icon-back" />关闭到左侧</li>
      <li>
        <span>关闭所有</span>
      </li>
    </ul>
  </div>
</template>

<script>
import AppMain from '../AppMain'
export default {
  components: { AppMain },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTab: {}
    }
  },
  computed: {
    tabs() {
      return this.$store.state.tabs.tabs
    },
    tabActiveName: {
      get: function() {
        return this.$store.getters.tabActiveName
      },
      set: function(val) {
        this.$store.dispatch('tabs/setActiveName', val)
      }
    }
  },
  watch: {
    $route() {
      this.addTab()
    }
  },
  mounted() {
    this.initTabs()
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    handleSelect(key, keyPath) {
      this.handleOpen(key, keyPath)
    },
    handleClick(tab, event) {
      if (tab.$route.fullPath === this.tabActiveName) return
      this.$router.replace(this.tabActiveName)
    },
    initTabs() {
      const { name, fullPath, meta } = this.$route
      if (name) {
        this.$store.dispatch('tabs/addTab', {
          fullPath,
          meta
        })
      }
    },
    addTab() {
      const { name, fullPath, meta } = this.$route
      // console.log(this.$route)
      if (name) {
        this.$store.dispatch('tabs/addTab', {
          fullPath,
          meta
        })
      }
      return false
    },
    removeTab(targetName) {
      this.$store.dispatch('tabs/delTab', targetName)
      if (this.tabActiveName === targetName) {
        this.$store.dispatch(
          'tabs/setActiveName',
          this.tabs[this.tabs.length - 1].fullPath
        )
        this.$router.replace(this.tabActiveName)
      }
    },
    openMenu(that, e) {
      // const menuMinWidth = 105
      // // const offsetLeft = this.$el.getBoundingClientRect().left  container margin left
      // const offsetWidth = this.$el.offsetWidth // container width
      // const maxLeft = offsetWidth - menuMinWidth // left boundary
      // console.log(e.clientX)
      // const left = e.clientX - 210 + 15
      // if (left > maxLeft) {
      //   this.left = maxLeft
      // } else {
      //   this.left = left
      // }
      // this.top = e.clientY
      // this.visible = true
    },
    refreshSelectedTab(tab) {
      this.$store.dispatch('tabs/delTab', tab).then(() => {
        const { fullPath } = tab
        this.$nextTick(() => {
          this.$router.replace({
            path: fullPath
          })
        })
      })
    }
  }
}
</script>
<style lang="scss">
.el-tabs__nav-scroll {
  padding-left: 15px;
}
.el-tabs__header{
    margin: 0 ;
  }
</style>
<style lang="scss" scoped>
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  border: 1px solid #ebeef5;
  -webkit-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  min-width: 130px;
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    i {
      margin-right: 8px;
      font-size: 14px;
      vertical-align: -1px;
      span {
        margin-left: 22px;
      }
    }
  }
  li:hover {
    background: #eee;
  }
  .el-divider--horizontal {
    margin: 5px 0;
  }
}
  .el-tabs{
    background: white;
  }
</style>
