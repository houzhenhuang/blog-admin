const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  expiration: state => state.user.expiration,
  avatar: state => state.user.avatar,
  realName: state => state.user.realName,
  tabs: state => state.tabs.tabs,
  tabActiveName: state => state.tabs.activeName,
  permisRoutes: state => state.permission.routes
}
export default getters
