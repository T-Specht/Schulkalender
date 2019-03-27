import React, { useContext } from "react";
import { AppContext } from "./AppContext";
import { List, Button, Icon } from "semantic-ui-react";

const CalendarList: React.SFC = () => {
  const { calendars, removeCalendar, moveUp, calendarGroups } = useContext(AppContext);
  return (
    <React.Fragment>
      {calendars.map((c, i) => (
        <div className="calendar-list-item" key={c.url}>
          {/* <div className="color" style={{ backgroundColor: c.color }} /> */}
          <div className="info">
            <div className="title">{c.name} <span style={{
              fontWeight: 'normal'
            }}>(Gruppe {calendarGroups.find(g => g.uuid == c.groupUUID)!.name})</span></div>
            <div className="url">{c.url}</div>
          </div>
          <div className="actions">
            <Button icon onClick={() => removeCalendar(i)}>
              <Icon name="trash" />
            </Button>
            {/* <Button icon onClick={() => moveUp(i)}>
              <Icon name="chevron up" />
            </Button> */}
          </div>
        </div>
      ))}
    </React.Fragment>
  );
};

export default CalendarList;
