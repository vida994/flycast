import { getSession } from "@/actions/auth";
import { PasswordGate } from "@/components/PasswordGate";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await getSession();

  if (!isAuthenticated) {
    return <PasswordGate />;
  }

  return <>{children}</>;
}
