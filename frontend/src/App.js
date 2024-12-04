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
            element={<Dashboard />}
          >
            <Route path="home" element={<Dashboard />} />
            <Route path="profile" element={<Dashboard />} />
            <Route path="roadmap" element={<Dashboard />} />
            <Route path="events" element={<Dashboard />} />
            <Route path="network" element={<Dashboard />} />
            <Route path="support" element={<Dashboard />} />
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
            element={<AdminDashboard />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
