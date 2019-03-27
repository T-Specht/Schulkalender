import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "./AppContext";
import { CirclePicker } from "react-color";
import color from "color";
import { Input, Button, Select } from "semantic-ui-react";

const useFormField = () => {
  const [value, setValue] = useState("");
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setValue(e.target.value);
  };

  return { value, onChange: handleChange };
};

const AddCalendarForm: React.SFC = () => {
  const name = useFormField();
  const [url, setUrl] = useState("");
  const context = useContext(AppContext);
  const [group, setGroup] = useState<string | undefined>(undefined);

  const handleClick = () => {
    if (name.value.trim() == "" || url.trim() == "" || group == undefined) {
      return alert("Bitte fülle zuerst alle Felder aus!");
    }
    context.addCalendar({
      name: name.value,
      url,
      color: "blue",
      data: null,
      whiteText: true,
      groupUUID: group
    });
  };

  useEffect(() => {
    //http://calendar.google.com/calendar/ical/3pd2oatvud2hm9777k7fmgj1og%40group.calendar.google.com/public/basic.ics
    const expr = /^http:\/\/calendar.google.com\/calendar\/ical\/(.+)\/public\/basic.ics$/;
    if (expr.test(url)) {
      setUrl(url.match(expr)![1]);
    }
  }, [url]);

  return (
    <div id="add-calendar">
      <Input type="text" placeholder="Name" {...name} label="Name" fluid />
      <br />
      <Input
        type="text"
        placeholder="xxxxxx.calendar.google.com"
        value={url}
        onChange={e => setUrl(e.target.value)}
        label="Kalender ID"
        fluid
      />
      <br />
      <Select
        placeholder="Gruppe auswählen"
        options={context.calendarGroups.map((g, i) => ({
          key: g.uuid,
          value: g.uuid,
          text: g.name
        }))}
        value={group}
        onChange={(e, data) => setGroup(data.value as string)}
        fluid
      />
      <br />
      <Button onClick={handleClick}>Kalender {name.value} hinzufügen</Button>
    </div>
  );
};

export default AddCalendarForm;
