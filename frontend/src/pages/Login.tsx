import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Password } from "primereact/password";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("doe.john558@iiitb.ac.in");
    const [password, setPassword] = useState("123456");
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const { setLoggedInUserType } = useAuth();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        try {
            const res = await axios.post("/auth/login", { email, password })
            const data: {jwtToken: string, user_type: string} = res.data;

            localStorage.setItem("jwtToken", data.jwtToken);

            if(data.user_type === "student") {
                setLoggedInUserType("student");
                localStorage.setItem("userType", "student");
                navigate("/student");
            }
            else if(data.user_type === "employee") {
                setLoggedInUserType("employee");
                localStorage.setItem("userType", "employee");
                navigate("/employee");
            }
            else {
                setLoggedInUserType("");
                localStorage.setItem("userType", "");
                alert("Failed to login!")
            }
            setErrorMessage("");
        } catch (error: any) {
            if(error.status === 401)
                setErrorMessage("Inavlid email or password!");
            else
                setErrorMessage("Something went wrong!");
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setLoggedInUserType("");
        localStorage.setItem("jwtToken", "");
        localStorage.setItem("userType", "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mt-20 mb-5 w-[350px] mx-auto">
            <img src={`${process.env.PUBLIC_URL}/favicon.svg`} alt="Logo" width="80" height="80" className="mb-10 mx-auto block" />
            <form onSubmit={handleFormSubmit}>
                <div className="flex flex-column gap-2 mb-3">
                    <div className="flex gap-2">
                        <i className="pi pi-envelope"></i>
                        <label htmlFor="email">Email</label>
                    </div>
                    <InputText type="email" value={email} keyfilter="email" id="email" required={true}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className="flex flex-column gap-2 mb-3">
                    <div className="flex gap-2">
                        <i className="pi pi-lock"></i>
                        <label htmlFor="password">Password</label>
                    </div>
                    <Password value={password} required={true} minLength={3} maxLength={6}
                        onChange={e => setPassword(e.target.value)} 
                        feedback={false} tabIndex={1} 
                        toggleMask
                        className="w-full"
                        inputClassName="w-full"
                        pt={{ iconField: { root: { className: 'w-full' } } }}
                    />
                </div>
                <Button type="submit" label="Login"
                    severity="success" 
                    raised icon="pi pi-sign-in" 
                    loading={isLoading}
                    className="w-full mb-3"
                />
                {errorMessage &&
                    <Message severity="error" text={errorMessage} className="w-full"/>
                }
            </form>
        </div>
    );
}

export default Login;