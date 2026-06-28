import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <Topbar />

        <div className="mt-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;