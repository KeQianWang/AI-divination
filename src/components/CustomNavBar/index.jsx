import { Popup } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import useNavBarHeight from "../../hooks/useNavBarHeight";
import "./index.less";

// 菜单配置
const MENU_ITEMS = [
  { text: "卜卦", url: "/pages/home/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "大师算命", url: "/pages/chat/index" },
  { text: "卜卦", url: "/pages/home/index" },
];

const CustomNavBar = ({ title = "AI 卜卦" }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { statusBarHeight, navBarHeight } = useNavBarHeight();

  // 统一的导航处理函数
  const handleNavigate = (url) => {
    Taro.switchTab({ url });
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
            {MENU_ITEMS.map((item) => (
              <View
                key={item.url}
                className="menu-item"
                onClick={() => handleNavigate(item.url)}
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
