import { View } from "@tarojs/components";
import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import DreamInput from "../../components/DreamInput";
import "./index.less";

// 梦境符号解析数据库（简化版）
const dreamSymbols = {
  飞翔: {
    meaning: "渴望自由与突破",
    interpretation: "梦见飞翔通常代表你内心对自由的渴望，或是对现状的突破愿望。可能暗示你最近在某个领域取得进展，或是心中有远大抱负。",
    advice: "保持积极心态，勇于追求目标，但也要脚踏实地。",
  },
  掉落: {
    meaning: "焦虑与失控感",
    interpretation: "掉落的梦境常反映内心的不安全感或对失去控制的恐惧。可能与工作压力、人际关系或生活变化有关。",
    advice: "找出焦虑的根源，寻求支持，建立安全感。",
  },
  水: {
    meaning: "情感与潜意识",
    interpretation: "水象征情感、直觉和潜意识。清澈的水代表纯净的情感，浑浊的水可能暗示情绪困扰。",
    advice: "关注内心情感，适时表达和疏导。",
  },
  火: {
    meaning: "热情与转变",
    interpretation: "火代表热情、欲望和转变。可能暗示你正经历重大变化，或内心充满激情。",
    advice: "把握机遇，但需注意控制情绪，避免冲动。",
  },
  蛇: {
    meaning: "智慧与恐惧",
    interpretation: "蛇象征智慧、治愈，有时也代表隐藏的恐惧或威胁。具体含义需结合梦中感受判断。",
    advice: "面对恐惧，挖掘内在智慧，寻求成长。",
  },
  考试: {
    meaning: "压力与评价",
    interpretation: "考试梦境反映对能力的担忧或对评价的在意。可能暗示你面临重要决定或挑战。",
    advice: "充分准备，相信自己，不过分在意他人评价。",
  },
  // 可继续添加更多梦境符号
};

const DreamInterpretation = () => {
  const [result, setResult] = useState(null);

  const analyzeDream = (dreamData) => {
    const { content, keywords } = dreamData;

    // 分析关键词
    const matchedSymbols = keywords
      .filter(keyword => dreamSymbols[keyword])
      .map(keyword => ({
        keyword,
        ...dreamSymbols[keyword],
      }));

    // 生成综合解析
    const overallInterpretation = generateOverallInterpretation(matchedSymbols, content);
    const psychologicalAnalysis = generatePsychologicalAnalysis(matchedSymbols);
    const lifeAdvice = generateLifeAdvice(matchedSymbols);

    return {
      dreamContent: content,
      matchedSymbols,
      overallInterpretation,
      psychologicalAnalysis,
      lifeAdvice,
      timestamp: new Date().toLocaleString("zh-CN"),
    };
  };

  const generateOverallInterpretation = (symbols, content) => {
    if (symbols.length === 0) {
      return "您的梦境内容较为独特，建议关注梦中的情绪体验和主要场景，这些往往反映了您当下的心理状态和生活关注点。";
    }

    const themes = symbols.map(s => s.meaning).join("、");
    return `您的梦境主要涉及${themes}等主题。这些元素的出现可能反映了您内心深处的愿望、担忧或正在经历的生活变化。梦境是潜意识的表达，建议结合近期生活经历理解其含义。`;
  };

  const generatePsychologicalAnalysis = (symbols) => {
    if (symbols.length === 0) {
      return "梦境是心理活动的自然表现，每个人的梦都是独特的。建议记录梦境日记，观察梦境与生活的关联。";
    }

    const positiveCount = symbols.filter(s =>
      s.meaning.includes("自由") || s.meaning.includes("智慧") || s.meaning.includes("热情")
    ).length;

    if (positiveCount > symbols.length / 2) {
      return "从心理学角度看，您的梦境总体呈现积极向上的状态，显示出内心的成长力量和生命活力。这是心理健康的良好信号。";
    } else {
      return "梦境显示您可能正处于心理调整期，这是正常的成长过程。建议保持自我觉察，必要时寻求专业支持。";
    }
  };

  const generateLifeAdvice = (symbols) => {
    const advices = symbols.map(s => s.advice);

    if (advices.length === 0) {
      return "保持开放的心态，关注内心真实感受，梦境可以成为自我了解的一扇窗。";
    }

    return advices.slice(0, 3).join(" ");
  };

  const handleDreamSubmit = (dreamData) => {
    const analysis = analyzeDream(dreamData);
    setResult(analysis);
  };

  return (
    <PageLayout title="在线解梦" className="dream-interpretation-page">
      <View className="dream-content">
        <View className="page-header">
          <View className="header-badge">梦境符号</View>
          <View className="header-title">在线解梦</View>
          <View className="header-desc">
            解读潜意识的象征，探索梦境与现实的联结。
          </View>
        </View>

        {!result ? (
          <DreamInput onSubmit={handleDreamSubmit} />
        ) : (
          <View className="result-section">
            <View className="dream-summary">
              <View className="summary-title">您的梦境</View>
              <View className="summary-content">{result.dreamContent}</View>
              <View className="summary-time">{result.timestamp}</View>
            </View>

            {result.matchedSymbols.length > 0 && (
              <View className="symbols-section">
                <View className="section-title">梦境符号解析</View>
                {result.matchedSymbols.map((symbol, index) => (
                  <View key={index} className="symbol-card">
                    <View className="symbol-header">
                      <View className="symbol-keyword">{symbol.keyword}</View>
                      <View className="symbol-meaning">{symbol.meaning}</View>
                    </View>
                    <View className="symbol-interpretation">
                      {symbol.interpretation}
                    </View>
                    <View className="symbol-advice">
                      <text className="advice-label">建议：</text>
                      {symbol.advice}
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View className="analysis-section">
              <View className="analysis-card">
                <View className="card-title">综合解析</View>
                <View className="card-content">{result.overallInterpretation}</View>
              </View>

              <View className="analysis-card">
                <View className="card-title">心理分析</View>
                <View className="card-content">{result.psychologicalAnalysis}</View>
              </View>

              <View className="analysis-card">
                <View className="card-title">生活建议</View>
                <View className="card-content">{result.lifeAdvice}</View>
              </View>
            </View>

            <View className="reset-button" onClick={() => setResult(null)}>
              <View className="button-text">解析新梦境</View>
            </View>

            <View className="notice-text">
              * 解梦结果仅供参考，梦境解析因人而异
            </View>
          </View>
        )}
      </View>
    </PageLayout>
  );
};

export default DreamInterpretation;
