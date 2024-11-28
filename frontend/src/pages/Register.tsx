import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Password } from "primereact/password";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("Cavill.Henry@iiitb.ac.in");
    const [password, setPassword] = useState("123");
    const [confirmPassword, setConfirmPassword] = useState("123");
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if(password !== confirmPassword) {
            setPasswordErrorMessage("Passwords missmatched");
            setIsLoading(false);
            return;
        }

        try {
            await axios.post("/auth/signup", { email, password })

            setErrorMessage("");
            navigate("/login");
        } catch (error: any) {
            if(error.status === 401)
                setErrorMessage("Email already registered!");
            else
                setErrorMessage("Something went wrong!");
        }
        setIsLoading(false);
    }

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
                <div className="flex flex-column gap-2 mb-2">
                    <div className="flex gap-2">
                        <i className="pi pi-lock"></i>
                        <label htmlFor="password">Confirm Password</label>
                    </div>
                    <Password value={confirmPassword} required={true} minLength={3} maxLength={6}
                        onChange={e => {
                            if(e.target.value !== password)
                                setPasswordErrorMessage("Passwords missmatched");
                            else
                                setPasswordErrorMessage("");
                            setConfirmPassword(e.target.value);
                        }} 
                        feedback={false} tabIndex={1} 
                        toggleMask
                        className="w-full"
                        inputClassName="w-full"
                        pt={{ iconField: { root: { className: 'w-full' } } }}
                    />
                </div>

                <small className="text-red-600">{passwordErrorMessage}&nbsp;</small>

                <Button type="submit" label="Register"
                    severity="success" 
                    raised icon="pi pi-sign-in" 
                    loading={isLoading}
                    className="w-full mt-3 mb-3"
                />
                {errorMessage &&
                    <Message severity="error" text={errorMessage} className="w-full"/>
                }
            </form>
        </div>
    );
}

export default Register;