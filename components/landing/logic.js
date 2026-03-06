import { useRouter } from "next/router";

export function useLandingLogic() {
  const router = useRouter();

  return {
    start: () => router.push("/text")
  };
}

