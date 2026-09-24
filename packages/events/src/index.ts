export const domainEvents = {
  userCreated: "user.created",
  profileChanged: "provider.matching-profile.changed",
  requestPublished: "request.published",
  offerSubmitted: "offer.submitted",
  agreementLocked: "agreement.locked",
  paymentVerified: "payment.verified",
  messageCreated: "message.created",
  evidenceSubmitted: "evidence.submitted",
  disputeOpened: "dispute.opened",
} as const;

export type DomainEventName = (typeof domainEvents)[keyof typeof domainEvents];
