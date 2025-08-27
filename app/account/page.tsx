// app/account/page.tsx
import { auth } from "@/auth";

export default async function AccountDashboard() {
  const session = await auth();

  return (
    <div className="tab__content active-tab">
      <h3 className="tab__header">Welcome, {session?.user?.username || "Guest"}!</h3>
      <div className="tab__body">
        <p className="tab__description">
          From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
        </p>
      </div>
    </div>
  );
}
