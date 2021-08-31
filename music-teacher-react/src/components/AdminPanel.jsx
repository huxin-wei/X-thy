import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import LessonPanel from './LessonPanel';
import Booking from './Booking';
import AvailabilityPanel from './AvailabilityPanel';


function Appointment() {
  return (
    <div>
      Appointment
    </div>
  )
}


function Upload() {
  return (
    <div>
      Upload
    </div>
  )
}


function AdminPanel() {
  return (
    <div>
      <div>
        <Sidebar />
        <div className="content-wrapper">
          <div className="container-fluid">
            <Switch>
              <Route path="/appointment">
                <Appointment />
              </Route>
              <Route path="/lesson">
                <LessonPanel />
              </Route>
              <Route path="/availability">
                <AvailabilityPanel />
              </Route>
              <Route path="/upload">
                <Upload />
              </Route>
              <Route path="/booking">
                <Booking />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
