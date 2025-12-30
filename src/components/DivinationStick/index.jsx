import { View } from "@tarojs/components";
import { useState } from "react";
import "./index.less";

const DivinationStick = ({ onComplete }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnStick, setDrawnStick] = useState(null);

  const handleShake = () => {
    if (isShaking || isDrawing) return;

    setIsShaking(true);

    // 摇签动画持续2秒
    setTimeout(() => {
      setIsShaking(false);
      setIsDrawing(true);

      // 抽签动画持续1秒
      const stickNumber = Math.floor(Math.random() * 64) + 1; // 1-64卦
      setTimeout(() => {
        setDrawnStick(stickNumber);
        setIsDrawing(false);
        if (onComplete) {
          onComplete(stickNumber);
        }
      }, 1000);
    }, 2000);
  };

  const handleReset = () => {
    setDrawnStick(null);
  };

  return (
    <View className="divination-stick-container">
      <View className={`stick-holder ${isShaking ? "shaking" : ""}`}>
        <View className="stick-bundle">
          {Array.from({ length: 9 }).map((_, index) => (
            <View
              key={index}
              className={`stick ${isDrawing && index === 4 ? "drawing" : ""}`}
              style={{
                transform: `rotate(${(index - 4) * 8}deg)`,
                zIndex: index === 4 ? 10 : 9 - Math.abs(index - 4),
              }}
            >
              <View className="stick-body" />
              <View className="stick-top" />
            </View>
          ))}
        </View>
      </View>

      {drawnStick && (
        <View className="result-display">
          <View className="result-number">第 {drawnStick} 签</View>
          <View className="result-hint">已为您抽取灵签</View>
        </View>
      )}

      {!drawnStick ? (
        <View className="action-button" onClick={handleShake}>
          <View className="button-text">
            {isShaking ? "摇签中..." : isDrawing ? "抽签中..." : "摇签问卦"}
          </View>
        </View>
      ) : (
        <View className="action-button" onClick={handleReset}>
          <View className="button-text">重新抽签</View>
        </View>
      )}

      <View className="hint-text">
        {!drawnStick && !isShaking && "轻触按钮，诚心问卦"}
      </View>
    </View>
  );
};

export default DivinationStick;
