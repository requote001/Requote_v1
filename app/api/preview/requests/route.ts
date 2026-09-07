import { NextResponse } from "next/server";
import {
  type RequestStatus,
  type RequoteRequest,
  validateRequestPayload,
} from "@/lib/request";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 },
    );
  }

  const submission = body as {
    request?: unknown;
    status?: RequestStatus;
  };
  const status =
    submission.status === "draft" || submission.status === "published"
      ? submission.status
      : null;
  const errors = validateRequestPayload(submission.request);

  if (!status) {
    errors.push("Choose whether to save or publish the request.");
  }

  if (errors.length > 0 || !status) {
    return NextResponse.json({ message: errors[0], errors }, { status: 400 });
  }

  const requestDetails = submission.request as RequoteRequest;
  return NextResponse.json(
    {
      request: {
        ...requestDetails,
        id: crypto.randomUUID(),
        status,
        createdAt: new Date().toISOString(),
        persisted: false,
      },
      preview: true,
    },
    { status: 201 },
  );
}
