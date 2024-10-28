import React, { useContext, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';

const Create = () => {
    const fileInput = useRef(null);
    const navigate = useNavigate();
    const [caption, setCaption] = useState('');
    const { user } = useContext(UserContext);
    const [imageUrl, setImageUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false); // New loading state

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url); // Set preview image URL
            setSelectedFile(file); // Set the actual file object for upload
        }
    };

    const handlePost = async () => {
        if (!selectedFile) {
            alert('Please select a file first.');
            return;
        }

        // Set loading to true when the post starts
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile); // The file for upload
            formData.append('caption', caption); // Append other post details
            formData.append('username', user?.username);
            formData.append('userId', user?._id);
            formData.append('profilePic', user?.profilePic);

            const response = await axios.post(
                'http://localhost:5001/api/post/create',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.status === 200) {
                alert('Post created successfully');
                console.log(response.data);
                navigate('/');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            // Set loading to false after the request completes
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                <div className='bg-white w-[50rem] h-[35rem] rounded-xl'>
                    <div className='bg-gray-800 text-white flex justify-between items-center h-10 px-4 rounded-tl-xl rounded-tr-xl'>
                        <p className='font-semibold'>Create a post</p>
                        <button onClick={() => navigate('/')} className=''>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className='flex'>
                        <button className='w-4/5 h-[32.5rem] bg-red-20 rounded-bl-xl flex items-center justify-center' onClick={() => fileInput.current.click()}>
                            <div
                                className='w-full h-full bg-red-20 rounded-bl-xl flex items-center justify-center'
                                style={{
                                    backgroundImage: `url(${imageUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >
                                {!imageUrl && <p className='text-2xl'>Add photo</p>}
                                <input onChange={handleImageChange} type="file" ref={fileInput} className='hidden' accept='image/png, image/jpeg, image/jpg' />
                            </div>
                        </button>
                        <div className='w-1/2 h-[32.5rem] bg-gray-100 rounded-br-xl p-3'>
                            <div className='flex items-center gap-2'>
                                <div
                                    className='PROFILE w-6 h-6 bg-red-200 rounded-full'
                                    style={{
                                        backgroundImage: `url(${user?.profilePic || ''})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                ></div>
                                <p>{user?.username || 'username'}</p>
                            </div>
                            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className='mt-5 w-full h-40 bg-transparent outline-none resize-none ' placeholder='Type something...'></textarea>
                            <button 
                                onClick={handlePost} 
                                className='border border-black rounded-lg py-1 px-3 mt-2' 
                                disabled={loading} // Disable button while posting
                            >
                                {loading ? 'Posting...' : 'Post'} {/* Show Posting... during loading */}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Create;
