import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const routeTitleMap = {
  '/admin/dashboard': 'Executive Operations Dashboard',
  '/admin/events': 'Event Management',
  '/admin/teams': 'Team & Volunteer Allocation',
  '/admin/tasks': 'Central Task Tracking',
  '/admin/resources': 'Resource Inventory & Equipment',
  '/admin/vendors': 'Vendor & Procurement Management',
  '/admin/approvals': 'Requisition Approvals Workflow',
  '/admin/users': 'User Accounts & Roles',
  '/admin/audit-logs': 'System Audit Log',
  '/admin/reports': 'Operations Reports & Analytics',

  '/coordinator/dashboard': 'Coordinator Operations Hub',
  '/coordinator/events': 'Managed Events',
  '/coordinator/teams': 'Event Teams & Members',
  '/coordinator/tasks': 'Task Delegation',
  '/coordinator/resources': 'Resource Requests',
  '/coordinator/vendors': 'Assigned Vendors',

  '/teamlead/dashboard': 'Team Lead Dashboard',
  '/teamlead/members': 'Team Roster',
  '/teamlead/tasks': 'Team Task Board',

  '/volunteer/dashboard': 'Volunteer Workspace',
  '/volunteer/tasks': 'Assigned Task Queue',
  '/volunteer/team': 'Team Directory',
  '/volunteer/events': 'Event Schedule',
};

export const AppLayout = () => {
  const location = useLocation();
  const title = routeTitleMap[location.pathname] || 'EventOps Platform';

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title={title} />
        <main className="content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
