import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"
import BACKEND_URL from "../config"
import logo from '../assets/logo.png';

export function Auth({endpoint}) {
    const [postInputs, setpostInputs] = useState({
        email: "",
        password: "",
        businessName: ""
    })
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function sendRequest() {
        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${endpoint === "signup" ? "signup" : "login"}`, postInputs)
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            navigate('/waitlist');
            
        } catch (e) {
            console.error("Failed to send request:", e);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-100 mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-100 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-100 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="flex justify-center relative z-10 px-4 sm:px-0">
                    <div className="w-full max-w-md">
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-4">
                            <div className="flex justify-center mb-6">
                                <img className="h-16 hover:scale-105 transition-transform duration-300" src={logo} alt="Logo of Nivo company"/>
                            </div>
                            <div className="text-center text-2xl font-bold text-gray-800 mb-6">
                                {endpoint === "signup" ? "Sign up" : "Log in" }
                            </div>
                            <div className="space-y-4">
                                <LabelledInput 
                                    label={"Email"} 
                                    type={"email"} 
                                    placeholder={"sharon19@gmail.com"} 
                                    onChange={(e) => {
                                        setpostInputs({
                                            ...postInputs,
                                            email: e.target.value
                                        })
                                    }}
                                />

                                <LabelledInput 
                                    label={"Password"} 
                                    type={"password"} 
                                    placeholder={"••••••••"} 
                                    onChange={(e) => {
                                        setpostInputs({
                                            ...postInputs,
                                            password: e.target.value
                                        })
                                    }}
                                />
                                
                                {endpoint === "signup" && (
                                    <LabelledInput 
                                        label={"Business Name"} 
                                        type={"text"} 
                                        placeholder={"Sharon's Restaurant"} 
                                        onChange={(e) => {
                                            setpostInputs({
                                                ...postInputs,
                                                businessName: e.target.value
                                            })
                                        }}
                                    />
                                )}
                                
                                <div className="text-xs text-gray-600 py-2">
                                    {endpoint === "signup" ? "By creating an account you agree to the terms of use and our privacy policy." : "" }
                                </div>

                                <button 
                                    onClick={sendRequest} 
                                    type="button"  
                                    className="w-full bg-[#605BFF] text-white hover:bg-[#4f4adb] transition-all duration-300 hover:scale-[1.02] font-medium rounded-lg text-sm px-5 py-3 flex items-center justify-center shadow-lg shadow-indigo-200"
                                >
                                    {loading ? <div className="loader-small"></div> : (endpoint === "signup" ? "Create account" : "Log in")}
                                </button>

                                <div className="text-sm text-center text-gray-600">
                                    {endpoint === "signup" ? (
                                        <div>
                                            Already have an account? <Link className="text-[#605BFF] hover:text-[#4f4adb] font-medium" to="/login">Login</Link>
                                        </div>
                                    ) : (
                                        <div>
                                            Don't have an account yet? <Link className="text-[#605BFF] hover:text-[#4f4adb] font-medium" to="/signup">New Account</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
}

export function LabelledInput({ label, placeholder, onChange, type }) {
    return <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
        <input 
            onChange={onChange} 
            type={type} 
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#605BFF] focus:border-[#605BFF] block w-full p-2.5 transition-all duration-300 hover:border-[#605BFF]" 
            placeholder={placeholder} 
            required 
        />
    </div>
}

