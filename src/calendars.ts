import axios from "axios";
import { CalendarAPIResult } from "./ical-type";
import moment from "moment";

const KEY = 'AIzaSyDwEj7O-RRgWm9oBduidvCOPLTYWVR5gBw';

const cURL = (c: string) => `https://www.googleapis.com/calendar/v3/calendars/${c}/events?key=${KEY}&timeMin=${moment({
  date: 1,
  month: 0,
  minute: 0,
  hour: 0
}).utc().format()}`

export const CALENDARS: {
  name: string;
  color: string;
  whiteText: boolean;
  url: string | null;
}[] = [
  {
    name: "Allgemein",
    color: "#E91E63",
    whiteText: true,
    url: '1r19n0ivrjctl7jsroha4n81us%40group.calendar.google.com'
  },
  {
    name: "5",
    color: "#3F51B5",
    whiteText: true,
    url: "7nnbif6kcpu6rjb3jagfu3q0uk%40group.calendar.google.com"
  },
  {
    name: "9",
    color: "#009688",
    whiteText: true,
    url: "mspfnannktgc2dj2pnfuuc8fd8%40group.calendar.google.com"
  },
  {
    name: "Q2",
    color: "#FFC107",
    whiteText: false,
    url: "3pd2oatvud2hm9777k7fmgj1og%40group.calendar.google.com"
  }
]

export function getCalFromURL(url: string) {
  return axios.get<CalendarAPIResult>(cURL(url));
}

export type CalWithData = {
  name: string;
  color: string;
  whiteText: boolean;
  url: string | null;
  data: CalendarAPIResult;
};

export async function getCalendarWithData() {
  const calsWithData: {
    name: string;
    color: string;
    whiteText: boolean;
    url: string | null;
    data: CalendarAPIResult;
  }[] = [];
  for (let c of CALENDARS) {
    calsWithData.push({
      ...c,
      data: (await getCalFromURL(c.url!)).data
    });
  }
  return calsWithData;
}

(window as any).getCalendarWithData = getCalendarWithData;
