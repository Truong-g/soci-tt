import './styles/main.css';
import ProtectedRouter from './router/PotectedRouter'
import MainRouter from './router/MainRouter';
import SignInPage from './pages/Signinpage/SignInPage'
import SignUpPage from './pages/Signuppage/SignUpPage'
import { Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="app">
      <Routes>
        <Route element={<ProtectedRouter />} >
            <Route path="/*" element={<MainRouter />}/>
        </Route>
        <Route path="/dang-nhap" element={<SignInPage />}/>
        <Route path="/dang-ky" element={<SignUpPage />}/>
      </Routes>
    </div>
  );
}

export default App;
