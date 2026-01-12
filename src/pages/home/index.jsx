import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import PageLayout from "../../components/PageLayout";
import "./index.less";

const featureCards = [
  {
    title: "每日一卦",
    tag: "今日灵机",
    desc: "晨起抽一卦，洞悉当下气运，趋吉避凶。",
    accent: "linear-gradient(135deg, #f8e3c9, #d9b07a)",
    path: "/pages/daily-divination/index",
  },
  {
    title: "八字测算",
    tag: "命盘解读",
    desc: "根据生辰八字剖析命格，寻觅人生节奏。",
    accent: "linear-gradient(135deg, #c0d6ff, #7e9dff)",
    path: "/pages/bazi-calculate/index",
  },
  {
    title: "在线解梦",
    tag: "梦境符号",
    desc: "解读潜意识中的象征，找到与现实的暗合。",
    accent: "linear-gradient(135deg, #fde1f2, #db91c2)",
    path: "/pages/dream-interpretation/index",
  },
  {
    title: "大师解惑",
    tag: "即时指引",
    desc: "困于情感抉择或事业迷雾，获得即时灵感。",
    accent: "linear-gradient(135deg, #d5f5e3, #7dc7aa)",
    path: "/pages/chat/index",
  },
];

const Home = () => {
  const handleCardClick = (path) => {
    const token = Taro.getStorageSync('token');
    if (!token) {
      Taro.navigateTo({ url: '/pages/login/index' });
      return;
    }
    Taro.navigateTo({ url: path });
  };

  return (
    <PageLayout title="卜卦">
      <View className="home-content">
        <View className="feature-grid">
          {featureCards.map((card) => (
            <View
              key={card.title}
              className="feature-card"
              onClick={() => handleCardClick(card.path)}
            >
              <View className="card-glow" style={{ background: card.accent }} />
              <View className="card-header">
                <View className="card-badge">{card.tag}</View>
                <View className="card-title">{card.title}</View>
              </View>
              <View className="card-desc">{card.desc}</View>
              <View className="card-footer">点击开启指引</View>
            </View>
          ))}
        </View>
      </View>
    </PageLayout>
  );
};

export default Home;
