export interface TimeSlot {
  id?: string;
  date: string;
  time: string;
  available: boolean;
  maxGuests: number;
}