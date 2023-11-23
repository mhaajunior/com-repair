import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const useClientSession = (required = false) => {
  const { data: session } = useSession({
    required,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/");
    },
  });
  return session;
};

export default useClientSession;
