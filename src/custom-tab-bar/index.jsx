import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import "./index.less";

const list = [
  {
    pagePath: "/pages/home/index",
    text: "卜卦",
    iconPath: require("../assets/images/divination.png"),
    selectedIconPath: require("../assets/images/selected-divination.png"),
  },
  {
    pagePath: "/pages/chat/index",
    text: "大师算命",
    iconPath: require("../assets/images/chat.png"),
    selectedIconPath: require("../assets/images/selected-chat.png"),
  },
];

export default function CustomTabBar() {
  const [selected, setSelected] = useState(0);

  const switchTab = (index, url) => {
    setSelected(index);
    Taro.switchTab({ url });
  };

  return (
    <View className="custom-tab-bar">
      {list.map((item, index) => (
        <View
          key={index}
          className="tab-item"
          onClick={() => switchTab(index, item.pagePath)}
        >
          <Image
            className="tab-icon"
            src={selected === index ? item.selectedIconPath : item.iconPath}
          />
          <Text
            className="tab-text"
            style={{ color: selected === index ? "#007AFF" : "#666" }}
          >
            {item.text}
          </Text>
        </View>
      ))}
    </View>
  );
}
