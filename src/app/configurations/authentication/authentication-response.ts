import { User } from "src/app/core/models/user.model";

export interface AuthenticationResponse {
  user: User;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}
