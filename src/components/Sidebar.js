import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import profileEmptyImage from '../Assets/Images/ProfileEmpty.png'
import { UserContext } from '../context/userContext';

const Sidebar = () => {
    const [more,setMore]=useState(false);
    const {user} = useContext(UserContext)
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('userId')
        window.location.reload()
    }
    return (
        <div className='relative w-1/6 h-screen border-r-2 px-2 flex flex-col justify-between'>
            <div className='flex flex-col justify-between h-1/4'>
                <Link to='/' className='flex items-center gap-3 w-full py-2 pl-8 rounded-lg mt-8'>
                    <p className='font-semibold text-2xl satisfy'>Instaloop</p>
                </Link>
                <div className='flex flex-col gap-2 mt-10'>
                    <Link to='/' className='flex items-center gap-3 w-full py-2 pl-7 hover:bg-gray-100 rounded-lg'>
                        <i className="fa-solid fa-house"></i>
                        <p>Home</p>
                    </Link>
                    {/* <Link to='/search' className='flex items-center gap-3 w-full py-2 pl-7 hover:bg-gray-100 rounded-lg'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <p>Search</p>
                    </Link> */}
                    {user && 
                    <Link to='/create' className='flex items-center gap-3 w-full py-2 pl-7 hover:bg-gray-100 rounded-lg'>
                        <i className="fa-regular fa-square-plus text-lg"></i>
                        <p>Create</p>
                    </Link>
                    }
                    
                </div>
            </div>
            <div className='flex flex-col gap-4 pb-12'>
                {user? 
                    <Link onClick={()=>{navigate('/profile');window.location.reload()}} className='flex items-center gap-3 w-full py-2 pl-5 hover:bg-gray-100 rounded-lg'>
                    <div className='PROFILE w-8 h-8 rounded-full'
                        style={{
                            backgroundImage: `url(${ user?.profilePic ||profileEmptyImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                            ></div>
                            <p>Profile</p>
                        </Link>
                    :
                        <button onClick={()=>navigate('/login')} className='flex items-center gap-3 w-full py-2 pl-6 hover:bg-gray-100 rounded-lg'>
                            <i className="fa-solid fa-arrow-right-to-bracket"></i>Login</button>
                }
                
                {user && 
                <button onClick={()=>setMore(!more)} className='flex items-center gap-3 w-full py-2 pl-7 hover:bg-gray-100 rounded-lg'>
                    <i className="fa-solid fa-bars"></i>
                    <p>More</p>
                </button>
                }
                
                {more && <div className=' bg-white w-[90%] rounded-xl h-fit py-1 px-1 bottom-24 absolute shadow-lg border flex flex-col items-start'>
                    <button onClick={()=>navigate('/settings')} className='flex items-center gap-3 w-full py-2 pl-7 hover:bg-gray-100 rounded-lg'>
                        <i className="fa-solid fa-gear"></i>
                        Settings</button>
                    <button onClick={()=>navigate('/saved')} className='flex items-center gap-4 w-full py-2 pl-7 hover:bg-gray-100 rounded-lg'>
                        <i className="fa-solid fa-bookmark"></i>
                        Saved</button>
                    <button onClick={handleLogout} className='flex items-center gap-3 w-full py-2 pl-7 hover:bg-gray-100 rounded-lg'>Logout</button>

                </div>}
                
            </div>
        </div>
    )
}

export default Sidebar
