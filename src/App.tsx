import React, { useState } from "react";
import "./style.scss";
import "moment/locale/de";
import { Switch, Route } from "react-router-dom";
import AddCalendarForm from "./AddCalendarForm";
import Months from "./Months";
import EditCalendars from "./EditCalendars";

const App: React.SFC = props => {
  return (
    <Switch>
      <Route component={Months} path='/' exact={true}></Route>
      <Route component={EditCalendars} path='/edit' exact={true}></Route>
    </Switch>
  );
};

export default App;
