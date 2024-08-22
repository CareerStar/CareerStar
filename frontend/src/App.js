import logo from './logo.svg';
import './App.css';
import MainPage from './components/MainPage';
import UserIntent from './components/UserIntent';
import EmailCredentialPage from './components/EmailCredentialPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignUp from './components/SignUp';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route
            exact
            path="/"
            element={<MainPage />}
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
