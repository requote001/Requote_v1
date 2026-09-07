import type { Metadata } from "next";
import LandingPage from "@/src/App";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <LandingPage />;
}
