export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  reservationsCount: number;
  totalSpent: number;
  status: CustomerStatus;
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  isActive: boolean;
  lastReservation?: string;
}

export type CustomerStatus = "active" | "inactive" | "blocked";
