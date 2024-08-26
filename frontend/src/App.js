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
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
