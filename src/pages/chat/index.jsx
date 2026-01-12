import { View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useEffect, useState } from "react";
import InputArea from "../../components/InputArea";
import MessageList from "../../components/MessageList";
import PageLayout from "../../components/PageLayout";
import "./index.less";
import { getChatHistory, chatStream } from "../../services/chat";

const Chat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [messages, setMessages] = useState([]);

  /**
   * 历史数据转换为 messages 格式
   */
  const transformHistoryToMessages = (response) => {
    const historyList = response?.history || [];
    
    if (!Array.isArray(historyList) || historyList.length === 0) {
      return [];
    }

    const messages = [];

    historyList.forEach((item) => {
      const timestamp = item.created_at ? new Date(item.created_at) : new Date();
      
      if (item.user_message) {
        messages.push({
          id: `user-${item.id}`,
          content: item.user_message,
          role: "user",
          mood: "default",
          timestamp,
        });
      }

      if (item.assistant_message) {
        messages.push({
          id: `assistant-${item.id}`,
          content: item.assistant_message,
          role: "assistant",
          mood: item.mood || "default",
          timestamp,
        });
      }
    });

    return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  const getChat = async (sessionId) => {
    const targetSessionId = sessionId || currentSessionId;
    if (!targetSessionId) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await getChatHistory({ sessionId: targetSessionId });
      console.log("response>>>", response);
      const transformedMessages = transformHistoryToMessages(response);
      setMessages(transformedMessages);
    } catch (error) {
      console.error("获取聊天历史失败:", error);
      Taro.showToast({
        title: "获取聊天历史失败",
        icon: "none",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useDidShow(() => {
    const sessionId = Taro.getStorageSync("target_session_id");
    if (sessionId) {
      setCurrentSessionId(sessionId);
      Taro.removeStorageSync("target_session_id");
      getChat(sessionId);
    }
  });

  useEffect(() => {
    const handleSwitchSession = (sessionId) => {
      if (sessionId) {
        setCurrentSessionId(sessionId);
        getChat(sessionId);
      }
    };

    Taro.eventCenter.on("switchChatSession", handleSwitchSession);

    return () => {
      Taro.eventCenter.off("switchChatSession", handleSwitchSession);
    };
  }, []);

  const handleSendMessage = async (input) => {
    const query = input.text?.trim();
    if (!query) {
      return;
    }

    let assistantMessageId = "";

    try {
      setIsLoading(true);

      const userMessage = {
        id: `user-${Date.now()}`,
        content: query,
        role: "user",
        mood: "default",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage = {
        id: assistantMessageId,
        content: "",
        role: "assistant",
        mood: "default",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      const response = await chatStream(
        query,
        currentSessionId || "",
        false,
        false
      );

      if (response) {
        if (response.session_id && !currentSessionId) {
          setCurrentSessionId(response.session_id);
        }

        const assistantContent = response.content || response.message || response.answer || "";
        const assistantMood = response.mood || "default";

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: assistantContent,
                  mood: assistantMood,
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      
      if (assistantMessageId) {
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
      }
      
      Taro.showToast({
        title: error.message || "发送消息失败",
        icon: "none",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout title="玄门问道">
      <View className="chat-content">
        <MessageList messages={messages} isLoading={isLoading} />
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
