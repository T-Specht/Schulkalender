import React, { useContext } from "react";
import moment from "moment";
import { Day } from "./Day";
import { CalendarAPIResult, Item } from "./ical-type";
import { CalWithData } from "./calendars";
import { AppContext } from "./AppContext";

type Props = {
  date: moment.Moment;
};

const Month: React.SFC<Props> = props => {
  const date = props.date.clone();
  const iterationDate = date.clone();
  const days: JSX.Element[] = [];
  const context = useContext(AppContext);

  const filteredCals = context.calendars.map(c => {
    let events: Item[] = [];
    if (c.data)
      events = c.data.items
        .filter(i => i.kind == "calendar#event" && !!i.start)
        .filter(i => {
          let startMonth = moment(i.start.dateTime || i.start.date);
          let endMonth = moment(i.end.dateTime || i.end.date);

          //if(i.description) console.log(i);

          return date.isBetween(startMonth, endMonth, 'month', "[]");

          //return date.isSame(moment(i.start.dateTime || i.start.date), "month")
        });
    return {
      ...c,
      events
    };
  });

  //console.log(filteredCals);

  do {
    days.push(
      <Day
        date={iterationDate.clone()}
        key={iterationDate.date()}
        cals={filteredCals.map(c => ({
          ...c,
          events: c.events.filter(
            e =>
              iterationDate.isBetween(
                moment(e.start.dateTime || e.start.date),
                moment(
                  e.end.dateTime ||
                    e.end.date ||
                    e.start.dateTime ||
                    e.start.date
                ).subtract(1, "minute"),
                "date",
                "[]"
              ) && e.summary
          )
        }))}
      />
    );
    iterationDate.add(1, "day");
  } while (iterationDate.month() == date.month());

  return (
    <div className="month">
      <h1>{date.format("MMMM YYYY")}</h1>
      <table>
        <thead>
          <tr>
            <td className="date-span-head" />
            {context.calendarGroups
              .filter(g => g.active)
              .map(c => (
                <td key={c.name}>{c.name}</td>
              ))}
          </tr>
        </thead>
        <tbody>{days}</tbody>
      </table>
    </div>
  );
};

export default React.memo(Month);
