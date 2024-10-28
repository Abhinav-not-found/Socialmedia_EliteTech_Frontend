import React, { useState } from 'react'
import '../App.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
const Register = () => {
    const [fullName,setFullName]=useState('');
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/user/register',{fullName:fullName,username:username,password:password,email:email})
            if(response.status === 201) {
                alert('Registration successful!')
                navigate('/login')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='flex justify-center gap-5 flex-col w-2/6 h-fit bg-red-30 border rounded-lg py-6 px-8'>
                <h1 className='satisfy text-3xl'>Register</h1>
                <div>
                    <p>Full name</p>
                    <input className='border' value={fullName} onChange={(e)=>setFullName(e.target.value)} type="text"/>
                </div>
                <div>
                    <p>Username</p>
                    <input className='border' value={username} onChange={(e)=>setUsername(e.target.value)} type="text"/>
                </div>
                <div>
                    <p>Email</p>
                    <input className='border' value={email} onChange={(e)=>setEmail(e.target.value)} type="text"/>
                </div>
                <div>
                    <p>Password</p>
                    <input className='border' value={password} onChange={(e)=>setPassword(e.target.value)} type="text"/>
                </div>
                <div>
                    <button onClick={handleRegister} className='border border-black py-2 px-4 rounded-lg'>Register</button>
                </div>
                <p>Already have an account <Link to='/login' className='underline'>Login</Link> here</p>
            </div>
        </div>
    )
}

export default Register
