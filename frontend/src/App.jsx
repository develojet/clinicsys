import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients.jsx";
import Users from "./pages/Users";
import Appointments from "./pages/Appointments.jsx";
import MainLayout from "./components/layout/MainLayout";

// Main Longitudinal Patient Record (The "Master" Page)
import PatientChart from "./pages/subpages/PatientChart.jsx";
import Profile from "./pages/Profile.jsx";

// Keep these imports only if you still need standalone access toBrowserRouter them
// import FullOBConsult from "./pages/subpages/FullOBConsult.jsx";
// import FullMedicineConsult from "./pages/subpages/FullMedicineConsult.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Public Route */}
        <Route path="/" element={<Login />} />

        {/* 2. Main Dashboard & Sidebar Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/users"
          element={
            <MainLayout>
              <Users />
            </MainLayout>
          }
        />
        <Route
          path="/appointments"
          element={
            <MainLayout>
              <Appointments />
            </MainLayout>
          }
        />

        {/* 3. Patient List Route */}
        <Route
          path="/patients"
          element={
            <MainLayout>
              <Patients />
            </MainLayout>
          }
        />

        {/* 4. THE SPECIFIC PATIENT FORM (Longitudinal Master Record)
                    This path handles the Patient Details, Visit History,
                    and the dynamic Bottom Pane (OB vs Medicine)
                */}
        <Route
          path="/patients/chart"
          element={
            <MainLayout>
              <PatientChart />
            </MainLayout>
          }
        />

        {/* 5. Legacy / Standalone Specific Routes */}
        {/*<Route path="/patients/consult" element={<MainLayout><FullOBConsult /></MainLayout>} />*/}
        {/*<Route path="/patients/medicine-consult" element={<MainLayout><FullMedicineConsult /></MainLayout>} />*/}

        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
