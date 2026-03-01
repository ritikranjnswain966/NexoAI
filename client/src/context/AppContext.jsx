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

    const createNewChat = async () =>{
        try {
            if(!user) return toast.error('Login to create a new chat')
            const { data } = await axios.get('/api/chat/create',{headers: {Authorization: token}})
            if (data?.success) {
                navigate('/')
                await fetchUsersChats()
            } else {
                toast.error(data?.message || 'Error creating chat')
                console.error('Chat creation failed:', data)
            }
        } catch (error) {
            toast.error(error.message)
            console.error('Chat creation error:', error)
        }
    }

    const fetchUsersChats = async () => {
        try {
            const {data} = await axios.get('/api/chat/get',{headers: {Authorization: token}})
            if(data.success){
                if(data.chats.length === 0){
                    const createData = await axios.get('/api/chat/create',{headers: {Authorization: token}})
                    if (createData?.data?.success) {
                        const {data: newData} = await axios.get('/api/chat/get',{headers: {Authorization: token}})
                        if (newData.success) {
                            setChats(newData.chats)
                            setSelectedChat(newData.chats[0])
                        }
                    } else {
                        console.error('Initial chat creation failed:', createData)
                    }
                }else{
                    setChats(data.chats)
                    setSelectedChat(data.chats[0])
                }
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
        navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, theme, setTheme, createNewChat, loadingUser,fetchUsersChats, token, setToken, axios
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)