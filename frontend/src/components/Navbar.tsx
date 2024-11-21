import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/student">Student</Link>
            <Link to="/employee">Employee</Link>
        </nav>
    );
}

export default Navbar;