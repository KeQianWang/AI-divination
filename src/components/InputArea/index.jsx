import { Button, Input, View } from "@tarojs/components";
import { useState } from "react";

import Taro from "@tarojs/taro";
import "./index.less";

export default function InputArea({ onSendMessage, disabled = false }) {
  const [text, setText] = useState("");
  const [filePath, setFilePath] = useState("");
  const [url, setUrl] = useState("");
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const handleSend = () => {
    if (!text.trim() && !filePath && !url) return;
    onSendMessage({ text: text.trim(), filePath, url });
    setText("");
    setFilePath("");
    setUrl("");
    setIsPanelVisible(false);
  };

  const chooseFile = async () => {
    try {
      const res = await Taro.chooseMessageFile({
        count: 1,
        type: "file",
      });
      setFilePath(res.tempFiles[0].path);
      Taro.showToast({ title: "文件已选择", icon: "success" });
    } catch (e) {
      Taro.showToast({ title: "取消选择", icon: "none" });
    }
  };

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <View className="input-area-container">
      <View className="chat-input-bar">
        <Input
          className="input"
          type="text"
          placeholder="请输入消息"
          value={text}
          onInput={(e) => setText(e.detail.value)}
          confirmType="send"
          onConfirm={handleSend}
        />
        <View className="multi-function-btn" onClick={togglePanel}>
          +
        </View>
        <Button className="send-btn" size="mini" onClick={handleSend}>
          发送
        </Button>
      </View>
      {isPanelVisible && (
        <View className="function-panel">
          <View className="panel-item" onClick={chooseFile}>
            <View className="panel-icon">📁</View>
            <View className="panel-text">选择文件</View>
          </View>
          <View className="panel-item">
            <View className="panel-input-wrapper">
              <View className="panel-icon">🔗</View>
              <Input
                className="panel-input"
                type="text"
                placeholder="输入URL"
                placeholderStyle="color:#dad3d3"
                onInput={(e) => setUrl(e.detail.value)}
                maxlength={-1}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
