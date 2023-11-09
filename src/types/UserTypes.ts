
export type ClientUserTypes = {
  cpf: string;
}

export type UserConfirmationData = {
  Username: string;
  UserPoolId: string | undefined;
}

export type UserDataUserPoolType = {
  Username: string;
  Password?: string;
  UserPoolId: string | undefined;
  ClientId: string | undefined;
  IdentityPoolId: string | undefined;
}