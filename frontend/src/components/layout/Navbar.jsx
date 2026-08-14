import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="border-b border-slate-800 bg-slate-950">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Brand */}
                <button
                    onClick={() => navigate("/")}
                    className="text-xl font-bold text-white transition hover:text-indigo-400"
                >
                    AI Interview
                </button>


                {/* Right Side */}
                <div className="flex items-center gap-5">

                    {/* User */}
                    <div className="hidden sm:block text-right">

                        <p className="text-sm font-medium text-white">
                            {user?.name}
                        </p>

                        <p className="text-xs text-slate-400">
                            {user?.email}
                        </p>

                    </div>


                    {/* Avatar */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>


                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    );
}
