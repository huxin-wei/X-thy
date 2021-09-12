import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import LessonPanel from './LessonPanel';
import Booking from './Booking';
import AvailabilityPanel from './AvailabilityPanel';
import Calendar from './Calendar';


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
      <div style={{position: "relative"}}>
        <Sidebar />

          <div className="content-wrapper">
              <Switch>
                <Route path="/calendar">
                  <Calendar />
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
  )
}

export default AdminPanel
