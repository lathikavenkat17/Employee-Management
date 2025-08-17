import './header.css';
import { useNavigate } from 'react-router-dom';

function Header({ loggedUser, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();        // Call logout logic from App.jsx
      navigate('/login'); // Redirect to login page after logout
    }
  };

  return (
    <div>
    <div className="headers-container">
      <div className="headers-left">
        <img src="./man.png" alt="Logo" className="headers-logo" />
        <h2 className="headers-title">Employee Management</h2>
      </div>
      <div className="headers-user-info">
        <h4 className="headers-user-text">
          {loggedUser?.firstName} {loggedUser?.lastName}
          <br />
          {loggedUser?.role}
        </h4>
      </div>
    </div>
    <div className="logout-li">
      <button className="nav-links-button" onClick={handleLogout}>Logout</button>
    </div>
    </div>
  );
}

export default Header;
