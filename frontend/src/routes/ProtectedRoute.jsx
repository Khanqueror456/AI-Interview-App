import {Navigate, Outlet} from "react-router-dom";
import useAuth from "../hooks/useAuth";


const ProtectedRoute = () => {
    
    const { user, loading } = useAuth();

    if (loading)
    {
        return <h1>Loading...</h1>
    }

    if (!user)
    {
        return <Navigate to = "/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute
