import React, { useState } from 'react'
import{Box} from '@chakra-ui/react'
import ChatBox from '../components/ChatBox';
import SideDrawer from '../components/Miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
 import { ChatState } from '../Context/ChatProvider'

const ChatPage = () => {
  const {user} = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width:"100%"}}>
       {user && <SideDrawer/>}
       <Box 
       display={"flex"} 
       justifyContent={'space-between'}
       w={"100%" }
       h={"91.5vh"} 
       p={4}>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
       </Box>
    </div>
  )
}

export default ChatPage