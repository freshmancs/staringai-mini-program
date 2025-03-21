import { ScrollView, View } from "@tarojs/components"
import Message from "../Message"
import styles from './style.module.less'
import Store from '../../store'
import { useEffect, useRef, useState } from "react"

interface IProps {
  conversationId: string | undefined;
  isShare: boolean;
}

const MessageListView = ({conversationId, isShare}: IProps) => {
  const scrollViewRef = useRef<any>(null)
  const {state, actions} = Store.useContainer()
  const [curConv, setCurConv] = useState(state.conversationList[conversationId as string] || {messages: []})
  const lastMessage = curConv?.messages?.[curConv?.messages?.length - 1]

  const init = async () => {
    if (!conversationId) return
    const data = await actions.getConversation(conversationId, isShare)
    setCurConv(data)
  }

  useEffect(() => {
    init()
  }, [conversationId])

  useEffect(() => {
    setCurConv(state.conversationList[conversationId as string] || {messages: []})
  }, [state.conversationList])

  return (<ScrollView
    ref={scrollViewRef} 
    className={styles.messageListWrapper}
    scrollWithAnimation
    scrollY
    scrollIntoView={`m${lastMessage?.messageId}`}
  >
    <View className={styles.messageListContainer}>
      {curConv?.messages.map((cur, i) => {
        return <Message message={cur} isShare={isShare} key={i} />
      })}
    </View>
  </ScrollView>)
}

export default MessageListView