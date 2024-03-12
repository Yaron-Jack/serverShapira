export interface CompostStandReqObject {
  compostStandId: number;
  name: string;
}

export interface CompostStandAdminsReq {
  userIds: string[];
  compostStandId: number;
}

export interface AddCompostStandAdminReq {
  userId: string;
  compostStandId: number;
}

export interface AddUsersLocalStandReqObject {
  compostStandId: number;
  userId: string;
}