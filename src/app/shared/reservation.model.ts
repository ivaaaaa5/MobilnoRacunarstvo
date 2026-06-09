export interface Reservation {
  id?: string;
  date: string;
  time: string;
  numberOfGuests: number;
  userId: string;
  userName: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  tableNumber?: number;
}