export interface Event {
  title: string;
  description: string;
  date: string;
  location: string;
  activity: string;
  createdBy: string | null;
  invitees: string[];
  attendees?: string[];
  declined?: string[];
}
