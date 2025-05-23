import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import { TagType } from "@/types/enum";

export const useGetSingleVehicleQuery = (vehicleId: string) => {
  return useQuery({
    queryKey: [TagType.VEHICLE, vehicleId],
    queryFn: () =>
      fetcher<{ success: boolean; data: VehicleCertificate }>({
        url: `/api/vehicles/${vehicleId}`,
        method: "GET",
      }),
    enabled: !!vehicleId,
  });
};
