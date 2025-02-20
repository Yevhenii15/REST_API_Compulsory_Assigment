export interface Owner extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string; // Contact number
  address: string; // Home address
  createdAt: Date;
  updatedAt: Date;
}
