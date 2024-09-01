import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import './styles/App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
