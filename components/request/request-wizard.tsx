"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  getPreviewSession,
  storePendingRequest,
  submitPreviewRequest,
} from "@/lib/preview-session";
import {
  initialRequest,
  REQUEST_DRAFT_KEY,
  type RequestStatus,
  type RequoteRequest,
  validateRequestPayload,
} from "@/lib/request";

const steps = [
  { label: "Basics", helper: "What do you need?" },
  { label: "Details", helper: "Define the outcome" },
  { label: "Delivery", helper: "Where and how?" },
  { label: "Budget", helper: "Set expectations" },
  { label: "Review", helper: "Confirm the request" },
];

const categories = [
  "Agriculture",
  "Fabrication & Welding",
  "Construction & Skilled Trades",
  "Digital & Technology Services",
  "Logistics & Delivery",
  "Professional Services",
  "Other",
];

const logisticsOptions: {
  value: RequoteRequest["logistics"];
  title: string;
  copy: string;
}[] = [
  {
    value: "requote",
    title: "Requote logistics",
    copy: "Request a quote from an available Requote logistics partner.",
  },
  {
    value: "provider",
    title: "Provider arranges delivery",
    copy: "Providers should include logistics in their offer.",
  },
  {
    value: "self",
    title: "I will arrange it",
    copy: "You will coordinate transport or access independently.",
  },
  {
    value: "discuss",
    title: "Decide with the provider",
    copy: "Keep logistics open until you review the offers.",
  },
];

function getStepErrors(step: number, request: RequoteRequest) {
  if (step === 0) {
    if (request.title.trim().length < 6) {
      return "Use a clear title with at least 6 characters.";
    }
    if (!request.category) return "Choose the closest category.";
  }

  if (step === 1 && request.description.trim().length < 20) {
    return "Describe the required outcome in at least 20 characters.";
  }

  if (step === 2 && (!request.location.state || !request.location.city)) {
    return "Add the state and city where the request is needed.";
  }

  if (step === 3) {
    const minimum = request.budget.minimum
      ? Number(request.budget.minimum.replace(/,/g, ""))
      : undefined;
    const maximum = request.budget.maximum
      ? Number(request.budget.maximum.replace(/,/g, ""))
      : undefined;
    if (
      minimum !== undefined &&
      maximum !== undefined &&
      (Number.isNaN(minimum) || Number.isNaN(maximum) || maximum < minimum)
    ) {
      return "The maximum budget must be greater than the minimum budget.";
    }
  }

  return "";
}

function formatBudget(request: RequoteRequest) {
  const { minimum, maximum } = request.budget;
  if (!minimum && !maximum) return "Open to provider offers";
  if (minimum && maximum) return "₦" + minimum + " – ₦" + maximum;
  return minimum ? "From ₦" + minimum : "Up to ₦" + maximum;
}

export function RequestWizard() {
  const router = useRouter();
  const [request, setRequest] = useState<RequoteRequest>(initialRequest);
  const [step, setStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<RequestStatus | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(REQUEST_DRAFT_KEY);
    const frame = window.requestAnimationFrame(() => {
      if (stored) {
        try {
          setRequest(JSON.parse(stored) as RequoteRequest);
        } catch {
          window.localStorage.removeItem(REQUEST_DRAFT_KEY);
        }
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(REQUEST_DRAFT_KEY, JSON.stringify(request));
  }, [hydrated, request]);

  function setTopLevel<K extends keyof RequoteRequest>(
    field: K,
    value: RequoteRequest[K],
  ) {
    setRequest((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function goToStep(nextStep: number) {
    const bounded = Math.max(0, Math.min(steps.length - 1, nextStep));
    setStep(bounded);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function continueFlow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const stepError = getStepErrors(step, request);
    if (stepError) {
      setError(stepError);
      return;
    }
    goToStep(step + 1);
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const names = Array.from(event.target.files ?? []).map((file) => file.name);
    setTopLevel("attachmentNames", names);
  }

  async function submitRequest(status: RequestStatus) {
    const errors = validateRequestPayload(request);
    if (errors.length > 0) {
      setError(errors[0]);
      if (!request.title || !request.category) setStep(0);
      else if (request.description.trim().length < 20) setStep(1);
      else if (!request.location.state || !request.location.city) setStep(2);
      return;
    }

    const submission = { request, status };
    const session = getPreviewSession();

    if (!session) {
      storePendingRequest(submission);
      router.push("/login?next=%2Fpost-a-request%2Fcomplete&intent=" + status);
      return;
    }

    setSubmitting(status);
    setError("");
    try {
      const saved = await submitPreviewRequest(submission);
      window.localStorage.removeItem(REQUEST_DRAFT_KEY);
      router.push(
        "/post-a-request/complete?id=" +
          encodeURIComponent(saved.id) +
          "&status=" +
          saved.status,
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The request could not be processed.",
      );
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="request-flow">
      <aside className="request-progress" aria-label="Request progress">
        <div>
          <p className="product-kicker product-kicker--light">New request</p>
          <h1>Tell providers exactly what success looks like.</h1>
          <p>
            Clear details lead to better offers and create the record used for
            transaction protection.
          </p>
        </div>
        <ol>
          {steps.map((item, index) => (
            <li
              className={
                index === step
                  ? "is-current"
                  : index < step
                    ? "is-complete"
                    : ""
              }
              key={item.label}
            >
              <button
                type="button"
                onClick={() => index < step && goToStep(index)}
              >
                <span>{index < step ? "✓" : index + 1}</span>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.helper}</small>
                </div>
              </button>
            </li>
          ))}
        </ol>
        <div className="request-progress__protection">
          <span>✓</span>
          <p>
            <strong>Your progress is saved on this device.</strong>
            You will log in only when you save the draft or publish.
          </p>
        </div>
      </aside>

      <section className="request-workspace">
        <header className="request-workspace__header">
          <div>
            <span>
              Step {step + 1} of {steps.length}
            </span>
            <strong>{steps[step].label}</strong>
          </div>
          <span className="request-workspace__saved">
            {hydrated ? "Draft saved locally" : "Loading draft…"}
          </span>
        </header>

        <form className="request-form" onSubmit={continueFlow}>
          {step === 0 && (
            <div className="request-screen">
              <header>
                <p className="product-kicker">Request basics</p>
                <h2>What do you need?</h2>
                <p>
                  Write a title providers can understand at a glance, then
                  choose the closest category.
                </p>
              </header>
              <label>
                Request title
                <input
                  type="text"
                  value={request.title}
                  onChange={(event) => setTopLevel("title", event.target.value)}
                  placeholder="e.g. Commercial welding for a workshop gate"
                  maxLength={90}
                  autoFocus
                />
                <small>{request.title.length}/90 characters</small>
              </label>
              <label>
                Category
                <select
                  value={request.category}
                  onChange={(event) =>
                    setTopLevel("category", event.target.value)
                  }
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <div className="request-tip">
                <span>Tip</span>
                <p>
                  Describe the outcome—not the provider. “Fabricate and install
                  a steel security gate” is stronger than “I need a welder.”
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="request-screen">
              <header>
                <p className="product-kicker">Scope and quality</p>
                <h2>Define the expected outcome.</h2>
                <p>
                  These details become the shared reference for every offer and
                  any later delivery review.
                </p>
              </header>
              <label>
                Detailed description
                <textarea
                  value={request.description}
                  onChange={(event) =>
                    setTopLevel("description", event.target.value)
                  }
                  placeholder="Describe what should be supplied or completed, how it will be used, and what a good result looks like."
                  rows={6}
                  autoFocus
                />
                <small>Minimum 20 characters</small>
              </label>
              <div className="form-grid form-grid--two">
                <label>
                  Quantity or size
                  <input
                    type="text"
                    value={request.quantity}
                    onChange={(event) =>
                      setTopLevel("quantity", event.target.value)
                    }
                    placeholder="e.g. 2 gates or 500 units"
                  />
                </label>
                <label>
                  Quality or standard
                  <input
                    type="text"
                    value={request.specifications}
                    onChange={(event) =>
                      setTopLevel("specifications", event.target.value)
                    }
                    placeholder="Material, grade, finish, format…"
                  />
                </label>
              </div>
              <label className="file-field">
                Reference files
                <input type="file" multiple onChange={handleFiles} />
                <span>
                  <strong>Upload photos or documents</strong>
                  PNG, JPG, or PDF references. File names are retained in this
                  preview.
                </span>
              </label>
              {request.attachmentNames.length > 0 && (
                <ul className="file-list">
                  {request.attachmentNames.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="request-screen">
              <header>
                <p className="product-kicker">Location and logistics</p>
                <h2>Where is the request needed?</h2>
                <p>
                  Providers use this to judge availability, travel, delivery,
                  and installation costs.
                </p>
              </header>
              <div className="form-grid form-grid--two">
                <label>
                  State
                  <input
                    type="text"
                    value={request.location.state}
                    onChange={(event) =>
                      setRequest((current) => ({
                        ...current,
                        location: {
                          ...current.location,
                          state: event.target.value,
                        },
                      }))
                    }
                    placeholder="e.g. Lagos"
                    autoFocus
                  />
                </label>
                <label>
                  City or area
                  <input
                    type="text"
                    value={request.location.city}
                    onChange={(event) =>
                      setRequest((current) => ({
                        ...current,
                        location: {
                          ...current.location,
                          city: event.target.value,
                        },
                      }))
                    }
                    placeholder="e.g. Ikeja"
                  />
                </label>
              </div>
              <label>
                Address or access note{" "}
                <span className="optional">Optional</span>
                <input
                  type="text"
                  value={request.location.address}
                  onChange={(event) =>
                    setRequest((current) => ({
                      ...current,
                      location: {
                        ...current.location,
                        address: event.target.value,
                      },
                    }))
                  }
                  placeholder="Share precise details after selecting a provider if preferred"
                />
              </label>
              <fieldset className="choice-grid">
                <legend>How should logistics be handled?</legend>
                {logisticsOptions.map((option) => (
                  <label
                    className={
                      request.logistics === option.value ? "is-selected" : ""
                    }
                    key={option.value}
                  >
                    <input
                      type="radio"
                      name="logistics"
                      value={option.value}
                      checked={request.logistics === option.value}
                      onChange={() => setTopLevel("logistics", option.value)}
                    />
                    <span>
                      <strong>{option.title}</strong>
                      <small>{option.copy}</small>
                    </span>
                  </label>
                ))}
              </fieldset>
            </div>
          )}

          {step === 3 && (
            <div className="request-screen">
              <header>
                <p className="product-kicker">Budget and timing</p>
                <h2>Set useful expectations.</h2>
                <p>
                  A budget is optional. Providers can still submit offers when
                  you prefer to compare the market first.
                </p>
              </header>
              <div className="form-grid form-grid--two">
                <label>
                  Minimum budget <span className="optional">Optional</span>
                  <span className="money-field">
                    <i>₦</i>
                    <input
                      inputMode="numeric"
                      value={request.budget.minimum}
                      onChange={(event) =>
                        setRequest((current) => ({
                          ...current,
                          budget: {
                            ...current.budget,
                            minimum: event.target.value.replace(/[^0-9,]/g, ""),
                          },
                        }))
                      }
                      placeholder="250,000"
                      autoFocus
                    />
                  </span>
                </label>
                <label>
                  Maximum budget <span className="optional">Optional</span>
                  <span className="money-field">
                    <i>₦</i>
                    <input
                      inputMode="numeric"
                      value={request.budget.maximum}
                      onChange={(event) =>
                        setRequest((current) => ({
                          ...current,
                          budget: {
                            ...current.budget,
                            maximum: event.target.value.replace(/[^0-9,]/g, ""),
                          },
                        }))
                      }
                      placeholder="500,000"
                    />
                  </span>
                </label>
              </div>
              <label>
                When do you need it?
                <input
                  type="date"
                  value={request.neededBy}
                  onChange={(event) =>
                    setTopLevel("neededBy", event.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </label>
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={request.timelineFlexible}
                  onChange={(event) =>
                    setTopLevel("timelineFlexible", event.target.checked)
                  }
                />
                <span>
                  My timing is flexible if the right provider needs longer.
                </span>
              </label>
              <div className="request-tip request-tip--blue">
                <span>Protected</span>
                <p>
                  This budget does not charge your account. Payment is discussed
                  after you accept an offer and confirm the agreement.
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="request-screen request-review">
              <header>
                <p className="product-kicker">Review request</p>
                <h2>Make sure providers see the same clear brief.</h2>
                <p>
                  You can return to any section before saving or publishing.
                </p>
              </header>
              <div className="review-title">
                <span>{request.category}</span>
                <h3>{request.title}</h3>
                <p>{request.description}</p>
              </div>
              <div className="review-grid">
                <button type="button" onClick={() => goToStep(1)}>
                  <span>Scope</span>
                  <strong>
                    {request.quantity || "Quantity not specified"}
                  </strong>
                  <small>
                    {request.specifications || "Quality open for discussion"}
                  </small>
                </button>
                <button type="button" onClick={() => goToStep(2)}>
                  <span>Location</span>
                  <strong>
                    {request.location.city}, {request.location.state}
                  </strong>
                  <small>
                    {
                      logisticsOptions.find(
                        (option) => option.value === request.logistics,
                      )?.title
                    }
                  </small>
                </button>
                <button type="button" onClick={() => goToStep(3)}>
                  <span>Budget</span>
                  <strong>{formatBudget(request)}</strong>
                  <small>
                    {request.neededBy
                      ? "Needed by " + request.neededBy
                      : "Timing open for discussion"}
                  </small>
                </button>
                <button type="button" onClick={() => goToStep(1)}>
                  <span>References</span>
                  <strong>
                    {request.attachmentNames.length
                      ? request.attachmentNames.length + " file(s)"
                      : "No files added"}
                  </strong>
                  <small>Add drawings, examples, or inspection notes.</small>
                </button>
              </div>
              <div className="review-protection">
                <span>✓</span>
                <div>
                  <strong>This request becomes the source of truth.</strong>
                  <p>
                    Accepted offers and later changes will be recorded against
                    these details.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <footer className="request-form__actions">
            {step > 0 ? (
              <button
                className="product-secondary-button"
                type="button"
                onClick={() => goToStep(step - 1)}
              >
                Back
              </button>
            ) : (
              <a className="product-link-button" href="/">
                Cancel
              </a>
            )}

            {step < steps.length - 1 ? (
              <button className="product-primary-button" type="submit">
                Continue
              </button>
            ) : (
              <div className="request-submit-actions">
                <button
                  className="product-secondary-button"
                  type="button"
                  disabled={submitting !== null}
                  onClick={() => submitRequest("draft")}
                >
                  {submitting === "draft" ? "Saving…" : "Save as draft"}
                </button>
                <button
                  className="product-primary-button"
                  type="button"
                  disabled={submitting !== null}
                  onClick={() => submitRequest("published")}
                >
                  {submitting === "published"
                    ? "Publishing…"
                    : "Publish request"}
                </button>
              </div>
            )}
          </footer>
        </form>
      </section>
    </div>
  );
}
