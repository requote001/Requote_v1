import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="product-footer">
      <div className="product-shell product-footer__grid">
        <div className="product-footer__brand">
          <Link className="product-brand" href="/">
            <img src="/requote-logo.png" alt="Requote" />
          </Link>
          <p>Clear requests, competitive offers, and protected transactions.</p>
        </div>
        <div>
          <strong>Product</strong>
          <Link href="/post-a-request">Post a request</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/create-account?role=provider">Become a provider</Link>
        </div>
        <div>
          <strong>Trust</strong>
          <Link href="/trust-safety">Trust &amp; safety</Link>
          <Link href="/trust-safety#disputes">Dispute process</Link>
          <a href="mailto:info@requote.cc">Contact support</a>
        </div>
        <div>
          <strong>Legal</strong>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Cookies</Link>
        </div>
      </div>
      <div className="product-shell product-footer__bottom">
        <span>© {new Date().getFullYear()} Requote Marketplace.</span>
        <span>Built for trusted transactions in Nigeria.</span>
      </div>
    </footer>
  );
}
