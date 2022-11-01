import React, {useEffect, useRef, useState} from "react";
import { DateItem } from "./DateItem/DateItem";
import { UserJoinItem } from "./UserJoinItem/UserJoinItem";
import { MessageItem } from "./MessageItem/MessageItem";
import styles from './ChatBody.module.css';
import { useSelector } from "react-redux";
 

export const ChatBody = () => {
    const {messagesArray} = useSelector(state => state.chat.chat)
    const [isAutoScroll, setIsAutoScroll] = useState(true)
    const scrollDownRef = useRef(null)
    
    const {userId} = useSelector(state => state.authData.login)

    useEffect(()=>{
        isAutoScroll && scrollDownRef.current.scrollIntoView()
    },[messagesArray])

    const ScrollHandler = e => {
        if ((Math.abs( e.currentTarget.scrollHeight  - e.currentTarget.scrollTop) - e.currentTarget.clientHeight ) < 300) {
            !isAutoScroll && setIsAutoScroll(true)
        }  else {
            !!isAutoScroll && setIsAutoScroll(false)
        }
    }

    return (
        <div onScroll={ScrollHandler} className={styles.chatBody + " scroll"}>
            {messagesArray.map( ( el, index )=>{
                if (el.type === 'join_in_room' || el.type === 'leave_in_room') {
                    return <UserJoinItem key={el.id} username={el.user.username} type={el.type}/>
                } else if (el.type === 'new_message') {
                    let isMyMessageUp = false;
                    if (index > 1 && messagesArray[index-1].type === 'new_message') {
                        
                        isMyMessageUp = messagesArray[index-1].message.user_id === userId
                    } 
                    return <MessageItem key={el.message.id}
                                        myMess={userId === el.message.user_id}
                                        isMyMessageUp={isMyMessageUp}
                                        username={el.message.username} 
                                        message={el.message.message} 
                                        created_at={el.message.created_at}
                    />
                }
            })}

            <div ref={scrollDownRef}></div>
        </div>
    )
}