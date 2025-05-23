import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";

type VehicleListItem = {
  _id: string;
  registrationNumber: string;
  type: string;
  owner: { name: string; phoneNumber: string };
  route: { route: string };
  createdAt: string;
};

export const useGetVehiclesQuery = () => {
  return useQuery({
    queryKey: [TagType.GET_VEHICLES],
    queryFn: () =>
      fetcher<{ success: boolean; data: VehicleListItem[] }>({
        url: "/api/vehicles",
        method: "GET",
      }),
  });
};
