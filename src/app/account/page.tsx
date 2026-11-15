import type { Metadata } from "next";
import AccountPortal from "@/components/account/account-portal";

export const metadata: Metadata = {
  title: "Xaritoo Club Member Space",
  description: "Create a Xaritoo Club student or tutor account, find approved tutors, and message privately.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountPortal />;
}
