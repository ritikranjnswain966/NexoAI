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
        sessionStorage.removeItem('activeChatId')
        setToken(null)
        navigate('/')
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
        <div className={`flex flex-col min-w-72 p-5 max-md:bg-white max-md:dark:bg-[#0c1222] bg-linear-to-b from-white via-slate-50/80 to-blue-50/40 dark:bg-none dark:bg-linear-to-b dark:from-[#0c1222]/90 dark:to-[#030712]/95 border-r border-slate-200/70 dark:border-blue-500/10 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-50 ${!isMenuOpen && 'max-md:-translate-x-full'}`} style={{height: '100dvh'}}>

            {/*Logo*/}
            <div className='flex items-center gap-2 mb-2'>
                <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-40 logo-recolor' />
            </div>

            {/*New chat button*/}
            <button onClick={(e) => {
                createNewChat(e);
                setIsMenuOpen(false);
            }} className='flex justify-center items-center w-full py-3 mt-6 text-white font-semibold bg-linear-to-r from-blue-500 via-violet-500 to-purple-500 text-sm rounded-xl cursor-pointer transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_30px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-[0.98]'>
                <span className='mr-2 text-lg font-light'>+</span> New Chat
            </button>

            {/*Search Conversation */}
            <div className='flex items-center gap-3 px-4 py-2.5 mt-5 bg-white dark:bg-[#0f172a] rounded-xl transition-all duration-300 border border-slate-200 dark:border-blue-500/10 focus-within:border-blue-400 dark:focus-within:border-blue-500/40 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-transparent'>
                <img src={assets.search_icon} className='w-4 opacity-50 not-dark:invert' alt="" />
                <input onChange={(e) => setSearch(e.target.value)} value={search} type="text" placeholder='Search...' className='flex-1 text-sm bg-transparent placeholder:text-gray-400 text-gray-700 dark:text-white outline-none' />
            </div>

            {/*Recent chats */}
            {chats.length > 0 && <p className='mt-5 px-1 text-[11px] font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest'>Recent</p>}
            <div className='flex-1 min-h-0 overflow-y-auto mt-2 text-sm space-y-1 custom-scrollbar pr-1'>
                {
                    chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
                        <div onClick={()=>{sessionStorage.setItem('activeChatId', chat._id); navigate(`/chat/${chat._id}`); setSelectedChat(chat); setIsMenuOpen(false)}} key={chat._id} className='p-2.5 px-3 rounded-xl cursor-pointer flex justify-between items-center group transition-all duration-200 hover:bg-white dark:hover:bg-blue-500/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-blue-500/5 hover:shadow-sm'>
                            <div className='flex-1 min-w-0'>
                                <p className='truncate w-full font-medium text-[13px]'>
                                    {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                                </p>
                                <p className='text-[11px] text-slate-400 dark:text-gray-500 mt-0.5 group-hover:text-slate-500 dark:group-hover:text-gray-400 transition-colors'>{moment(chat.updatedAt).fromNow()}</p>
                            </div>
                            <img src={assets.bin_icon} className='max-md:block hidden group-hover:block w-4 cursor-pointer max-md:opacity-100 opacity-60 hover:opacity-100 not-dark:invert transition-opacity' alt="delete" onClick={e=> toast.promise(deleteChat(e, chat._id),{loading: 'deleting...'})}/>
                        </div>
                    ))
                }
            </div>

            <div className='border-t border-slate-200 dark:border-white/10 mt-2 mb-3'></div>

            {/*Community Images */}
            <div onClick={() => { navigate('/community'); setIsMenuOpen(false) }} className='flex items-center gap-3 p-2.5 px-3 rounded-xl cursor-pointer group hover:bg-white dark:hover:bg-blue-500/5 transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:shadow-sm'>
                <div className='w-8 h-8 flex items-center justify-center rounded-lg bg-violet-50 dark:bg-transparent'>
                    <img src={assets.gallery_icon} className='w-4 opacity-70 group-hover:opacity-100 not-dark:invert transition-opacity' alt="" />
                </div>
                <p className='text-sm font-medium'>Community</p>
            </div>

            {/*Credit Purchases Option */}
            <div onClick={() => { navigate('/credits'); setIsMenuOpen(false)}} className='flex items-center gap-3 p-2.5 px-3 mt-1 rounded-xl cursor-pointer group hover:bg-white dark:hover:bg-blue-500/5 transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:shadow-sm'>
                <div className='w-8 h-8 flex items-center justify-center rounded-lg bg-amber-50 dark:bg-transparent'>
                    <img src={assets.diamond_icon} className='w-4 opacity-70 group-hover:opacity-100 dark:invert transition-opacity' alt="" />
                </div>
                <div className='flex flex-col'>
                    <p className='text-sm font-medium'>Credits : {user?.credits}</p>
                    <p className='text-[11px] text-slate-400 dark:text-gray-500 group-hover:text-slate-500 dark:group-hover:text-gray-400'>Buy more credits</p>
                </div>
            </div>

            {/*Dark Mode Toggle*/}
            <div className='flex items-center justify-between gap-2 p-3 mt-3 bg-white dark:bg-transparent border border-slate-200 dark:border-blue-500/15 rounded-xl'>
                <div className='flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300'>
                    <img src={assets.theme_icon} className='w-4 not-dark:invert' alt="" />
                    <p>Dark Mode</p>
                </div>
                <label className='relative inline-flex cursor-pointer'>
                    <input onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox" className='sr-only peer' checked={theme === 'dark'} />
                    <div className='w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-500 transition-all'></div>
                    <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm'></span>
                </label>
            </div>

            {/*User Account */}
            <div className='flex items-center gap-3 p-3 mt-3 rounded-xl cursor-pointer group bg-white dark:bg-blue-500/3 border border-slate-200 dark:border-blue-500/10 hover:border-blue-200 dark:hover:border-blue-500/20 transition-all duration-300 hover:shadow-sm'>
                <div className='relative'>
                    <div className='absolute inset-[-2px] rounded-full bg-linear-to-r from-cyan-400 to-violet-400 opacity-70'></div>
                    <img src={assets.user_icon} className='w-9 h-9 rounded-full relative z-10 border-2 border-white dark:border-[#0c1222]' alt="" />
                </div>
                <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-gray-800 dark:text-white truncate'>{user ? user.name : 'Login your account'}</p>
                    {user?.email && <p className='text-[11px] text-slate-400 dark:text-gray-500 truncate'>{user.email}</p>}
                </div>
                {user && <button onClick={logout} className='p-2 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-200 border border-red-100 dark:border-red-500/10 hover:border-red-200 dark:hover:border-red-500/25 max-md:block hidden group-hover:block'>
                    <img src={assets.logout_icon} className='h-4 w-4 not-dark:invert opacity-60 hover:opacity-100 transition-opacity' alt="logout" />
                </button>}
            </div>

            <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon} className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' />

        </div>
    )
}

export default Sidebar
