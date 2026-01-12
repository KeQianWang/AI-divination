import { Button, Input, View } from "@tarojs/components";
import { useState } from "react";

import "./index.less";

export default function InputArea({ onSendMessage, disabled = false, placeholder = "请输入消息" }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage({ text: text.trim() });
    setText("");
  };

  return (
    <View className="input-area-container">
      <View className="chat-input-bar">
        <Input
          className="input"
          type="text"
          placeholder={placeholder}
          value={text}
          onInput={(e) => setText(e.detail.value)}
          confirmType="send"
          onConfirm={handleSend}
        />
        <Button className="send-btn" size="mini" onClick={handleSend}>
          发送
        </Button>
      </View>
    </View>
  );
}
