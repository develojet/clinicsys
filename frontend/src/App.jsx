import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Users from './pages/Users';
import Appointments from './pages/Appointments.jsx';
import MainLayout from './components/layout/MainLayout';
import OBConsultForm from "./pages/subpages/OBConsultForm.jsx";
import FullOBCosult from "./pages/subpages/FullOBConsult.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
                <Route path="/patients" element={<MainLayout><FullOBCosult /></MainLayout>} />
                <Route path="/users" element={<MainLayout><Users /></MainLayout>} />
                <Route path="/appointments" element={<MainLayout><Appointments /></MainLayout>} />
            </Routes>
        </Router>
    );
}

export default App;