import React, { useContext, useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [menu, setMenu] = useState(1);
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    // Set bio to user.bio when component mounts
    useEffect(() => {
        if (user && user.bio) {
            setBio(user.bio);
        }
        if(user && user.username) {
            setUsername(user.username);
        }
    }, [user]);

    const handleSave = async () => {
        try {
            const res = await axios.put(`http://localhost:5001/api/user/bio/${user._id}`, { bio,username});
            if (res.status === 200) {
                alert('Updated!');
                setBio(bio); // Update bio with the current value
                navigate('/profile');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating bio:', error);
        }
    };

    return (
        <Layout>
            <div className='flex w-full'>
                <div className='border-r-2 w-1/4 flex flex-col gap-10 justify-center relative'>
                    <button onClick={() => setMenu(1)} className='bg-gray-100 hover:bg-gray-200 w-fit m-auto px-20 py-1 rounded-md text-xl flex text-gray-700 hover:text-gray-900 items-center gap-3'>
                        <i className="fa-solid text-md fa-user"></i>
                        Profile
                    </button>
                    <div className='absolute top-5 left-1/3 text-2xl'>Settings</div>
                </div>
                <div className='w-3/4 h-screen flex px-20 py-40'>
                    {menu === 1 && 
                        <div className='w-full h-full m-auto flex flex-col gap-3'>
                            {/* <p>Username:</p>
                            <input value={username} onChange={(e)=>setUsername(e.target.value)} className='w-fit outline-none resize-none border border-black rounded-md px-2' type="text" /> */}
                            <p>Bio:</p>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder='Type something . . .' 
                                className='w-80 h-40 outline-none resize-none border border-black rounded-md px-2'
                            />
                            <button onClick={handleSave} className='w-fit border border-black px-3 py-1 rounded-md'>Save</button>
                        </div>
                    }
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
