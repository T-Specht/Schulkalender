import * as React from "react";
import classnames from "classnames";
import moment from "moment";
import { Item } from "./ical-type";
import { ICalendar, AppContext, CalendarGroup } from "./AppContext";
import { Modal, Header } from "semantic-ui-react";

interface IDayProps {
  date: moment.Moment;
  cals: (ICalendar & { events: Item[] })[];
}

function shorten(text: string, maxLength: number) {
  if (!text) return;
  return text.substring(0, maxLength);
}

export const Event: React.SFC<{
  group: CalendarGroup;
  event: Item;
  textLength: number;
}> = ({ group, event, textLength }) => {
  let startDate = moment(event.start.dateTime || event.start.date);
  let endDate = moment(event.end.dateTime || event.end.date);
  let wholeDay = !!event.start.date;
  let sameDate = wholeDay
    ? startDate.isSame(endDate.clone().subtract(1, "day"), "date")
    : startDate.isSame(endDate, "date");

  const DATE_FORMAT = "dddd, D. MMM YYYY";
  const TIME_FORMAT = "HH:mm";

  let dateDisplayString: string;

  if (wholeDay) {
    if (sameDate) {
      dateDisplayString = `${startDate.format(DATE_FORMAT)} ganztägig`;
    } else {
      dateDisplayString = `${startDate.format(DATE_FORMAT)} bis ${endDate
        .clone()
        .subtract(1, "day")
        .format(DATE_FORMAT)}`;
    }
  } else {
    if (sameDate) {
      dateDisplayString = `${startDate.format(
        `${DATE_FORMAT} ${TIME_FORMAT}`
      )} bis ${endDate.format(TIME_FORMAT)} Uhr`;
    } else {
      dateDisplayString = `${startDate.format(
        `${DATE_FORMAT} ${TIME_FORMAT}`
      )} Uhr bis ${endDate.format(`${DATE_FORMAT} ${TIME_FORMAT}`)} Uhr`;
    }
  }

  return (
    <Modal
      trigger={
        <div
          className="event"
          style={{
            backgroundColor: group.color
          }}
          // onClick={() => console.log(event)}
        >
          {shorten(event.summary, textLength)}
        </div>
      }
    >
      <Modal.Header>
        <span className="color-dot" style={{ backgroundColor: group.color }} />
        <span style={{ verticalAlign: "middle" }}>{event.summary}</span>
      </Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <h4>🗓 {dateDisplayString}</h4>
          {event.location && <p>📍 {event.location}</p>}
          <p>{event.description}</p>
          <p className="more-info">Erstellt von {event.creator.displayName || event.creator.email}, letzte Änderung am {moment(event.updated).format(`${DATE_FORMAT} ${TIME_FORMAT}`)} Uhr</p>
          
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export const Day: React.SFC<IDayProps> = ({ date, cals }) => {
  //if(date.isSame())

  const context = React.useContext(AppContext);

  return (
    <tr
      className={classnames("day", {
        weekend: date.day() === 6 || date.day() === 0
      })}
    >
      <td className="date">{date.date()}</td>
      {context.calendarGroups
        .filter(g => g.active)
        .map((g, i) => {
          return (
            <td
              key={i}
              className="calendar-column"
              style={{
                color: g.whiteText ? "white" : "inherit"
              }}
            >
              <div className="events">
                {cals
                  .filter(cal => cal.groupUUID == g.uuid)
                  .map(c => {
                    return c.events.map((e, i) => {
                      return (
                        <Event
                          key={i}
                          group={g}
                          event={e}
                          textLength={context.textLength}
                        />
                      );
                    });
                  })}
              </div>
            </td>
          );
        })}
    </tr>
  );
};
