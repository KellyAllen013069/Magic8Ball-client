import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {AuthContext} from '../components/AuthContext'
import { FaHome} from 'react-icons/fa'



function Navbar() {
    let navigate = useNavigate();
    const {authUser, logout} = useContext(AuthContext)

    const handleLogout = () => {
        logout();
        navigate("/");
        window.location.reload();
        
    }
    return (
    
        <div className="navbar-container">
                
                <div className="nav-home">
                    
                        <div>
                        <Link className = "r-link" to="/">
                            <FaHome className="home-icon"/>
                        </Link>
                        </div>
                        <div>
                        <Link className = "r-link" to="/">
                            Magic 8 Ball
                        </Link>
                        </div>
                    
                </div>
                
                
                {authUser ? (
                <div className="nav-display-1">
                    <div className="nav-item">
                        <Link className = "r-link" to="/userThemes">Your Themes</Link>
                    </div>
                    {authUser.Role === 'admin' &&
                    <div className="nav-item">
                        <Link className = "r-link" to="/admin">Admin</Link>
                    </div>
                    }
                    <div className="nav-item">
                        <Link className = "r-link" onClick={handleLogout}>Logout</Link>
                    </div>
                    <div className="nav-user-display">
                        {authUser.thumbnail !== "" && 
                        <div>
                            <img className="avatar-image" src={authUser.thumbnail} alt='User Avatar' />   
                        </div>
                        }
                        <div>
                            {authUser.Name}
                        </div>
                    </div>
                </div>
                ): (
                <div className="nav-display-2">
                    <div className="nav-item">
                        <i>Create your own...</i>
                    </div>
                    <div className="nav-item">
                        <Link className = "r-link" to="/register">Register</Link>
                    </div>
                    <div className="nav-item">
                        <Link className = "r-link" to="/login">Login</Link>
                    </div>
                </div>
                )}
                

        </div>
        
    );
}



export default Navbar;