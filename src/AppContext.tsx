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
  updateInterval: number;
  setUpdateInterval: (minutes: number) => void;
  setCalendarGroupActiveStatus: (uuid: string, active: boolean) => void;
  textLength: number,
  setTextLength: (value: number) => any;
}

export interface CalendarGroup {
  name: string;
  color: string;
  uuid: string;
  whiteText: boolean;
  active: boolean;
}

export const AppContext = React.createContext<ContextType>({} as any);

const LOCAL = "CALENDARS";
const LOCAL_GROUPS = LOCAL + "-GROUPS";

export function usePersistentState<T>(
  initialValue: T,
  key: string,
  session = false,
  saveFunction?: (value: T) => string,
  getFunction?: (raw: string) => T
) {
  const storage = session ? sessionStorage : localStorage;

  const localKey = `${LOCAL}${key.toUpperCase()}`;
  let [value, setValue] = useState(() => {
    let localItem = storage.getItem(localKey);
    const getFunc: (raw: string) => T = getFunction ? getFunction : JSON.parse;
    return localItem != null ? getFunc(localItem) : initialValue;
  });

  useEffect(() => {
    storage.setItem(
      localKey,
      saveFunction ? saveFunction(value) : JSON.stringify(value)
    );
  }, [value]);

  return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}

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
  const [calendars, setCalendars] = usePersistentState<ICalendar[]>(
    [],
    "",
    false,
    calendars => JSON.stringify(calendars.map(c => ({ ...c, data: null })))
  );
  const [apiKey, setApiKey] = usePersistentState(
    "",
    "_API",
    false,
    raw => raw,
    raw => raw
  );
  const [updateInterval, setUpdateInterval] = usePersistentState(
    60,
    "_UPDATE_INTERVAL"
  );
  const [textLength, setTextLength] = usePersistentState(
    1000,
    "_TEXT_LENGTH"
  );
  const [calendarGroups, setCalendarGroups] = usePersistentState<
    CalendarGroup[]
  >([], "-GROUPS");
  const [isLoading, setIsLoading] = useState(false);

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

  function setCalendarGroupActiveStatus(uuid: string, active: boolean) {
    const copy = [...calendarGroups];
    copy.find(c => c.uuid == uuid)!.active = active;
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

  return (
    <AppContext.Provider
      value={{
        calendarGroups,
        updateInterval,
        setUpdateInterval,
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
        moveCalendarGroupUp,
        setCalendarGroupActiveStatus,
        textLength,
        setTextLength
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
