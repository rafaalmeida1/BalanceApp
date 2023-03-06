export interface UserProps {
  id: string;
  email: string;
  username: string;
  user_account: {
    balance: number;
  };
}

export interface GetUserProps {
  userLoggedIn: {
    id: string;
    username: string;
    email: string;
  };
  userAccount: {
    id: string;
    balance: number; 
  }
}