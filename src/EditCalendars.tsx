import React, { useContext, useState } from "react";
import AddCalendarForm from "./AddCalendarForm";
import AddCalendarGroupForm from "./AddCalendarGroupForm";
import CalendarList from "./CalendarList";
import { Link } from "react-router-dom";
import { Icon, Input, Button } from "semantic-ui-react";
import CalendarGroupList from "./CalendarGroupList";
import { AppContext } from "./AppContext";

function download(filename: string, text: string) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const EditCalendars: React.SFC = () => {
  const context = useContext(AppContext);
  const [apiKey, setApiKey] = useState(context.apiKey);
  const [updateInterval, setUpdateInterval] = useState(context.updateInterval);
  const [textLength, setTextLength] = useState(context.textLength);

  const downloadConfig = () => {
    let object = {
      CALENDARS: JSON.parse(localStorage.getItem("CALENDARS")!),
      "CALENDARS-GROUPS": JSON.parse(localStorage.getItem("CALENDARS-GROUPS")!),
      CALENDARS_API: localStorage.getItem("CALENDARS_API")!,
      CALENDARS_TEXT_LENGTH: parseInt(
        localStorage.getItem("CALENDARS_TEXT_LENGTH")!
      ),
      CALENDARS_UPDATE_INTERVAL: parseInt(
        localStorage.getItem("CALENDARS_UPDATE_INTERVAL")!
      )
    };
    console.log(object);

    download("config.json", JSON.stringify(object, null, 3));
  };

  const reset = () => {
    const sure = confirm("Soll die App wirklich zurückgesetzt werden?");
    if(sure){
      localStorage.clear();
      location.reload();
    }
  }

  return (
    <div id="edit-view">
      <div>
        <Link to="/">
          <Icon name="chevron left" /> Zurück zur Übersicht
        </Link>
      </div>
      <h2>API Schlüssel</h2>
      <div>
        <Input value={apiKey} onChange={e => setApiKey(e.target.value)} />
        <Button onClick={() => context.setApiKey(apiKey)}>Speichern</Button>
      </div>
      <h2>Update Intervall</h2>
      <div>(in Minuten)</div>
      <div>
        <Input
          value={updateInterval}
          type="number"
          onChange={e => setUpdateInterval(parseInt(e.target.value))}
        />
        <Button onClick={() => context.setUpdateInterval(updateInterval)}>
          Speichern
        </Button>
      </div>

      <h2>Maximale Anzahl an Zeichen für Eintrag</h2>
      <div>
        <Input
          value={textLength}
          type="number"
          onChange={e => setTextLength(parseInt(e.target.value))}
        />
        <Button onClick={() => context.setTextLength(textLength)}>
          Speichern
        </Button>
      </div>
      <h2>Kalender Gruppe hinzufügen</h2>
      <AddCalendarGroupForm />
      <h2>Alle Kalender Gruppen</h2>
      <CalendarGroupList />
      <h2>Kalender hinzufügen</h2>
      <AddCalendarForm />
      <h2>Alle Kalender</h2>
      <CalendarList />
      <h2>Konfiguration speichern</h2>
      <Button onClick={downloadConfig}>config.json herunterladen</Button>
      <Button onClick={reset}>App zurücksetzen</Button>
    </div>
  );
};

export default EditCalendars;
