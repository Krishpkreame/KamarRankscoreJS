import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import Login from './Pages/Login'
import Results from './Pages/Results'
import NotFound from './Pages/NotFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/results" element={<Results />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
