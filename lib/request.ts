export type RequestStatus = "draft" | "published";

export type RequoteRequest = {
  title: string;
  category: string;
  description: string;
  quantity: string;
  specifications: string;
  attachmentNames: string[];
  location: {
    state: string;
    city: string;
    address: string;
  };
  logistics: "requote" | "self" | "provider" | "discuss";
  budget: {
    minimum: string;
    maximum: string;
    currency: "NGN";
  };
  neededBy: string;
  timelineFlexible: boolean;
};

export type RequestSubmission = {
  request: RequoteRequest;
  status: RequestStatus;
};

export type SavedRequest = RequoteRequest & {
  id: string;
  status: RequestStatus;
  createdAt: string;
  persisted: false;
};

export const initialRequest: RequoteRequest = {
  title: "",
  category: "",
  description: "",
  quantity: "",
  specifications: "",
  attachmentNames: [],
  location: {
    state: "",
    city: "",
    address: "",
  },
  logistics: "discuss",
  budget: {
    minimum: "",
    maximum: "",
    currency: "NGN",
  },
  neededBy: "",
  timelineFlexible: false,
};

export const REQUEST_DRAFT_KEY = "requote.requestDraft";
export const PENDING_REQUEST_KEY = "requote.pendingRequest";
export const SAVED_REQUESTS_KEY = "requote.savedRequests";
export const PREVIEW_SESSION_KEY = "requote.previewSession";

export function validateRequestPayload(value: unknown): string[] {
  if (!value || typeof value !== "object") {
    return ["Request details are missing."];
  }

  const request = value as Partial<RequoteRequest>;
  const errors: string[] = [];

  if (!request.title || request.title.trim().length < 6) {
    errors.push("Add a clear request title.");
  }
  if (!request.category) {
    errors.push("Choose a category.");
  }
  if (!request.description || request.description.trim().length < 20) {
    errors.push("Describe the request in at least 20 characters.");
  }
  if (!request.location?.state || !request.location.city) {
    errors.push("Add the state and city where the request is needed.");
  }

  const minimum = request.budget?.minimum
    ? Number(request.budget.minimum.replace(/,/g, ""))
    : undefined;
  const maximum = request.budget?.maximum
    ? Number(request.budget.maximum.replace(/,/g, ""))
    : undefined;

  if (
    minimum !== undefined &&
    maximum !== undefined &&
    (Number.isNaN(minimum) || Number.isNaN(maximum) || maximum < minimum)
  ) {
    errors.push("The maximum budget must be greater than the minimum budget.");
  }

  return errors;
}
