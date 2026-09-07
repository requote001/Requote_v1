import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader compact />
      <main className="status-page">
        <div className="status-page__mark">404</div>
        <p className="product-kicker">Page not found</p>
        <h1>This page is outside the agreement.</h1>
        <p>
          The link may be outdated, or the page may have moved. Return home or
          start a new request.
        </p>
        <div className="status-page__actions">
          <Link className="product-primary-button" href="/">
            Return home
          </Link>
          <Link className="product-secondary-button" href="/post-a-request">
            Post a request
          </Link>
        </div>
      </main>
    </>
  );
}
