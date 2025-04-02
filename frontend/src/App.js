import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EngineerDashboard from './pages/EngineerDashboard';
import UserComplaints from './pages/UserComplaints';
import CreateComplaint from './pages/CreateComplaint';
import Layout from './components/Layout';
import ComplaintDetails from './pages/ComplaintDetails';
import MyComplaints from './pages/MyComplaints';
import darkTheme from './theme';
import './styles/global.css';
import { useAuth } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route element={<PrivateRoute />}>
              {/* Redirect based on role */}
              <Route index element={<NavigateToDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="engineer" element={<EngineerDashboard />} />
              <Route path="complaints" element={<UserComplaints />} />
              <Route path="create-complaint" element={<CreateComplaint />} />
              <Route path="complaints/:id" element={<ComplaintDetails />} />
              <Route path="my-complaints" element={<MyComplaints />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
    </ThemeProvider>
  );
}

function NavigateToDashboard() {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  if (user?.role === 'junior_engineer') {
    return <Navigate to="/engineer" replace />;
  }
  return <Navigate to="/complaints" replace />;
}

export default App;
