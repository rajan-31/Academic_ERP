import { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { loggedInUserType, setLoggedInUserType } = useAuth();

    const onLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.setItem("userType", "");
        navigate("/login");
    }

    useEffect(() => {
        const userType = localStorage.getItem("userType");
        setLoggedInUserType(userType ? userType : "");
    });

    return (
        <nav className="flex gap-x-2 px-10 py-3 bg-sky-400">
            <Link to="/">Home</Link>
            { !loggedInUserType &&
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            }
            { loggedInUserType === "student" &&
                <Link to="/student">Student</Link>
            }
            { loggedInUserType === "employee" &&
                <Link to="/employee">Employee</Link>
            }
            { loggedInUserType &&
                <button onClick={onLogout}>Logout</button>
            }
        </nav>
    );
}

export default Navbar;