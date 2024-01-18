import React,{useEffect,useState} from 'react';
import ChatPage from './ChatPage';

const MemberPage = () => {
    const [notif,setNotif] = useState(null);

    useEffect(() => {
        setNotif(new WebSocket(`ws://localhost:8000/ws/chat/groupe/notifications/`));
      }, []);

    return (
        <div>
        {notif ?(<ChatPage notif={notif}/>):(<div></div>)}
        </div>        
    );
};

export default MemberPage;