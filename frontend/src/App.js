import logo from './logo.svg';
import './App.css';
import MainPage from './components/MainPage';
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
