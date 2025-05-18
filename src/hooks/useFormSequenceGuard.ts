import { CookieType } from "@/cookieType";
import { getCookieValue } from "@/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function useFormSequenceGuard(
  cookieType: CookieType | CookieType[] | null
): boolean {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    if (!cookieType) {
      setIsAllowed(true);
      return;
    }
    const checkCookies = () => {
      if (Array.isArray(cookieType)) {
        // Check if all required cookies exist
        const missingCookie = cookieType.some((type) => !getCookieValue(type));
        return !missingCookie;
      } else {
        // Check if the single required cookie exists
        return !!getCookieValue(cookieType);
      }
    };

    const allowed = checkCookies();
    if (!allowed) {
      router.replace("/vehicles/register");
    } else {
      setIsAllowed(true);
    }
  }, [cookieType, router]);

  return isAllowed;
}
