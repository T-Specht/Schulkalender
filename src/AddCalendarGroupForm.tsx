import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "./AppContext";
import { CirclePicker } from "react-color";
import { Input, Button } from "semantic-ui-react";
import uuid from "uuid/v4";
import color from "color";

const useFormField = () => {
  const [value, setValue] = useState("");
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setValue(e.target.value);
  };

  return { value, onChange: handleChange };
};

const AddCalendarGroupForm: React.SFC = () => {
  const name = useFormField();
  const [_color, setColor] = useState("#F44336");
  const context = useContext(AppContext);

  const handleClick = () => {
    if(name.value.trim() == ''){
        return alert('Bitte fülle zuerst alle Felder aus!');
    }
    context.addCalendarGroup({
      name: name.value,
      color: _color,
      uuid: uuid(),
      whiteText: color(_color).isDark()
    });
  };

  return (
    <div id="add-calendar">
      <Input type="text" placeholder="Name" {...name} label="Name" fluid />
      <br />
      <div style={{
          margin: '20px auto'
      }}>
        <h2>Farbe auswählen</h2>
        <CirclePicker color={_color} onChangeComplete={e => setColor(e.hex)} />
      </div>
      <Button onClick={handleClick}>Kalender Gruppe {name.value} hinzufügen</Button>
    </div>
  );
};

export default AddCalendarGroupForm;
