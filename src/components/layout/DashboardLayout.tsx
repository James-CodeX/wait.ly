import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-white dark:bg-dark-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopBar />
        <main className="flex-1 p-6 bg-white dark:bg-dark-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
