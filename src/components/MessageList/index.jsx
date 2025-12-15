import { ScrollView, Text, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import "./index.less";

const MessageList = ({ messages = [], isLoading = false }) => {
  const [intoView, setIntoView] = useState("");

  /* 每次消息变化就滚到底 */
  useEffect(() => {
    if (messages.length) {
      // 用时间戳保证 id 唯一，避免相同 id 时不触发滚动
      setIntoView(`msg-${Date.now()}`);
    }
  }, [messages]);

  const getMoodEmoji = (mood) => {
    const map = {
      default: "😊",
      friendly: "😊",
      upbeat: "😄",
      angry: "😠",
      depressed: "😔",
      cheerful: "😃",
    };
    return map[mood] || map.default;
  };

  return (
    <ScrollView
      className="messageListContainer"
      scrollY
      scrollIntoView={intoView}
      scrollWithAnimation
    >
      <View className="messageList">
        {messages.map((msg) => (
          <View
            key={msg.id}
            id={`msg-${msg.id}`} /* 给每条消息一个唯一 id */
            className={`messageItem ${msg.role}`}
          >
            <View className="messageHeader">
              <Text className="messageRole">
                {msg.role === "user" ? "您" : "陳大師"}
              </Text>
              {msg.mood && (
                <Text className="moodIndicator">{getMoodEmoji(msg.mood)}</Text>
              )}
              <Text className="messageTime">
                {msg.timestamp.toLocaleTimeString("zh-TW")}
              </Text>
            </View>

            <View className="messageContent">{msg.content}</View>
          </View>
        ))}

        {/* 加载中占位 */}
        {isLoading && (
          <View className="messageItem assistant loading">
            <View className="messageHeader">
              <span className="messageRole">陳大師</span>
            </View>
            <View className="messageContent">
              <View className="typingIndicator">
                <span />
                <span />
                <span />
              </View>
            </View>
          </View>
        )}

        {/* 空节点，用来滚到底 */}
        <View id={intoView} style={{ height: 1 }} />
      </View>
    </ScrollView>
  );
};

export default MessageList;
