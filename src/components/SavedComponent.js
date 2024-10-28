import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SavedComponent = () => {
    const [posts, setPosts] = useState([]); 
    const [selectedPost, setSelectedPost] = useState(null); // Track the selected post (clicked image)
    console.log(posts)
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const getSavedPosts = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/post/getSavedPosts/${userId}`);
                if (res.status === 200) {
                    // Fetch post data for each saved post ID
                    const savedPostIds = res.data; // This is an array of post IDs
                    const postPromises = savedPostIds.map(id => 
                        axios.get(`http://localhost:5001/api/post/getPostById/${id}`) // Fetch each post data
                    );
                    
                    const postResponses = await Promise.all(postPromises);
                    const postsData = postResponses.map(post => post.data); // Extract data
                    setPosts(postsData); // Set posts data to state
                }
            } catch (error) {
                console.error('Error fetching saved posts:', error.message);
            }
        };
        getSavedPosts();
    }, []);

    const handleImageClick = (post) => {
        setSelectedPost(post); // Set the clicked post as the selected post
    };

    const handleCloseModal = () => {
        setSelectedPost(null); // Deselect post, which closes the modal
    };

    return (
        <div className='w-fit m-auto'>
                    <div className='grid grid-cols-3 gap-x-3 auto-rows-max gap-y-3'>
                        {posts.map((post) => (
                            <button 
                                key={post._id} 
                                className='w-60 h-60'
                                onClick={() => handleImageClick(post)}
                            >
                                <img src={post.image} alt={post.caption} className='object-cover w-full h-full' />
                            </button>
                        ))}
                    </div>

                    {selectedPost && (
                        <div>
                            <div className='fixed inset-0 bg-black bg-opacity-50 z-10' onClick={handleCloseModal}></div>
                            
                            <div className='bg-white w-[50rem] h-[40rem] absolute top-10 left-72 flex rounded-lg z-20'>
                                <div className='w-4/6 h-full rounded-bl-lg rounded-tl-lg flex items-center justify-center'
                                    style={{
                                        backgroundImage: `url(${selectedPost.image})`,
                                        backgroundSize: 'contain',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                >
                                </div>

                                <div className='w-3/6 h-full bg-gray-200 rounded-tr-lg rounded-br-lg px-3 py-2'>
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
                                        <button onClick={handleCloseModal}>
                                            <i className="fa-solid text-lg fa-xmark"></i>
                                        </button>
                                    </div>
                                    <div className='mt-3'>
                                        <p>{selectedPost.caption}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
    )
}

export default SavedComponent
