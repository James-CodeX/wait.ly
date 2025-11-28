import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopBar />
        <main className="flex-1 p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
