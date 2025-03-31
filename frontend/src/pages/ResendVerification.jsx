import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function ResendVerification() {
    const [message, setMessage] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false)
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
    
            const data = await response.json()

            if(response.ok){
                navigate('/verification')
                setMessage(data.message)
            }else if(response.status === 500){
                setMessage('Something went wrong, try again later')
                // setMessage("Please enter a valid email address")
            }else{
                if (data.message === "Email is already verified"){
                    setShowPopUp(true)
                }else{
                    setMessage(data.message)
                }
                // setMessage('Invalid email address')
            }
            e.target.email.value = ''
        }catch(error){
            setMessage('Something went wrong, try again later')
            e.target.email.value = ''
            console.log(error)
        }
    }

    const handleLogin = (e) => {
        e.preventDefault()
        navigate('/login')
        setShowPopUp(false)
    }

  return (
    <div>
        <form action="" onSubmit={handleVerify}>
            <div className="flex justify-center items-center h-screen">
                <div className="bg-white rounded-lg shadow-sm p-8 w-1/2">
                    <h2 className="text-2xl font-bold">Resend Verification Email</h2>
                    <p className="text-gray-600 mb-4">Please enter your email address to resend the verification email.</p>
                    {message && <p className='text-red-500 mb-2'>{message}</p>}
                    <input type="email" name='email' id='email' className="border border-gray-300 p-2 w-full rounded" placeholder="Enter your email address" required />
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                        Resend
                    </button>
                </div>
            </div>


        </form>
        { showPopUp && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <span className="cursor-pointer text-gray-500 float-right" onClick={() => setShowPopUp(false)}>&times;</span>
                        <h2 className="text-lg font-bold mb-2">Account Already Activated</h2>
                        <p className="mb-4">Your account is already activated. Please log in to continue.</p>
                        <button 
                            onClick={handleLogin} 
                            className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition"
                        >
                            Login
                        </button>
                    </div>
                </div>
            )}
    </div>
  );
}

export default ResendVerification;