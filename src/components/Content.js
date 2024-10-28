import React,{useEffect, useState} from 'react'
import Post from './Post'
import axios from 'axios'
const Content = () => {
    const [allPosts, setAllPosts]=useState([])
    // console.log(allPosts)
    useEffect(() =>{
        const getAllPosts = async() =>{
            try {
                const res = await axios.get('http://localhost:5001/api/post/getAllPosts')
                if(res.status === 200){
                    // console.log(res.data)
                    const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    setAllPosts(sortedPosts)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        getAllPosts()
    }, [])
    return (
        <div className=' w-5/6 h-screen'>
            <div>
                {
                    allPosts.map(data=>(
                        <Post key={data._id} prop={data}/>
                    ))
                }
            </div>
        </div>
    )
}

export default Content
