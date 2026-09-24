export type AuthenticatedSubject = {
  userId: string;
  sessionId?: string;
  activeRole?: string;
};

export type AuthorizationContext = AuthenticatedSubject & {
  roles: string[];
  isOperator: boolean;
};
