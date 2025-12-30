import { View, Picker, Input } from "@tarojs/components";
import { useState } from "react";
import "./index.less";

const BaziForm = ({ onSubmit }) => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    name: "",
    year: currentYear,
    month: 1,
    day: 1,
    hour: 0,
    gender: "男",
  });

  // 生成年份选项（1920-当前年份）
  const years = Array.from({ length: currentYear - 1919 }, (_, i) => 1920 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const genders = ["男", "女"];

  const handleYearChange = (e) => {
    setFormData({ ...formData, year: years[e.detail.value] });
  };

  const handleMonthChange = (e) => {
    setFormData({ ...formData, month: months[e.detail.value] });
  };

  const handleDayChange = (e) => {
    setFormData({ ...formData, day: days[e.detail.value] });
  };

  const handleHourChange = (e) => {
    setFormData({ ...formData, hour: hours[e.detail.value] });
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, gender: genders[e.detail.value] });
  };

  const handleNameInput = (e) => {
    setFormData({ ...formData, name: e.detail.value });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      // 可以使用 Taro.showToast 提示
      return;
    }
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <View className="bazi-form">
      <View className="form-item">
        <View className="form-label">姓名</View>
        <Input
          className="form-input"
          type="text"
          placeholder="请输入您的姓名"
          value={formData.name}
          onInput={handleNameInput}
        />
      </View>

      <View className="form-item">
        <View className="form-label">性别</View>
        <Picker
          mode="selector"
          range={genders}
          value={genders.indexOf(formData.gender)}
          onChange={handleGenderChange}
        >
          <View className="form-picker">
            <View className="picker-value">{formData.gender}</View>
            <View className="picker-arrow">›</View>
          </View>
        </Picker>
      </View>

      <View className="form-item">
        <View className="form-label">出生年份</View>
        <Picker
          mode="selector"
          range={years}
          value={years.indexOf(formData.year)}
          onChange={handleYearChange}
        >
          <View className="form-picker">
            <View className="picker-value">{formData.year}年</View>
            <View className="picker-arrow">›</View>
          </View>
        </Picker>
      </View>

      <View className="form-row">
        <View className="form-item half">
          <View className="form-label">月份</View>
          <Picker
            mode="selector"
            range={months}
            value={months.indexOf(formData.month)}
            onChange={handleMonthChange}
          >
            <View className="form-picker">
              <View className="picker-value">{formData.month}月</View>
              <View className="picker-arrow">›</View>
            </View>
          </Picker>
        </View>

        <View className="form-item half">
          <View className="form-label">日期</View>
          <Picker
            mode="selector"
            range={days}
            value={days.indexOf(formData.day)}
            onChange={handleDayChange}
          >
            <View className="form-picker">
              <View className="picker-value">{formData.day}日</View>
              <View className="picker-arrow">›</View>
            </View>
          </Picker>
        </View>
      </View>

      <View className="form-item">
        <View className="form-label">出生时辰</View>
        <Picker
          mode="selector"
          range={hours}
          value={hours.indexOf(formData.hour)}
          onChange={handleHourChange}
        >
          <View className="form-picker">
            <View className="picker-value">{formData.hour}时</View>
            <View className="picker-arrow">›</View>
          </View>
        </Picker>
      </View>

      <View className="submit-button" onClick={handleSubmit}>
        <View className="button-text">开始测算</View>
      </View>

      <View className="form-notice">
        * 请准确填写出生信息，以获得精准测算结果
      </View>
    </View>
  );
};

export default BaziForm;
