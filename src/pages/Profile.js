import React, { useContext, useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import profileEmptyImage from '../Assets/Images/ProfileEmpty.png'
import axios from 'axios'
import { UserContext } from '../context/userContext';
import { useNavigate, useParams } from 'react-router-dom';
import SavedComponent from '../components/SavedComponent';
const Profile = () => {
    const fileInput = useRef(null);
    const [imageUrl,setImageUrl]=useState(null);
    const [selectedFile,setSelectedFile] = useState(null);
    const {user,setUser} = useContext(UserContext)
    // console.log(user)
    const {username} = useParams()
    const [specProfile,setSpecProfile] = useState(null);
    const [token,setToken] = useState(null);
    const [follow , setFollow] = useState(false);
    const [followText , setFollowText] = useState('Follow');
    const [postCount,setPostCount] = useState(null);
    const [post,setPost] = useState([])
    const [selectedPost, setSelectedPost] = useState(null);
    const [visible,setVisible]=useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        // window.location.reload();
        setToken(localStorage.getItem('token'))
    },[])
    
    const getSpecificProfile = async()=>{
        try {
            const res = await axios.get(`http://localhost:5001/api/user/specificProfile/${username}`)
            if(res.status === 200) {
                // console.log('hello : ',res.data)
                setSpecProfile(res.data);
                // Check if the user is already following this profile

                const userId = localStorage.getItem('userId');
                if (res.data.followers.includes(userId)) {
                    setFollow(true);
                    setFollowText('UnFollow');
                } else {
                    setFollow(false);
                    setFollowText('Follow');
                }
            }
        } catch (error) {
            console.error('Error fetching specific user:', error);
        }
    }
    useEffect(() => {
        if (username) {
            getSpecificProfile();
        }
    }, [username]);
    

    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        if(file) {
            const url = URL.createObjectURL(file)
            setImageUrl(url)
            setSelectedFile(file)
            console.log(imageUrl);
        }
    }
    const handleSubmit = async()=>{
        if (!selectedFile) {
            alert('Please select a file first.');
            return;
        }

        const userId = localStorage.getItem('userId')
        console.log(userId)

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const res = await axios.post(`http://localhost:5001/upload/${userId}`, formData,{headers:{'Content-Type':'multipart/form-data'}})
            if(res.status === 200){
                alert('Image uploaded successfully')
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }
    const handleFollowButton = async () => {
        if (follow) {
            await handleUnFollowing();
        } else {
            await handleFollowing();
        }
        setFollow(!follow);
        setFollowText(follow ? 'Follow' : 'UnFollow');
    }
    const handleFollowing=async()=>{
        try {
            const userId = localStorage.getItem('userId')
            const res = await axios.put(`http://localhost:5001/api/user/follow/${specProfile._id}`, {userId})
            if(res.status === 200){
                console.log(res.data)
                window.location.reload()
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    }
    const handleUnFollowing = async()=>{
        try {
            const userId = localStorage.getItem('userId')
            const res = await axios.put(`http://localhost:5001/api/user/unfollow/${specProfile._id}`, {userId})
            if(res.status === 200){
                console.log(res.data)
                window.location.reload()

            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    }
    useEffect(() => {
        const getPostCount = async () => {
            if (specProfile?.username || user?.username) { 
                try {
                    const res = await axios.get(`http://localhost:5001/api/post/getPostCount/${specProfile?.username || user?.username}`);
                    if (res.status === 200) {
                        // console.log('Post Count:', res.data); 
                        setPostCount(res.data.postCount);
                        setPost(res.data.findPosts)  
                    }
                } catch (error) {
                    console.error('Error fetching post count:', error);
                }
            }
        };
    
        getPostCount();
    }, [specProfile?.username, user?.username]);      
    
    const handleImageClick = (post) => {
        setSelectedPost(post); 
    };

    const handleCloseModal = () => {
        setSelectedPost(null); 
    };
    const handleMore = () => {
        setVisible(!visible)
    }
    const handleDelete = async() => {
        try {
            const postId = selectedPost._id
            const res = await axios.delete(`http://localhost:5001/api/post/delete/${postId}`)
            if (res.status === 200) {
                alert('Post deleted successfully')
                window.location.reload()
            }
        } catch (error) {
            return console.log('Error deleting post: ' + error.message)
        }
    }
    return (
        <Layout>
            <div className=' relative flex flex-col items-center w-full'>
                    <div className='flex justify-center gap-10 pt-10 w-full'>
                        <div className='flex flex-col gap-4 items-center'>
                            <button onClick={()=>!specProfile && fileInput.current.click()}>
                                <div className='relative w-32 h-32 rounded-full hover:drop-shadow-xl group'>
                                <div 
                                    className='absolute inset-0 w-full h-full rounded-full bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300'
                                    ></div>
                                <div 
                                    className='PROFILE w-32 h-32 rounded-full'
                                    style={{
                                        backgroundImage: `url(${imageUrl|| specProfile?.profilePic || user?.profilePic ||profileEmptyImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                    ></div>
                                <div 
                                    className='absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                    >
                                    Add Photo
                                </div>
                            </div>
                                    <input onChange={handleImageChange} disabled={specProfile} ref={fileInput} type="file" className='hidden' accept='image/png, image/jpeg, image/jpg'/>
                            
                        </button>
                        {!specProfile && <button onClick={handleSubmit} className='hover:bg-gray-200 py-1 px-3 w-fit rounded-md bg-gray-100 font-semibold text-sm'>Update</button>}
                    </div>
                        
                    <div className='flex-col flex gap-8'>
                        <div className='flex gap-5 items-end'>
                            <p className='text-lg'>{ specProfile?.username || user?.username || 'username'}</p>
                            <div className='flex gap-3'>
                                {!specProfile && <button onClick={()=>navigate('/settings')} className='hover:bg-gray-200 py-1 px-3 rounded-md bg-gray-100 font-semibold text-sm'>Edit profile</button> }
                                
                                {specProfile && <button onClick={handleFollowButton} className='hover:bg-gray-200 py-1 px-3 rounded-md bg-gray-100 font-semibold text-sm'>{followText}</button>}
                                
                                {/* <button className='py-1 px-3 rounded-full'>
                                    <i className="fa-solid fa-ellipsis"></i>
                                </button> */}
                            </div>
                        </div>
                        <div className='flex gap-10'>
                            <p><span className='font-semibold'>{postCount || '0'}</span> posts</p>
                            <p><span className='font-semibold'>{specProfile ? specProfile.followers.length : (user?.followers?.length || '0')}</span> followers</p>
                            <p><span className='font-semibold'>{specProfile ? specProfile.following.length : (user?.following?.length || '0')}</span> following</p>
                        </div>
                        <div>
                            <p className='font-semibold'>{ specProfile?.fullName || user?.fullName || 'Name'}</p>
                            <p className='text-gray-500 text-sm' >{user?.bio}</p>
                        </div>
                    </div>
                </div>
                <div className='pt-20'>
                    <h1 className='text-center mb-5 uppercase'>Posts</h1>
                    <div className='grid grid-cols-3 gap-x-3 auto-rows-max gap-y-3 relative'>
                        {post.length > 0 ? (
                            post.map((post, index) => (
                                <button
                                onClick={() => handleImageClick(post)}
                                key={index}>
                                    <div className='w-60 h-60 bg-gray-200'
                                        style={{
                                            backgroundImage: `url(${post.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    ></div>
                                </button>
                            ))
                        ) : (
                            <p className='absolute top-0 w-40' >No posts found.</p>
                        )}
                    </div>
                    {selectedPost && 
                        <div className='bg-white w-[55rem] border shadow-lg h-[40rem] absolute top-10 left-20 flex rounded-lg z-20'>
                        <div className='w-4/6 h-full  rounded-bl-lg rounded-tl-lg flex items-center justify-center'
                                style={{
                                    backgroundImage: `url(${selectedPost.image})`,
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >
                        </div>
                        <div className='w-3/6 h-full bg-gray-100 rounded-tr-lg rounded-br-lg px-3 py-2 relative'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex gap-2 items-center'>
                                        <div className='PROFILE w-8 h-8 bg-red-200 rounded-full'
                                            style={{
                                                backgroundImage: `url(${selectedPost.profilePic})`,
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                        ></div>
                                        <p>{selectedPost.username}</p>
                                    </div>
                                    <div className='flex gap-3'>
                                        <button onClick={handleMore} className='cursor-pointer'>
                                            <i className="fa-solid fa-ellipsis"></i>
                                        </button>
                                        <button onClick={handleCloseModal}>
                                            <i className="fa-solid text-lg fa-xmark"></i>
                                        </button>
                                    </div>
                                    {!specProfile && visible && 
                                    <div className='absolute right-8 top-10 w-fit h-fit bg-white rounded-md py-1'>
                                        <button onClick={handleDelete} className='flex gap-2 items-center hover:bg-gray-200 w-full px-3 py-1'> 
                                            <i className="fa-solid text-sm fa-trash-can"></i>
                                            Delete
                                        </button>
                                    </div>
                                    }
                                </div>
                                <div className='mt-3'>
                                    <p>{selectedPost.caption}</p>
                                </div>
                            </div>
                    </div>
                    }
                    
                </div>
            </div>

        </Layout>
    )
}

export default Profile
