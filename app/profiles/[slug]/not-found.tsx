import Link from "next/link";

export default function ProfileNotFound() {
  return <main className="status-page">
    <div className="status-page__mark" aria-hidden="true">404</div><p className="product-kicker">PROFILE UNAVAILABLE</p><h1>We couldn’t find this profile.</h1>
      <p>The link may be incorrect, or the profile may no longer be available. We won’t show someone else’s information in its place.</p>
      <div className="status-page__actions"><Link className="product-primary-button" href="/home">Back to home</Link><Link className="product-secondary-button" href="/profile">Your profile</Link></div>
  </main>;
}
