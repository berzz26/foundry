export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
  provider: 'local' | 'google' | 'github' | string;
  providerId?: string;
  profileImageUrl?: string;
}
