import request from "./request";


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

export const chatStream = async (query, sessionId = "", enableTts = false, asyncMode = false) => {
  return request({
    url: "/chat/stream",
    method: "POST",
    data: {
      query,
      session_id: sessionId,
      enable_tts: enableTts,
      async_mode: asyncMode,
    },
  });
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
