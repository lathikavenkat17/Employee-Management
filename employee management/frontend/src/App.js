import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Bread from './pages/Bread';
import Home from './pages/Home';
import Emplist from './pages/Emplist';
import Addemp from './pages/Addemp';
import Edit from './pages/Edit';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Attenup from './pages/Attenup';
import AbsentRep from './reports/AbsentRep';
import ListFeed from './feedback/ListFeed';
import Feedform from './feedback/Feedform';
import Viewfeed from './feedback/Viewfeed';
import Reportfeed from './reports/Reportfeed';
import Login from './logs/Login';
import ViewLeave from './pages/ViewLeave'; 
import Myattendance from './attendance/Myattendance';
import Pending from './attendance/Pending';
import Addproject from './projects/Addproject';
import ListProject from './projects/ListProject';
import EditProject from './projects/EditProject';
import Addtask from './task/Addtask';
import Edittask from './task/Edittask';
import Listtask from './task/Listtask';
import Addbugs from './bugs/addbugs';
import Editbugs from './bugs/editbugs';
import Listbugs from './bugs/listbugs';
import Header from './Header';

function RequireAuth({ isLoggedIn }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function App() {
  useEffect(() => {
    document.title = 'Employee Management';
  }, []);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/accounts/profile/', { withCredentials: true })
      .then(res => {
        setIsLoggedIn(true);
        setLoggedUser(res.data);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setLoggedUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    axios.post('http://127.0.0.1:8000/api/accounts/logout/', {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        setLoggedUser(null);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setLoggedUser(null);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      {isLoggedIn && <Navbar onLogout={handleLogout} loggedUser={loggedUser} />}
      {isLoggedIn && <Bread loggedUser={loggedUser} onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} setLoggedUser={setLoggedUser} />
            )
          }
        />

        <Route element={<RequireAuth isLoggedIn={isLoggedIn} />}>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} loggedUser={loggedUser} />} />
          <Route path="/emplist" element={<Emplist />} />
          <Route path="/addemp" element={<Addemp />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/attendance/" element={<Attendance loggedUser={loggedUser} />} />
          <Route path="/leave" element={<Leave loggedUser={loggedUser} />} />
          <Route path="/edit-leave/:id" element={<Attenup />} />
          <Route path="/AbsentRep" element={<AbsentRep />} />
          <Route path="/listFeed" element={<ListFeed loggedUser={loggedUser} />} />
          <Route path="/feedback/Viewfeed/:id" element={<Viewfeed loggedUser={loggedUser}/>} />
          <Route path="/Feedform" element={<Feedform loggedUser={loggedUser}/>} />
          <Route path="/reportfeed" element={<Reportfeed />} />
          <Route path="/view-leave/:id" element={<ViewLeave loggedUser={loggedUser} />}/>
          <Route path="/pending" element={<Pending loggedUser={loggedUser} />}/>
          <Route path="/myattendance" element={<Myattendance loggedUser={loggedUser} />}/>
          <Route path="/addproject" element={<Addproject loggedUser={loggedUser}/>}/>
          <Route path="/listproject" element={<ListProject/>}/>
          <Route path="/edit-project/:id" element={<EditProject />} />
          <Route path="/addtask" element={<Addtask loggedUser={loggedUser}/>}/>
          <Route path="/listtask" element={<Listtask loggedUser={loggedUser}/>}/>
          <Route path="/edit-task/:id" element={<Edittask/>}/>
          <Route path="/addbugs" element={<Addbugs loggedUser={loggedUser}/>}/>
          <Route path="/listbugs" element={<Listbugs loggedUser={loggedUser}/>}/>
          <Route path="/edit-bugs/:id" element={<Editbugs loggedUser={loggedUser} />} />
        </Route>

        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
