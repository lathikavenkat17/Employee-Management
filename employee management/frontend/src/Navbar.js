import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import './Navbar.css';

function Navbar({ onLogout, loggedUser }) {
  const [showAttendanceDrop, setShowAttendanceDrop] = useState(false);
  const [showReportsDrop, setShowReportsDrop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // desktop open/collapse
  const [isMobileOpen, setIsMobileOpen] = useState(false);   // mobile open/close
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate('/login');
      setIsMobileOpen(false); // close mobile sidebar on logout
    }
  };

  const role = loggedUser?.role?.toLowerCase() || '';
  const isPrivileged = role.includes('hr') || role.includes('team lead') || role.includes('manager');
  const isTeamLead = role.includes('team lead');
  const isManager = role.includes('manager');

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="hamburger mobile-hamburger"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar 
          ${isSidebarOpen ? 'open' : 'closed'} 
          ${isMobileOpen ? 'open-mobile' : ''}`}
      >
        {/* Desktop Hamburger */}
        <button
          className="hamburger desktop-hamburger"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Sidebar content */}
        {(isSidebarOpen || isMobileOpen) && (
          <>
            <div className="sidebar-header">
              <div className="logo-title">
                <img src="./man.png" alt="Logo" className="logo" />
                <div className="brand-text">
                  <p className="nav-title">
                    <span className="emp-line">Employee</span>
                    <span className="mgmt-line">Management</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="user-info">
              <h4>{loggedUser.firstName} {loggedUser.lastName}<br />{loggedUser.role}</h4>
            </div>
          </>
        )}

        <ul className="nav-links">
          {isPrivileged ? (
            <>
              <li><Link to="/" onClick={() => setIsMobileOpen(false)}>Home</Link></li>
              <li><Link to="/emplist" onClick={() => setIsMobileOpen(false)}>Employee</Link></li>
              {isManager && <li><Link to="/listproject" onClick={() => setIsMobileOpen(false)}>Projects</Link></li>}
              <li><Link to="/listtask" onClick={() => setIsMobileOpen(false)}>Task</Link></li>

              <li onClick={() => setShowAttendanceDrop(!showAttendanceDrop)}>
                <span className="report">Attendance ▼</span>
                {showAttendanceDrop && (
                  <ul className="dropdown-menu">
                    <li><Link to="/myattendance" onClick={() => setIsMobileOpen(false)}>My Attendance</Link></li>
                    {isTeamLead && <li><Link to="/pending" onClick={() => setIsMobileOpen(false)}>Pending</Link></li>}
                  </ul>
                )}
              </li>

              <li><Link to="/listfeed" onClick={() => setIsMobileOpen(false)}>Feedback</Link></li>

              <li onClick={() => setShowReportsDrop(!showReportsDrop)}>
                <span className="report">Reports ▼</span>
                {showReportsDrop && (
                  <ul className="dropdown-menu">
                    <li><Link to="/AbsentRep" onClick={() => setIsMobileOpen(false)}>Leave Report</Link></li>
                    <li><Link to="/reportfeed" onClick={() => setIsMobileOpen(false)}>Feedback Report</Link></li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            <>
              <li><Link to="/" onClick={() => setIsMobileOpen(false)}>Home</Link></li>
              <li><Link to="/attendance" onClick={() => setIsMobileOpen(false)}>Attendance</Link></li>
              <li><Link to="/listtask" onClick={() => setIsMobileOpen(false)}>Task</Link></li>
              <li><Link to="/listbugs" onClick={() => setIsMobileOpen(false)}>Bugs</Link></li>
            </>
          )}

          <li className="logout-li">
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
