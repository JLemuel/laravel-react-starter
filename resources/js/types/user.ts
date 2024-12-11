export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    username: string;
    roles: string[];
    created_at: string;
  }
  
  export interface UserPageProps {
    users: User[];
    flash: {
      success: string | null;
      error: string | null;
    };
    availableRoles?: string[];
  }