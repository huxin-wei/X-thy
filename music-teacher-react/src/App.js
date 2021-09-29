import './App.css';
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AdminPanel from './components/AdminPanel'
import Login from './components/Login'
import { AppContext } from './components/AppContext';
import Cookies from 'js-cookie'
import Loading from './components/Loading';
//logged_in


function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (Cookies.get('loggedIn')) {
      setUser({ loggedIn: true })
    }

    setIsLoading(false)
  }, [])

  return (
    <AppContext.Provider value={{ user, setUser }} >
      <div>
        <Router basename={'admin'}>
          {
            isLoading ?
              <Loading />

              :

              user ?
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
