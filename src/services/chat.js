import request from "./request";
import Taro from "@tarojs/taro";

const BASE_URL = "http://192.168.12.118:8001";

export const chat = async (query, sessionId = "", enableTts = false, asyncMode = false) => {
  return request({
    url: "/chat",
    method: "POST",
    data: {
      query,
      session_id: sessionId,
      enable_tts: enableTts,
      async_mode: asyncMode,
    },
  });
};

const parseDataString = (str) => {
  try {
    return JSON.parse(str);
  } catch (jsonError) {
    try {
      let jsonStr = str
        .replace(/'/g, '"')
        .replace(/True/g, 'true')
        .replace(/False/g, 'false')
        .replace(/None/g, 'null');
      
      return JSON.parse(jsonStr);
    } catch (pythonError) {
      console.error("解析数据失败 (JSON 和 Python 格式都失败):", {
        original: str,
        jsonError: jsonError.message,
        pythonError: pythonError.message
      });
      return null;
    }
  }
};

const decodeChunk = (res, decoder) => {
  const rawData = typeof res === "string" ? res : res?.data ?? res?.chunk ?? res;
  if (rawData instanceof ArrayBuffer) return decoder.decode(rawData, { stream: true });
  if (typeof rawData === "string") return rawData;
  return "";
};

const extractDataString = (line) => {
  if (!line) return "";
  const trimmed = line.trimStart();
  const dataMatch = trimmed.match(/^data:\s*(.*)$/i);
  if (dataMatch) return dataMatch[1];
  if (trimmed.startsWith("message\t")) return trimmed.slice(8);
  if (trimmed.startsWith("{")) return trimmed;
  return "";
};

export const startChatStream = ({
  query,
  sessionId = "",
  enableTts = false,
  asyncMode = false,
  onContent,
  onComplete,
  onError,
}) => {
  const token = Taro.getStorageSync("token");
  const decoder = new TextDecoder("utf-8");

  let buffer = "";
  let finalResult = null;
  let currentSessionId = sessionId;
  let abort = () => {};

  const promise = new Promise((resolve, reject) => {
    const handleError = (err) => {
      onError?.(err);
      reject(err);
    };

    const requestTask = Taro.request({
      url: `${BASE_URL}/chat/stream`,
      method: "POST",
      data: {
        query,
        session_id: sessionId,
        enable_tts: enableTts,
        async_mode: asyncMode,
      },
      header: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      responseType: "arraybuffer",
      enableChunked: true,
      success: (res) => {
        try {
          processBuffer(true); // 处理最后残余
        } catch (e) {
          const err = new Error(e?.message || "处理流式数据失败");
          handleError(err);
          return;
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(finalResult || { session_id: currentSessionId, content: "" });
        } else {
          const err = new Error(res.data?.detail || `请求失败: ${res.statusCode}`);
          handleError(err);
        }
      },
      fail: (error) => {
        const err = new Error(error.errMsg || "请求失败");
        handleError(err);
      },
    });

    if (requestTask && typeof requestTask.onChunkReceived === "function") {
      requestTask.onChunkReceived((res) => {
        try {
          const chunk = decodeChunk(res?.data, decoder);
          if (!chunk) return;
          buffer += chunk;
          processBuffer(false);
        } catch (e) {
          const err = new Error(e?.message || "处理流式数据失败");
          handleError(err);
          abort();
        }
      });
    }

    abort = () => {
      if (requestTask && typeof requestTask.abort === "function") {
        requestTask.abort();
      }
    };

    const handleLine = (line) => {
      const dataStr = extractDataString(line.trim());
      if (!dataStr) return;
      const data = parseDataString(dataStr);
      if (!data) return;

      if (data.session_id) currentSessionId = data.session_id;

      if (data.type === "content") {
        onContent?.({
          type: "content",
          content: data.content || "",
          session_id: currentSessionId,
          mood: data.mood || "default",
          voice_style: data.voice_style || "default",
        });
      } else if (data.type === "complete") {
        finalResult = {
          type: "complete",
          content: data.content || "",
          session_id: currentSessionId,
          mood: data.mood || "default",
          voice_style: data.voice_style || "default",
        };
        onComplete?.(finalResult);
      }
    };
    const processBuffer = (shouldFlush = false) => {
      if (shouldFlush) {
        buffer += decoder.decode();
      }
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || "";
      console.log("buffer>>>", buffer);
      
      lines.forEach(handleLine);
    };

    if (requestTask && typeof requestTask.onChunkReceived === "function") {
      requestTask.onChunkReceived((res) => {
        try {
          const chunk = decodeChunk(res, decoder);
          if (!chunk) return;
          buffer += chunk;
          processBuffer(false);
        } catch (e) {
          const err = new Error(e?.message || "处理流式数据失败");
          onError?.(err);
          reject(err);
          abort();
        }
      });
    } else {
      request({
        url: "/chat/stream",
        method: "POST",
        data: {
          query,
          session_id: sessionId,
          enable_tts: enableTts,
          async_mode: asyncMode,
        },
      })
        .then((res) => {
          onComplete?.(res);
          resolve(res);
        })
        .catch((err) => {
          onError?.(err);
          reject(err);
        });
    }

  });

  return { promise, abort };
};

export const getChatHistory = async (params = {}) => {
  const { sessionId, skip = 0, limit = 50 } = params;
  const queryParts = [];
  
  if (sessionId) {
    queryParts.push(`session_id=${encodeURIComponent(sessionId)}`);
  }
  if (skip !== undefined && skip !== null) {
    queryParts.push(`skip=${skip}`);
  }
  if (limit !== undefined && limit !== null) {
    queryParts.push(`limit=${limit}`);
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  const url = `/chat/history${queryString}`;

  return request({
    url,
    method: "GET",
  });
};

// 获取聊天统计信息
export const getChatStats = async () => {
  return request({
    url: "/chat/stats",
    method: "GET",
  });
};

export const getRecentChats = async (days = 7) => {
  const url = days ? `/chat/recent?days=${days}` : "/chat/recent";
  
  return request({
    url,
    method: "GET",
  });
};
