import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Post = ({ prop }) => {
    // console.log(prop)
    const [visible, setVisible] = useState(false);
    const [myPost, setMyPost] = useState(false);
    const [showFullCaption, setShowFullCaption] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(prop?.likes || 0);
    const [commentBtn,setCommentBtn]=useState(false);
    const [comment, setComment] = useState('');

    const navigate = useNavigate();
    const formattedDate = new Date(prop?.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
    });

    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        if (currentUserId === prop.userId) {
            setMyPost(true);
        }

        // Check if the current user has liked the post
        if (prop.likedBy?.includes(currentUserId)) {
            setIsLiked(true);
        }
    }, [currentUserId, prop.userId, prop.likedBy]);

    const handleMore = () => {
        setVisible(!visible);
    };

    const username = prop.username;

    const words = prop?.caption?.split(' ') || [];
    const truncatedCaption = words.slice(0, 6).join(' ');
    const isTruncated = words.length > 6;
    const toggleCaption = () => {
        setShowFullCaption(!showFullCaption);
    };

    const handleLike = async () => {
        const userId = localStorage.getItem('userId');
        const postId = prop._id;
    
        // Ensure userId and postId are available
        if (!userId || !postId) {
            console.error('User ID or Post ID is missing');
            return;  // Exit early if userId or postId is not found
        }
    
        try {
            const res = await axios.put('http://localhost:5001/api/post/likePost', { postId, userId, like: !isLiked });
    
            if (res.status === 200) {
                setIsLiked(!isLiked); // Toggle the like state
                setLikesCount(isLiked ? likesCount - 1 : likesCount + 1); // Increment or decrement the likes count
            }
        } catch (error) {
            console.error('Error liking/unliking post: ' + error.message);
        }
    };

    const handleReport = () => {
        alert('Currently Unavailable');
    };

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`http://localhost:5001/api/post/delete/${prop._id}`);
            if (res.status === 200) {
                alert('Post deleted successfully');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting post: ' + error.message);
        }
    };

    const handleSave = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const postId = prop._id;
            const res = await axios.post('http://localhost:5001/api/post/savePost', { postId, userId });
            if (res.status === 200) {
                alert('Post saved successfully');
            }
        } catch (error) {
            console.error('Error saving post: ' + error.message);
        }
    };

    const handleComment = async () => {
        try {
            const text = comment;
            const userId = localStorage.getItem('userId');
            const postId = prop._id;
            const res = await axios.post('http://localhost:5001/api/post/comment',{text,userId,postId})
            if(res.status === 200){
                alert('Comment posted successfully');
                window.location.reload();
                setComment('');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                console.error(data.message);
    
                if (status === 400) {
                    alert('Bad request: Please ensure all fields are filled in correctly.');
                } else if (status === 404) {
                    alert('Post not found: Unable to comment on this post.');
                } else {
                    alert('An unexpected error occurred. Please try again later.');
                }
            } else {
                console.error('Error:', error.message);
                alert('Network error: Please check your connection and try again.');
            }
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short' }; // Options for formatting
        return date.toLocaleDateString('en-GB', options); // Format as "DD MMM"
    };
    

    return (
        <div className='relative w-[40%] m-auto my-10'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-2'>
                    <Link to={myPost ? '/profile' : `/profile/${username}`} className='PROFILE w-10 h-10 rounded-full bg-red-100'
                        style={{
                            backgroundImage: `url(${prop?.profilePic || 'profilePic'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    ></Link>
                    <div>
                        <button onClick={() => {
                            navigate(myPost ? '/profile' : `/profile/${username}`);
                            window.location.reload();
                        }} className='text-sm'>{prop?.username || 'username'}</button>
                        <p className='text-xs'>{formattedDate || 'Date'}</p>
                    </div>
                </div>
                <button onClick={handleMore} className='cursor-pointer'>
                    <i className="fa-solid fa-ellipsis"></i>
                </button>
            </div>

            <div className='IMAGE w-full my-3 rounded h-[30rem] bg-red-200'
                style={{
                    backgroundImage: `url(${prop?.image || 'image'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            ></div>

            <div className='flex justify-between'>
                <div className='flex gap-5 items-center'>
                {!myPost &&
                    <button onClick={handleLike}>
                        {/* Ensure the heart icon correctly toggles between solid (filled) and regular (unfilled) */}
                        <i className={`fa-heart text-2xl ${isLiked ? 'fa-solid text-red-500' : 'fa-regular'}`}></i>
                    </button>
                }
                {!myPost && 
                <button onClick={()=>setCommentBtn(!commentBtn)}>
                    <i className="fa-regular text-2xl fa-comment"></i>
                </button>
                }
                
                </div>
                {!myPost &&
                    <button onClick={handleSave}>
                        <i className="SAVE fa-regular fa-bookmark text-2xl"></i>
                    </button>
                }
            </div>

            <div className='mt-1'>
                <p className='font-semibold'>{likesCount} Likes</p>
            </div>

            <div className=''>
                {/* Conditionally render truncated or full caption */}
                <p>
                    {showFullCaption ? prop.caption : truncatedCaption}
                    {isTruncated && !showFullCaption && (
                        <span> <button onClick={toggleCaption} className='text-gray-400'>... more</button></span>
                    )}
                </p>
            </div>
            {!myPost && 
            <div className='flex mt-2'>
                <input value={comment} onChange={(e)=>setComment(e.target.value)} type="text" className='border-b-2 w-full outline-none' placeholder='Add a comment...' />
                {comment.length > 0 &&  
                    <button onClick={handleComment} className='text-blue-500 font-semibold px-1'>Post</button>
                }
            </div>
            }
            {commentBtn && (
                <div className='mt-4'>
                {prop.comments && prop.comments.length > 0 ? (
                    prop.comments.map((comment) => (
                        <div key={comment._id} className='flex items-center gap-2 mt-1'>
                            <div
                                className='PROFILE w-8 h-8 rounded-full bg-red-200'
                                style={{
                                    backgroundImage: `url(${comment.profilePic || 'default-profile-pic-url'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',  
                                }}
                            ></div>
                            <div className='w-full'>
                                <div className='flex items-center justify-between w-full'>
                                    <p className='font-semibold'>{comment.username || 'username'}</p>
                                    <p className='text-xs'>{formatDate(comment.createdAt)}</p>
                                </div>
                                <p className='text-sm'>{comment.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-gray-500'>No comments yet.</p>
                )}
            </div>
            )}
            


            {
                visible &&
                <div className='bg-white border w-fit h-fit flex flex-col items-start absolute top-10 right-0 rounded-md shadow-md'>
                    {!myPost &&
                        <button onClick={handleReport} className='flex gap-2 items-center hover:bg-gray-100 w-full px-3 py-1'>
                            <i className="fa-solid text-sm fa-triangle-exclamation"></i>
                            Report
                        </button>
                    }
                    {myPost &&
                        <button className='flex gap-2 items-center hover:bg-gray-100 w-full px-3 py-1'>
                            <i className="fa-solid text-sm fa-pen-to-square"></i>
                            Edit
                        </button>
                    }
                    {myPost &&
                        <button onClick={handleDelete} className='flex gap-2 items-center hover:bg-gray-100 w-full px-3 py-1'>
                            <i className="fa-solid text-sm fa-trash-can"></i>
                            Delete
                        </button>
                    }
                </div>
            }
        </div>
    );
};

export default Post;
