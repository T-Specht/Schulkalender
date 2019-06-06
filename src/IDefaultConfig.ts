export interface CALENDAR {
  name: string;
  url: string;
  color: string;
  data?: any;
  whiteText: boolean;
  groupUUID: string;
}

export interface CALENDARSGROUP {
  name: string;
  color: string;
  uuid: string;
  whiteText: boolean;
  active: boolean;
}

export interface DefaultConfig {
  CALENDARS: CALENDAR[];
  "CALENDARS-GROUPS": CALENDARSGROUP[];
  CALENDARS_API: string;
  CALENDARS_TEXT_LENGTH: number;
  CALENDARS_UPDATE_INTERVAL: number;
}
