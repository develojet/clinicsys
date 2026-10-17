import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients.jsx";
import Users from "./pages/Users";
import Appointments from "./pages/Appointments.jsx";
import PatientChartContainer from "./pages/subpages/PatientChartContainer.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
    return (
        <AuthProvider>
            <Router basename="/clinic">
                <Routes>
                    {/* 1. Public Route (Login) */}
                    <Route path="/" element={<Login/>}/>
                    <Route path="/login" element={<Login/>}/>

                    {/* 2. Standard Authenticated Routes */}
                    <Route element={<ProtectedRoute/>}>
                        <Route
                            path="/dashboard"
                            element={
                                <MainLayout>
                                    <Dashboard/>
                                </MainLayout>
                            }
                        />
                        <Route
                            path="/appointments"
                            element={
                                <MainLayout>
                                    <Appointments/>
                                </MainLayout>
                            }
                        />
                        <Route
                            path="/patients"
                            element={
                                <MainLayout>
                                    <Patients/>
                                </MainLayout>
                            }
                        />
                        <Route
                            path="/patients/chart"
                            element={
                                <MainLayout>
                                    <PatientChartContainer/>
                                </MainLayout>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <MainLayout>
                                    <Profile/>
                                </MainLayout>
                            }
                        />
                    </Route>

                    {/* 3. Admin-Only Protected Route */}
                    <Route element={<ProtectedRoute allowedRoles={["ADMIN"]}/>}>
                        <Route
                            path="/users"
                            element={
                                <MainLayout>
                                    <Users/>
                                </MainLayout>
                            }
                        />
                    </Route>

                    {/* 4. Fallback Catch-All Route */}
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;