import { View } from "@tarojs/components";
import PageLayout from "../../components/PageLayout";
import "./index.less";

const Chat = () => {
  return (
    <PageLayout title="大师算命">
      <View className="chat-content">
        <View>对话</View>
      </View>
    </PageLayout>
  );
};

export default Chat;
