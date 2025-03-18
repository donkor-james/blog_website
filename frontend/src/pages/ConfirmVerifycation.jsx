import React, {useEffect, useState} from "react";
import {data, useNavigate, useParams} from "react-router-dom";

const ConfirmVerification = () => {
    const {uidb64, token} = useParams();
    const [ message, setMessage ] = useState(null);
    const [isloading, setIsLoading] = useState(true);
    const [isVerfiied, setIsVerified] = useState(false);
    const [responseData, setResponseData] = useState(null)
    const navigate = useNavigate();

    useEffect(() =>{
        handleVerification()
    }, [])

    const handleVerification = async () => {
        try{
            // console.log(uidb64, token, "cred")
            const response = await fetch(`http://localhost:8000/api/users/verify-confirm/${uidb64}/${token}/`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                }
            })
    
            if (response.ok){
                const data = await response.json()
                setMessage(data.message)
                // console.log(data)
                setResponseData(data)
                setIsLoading(false)
                setIsVerified(true)
                // console.log(data)
            }else{
                if(response.status === 404){
                    setMessage('Invalid Link or user does not exist')
                }else if(response.status === 400){
                    setMessage('Link has expired')
                }else{
                    setMessage('Something went wrong, try again later')
                }
                setIsLoading(false)
                // setMessage("An unexpected error occurred. Please try again later.");
            }
        }catch(error){
                setMessage("Something went wrong");
                setIsLoading(false)
            console.log(error)
        }
    }

    const handleRedirect = (e) =>{
        e.preventDefault()
        localStorage.setItem('refress', responseData.refresh)
        localStorage.setItem('access', responseData.access)
        navigate('/')
    }

    const handleResendVerification =  () => {
        navigate('/resend-verification')
    }


    return(
        <>
            <form action="">
                <div className="text-center pb-10">
                    
                    { isloading ? (
                        <div className="flex flex-col justify-center items-center h-screen">
                            <h1 className="text-3xl font-bold">Account Verification</h1>
                            <p className="mt-5">Please wait while we verify your account...</p>
                        </div>
                    ): (
                    
                        <div>
                            { isVerfiied ? 
                            <div className="flex flex-col justify-center items-center h-screen">
                                <p className='mb-4 text-green-800 text-xl'><span className="font-bold mr-4">V</span> {message}</p>
                                <button onClick={handleRedirect} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">click to login</button>
                            </div> :
                            <div className="flex justify-center items-center h-screen">
                                <div className="bg-white rounded-lg shadow-sm px-8 w-1/2">
                                <h2 className="text-2xl font-bold mb">Verification Failed</h2>
                                <p className="text-gray-600 mb-4 text-red-600">{message}</p>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleResendVerification}>
                                    Resend Verification Link
                                </button>
                                </div>
                            </div>
                            }
                        </div>
                    )
                    }
                </div>
            </form>
        </>
    )
}

export default ConfirmVerification;


