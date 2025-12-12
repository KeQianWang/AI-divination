export default defineAppConfig({
  pages: ["pages/home/index", "pages/chat/index", "pages/login/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "AI 卜卦",
    navigationBarTextStyle: "black",
  },

  tabBar: {
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
        text: "大师对话",
        iconPath: "assets/images/chat.png",
        selectedIconPath: "assets/images/selected-chat.png",
      },
    ],
  },
});
