import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import toast from 'react-hot-toast'

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

    const { chats, setSelectedChat, theme, setTheme, user, navigate, createNewChat, axios, setChats, fetchUsersChats, setToken, token } = useAppContext()
    const [search, setSearch] = useState('')

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        toast.success('Logged out successfully')
    }

    const deleteChat = async (e, chatId) => {
        try {
            e.stopPropagation()
            const conform = window.confirm('Are you sure you want to delete this chat?')
            if(!conform) return
            const { data } = await axios.post('/api/chat/delete', {chatId}, {headers: {Authorization: token}})
            if(data.success){
                setChats(prev => prev.filter(chat => chat._id !== chatId))
                await fetchUsersChats()
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className={`flex flex-col h-screen min-w-72 p-5 max-md:bg-white max-md:dark:bg-[#000a04] dark:bg-linear-to-b from-[#000a04]/90 to-[#000000]/95 border-r border-[#00FF41]/10 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-50 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>

            {/*Logo*/}
            <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-48' />

            {/*New chat button*/}
            <button onClick={(e) => {
                console.log("New Chat Button Clicked in Sidebar!");
                createNewChat(e);
            }} className='flex justify-center items-center w-full py-3 mt-8 text-black font-semibold bg-gradient-to-r from-[#0D9B3E] via-[#00FF41] to-[#39FF14] text-sm rounded-full cursor-pointer transition-all duration-300 dark:shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:dark:shadow-[0_0_40px_rgba(0,255,65,0.6)] hover:scale-105 active:scale-95'>
                <span className='mr-2 text-2xl font-light'>+</span> New Chat
            </button>

            {/*Search Conversation */}
            <div className='flex items-center gap-3 px-4 py-3 mt-4 bg-gray-100 dark:bg-[#0a1a0d] rounded-full transition-all duration-300 border border-[#00FF41]/10 focus-within:border-gray-400 dark:focus-within:border-[#00FF41]/40'>
                <img src={assets.search_icon} className='w-4 opacity-60 not-dark:invert' alt="" />
                <input onChange={(e) => setSearch(e.target.value)} value={search} type="text" placeholder='Search conversations' className='flex-1 text-sm bg-transparent placeholder:text-gray-500 text-gray-700 dark:text-white outline-none' />
            </div>

            {/*Recent chats */}
            {chats.length > 0 && <p className='mt-6 px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider'>Recent Chats</p>}
            <div className='flex-1 overflow-y-scroll mt-2 text-sm space-y-2 custom-scrollbar'>
                {
                    chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
                        <div onClick={()=>{navigate('/'); setSelectedChat(chat); setIsMenuOpen(false)}} key={chat._id} className='p-2.5 px-3 rounded-xl cursor-pointer flex justify-between items-center group transition-all duration-200 hover:bg-gray-100 dark:hover:bg-[#00FF41]/5 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white border border-gray-200 dark:border-[#00FF41]/5'>
                            <div className='flex-1 min-w-0'>
                                <p className='truncate w-full font-medium text-sm'>
                                    {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                                </p>
                                <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors'>{moment(chat.updatedAt).fromNow()}</p>
                            </div>
                            <img src={assets.bin_icon} className='max-md:block hidden group-hover:block w-4 cursor-pointer max-md:opacity-100 opacity-60 hover:opacity-100 not-dark:invert transition-opacity' alt="delete" onClick={e=> toast.promise(deleteChat(e, chat._id),{loading: 'deleting...'})}/>
                        </div>
                    ))
                }
            </div>

            <div className='border-t border-gray-300 dark:border-white/10 mt-2 mb-4 opacity-50'></div>

            {/*Community Images */}
            <div onClick={() => { navigate('/community'); setIsMenuOpen(false) }} className='flex items-center gap-3 p-3 px-4 rounded-xl cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#00FF41]/5 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'>
                <img src={assets.gallery_icon} className='w-5 opacity-60 group-hover:opacity-100 not-dark:invert transition-opacity' alt="" />
                <div className='flex flex-col text-sm font-medium'>
                    <p>Community Images</p>
                </div>
            </div>

            {/*Credit Purchases Option */}
            <div onClick={() => { navigate('/credits'); setIsMenuOpen(false)}} className='flex items-center gap-3 p-3 px-4 mt-2 rounded-xl cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#00FF41]/5 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'>
                <img src={assets.diamond_icon} className='w-5 opacity-60 group-hover:opacity-100 dark:invert transition-opacity' alt="" />
                <div className='flex flex-col text-sm'>
                    <p className='font-medium'>Credits : {user?.credits}</p>
                    <p className='text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'>Purchase credits to use gpt</p>
                </div>
            </div>

            {/*Dark Mode Toggle*/}
            <div className='flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-[#00FF41]/15 rounded-md'>
                <div className='flex items-center gap-2 text-sm'>
                    <img src={assets.theme_icon} className='w-4 not-dark:invert' alt="" />
                    <p>Dark Mode</p>
                </div>
                <label className='relative inline-flex cursor-pointer'>
                    <input onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox" className='sr-only peer' checked={theme === 'dark'} />
                    <div className='w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-green-700 transition-all'></div>
                    <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>
                </label>
            </div>

            {/*User Account */}
            <div className='flex items-center gap-3 p-3 mt-4 rounded-xl cursor-pointer group border border-gray-200 dark:border-[#00FF41]/10 bg-gray-50 dark:bg-[#00FF41]/[0.03] hover:bg-gray-100 dark:hover:bg-[#00FF41]/[0.06] transition-all duration-300'>
                <div className='relative'>
                    <div className='absolute inset-[-2px] rounded-full bg-gradient-to-r from-[#0D9B3E] to-[#39FF14] opacity-60'></div>
                    <img src={assets.user_icon} className='w-9 h-9 rounded-full relative z-10 border-2 border-[#000a04]' alt="" />
                </div>
                <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold dark:text-white truncate'>{user ? user.name : 'Login your account'}</p>
                    {user?.email && <p className='text-xs text-gray-400 dark:text-gray-500 truncate'>{user.email}</p>}
                </div>
                {user && <button onClick={logout} className='p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-200 border border-red-500/10 hover:border-red-500/25 max-md:block hidden group-hover:block'>
                    <img src={assets.logout_icon} className='h-4 w-4 not-dark:invert opacity-60 hover:opacity-100 transition-opacity' alt="logout" />
                </button>}
            </div>

            <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon} className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' />

        </div>
    )
}

export default Sidebar
