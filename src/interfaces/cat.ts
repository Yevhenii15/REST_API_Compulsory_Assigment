import { Owner } from "./owner";
export interface Cat extends Document {
  id: string;
  name: string;
  age: number;
  breed: string;
  color: string;
  weight: number;
  isVaccinated: boolean;
  birthDate: Date;
  _owner: Owner["id"];
}
