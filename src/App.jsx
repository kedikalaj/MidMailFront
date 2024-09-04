
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import  SignInPage  from './pages/SignInPage'
import SignupSecondStep from './pages/SignupSecondStep';
import Home from './pages/Home';
import './styles/App.css'
import Dashboard from '../src/pages/dashboard/Dashboard.js';

function App() {

  const token = localStorage.getItem('authToken');
  const activeUser = localStorage.getItem('activeuser');

  // Convert activeUser to boolean if it's not null
  const isActive = activeUser === 'true';
 
  return (
    
    <Routes>
   
    <Route
          path="/"
          element={
            (token === null || activeUser === null   ? <Navigate to="/signin" /> : <Home />)
          }
        />

        <Route path="/signin"       element={
            (token === null || activeUser === null   ?  <SignInPage /> : <Navigate to="/" />)
          } />
        <Route path="/asd" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    
  


  )
}

export default App
