import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL


const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [isNewChat, setIsNewChat] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [loadingUser, setLoadingUser] = useState(true)

    const fetchUser = async () => {
        try {
            const {data} = await axios.get('/api/user/data',{headers: {Authorization: token}})

            if(data.success){
                setUser(data.user)
            }else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoadingUser(false)
        }
    }

    const createNewChat = () =>{
        setSelectedChat(null)
        setIsNewChat(true)
        sessionStorage.removeItem('activeChatId')
        navigate('/')
    }

    const fetchUsersChats = async () => {
        try {
            const {data} = await axios.get('/api/chat/get',{headers: {Authorization: token}})
            if(data.success){
                setChats(data.chats)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        if (user) {
            fetchUsersChats()
            // Restore active chat from session storage on load
            const activeChatId = sessionStorage.getItem('activeChatId')
            if (activeChatId) {
                navigate(`/chat/${activeChatId}`, { replace: true })
            }
        }
        else {
            setChats([])
            setSelectedChat(null)
        }
    }, [user])

    useEffect(() => {
        if(token){
            fetchUser()
        }else{
            setUser(null)
            setLoadingUser(false)
        }
    }, [token])


    const value = { 
        navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, theme, setTheme, createNewChat, loadingUser, fetchUsersChats, token, setToken, axios, isNewChat, setIsNewChat
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)