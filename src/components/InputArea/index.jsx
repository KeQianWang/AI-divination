import { useState, useRef } from 'react'
import Taro from '@tarojs/taro'
import { View, Textarea, Input, Text } from '@tarojs/components'
import {
  UploadOutlined,
  LinkOutlined,
  SendOutlined,
  PaperClipOutlined
} from '@taroify/icons'

import './index.less'

export default function InputArea({onSendMessage, disabled = false, placeholder = '輸入消息...'}) {
  const [message, setMessage] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [url, setUrl] = useState('')
  const [attachments, setAttachments] = useState([])
  const [height, setHeight] = useState(0)


  const handleSend = () => {
    if (!message.trim() && attachments.length === 0 && !url.trim()) return

    onSendMessage?.(message, attachments, url)

    setMessage('')
    setUrl('')
    setAttachments([])
    setShowUrlInput(false)
  }

  const handleChooseFile = async () => {
    if (disabled) return

    try {
      const res = await Taro.chooseMessageFile({
        count: 5,
        type: 'file'
      })

      const validFiles = res.tempFiles.filter(file =>
        /\.(pdf|txt|md)$/i.test(file.name)
      )

      setAttachments(prev => [...prev, ...validFiles])
    } catch (err) {
      console.warn('选择文件失败', err)
    }
  }

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getHeight = (e) => {
    const height = e?.detail?.height === 0 ? 0 : e.detail.height
    setHeight(height)
  }
  const resetHeight = () => {
    setHeight(0)
  }
  return (
    <View className="inputAreaContainer">
      {/* 附件 */}
      {attachments.length > 0 && (
        <View className="attachments">
          {attachments.map((file, index) => (
            <View key={index} className="attachmentItem">
              {/*<PaperClipOutlined />*/}
              <Text className="fileName">{file.name}</Text>
              <Text
                className="removeBtn"
                onClick={() => removeAttachment(index)}
              >
                ×
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* URL 输入 */}
      {showUrlInput && (
        <View className="urlInput">
          <Input
            type="text"
            placeholder="輸入網頁URL以添加到知識庫..."
            value={url}
            onInput={e => setUrl(e.detail.value)}
            className="urlField"
          />
          <Text
            className="closeBtn"
            onClick={() => setShowUrlInput(false)}
          >
            ×
          </Text>
        </View>
      )}

      <View className="inputContainer">
        {/* 工具按钮 */}
        <View className="toolButtons">
          <View className="toolBtn" onClick={handleChooseFile}>
            {/*<UploadOutlined />*/}
          </View>

          <View
            className="toolBtn"
            onClick={() => setShowUrlInput(!showUrlInput)}
          >
            {/*<LinkOutlined />*/}
          </View>
        </View>

        {/* 输入框 */}
        <Textarea
          style={{bottom: height + 'px'}}
          value={message}
          onInput={e => setMessage(e.detail.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          adjustPosition={false}
          disabled={disabled}
          autoHeight
          className="messageInput"
          onFocus={(e) => getHeight(e)}
          onBlur={resetHeight}
        />

        {/* 发送按钮 */}
        <View
          className={`sendBtn ${
            disabled ||
            (!message.trim() && attachments.length === 0 && !url.trim())
              ? 'disabled'
              : ''
          }`}
          onClick={handleSend}
        >
          {/*<SendOutlined />*/}
        </View>
      </View>
    </View>
  )
}
