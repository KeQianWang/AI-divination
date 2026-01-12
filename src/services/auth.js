import Taro from "@tarojs/taro";
import request from "./request";

export const login = async (username, password) => {
  const response = await request({
    url: "/auth/login",
    method: "POST",
    data: {
      username,
      password,
    },
  });

  if (response.access_token) {
    Taro.setStorageSync("token", response.access_token);
  }

  return response;
};

// 注册
export const register = async (username, password, phone) => {
  return request({
    url: "/auth/register",
    method: "POST",
    data: {
      username,
      password,
      phone,
    },
  });
};

// 获取当前用户
export const getCurrentUser = async () => {
  return request({
    url: "/auth/me",
    method: "GET",
  });
};

// 更新当前用户
export const updateCurrentUser = async (userData) => {
  return request({
    url: "/auth/update_me",
    method: "PUT",
    data: userData,
  });
};
