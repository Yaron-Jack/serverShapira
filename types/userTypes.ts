export interface phoneNumberReqObject {
  phoneNumber: string;
}
export interface userReqObject extends phoneNumberReqObject {
  firstName: string;
  lastName: string;
  email?: string;
}

export interface UserWithTransactionsCount {
  _count: {
    transactions: number;
  };
}
