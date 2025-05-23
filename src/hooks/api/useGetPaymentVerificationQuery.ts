import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import { TagType } from "@/types/enum";



export const useGetPaymentVerificationQuery = (reference: string) => {
  return useQuery<VerificationResponse>({
    queryKey: [TagType.VERIFY_PAYMENT, reference],
    queryFn: () => {
      return fetcher<VerificationResponse>({
        url: `/api/vehicles/verify-payment/${reference}`,
        method: "GET",
      });
    },
    enabled: !!reference,
    retry: 2, // Retry failed requests twice
    retryDelay: 1000, // Wait 1 second between retries
  });
}; 