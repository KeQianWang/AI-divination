import { Button, Input, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import { login } from "../../services/auth";
import "./index.less";

const Login = () => {
  const [username, setUsername] = useState("junji");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) {
      Taro.showToast({
        title: "请输入用户名",
        icon: "none",
      });
      return;
    }

    if (!password.trim()) {
      Taro.showToast({
        title: "请输入密码",
        icon: "none",
      });
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
      Taro.showToast({
        title: "登录成功",
        icon: "success",
      });
      setTimeout(() => {
        Taro.switchTab({ url: "/pages/home/index" });
      }, 1500);
    } catch (error) {
      Taro.showToast({
        title: error.message || "登录失败，请检查账号密码",
        icon: "none",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="login">
      <View className="login-container">
        <View className="login-header">
          <View className="login-title">欢迎使用</View>
          <View className="login-subtitle">登录您的账号以继续</View>
        </View>

        <View className="login-form">
          <View className="form-item">
            <Input
              className="form-input"
              type="text"
              placeholder="请输入用户名"
              value={username}
              onInput={(e) => setUsername(e.detail.value)}
            />
          </View>

          <View className="form-item">
            <Input
              className="form-input"
              type="password"
              placeholder="请输入密码"
              value={password}
              onInput={(e) => setPassword(e.detail.value)}
              onConfirm={handleLogin}
            />
          </View>

          <Button
            className="login-button"
            loading={loading}
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "登录中..." : "登录"}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Login;
