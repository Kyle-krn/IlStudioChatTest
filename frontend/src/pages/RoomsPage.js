import React, {useEffect, useCallback} from 'react';
import { RoomForm } from '../components/RoomForm/RoomForm';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { setRooms, setError, appendRoom } from '../redux/chat/roomReducers';


export const RoomsPage = () => {
    const {isAuthenticated} = useSelector(state => state.authData.login)
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:8000/ws/rooms/", {
        shouldReconnect: (closeEvent) => true,
    });

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }[readyState];

    // console.log(connectionStatus)
    
    useEffect(()=>{
        if (lastMessage !== null) {
            let data = JSON.parse(lastMessage.data)
            switch (data.type) {
                case 'all_rooms':
                    dispatch(setRooms(data.rooms))
                    break
                case 'created_room':
                    dispatch(appendRoom(data.room))
                    break;
                case 'title_unique':
                    dispatch(setError("Комната с таким именем уже существует."))
                    break
            }
        }
    }, [lastMessage])

    const handleCreateRoom = useCallback((title) => sendMessage(JSON.stringify({
        "type": "createRoom",
        title
    })), []);


    useEffect(()=>{
        document.title = 'Rooms';
    },[])

    useEffect(()=>{
        !isAuthenticated && navigate('/login');
    }, [isAuthenticated])
    
    return (
        <div className='roomPage'>
            <RoomForm connectionStatus={connectionStatus} handleCreateRoom={handleCreateRoom}/>
        </div>
    )
}