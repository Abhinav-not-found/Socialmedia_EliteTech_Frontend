import React, { useContext, useEffect } from 'react'
import Layout from '../components/Layout'
import Content from '../components/Content'
import axios from 'axios'
import { UserContext } from '../context/userContext'
const Home = () => {
    const {user} = useContext(UserContext)
    // useEffect(() =>{
    //     const getProfile = async() =>{
    //         const userId = localStorage.getItem('userId')
    //         if(userId){
    //             try {
    //                 const res = await axios.get(`http://localhost:5001/api/user/profile/${userId}`)
    //                 if(res.status === 200){
    //                     setUser(res.data)
    //                 }
    //             } catch (error) {
    //                 console.error('Error fetching profile:', error);
    //             }
    //         }
    //     }
    //     getProfile()
    // }, [])
    return (
        <Layout>
            {
                user? 
                <Content/>
                :
                <div className='flex justify-center items-center h-screen w-full'>
                    <h1 className='text-2xl'>You Need To Login First</h1>  
                </div>
            }
        </Layout>
    )
}

export default Home
