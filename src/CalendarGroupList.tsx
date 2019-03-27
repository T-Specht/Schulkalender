import React, { useContext } from "react";
import { AppContext } from "./AppContext";
import { List, Button, Icon } from "semantic-ui-react";

const CalendarGroupList: React.SFC = () => {
  const context = useContext(AppContext);
  return (
    <React.Fragment>
      {context.calendarGroups.map((c, i) => (
        <div className="calendar-list-item" key={c.name}>
          <div className="color" style={{ backgroundColor: c.color }} />
          <div className="info">
            <div className="title">{c.name}</div>
            <div className="url">{context.calendars.filter(cal => cal.groupUUID == c.uuid).length} Kalender in Gruppe</div>
          </div>
          <div className="actions">
            <Button icon onClick={() => context.removeCalendarGroup(i)}>
              <Icon name="trash" />
            </Button>
            <Button icon onClick={() => context.moveCalendarGroupUp(i)}>
              <Icon name="chevron up" />
            </Button>
          </div>
        </div>
      ))}
    </React.Fragment>
  );
};

export default CalendarGroupList;
