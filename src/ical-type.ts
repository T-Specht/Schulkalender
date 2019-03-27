export interface Creator {
  email: string;
  displayName: string;
}

export interface Organizer {
  email: string;
  displayName: string;
  self: boolean;
}

export interface Start {
  date: string;
  dateTime?: Date;
}

export interface End {
  date: string;
  dateTime?: Date;
}

export interface OriginalStartTime {
  date: string;
}

export interface Item {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: Date;
  updated: Date;
  summary: string;
  creator: Creator;
  organizer: Organizer;
  start: Start;
  end: End;
  transparency: string;
  iCalUID: string;
  sequence: number;
  recurrence: string[];
  recurringEventId: string;
  originalStartTime: OriginalStartTime;
  location: string;
  endTimeUnspecified?: boolean;
  description: string;
}

export interface CalendarAPIResult {
  kind: string;
  etag: string;
  summary: string;
  description: string;
  updated: Date;
  timeZone: string;
  accessRole: string;
  defaultReminders: any[];
  nextPageToken: string;
  items: Item[];
}
