import './App.css';
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AdminPanel from './components/AdminPanel'
import Login from './components/Login'
import { AppContext } from './components/AppContext';
import Cookies from 'js-cookie'
//logged_in


function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    //console.log(document.cookies.logged_in)
    // console.log(getCookie('loggedIn'))
    // console.log(document.cookie)
    if (Cookies.get('loggedIn')) {
      setUser({ loggedIn: true })
    }
  }, [])



  return (
    <AppContext.Provider value={{ user, setUser }} >
      <div>
        <Router basename={'admin'}>
          {user ?

            <AdminPanel />
            :

            <Login />

          }
        </Router>
      </div>
    </AppContext.Provider>
  );
}



export default App;
