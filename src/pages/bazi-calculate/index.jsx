import { View } from "@tarojs/components";
import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import BaziForm from "../../components/BaziForm";
import "./index.less";

// 天干地支
const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 五行
const fiveElements = {
  "甲": "木", "乙": "木",
  "丙": "火", "丁": "火",
  "戊": "土", "己": "土",
  "庚": "金", "辛": "金",
  "壬": "水", "癸": "水",
  "子": "水", "丑": "土", "寅": "木", "卯": "木",
  "辰": "土", "巳": "火", "午": "火", "未": "土",
  "申": "金", "酉": "金", "戌": "土", "亥": "水"
};

const BaziCalculate = () => {
  const [result, setResult] = useState(null);

  // 简化的八字计算（实际应用需要更精确的农历转换和时辰计算）
  const calculateBazi = (formData) => {
    const { name, year, month, day, hour, gender } = formData;

    // 简化计算年柱
    const yearStemIndex = (year - 4) % 10;
    const yearBranchIndex = (year - 4) % 12;
    const yearPillar = heavenlyStems[yearStemIndex] + earthlyBranches[yearBranchIndex];

    // 简化计算月柱
    const monthStemIndex = ((year - 4) * 12 + month - 1) % 10;
    const monthBranchIndex = (month - 1) % 12;
    const monthPillar = heavenlyStems[monthStemIndex] + earthlyBranches[monthBranchIndex];

    // 简化计算日柱
    const dayStemIndex = (year * 365 + month * 30 + day) % 10;
    const dayBranchIndex = (year * 365 + month * 30 + day) % 12;
    const dayPillar = heavenlyStems[dayStemIndex] + earthlyBranches[dayBranchIndex];

    // 简化计算时柱
    const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
    const hourStemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10;
    const hourPillar = heavenlyStems[hourStemIndex] + earthlyBranches[hourBranchIndex];

    // 计算五行分布
    const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
    const elementCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

    pillars.forEach(pillar => {
      elementCount[fiveElements[pillar[0]]]++;
      elementCount[fiveElements[pillar[1]]]++;
    });

    // 找出最强和最弱的五行
    const sortedElements = Object.entries(elementCount).sort((a, b) => b[1] - a[1]);
    const strongElement = sortedElements[0][0];
    const weakElement = sortedElements[sortedElements.length - 1][0];

    return {
      name,
      gender,
      birthDate: `${year}年${month}月${day}日 ${hour}时`,
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      elementCount,
      strongElement,
      weakElement,
      analysis: generateAnalysis(elementCount, strongElement, weakElement),
    };
  };

  const generateAnalysis = (elementCount, strongElement, weakElement) => {
    const analyses = {
      personality: `五行${strongElement}旺，性格${getPersonalityTrait(strongElement)}。需注意平衡${weakElement}元素。`,
      career: `适合从事与${strongElement}相关的行业，如${getCareerSuggestion(strongElement)}等。`,
      health: `需注意${getHealthAdvice(strongElement, weakElement)}方面的保养。`,
      fortune: `整体运势平稳，${getCurrentYearFortune()}。建议多行善积德，顺应天时。`,
    };

    return analyses;
  };

  const getPersonalityTrait = (element) => {
    const traits = {
      木: "仁慈正直，富有同情心",
      火: "热情积极，充满活力",
      土: "稳重踏实，诚实守信",
      金: "果断坚定，注重原则",
      水: "聪明灵活，善于变通",
    };
    return traits[element] || "和善友好";
  };

  const getCareerSuggestion = (element) => {
    const careers = {
      木: "教育、医疗、环保、文化艺术",
      火: "科技、能源、传媒、演艺",
      土: "建筑、房地产、农业、管理",
      金: "金融、法律、工程、制造",
      水: "贸易、物流、旅游、咨询",
    };
    return careers[element] || "服务行业";
  };

  const getHealthAdvice = (strong, weak) => {
    const health = {
      木: "肝胆",
      火: "心脏",
      土: "脾胃",
      金: "肺部",
      水: "肾脏",
    };
    return `${health[strong]}和${health[weak]}`;
  };

  const getCurrentYearFortune = () => {
    const fortunes = [
      "贵人运佳，利于发展",
      "财运亨通，宜投资理财",
      "事业稳步提升",
      "人际关系和谐",
      "学业进步明显",
    ];
    return fortunes[Math.floor(Math.random() * fortunes.length)];
  };

  const handleFormSubmit = (formData) => {
    const baziResult = calculateBazi(formData);
    setResult(baziResult);
  };

  return (
    <PageLayout title="八字测算" className="bazi-calculate-page">
      <View className="bazi-content">
        <View className="page-header">
          <View className="header-badge">命盘解读</View>
          <View className="header-title">八字测算</View>
          <View className="header-desc">
            根据生辰八字，剖析五行命格，探寻人生运势。
          </View>
        </View>

        {!result ? (
          <BaziForm onSubmit={handleFormSubmit} />
        ) : (
          <View className="result-section">
            <View className="result-header">
              <View className="user-name">{result.name}</View>
              <View className="user-info">
                {result.gender} · {result.birthDate}
              </View>
            </View>

            <View className="bazi-pillars">
              <View className="pillars-title">八字命盘</View>
              <View className="pillars-grid">
                <View className="pillar-item">
                  <View className="pillar-label">年柱</View>
                  <View className="pillar-value">{result.yearPillar}</View>
                </View>
                <View className="pillar-item">
                  <View className="pillar-label">月柱</View>
                  <View className="pillar-value">{result.monthPillar}</View>
                </View>
                <View className="pillar-item">
                  <View className="pillar-label">日柱</View>
                  <View className="pillar-value">{result.dayPillar}</View>
                </View>
                <View className="pillar-item">
                  <View className="pillar-label">时柱</View>
                  <View className="pillar-value">{result.hourPillar}</View>
                </View>
              </View>
            </View>

            <View className="element-analysis">
              <View className="analysis-title">五行分布</View>
              <View className="element-bars">
                {Object.entries(result.elementCount).map(([element, count]) => (
                  <View key={element} className="element-bar">
                    <View className="bar-label">{element}</View>
                    <View className="bar-track">
                      <View
                        className="bar-fill"
                        style={{ width: `${(count / 8) * 100}%` }}
                      />
                    </View>
                    <View className="bar-count">{count}</View>
                  </View>
                ))}
              </View>
              <View className="element-summary">
                五行<text className="strong">{result.strongElement}</text>旺，
                <text className="weak">{result.weakElement}</text>弱
              </View>
            </View>

            <View className="analysis-cards">
              <View className="analysis-card">
                <View className="card-title">性格特征</View>
                <View className="card-content">{result.analysis.personality}</View>
              </View>

              <View className="analysis-card">
                <View className="card-title">事业发展</View>
                <View className="card-content">{result.analysis.career}</View>
              </View>

              <View className="analysis-card">
                <View className="card-title">健康建议</View>
                <View className="card-content">{result.analysis.health}</View>
              </View>

              <View className="analysis-card">
                <View className="card-title">运势展望</View>
                <View className="card-content">{result.analysis.fortune}</View>
              </View>
            </View>

            <View className="reset-button" onClick={() => setResult(null)}>
              <View className="button-text">重新测算</View>
            </View>

            <View className="notice-text">
              * 测算结果仅供参考，命运掌握在自己手中
            </View>
          </View>
        )}
      </View>
    </PageLayout>
  );
};

export default BaziCalculate;
