import axios from "axios";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("doe.john@iiitb.ac.in");
    const [password, setPassword] = useState("123456");

    const navigate = useNavigate();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await axios.post("/auth/login", { email, password })
            const data: {jwtToken: string, user_type: string} = res.data;

            localStorage.setItem("jwtToken", data.jwtToken);

            if(data.user_type === "student")
                navigate("/student");
            else if(data.user_type === "employee")
                navigate("/employee");
            else
                alert("Failed to login!")
        } catch (error) {
            alert("Failed to login!");
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleFormSubmit}>
                <input type="text" value={email} name="email" 
                    className="rounded border-2 border-indigo-500"
                    onChange={e => setEmail(e.target.value)}
                />
                <input type="password" value={password} name="password"
                    className="rounded border-2 border-indigo-500"
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit" className="bg-emerald-500">Login</button>
            </form>
        </div>
    );
}

export default Login;