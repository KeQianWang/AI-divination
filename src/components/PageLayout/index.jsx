import { View } from "@tarojs/components";
import useNavBarHeight from "../../hooks/useNavBarHeight";
import CustomNavBar from "../CustomNavBar";
import "./index.less";

const PageLayout = ({ title = "AI 卜卦", children, className = "" }) => {
  const { totalHeight } = useNavBarHeight();

  return (
    <View className={`page-layout ${className}`}>
      {/* 固定导航栏 */}
      <CustomNavBar title={title} />

      {/* 内容区域 - 自动计算剩余空间 */}
      <View
        className="page-content"
        style={{
          paddingTop: `${totalHeight}px`,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default PageLayout;
