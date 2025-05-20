import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// pages
import Login from './pages/Login';
import Master from './Master';
import Dashboard from './pages/Dashboard';
import Downloads from './pages/Downloads';
import Letters from './pages/Letters';
import Categories from './pages/Categories';
import Users from './pages/Users';

function App() {

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}></Route>
          <Route path='/dashboard' element={<Master/>}>
            <Route path='' element={<Dashboard/>}></Route>
          </Route>
          <Route path='/downloads' element={<Master/>}>
            <Route path='' element={<Downloads/>}></Route>
          </Route>
          <Route path='/letters' element={<Master/>}>
            <Route path='' element={<Letters/>}></Route>
          </Route>
          <Route path='/categories' element={<Master/>}>
            <Route path='' element={<Categories/>}></Route>
          </Route>
          <Route path='/users' element={<Master/>}>
            <Route path='' element={<Users/>}></Route>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
