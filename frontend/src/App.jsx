import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Event from "./pages/Event/Event.jsx";

const App = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />
                <Route 
                    path="/event/:eventId"
                    element={<Event />}
                />
            </Routes>
        </>
    )
}

export default App
