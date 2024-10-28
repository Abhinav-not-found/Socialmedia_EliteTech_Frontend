import React, { useState } from 'react'
import '../App.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import screenshot from '../Assets/Images/screenshot.png'
const Login = () => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const navigate = useNavigate();
    const handleLogin = async() => {
        try {
            const res = await axios.post('http://localhost:5001/api/user/login',{email: email, password: password})
            if(res.status === 200) {
                alert('Login successful!')
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userId', res.data.userId);
                navigate('/');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <div className='flex justify-center items-center h-screen'>
            <div>
                {/* <img src={screenshot} className='w-40 h-auto' /> */}
            </div>
            <div className='flex justify-center gap-5 flex-col w-2/6 h-fit bg-red-30 border rounded-lg py-6 px-8'>
                <h1 className='satisfy text-3xl'>Login</h1>
                <div>
                    <p>Email</p>
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} className='border' type="text"/>
                </div>
                <div>
                    <p>Password</p>
                    <input value={password} onChange={(e)=>setPassword(e.target.value)} className='border' type="text"/>
                </div>
                <div>
                    <button onClick={handleLogin} className='border border-black py-2 px-4 rounded-lg'>Login</button>
                </div>
                <p>Don't have an account yet <Link to='/register' className='underline'>Register</Link> here</p>
            </div>
        </div>
    )
}

export default Login
