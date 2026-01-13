import { View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useEffect, useState } from "react";
import InputArea from "../../components/InputArea";
import MessageList from "../../components/MessageList";
import PageLayout from "../../components/PageLayout";
import "./index.less";
import { getChatHistory, startChatStream } from "../../services/chat";

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

  const handleSendMessage = (input) => {
    const query = input.text?.trim();
    if (!query || isLoading) return;

    const assistantId = `assistant-${Date.now()}`;
    let streamedText = "";

    const ensureSessionId = (sid) => {
      if (!sid) return;
      setCurrentSessionId((prev) => (prev ? prev : sid));
    };

    const updateAssistant = (content, mood) =>
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content, mood: mood || msg.mood }
            : msg
        )
      );

    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        content: query,
        role: "user",
        mood: "default",
        timestamp: new Date(),
      },
      {
        id: assistantId,
        content: "",
        role: "assistant",
        mood: "default",
        timestamp: new Date(),
      },
    ]);

    const { promise } = startChatStream({
      query,
      sessionId: currentSessionId || "",
      enableTts: false,
      asyncMode: false,
      onContent: ({ content, session_id, mood }) => {
        streamedText += content || "";
        ensureSessionId(session_id);
        updateAssistant(streamedText, mood);
      },
      onComplete: ({ content, session_id, mood }) => {
        const finalText = content ?? streamedText;
        streamedText = finalText;
        ensureSessionId(session_id);
        updateAssistant(finalText, mood);
      },
      onError: (err) => {
        console.error("流式请求失败:", err);
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantId));
        Taro.showToast({
          title: err?.message || "发送消息失败",
          icon: "none",
        });
      },
    });

    promise
      .then((res) => {
        if (res && !streamedText) {
          ensureSessionId(res.session_id);
          updateAssistant(
            res.content || res.message || res.answer || "",
            res.mood || "default"
          );
        }
      })
      .catch((error) => {
        console.error("发送消息失败:", error);
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantId));
        Taro.showToast({
          title: error.message || "发送消息失败",
          icon: "none",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
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
