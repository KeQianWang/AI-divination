import Taro from "@tarojs/taro";
import { useMemo } from "react";

/**
 * 获取导航栏高度的自定义 Hook
 * @returns {Object} { statusBarHeight, navBarHeight, totalHeight }
 */
const useNavBarHeight = () => {
  return useMemo(() => {
    const systemInfo = Taro.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight || 0;
    const navBarHeight = systemInfo.platform === "ios" ? 44 : 48;
    const totalHeight = statusBarHeight + navBarHeight;

    return { statusBarHeight, navBarHeight, totalHeight };
  }, []);
};

export default useNavBarHeight;
