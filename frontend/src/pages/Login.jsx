import { useContext, useState } from "react";
// import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
// import { FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MyContext } from "../Context";

const Login = () => {
    const { userLogin } = MyContext();
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault()
        const credentials = {
            email: e.target.email.value,
            password: e.target.password.value,
        }

        if (credentials.email === '' || credentials.password === '') {
            setError('All fields are required');
            return;
        }
        try{
            const response = await fetch('http://localhost:8000/api/users/login/', {
                method: 'POST',
                body: JSON.stringify(credentials),
                headers:{
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok){
                const data = await response.json()
                userLogin(data.refresh, data.access)
                console.log(data)
                navigate('/dashboard')
            }else if(response.status === 401){
                console.log(response, 'hgh')
                setError('Account not verified')
            }else if(response.status === 400){
                console.log(response, 'hgh')
                setError('Wrong email or password')
            }else if(response.status === 404){
                console.log(response, 'hgh')
                setError('No user with that email')
            }else{
                console.log(response, 'hgh')
                setError( 'Try again, something went wrong')
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }
        }catch(error){
            console.log(error)
            // return {'response': error}
        }
    }


    return (
     <>
        <Navbar />
        <div className="text-center pt-16 pb-8">
            <div className="flex text-blue-600 justify-center items-center space-x-2 font-bold text-4xl mb-2">
                {/* <FaSignInAlt /> */}
                <span>Login</span>
            </div>
            <p className="text-xl font-semibold text-gray-800">Login to your account</p>
        </div>
        <div className="">
            {error && <div className="mt-2 text-red-600 text-center">{error}</div>}
        </div>
        <div className="md:w-7/12 mx-auto px-16 py-6">
            <form onSubmit={handleSubmit}>
                <div className=" mb-2">
                    <input type="email" id="email" className="w-full p-2 border border-gray-300 rounded-md mb-2 outline-none" placeholder="Enter email" required/> 
                </div>
                
                <div className="mb-2">
                    <input type="password" id="password" className="w-full p-2 border border-gray-300 rounded-md mb-2 outline-none" placeholder="Enter password" required />
                </div>

                <button type="submit" className="w-full mb-5 rounded-md bg-blue-600 text-white p-2"> 
                    Login
                </button>        
                <p className=" text-gray-800">Don't have an account? <Link to="/register" className="text-blue-600">Register</Link></p>
            </form>
        </div>
       
     </>
    );
}

export default Login;





