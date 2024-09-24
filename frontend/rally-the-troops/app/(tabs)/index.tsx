import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function RedirectToHome() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the 'home' tab when '/tabs' is accessed
    router.replace("/home");
  }, [router]);

  return null; // No UI to display
}
