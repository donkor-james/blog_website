import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function ResendVerification() {
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;

        if (email === '' || email === null || email === undefined){
            setMessage('Email is required')
            return
        }

        try{
            const response = await fetch('http://localhost:8000/api/users/resend-verification/',{
                method: 'POST',
                body: JSON.stringify({email}),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
    
            if(response.ok){
                const data = await response.json()
                navigate('/verification')
                setMessage(data.message)
            }else if(response.status === 404){
                setMessage('User does not exist')
            }else if(response.status === 400){
                setMessage('Invalid email address')
            }else{
                setMessage('Something went wrong, try again later')
            }
            e.target.email.value = ''
        }catch(error){
            setMessage('Something went wrong, try again later')
            e.target.email.value = ''
            console.log(error)
        }
    }
  return (
        <form action="" onSubmit={handleVerify}>
            <div className="flex justify-center items-center h-screen">
                <div className="bg-white rounded-lg shadow-sm p-8 w-1/2">
                    <h2 className="text-2xl font-bold mb-4">Enter Email</h2>
                    {message && <p className='text-red-500 mb-2'>{message}</p>}
                    <input type="email" name='email' id='email' className="border border-gray-300 p-2 w-full rounded" placeholder="Enter your email address" required />
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                        Verify Account
                    </button>
                </div>
            </div>
        </form>
  );
}

export default ResendVerification;