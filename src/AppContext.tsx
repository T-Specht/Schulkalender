import React, { useState, useEffect } from "react";
import axios from "axios";
import { CalendarAPIResult } from "./ical-type";
import moment from "moment";

export interface ICalendar {
  name: string;
  color: string;
  whiteText: boolean;
  url: string;
  data: CalendarAPIResult | null;
  groupUUID: string;
}

interface ContextType {
  calendars: ICalendar[];
  calendarGroups: CalendarGroup[];
  isLoading: boolean;
  update: () => void;
  addCalendar: (c: ICalendar) => void;
  addCalendarGroup: (c: CalendarGroup) => void;
  removeCalendarGroup: (i: number) => void;
  removeCalendar: (i: number) => void;
  moveUp: (i: number) => void;
  moveCalendarGroupUp: (i: number) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

interface CalendarGroup {
  name: string;
  color: string;
  uuid: string;
  whiteText: boolean;
}

export const AppContext = React.createContext<ContextType>({} as any);

const LOCAL = "CALENDARS";
const LOCAL_GROUPS = LOCAL + "-GROUPS";

const cURL = (c: string, apiKey: string) =>
  `https://www.googleapis.com/calendar/v3/calendars/${c}/events?key=${apiKey}&timeMin=${moment(
    {
      date: 1,
      month: 0,
      minute: 0,
      hour: 0
    }
  )
    .utc()
    .format()}`;

export const AppContextProvider: React.SFC = ({ children }) => {
  const [calendars, setCalendars] = useState<ICalendar[]>(
    localStorage.getItem(LOCAL) ? JSON.parse(localStorage.getItem(LOCAL)!) : []
  );
  const [apiKey, setApiKey] = useState(() => {
    const key = localStorage.getItem(LOCAL + '_API');
    return key ? key : '';
  });
  const [calendarGroups, setCalendarGroups] = useState<CalendarGroup[]>(
    localStorage.getItem(LOCAL_GROUPS)
      ? JSON.parse(localStorage.getItem(LOCAL_GROUPS)!)
      : []
  );
  const [isLoading, setIsLoading] = useState(false);

  function saveToStorage() {
    localStorage.setItem(
      LOCAL,
      JSON.stringify(calendars.map(c => ({ ...c, data: null })))
    );
    localStorage.setItem(LOCAL_GROUPS, JSON.stringify(calendarGroups));
  }

  function getCalFromURL(url: string) {
    return axios.get<CalendarAPIResult>(cURL(url, apiKey));
  }

  async function update() {
    setIsLoading(true);
    const calsWithData: ICalendar[] = [];
    for (let c of calendars) {
      calsWithData.push({
        ...c,
        data: (await getCalFromURL(c.url)).data
      });
    }
    setIsLoading(false);
    setCalendars(calsWithData);
  }

  function addCalendar(c: ICalendar) {
    setCalendars([
      ...calendars,
      {
        ...c,
        data: null
      }
    ]);
  }

  function removeCalendar(i: number) {
    calendars.splice(i, 1);
    setCalendars([...calendars]);
  }

  function moveUp(i: number) {
    const calendarsCopy = [...calendars];
    if (i > 0) {
      calendarsCopy.splice(i - 1, 0, calendars[i]);
      calendarsCopy.splice(i + 1, 1);
      setCalendars(calendarsCopy);
    }
  }

  function addCalendarGroup(c: CalendarGroup) {
    setCalendarGroups([...calendarGroups, c]);
  }
  function removeCalendarGroup(i: number) {
    const copy = [...calendarGroups];
    const group = copy[i];
    copy.splice(i, 1);

    const calendarsCopy = calendars.filter(c => c.groupUUID != group.uuid);

    setCalendars(JSON.parse(JSON.stringify(calendarsCopy)));
    setCalendarGroups(copy);
  }
  function moveCalendarGroupUp(i: number) {
    const copy = [...calendarGroups];
    if (i > 0) {
      copy.splice(i - 1, 0, calendarGroups[i]);
      copy.splice(i + 1, 1);
      setCalendarGroups(copy);
    }
  }

  // Save calendars to LocalStorage on change.
  React.useEffect(() => {
    saveToStorage();
  }, [calendars, calendarGroups]);

  return (
    <AppContext.Provider
      value={{
        calendarGroups,
        apiKey,
        setApiKey,
        calendars,
        isLoading,
        update,
        addCalendar,
        removeCalendar,
        moveUp,
        addCalendarGroup,
        removeCalendarGroup,
        moveCalendarGroupUp
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
