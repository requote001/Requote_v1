import Link from "next/link";

type SiteHeaderProps = {
  compact?: boolean;
};

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  return (
    <header
      className={
        compact ? "product-header product-header--compact" : "product-header"
      }
    >
      <div className="product-shell product-header__inner">
        <Link className="product-brand" href="/" aria-label="Requote home">
          <img src="/requote-logo.png" alt="Requote" />
        </Link>
        <nav className="product-nav" aria-label="Product navigation">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/trust-safety">Trust &amp; safety</Link>
          <Link href="/terms">Legal</Link>
        </nav>
        <div className="product-header__actions">
          <Link className="product-link-button" href="/waitlist">
            Join early access
          </Link>
          <Link
            className="product-primary-button product-primary-button--small"
            href="/post-a-request?journey=request&source=product"
          >
            Post a request
          </Link>
        </div>
      </div>
    </header>
  );
}
