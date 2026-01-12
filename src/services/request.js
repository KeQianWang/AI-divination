import Taro from "@tarojs/taro";

const BASE_URL = "http://192.168.12.118:8001";

const request = (options) => {
  const { url, method = "GET", data, header = {} } = options;

  const token = Taro.getStorageSync("token");

  return Taro.request({
    url: `${BASE_URL}${url}`,
    method,
    data,
    header: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...header,
    },
  }).then((res) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    if (res.statusCode === 401) {
      Taro.removeStorageSync("token");
      Taro.navigateTo({ url: "/pages/login/index" });
      return Promise.reject(new Error("未授权，请重新登录"));
    }
    return Promise.reject(
      new Error(res.data?.detail || `请求失败: ${res.statusCode}`)
    );
  });
};

export default request;
