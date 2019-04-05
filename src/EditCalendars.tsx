import React, {useContext, useState} from "react";
import AddCalendarForm from "./AddCalendarForm";
import AddCalendarGroupForm from "./AddCalendarGroupForm";
import CalendarList from "./CalendarList";
import { Link } from "react-router-dom";
import { Icon, Input, Button } from "semantic-ui-react";
import CalendarGroupList from "./CalendarGroupList";
import { AppContext } from "./AppContext";

const EditCalendars: React.SFC = () => {
  const context = useContext(AppContext);
  const [apiKey, setApiKey] = useState(context.apiKey);
  const [updateInterval, setUpdateInterval] = useState(context.updateInterval);
  return (
    <div id="edit-view">
      <div>
        <Link to="/">
          <Icon name="chevron left" /> Zurück zur Übersicht
        </Link>
      </div>
      <h2>API Schlüssel</h2>
      <div>
        <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)}></Input>
        <Button onClick={() => context.setApiKey(apiKey)}>Speichern</Button>
      </div>
      <h2>Update Intervall</h2>
      <div>(in Minuten)</div>
      <div>
        <Input value={updateInterval} type="number" onChange={(e) => setUpdateInterval(parseInt(e.target.value))}></Input>
        <Button onClick={() => context.setUpdateInterval(updateInterval)}>Speichern</Button>
      </div>
      <h2>Kalender Gruppe hinzufügen</h2>
      <AddCalendarGroupForm />
      <h2>Alle Kalender Gruppen</h2>
      <CalendarGroupList />
      <h2>Kalender hinzufügen</h2>
      <AddCalendarForm />
      <h2>Alle Kalender</h2>
      <CalendarList />
    </div>
  );
};

export default EditCalendars;
