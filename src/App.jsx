import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Favourites from "./pages/Favourites";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.scss";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected route example */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown route to the login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
