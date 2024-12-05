import logo from './logo.svg';
import './App.css';
import StartPage from './components/StartPage';
import UserIntent from './components/UserIntent';
import EmailCredentialPage from './components/EmailCredentialPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import LogIn from './components/LogIn';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import withAuth from './utils/withAuth';

const AuthProtectedDashboard = withAuth(Dashboard);
const AuthProtectedAdminDashboard = withAuth(AdminDashboard);

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route
            exact
            path="/"
            element={<StartPage />}
          />

          <Route
            exact
            path="/signup"
            element={<SignUp />}
          />

          <Route
            exact
            path="/userIntent"
            element={<UserIntent />}
          />

          <Route
            exact
            path="/emalCredential"
            element={<EmailCredentialPage />}
          />

          <Route
            exact
            path='/dashboard'
            element={<AuthProtectedDashboard />}
          >
            <Route path="home" element={<AuthProtectedDashboard />} />
            <Route path="profile" element={<AuthProtectedDashboard />} />
            <Route path="roadmap" element={<AuthProtectedDashboard />} />
            <Route path="events" element={<AuthProtectedDashboard />} />
            <Route path="network" element={<AuthProtectedDashboard />} />
            <Route path="support" element={<AuthProtectedDashboard />} />
          </Route>

          <Route
            exact
            path='/login'
            element={<LogIn />}
          />

          <Route
            exact
            path='/admin'
            element={<AdminLogin />}
          />

          <Route
            exact
            path='/admin/dashboard'
            element={<AuthProtectedAdminDashboard />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
