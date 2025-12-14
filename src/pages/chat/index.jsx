import {
  View,
} from "@tarojs/components";
import PageLayout from "../../components/PageLayout";
import "./index.less";
import MessageList from "../../components/MessageList";
import {useState} from "react";
import InputArea from "../../components/InputArea";

const Chat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      content:
        "貧道陳玉樓，人稱陳大師。精通陰陽五行，能為您算命、紫微斗數、姓名測算、占卜凶吉。請問您想算什麼？",
      role: "assistant",
      mood: "default",
      timestamp: new Date(),
    },
    {
      id: "2",
      content: "你好",
      role: "user",
      mood: "default",
      timestamp: new Date(),
    },
    {
      id: "3",
      content: "库卡家；开机啊看见对方；卡接口放假啊；看大家发；卡家；快点放假啊大开发贷款；季卡剪短发",
      role: "user",
      mood: "default",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = async (message) => {
  };

  return (
    <PageLayout title="玄门问道">
      <View className="chat-content">
        <MessageList
          messages={messages}
          isLoading={isLoading}
        />
        <InputArea
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder="請輸入您的問題..."
        />

      </View>
    </PageLayout>
  );
};

export default Chat;
