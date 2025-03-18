import React from 'react';
import { useNavigate } from 'react-router-dom';

function Verification() {
  const navigate = useNavigate();

  const handleResendVerification = () => {
    navigate('/resend-verification');
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white rounded-lg shadow-sm p-8 md:w-1/2 w-2/3">
        <h2 className="text-2xl font-bold mb-4">Verify Your Account</h2>
        <p className="text-gray-600 mb-4">
          We've sent a verification link to your email address. Please click on the link to verify your account.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleResendVerification}>
          Resend Verification Email
        </button>
      </div>
    </div>
  );
}

export default Verification;