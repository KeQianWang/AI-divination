import { Popup } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { getRecentChats } from "../../services/chat";
import useNavBarHeight from "../../hooks/useNavBarHeight";
import "./index.less";

const CustomNavBar = ({ title = "AI 卜卦" }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { text: "卜卦", url: "/pages/home/index" },
  ]);
  const { statusBarHeight, navBarHeight } = useNavBarHeight();


  const fetchChatHistory = async () => {
    try {
      const token = Taro.getStorageSync("token");
      if (!token) {
        return;
      }

      const response = await getRecentChats(7);

      const chatsList = response?.chats || (Array.isArray(response) ? response : []);

      if (Array.isArray(chatsList) && chatsList.length > 0) {
        const sessionMap = new Map();

        chatsList.forEach((item) => {
          const sessionId = item.session_id || item.sessionId || "";
          if (sessionId && !sessionMap.has(sessionId)) {
            const displayText = item.title || item.user_message || item.query || item.content || `会话 ${sessionId.slice(0, 8)}`;
            sessionMap.set(sessionId, {
              text: displayText.length > 20 ? `${displayText.slice(0, 20)}...` : displayText,
              url: `/pages/chat/index?session_id=${sessionId}`,
              sessionId,
            });
          }
        });

        const chatItems = Array.from(sessionMap.values());
        setMenuItems([
          { text: "卜卦", url: "/pages/home/index" },
          ...chatItems,
        ]);
      }
    } catch (error) {
      console.error("获取聊天历史失败:", error);
    }
  };

  useEffect(() => {
    if (drawerOpen) {
      fetchChatHistory();
    }

  }, [drawerOpen]);

  // 统一的导航处理函数
  const handleNavigate = (url, sessionId) => {
    if (url.startsWith("/pages/home/index") || url.startsWith("/pages/chat/index")) {
      const baseUrl = url.split("?")[0];
      
      const pages = Taro.getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const isCurrentChatPage = currentPage?.route === "pages/chat/index";
      
      if (sessionId) {
        Taro.setStorageSync("target_session_id", sessionId);
        
        if (isCurrentChatPage && baseUrl === "/pages/chat/index") {
          Taro.eventCenter.trigger("switchChatSession", sessionId);
        }
      }
      
      if (!isCurrentChatPage || baseUrl !== "/pages/chat/index") {
        Taro.switchTab({ url: baseUrl });
      }
    } else {
      Taro.navigateTo({ url });
    }
    setDrawerOpen(false);
  };

  return (
    <View
      className="custom-nav-bar"
      style={{ paddingTop: `${statusBarHeight}px` }}
    >
      <View className="nav-bar-content" style={{ height: `${navBarHeight}px` }}>
        <View className="nav-bar-left">
          <View
            className="nav-icon-wrapper"
            onClick={() => setDrawerOpen(true)}
          >
            <Image
              className="nav-icon"
              src={require("../../assets/images/draw.png")}
              mode="aspectFit"
            />
          </View>

          <View
            className="nav-icon-wrapper chat-icon-wrapper"
            onClick={() => handleNavigate("/pages/chat/index")}
          >
            <Image
              className="nav-icon"
              src={require("../../assets/images/new-chat.png")}
              mode="aspectFit"
            />
          </View>
        </View>

        <Text className="nav-bar-title">{title}</Text>
        <View className="nav-bar-right"></View>
      </View>

      <Popup
        open={drawerOpen}
        placement="left"
        onClose={() => setDrawerOpen(false)}
        style={{ width: "70%", height: "100%" }}
      >
        <View
          className="drawer-content"
          style={{ paddingTop: `${statusBarHeight}px` }}
        >
          <View className="drawer-menu">
            {menuItems.map((item, index) => (
              <View
                key={item.url || index}
                className="menu-item"
                onClick={() => handleNavigate(item.url, item.sessionId)}
              >
                <Text className="menu-text">{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </Popup>
    </View>
  );
};

export default CustomNavBar;
