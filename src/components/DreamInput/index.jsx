import { View, Textarea } from "@tarojs/components";
import { useState } from "react";
import "./index.less";

const DreamInput = ({ onSubmit }) => {
  const [dreamContent, setDreamContent] = useState("");
  const [dreamKeywords, setDreamKeywords] = useState([]);

  // 常见梦境关键词
  const commonKeywords = [
    "飞翔", "掉落", "水", "火", "蛇", "狗",
    "考试", "追赶", "死亡", "结婚", "怀孕",
    "迷路", "房子", "亲人", "朋友", "钱财"
  ];

  const handleInput = (e) => {
    setDreamContent(e.detail.value);
  };

  const toggleKeyword = (keyword) => {
    if (dreamKeywords.includes(keyword)) {
      setDreamKeywords(dreamKeywords.filter(k => k !== keyword));
    } else {
      setDreamKeywords([...dreamKeywords, keyword]);
    }
  };

  const handleSubmit = () => {
    const content = dreamContent.trim();
    if (!content && dreamKeywords.length === 0) {
      return;
    }

    const fullContent = dreamKeywords.length > 0
      ? `${dreamKeywords.join("、")}${content ? "，" + content : ""}`
      : content;

    if (onSubmit) {
      onSubmit({
        content: fullContent,
        keywords: dreamKeywords,
        rawContent: content,
      });
    }
  };

  return (
    <View className="dream-input">
      <View className="input-section">
        <View className="section-title">描述您的梦境</View>
        <Textarea
          className="dream-textarea"
          placeholder="请详细描述您梦到的内容，场景、人物、情绪等..."
          value={dreamContent}
          onInput={handleInput}
          maxlength={500}
          autoHeight
        />
        <View className="char-count">{dreamContent.length}/500</View>
      </View>

      <View className="keywords-section">
        <View className="section-title">或选择梦境关键词</View>
        <View className="keywords-grid">
          {commonKeywords.map((keyword) => (
            <View
              key={keyword}
              className={`keyword-tag ${dreamKeywords.includes(keyword) ? "active" : ""}`}
              onClick={() => toggleKeyword(keyword)}
            >
              {keyword}
            </View>
          ))}
        </View>
      </View>

      <View className="submit-button" onClick={handleSubmit}>
        <View className="button-text">开始解梦</View>
      </View>

      <View className="input-notice">
        * 梦境解析仅供参考，建议理性看待
      </View>
    </View>
  );
};

export default DreamInput;
