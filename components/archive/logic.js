import { useRouter } from "next/router";
import { figmaAssets } from "@/lib/figmaAssets";

export function useArchiveLogic() {
  const router = useRouter();

  return {
    assets: figmaAssets,
    back: () => router.push("/text")
  };
}

