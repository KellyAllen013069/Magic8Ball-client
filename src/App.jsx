
import {Routes, Route} from "react-router-dom";
import Navbar from "./pages/navbar"
import DefaultPage from "./pages/default.page";
import MainAuth from './pages/main.auth.page'
import Register from "./pages/user.register";
import UserThemes from "./pages/userThemes"
import  {AuthProvider} from './components/AuthContext'
import AdminPage from "./pages/admin.page";



function App() {
  
  return (
    <AuthProvider>
      <div className="App">
         <Navbar/>
          <div className="nav">
            <Routes>
              <Route path="/" element={<DefaultPage/>} />
              <Route path="/register" element = {<Register/>} />
              <Route path="/login" element = {<MainAuth/>} />
              <Route path="/userThemes" element={<UserThemes/>} />
              <Route path="/admin" element={<AdminPage/>} />
            </Routes>
          </div>
      </div>
    </AuthProvider>
  );
}

export default App;
