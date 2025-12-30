import { View } from "@tarojs/components";
import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import DivinationStick from "../../components/DivinationStick";
import "./index.less";

// 64卦简化数据（实际项目可从API获取完整卦辞）
const hexagrams = {
  1: { name: "乾为天", type: "上上签", fortune: "刚健中正，大吉大利", advice: "把握时机，积极进取" },
  2: { name: "坤为地", type: "上吉签", fortune: "柔顺厚德，顺势而为", advice: "以柔克刚，守正待时" },
  3: { name: "水雷屯", type: "中签", fortune: "初始艰难，渐入佳境", advice: "坚持努力，不可急躁" },
  4: { name: "山水蒙", type: "中签", fortune: "蒙昧待启，虚心求教", advice: "多学习思考，寻求指导" },
  5: { name: "水天需", type: "中吉签", fortune: "等待时机，静观其变", advice: "耐心等待，时机自来" },
  // ... 可继续添加其他卦象
};

// 默认卦象（当卦号不在数据中时使用）
const defaultHexagram = {
  name: "待解卦象",
  type: "中签",
  fortune: "事有变化，需待时观察",
  advice: "保持警觉，随机应变"
};

const DailyDivination = () => {
  const [result, setResult] = useState(null);

  const handleDivinationComplete = (stickNumber) => {
    // 获取卦象，如果不存在则使用默认
    const hexagram = hexagrams[stickNumber] || {
      ...defaultHexagram,
      name: `第${stickNumber}卦`
    };

    setResult({
      stickNumber,
      ...hexagram,
      date: new Date().toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
  };

  return (
    <PageLayout title="每日一卦" className="daily-divination-page">
      <View className="divination-content">
        <View className="page-header">
          <View className="header-badge">今日灵机</View>
          <View className="header-title">每日一卦</View>
          <View className="header-desc">
            诚心问卦，洞悉天机。一日一卦，趋吉避凶。
          </View>
        </View>

        <DivinationStick onComplete={handleDivinationComplete} />

        {result && (
          <View className="result-section">
            <View className="result-card">
              <View className="card-header">
                <View className="hexagram-name">{result.name}</View>
                <View className={`hexagram-type ${result.type.includes("上") ? "good" : "normal"}`}>
                  {result.type}
                </View>
              </View>

              <View className="card-body">
                <View className="fortune-item">
                  <View className="fortune-label">卦象</View>
                  <View className="fortune-text">{result.fortune}</View>
                </View>

                <View className="fortune-item">
                  <View className="fortune-label">建议</View>
                  <View className="fortune-text">{result.advice}</View>
                </View>
              </View>

              <View className="card-footer">
                <View className="date-text">{result.date}</View>
              </View>
            </View>

            <View className="notice-text">
              * 卦象仅供参考，命运掌握在自己手中
            </View>
          </View>
        )}
      </View>
    </PageLayout>
  );
};

export default DailyDivination;
