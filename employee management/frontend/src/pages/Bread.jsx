import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Bread.css';
import Header from '../Header';

// Path map
const pathNameMap = {
  '/': ['Home'],
  '/emplist': ['Home', 'Employee List'],
  '/addemp': ['Home', 'Employee List', 'Add Employee'],
  '/edit': ['Home', 'Employee List', 'Edit Employee'],
  '/view-leave': ['Home', 'Leave Records', 'View Leave'],
  '/attendance': ['Home', 'Leave Records'],
  '/Leave': ['Home', 'Leave Records', 'Add Leave'],
  '/edit-leave': ['Home', 'Leave Records', 'Edit Leave'],
  '/AbsentRep': ['Home', 'Reports', 'Leave Reports'],
  '/listfeed': ['Home', 'Feedback List'],
  '/Feedform': ['Home', 'Feedback List', 'Feedback Form'],
  '/feedback/Viewfeed/': ['Home', 'Feedback List', 'View'],
  '/reportfeed': ['Home', 'Feedback Report'],
  '/myattendance': ['Home', 'Myattendance'],
  '/pending': ['Home', 'Pending'],
  '/edit-project': ['Home', 'Project List', 'Edit Project'],
  '/addproject': ['Home', 'Project List', 'Add Project'],
  '/listproject': ['Home', 'Project List'],
  '/listtask': ['Home', 'Task List'],
  '/addtask': ['Home', 'Task List', 'Add Task'],
  '/edit-task': ['Home', 'Task List', 'Edit Task'],
};

function Bread({ loggedUser ,onLogout}) {
  const location = useLocation();
  const fullPath = location.pathname;

  function findMatchingPath(path) {
    const paths = Object.keys(pathNameMap).sort((a, b) => b.length - a.length);
    for (const p of paths) {
      if (path === p || path.startsWith(p + '/')) return p;
    }
    return '/';
  }

  const basePath = findMatchingPath(fullPath);
  const breadcrumbList = pathNameMap[basePath] || ['Home'];

  const findPathByBreadcrumb = (index) => {
    for (const [path, crumbs] of Object.entries(pathNameMap)) {
      if (
        crumbs.length > index &&
        crumbs.slice(0, index + 1).join() === breadcrumbList.slice(0, index + 1).join()
      ) {
        return path;
      }
    }
    return null;
  };

  return (
    <>
      <Header loggedUser={loggedUser} onLogout={onLogout} />
    <div className='left'>{/* 👈 Header shown above */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          {breadcrumbList.map((label, index) => {
            const isLast = index === breadcrumbList.length - 1;
            const to = findPathByBreadcrumb(index) || '/';

            return (
              <li className="breadcrumb-item" key={index}>
                {!isLast ? (
                  <>
                    <Link to={to}>{label}</Link>
                    <span className="breadcrumb-separator">{'>'}</span>
                  </>
                ) : (
                  <span className="breadcrumb-active">{label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      </div>
    </>
  );
}

export default Bread;
