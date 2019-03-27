import * as React from "react";
import classnames from "classnames";
import moment from "moment";
import { Item } from "./ical-type";
import { ICalendar, AppContext } from "./AppContext";

interface IDayProps {
  date: moment.Moment;
  cals: (ICalendar & { events: Item[] })[];
}

function shorten(text: string) {
  if (!text) return;
  return text.substring(0, 40);
}

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
      {context.calendarGroups.map((g, i) => {
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
                      <div
                        key={i}
                        className="event"
                        style={{
                          backgroundColor: g.color
                        }}
                        onClick={() => console.log(e)}
                      >
                        {shorten(e.summary)}
                      </div>
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
