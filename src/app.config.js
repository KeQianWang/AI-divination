export default defineAppConfig({
  pages: ["pages/home/index", "pages/chat/index", "pages/login/index"],
  window: {
    backgroundTextStyle: "light",
    navigationStyle: "custom", // 使用自定义导航栏
    navigationBarBackgroundColor: "#fff",
    navigationBarTextStyle: "black",
  },

  tabBar: {
    custom: true,
    color: "#666",
    selectedColor: "#007AFF",
    backgroundColor: "#fff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/home/index",
        text: "卜卦",
        iconPath: "assets/images/divination.png",
        selectedIconPath: "assets/images/selected-divination.png",
      },
      {
        pagePath: "pages/chat/index",
        text: "大师算命",
        iconPath: "assets/images/chat.png",
        selectedIconPath: "assets/images/selected-chat.png",
      },
    ],
  },
});
