import { useMutation } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import { CookieType } from "@/cookieType";
import { removeCookie } from "@/utils/cookies";
import {
  cleanVehicleInfo,
  cleanOwnerInfo,
  cleanDriverInfo,
} from "@/app/(dashboard)/vehicles/register/route-assignment/clean-payloads";
import { toast } from "react-toastify";

interface RegisterResponse {
  success: boolean;
  data: {
    paymentUrl: string;
  };
}

export const useRegisterVehicleMutation = () => {
  return useMutation({
    mutationFn: async (values: {
      route: string;
      routeState: string;
      vehicleInfo: IVehicleInfo;
      ownerInfo: IOwnerInfo;
      driverInfo: IDriverInformation;
    }) => {
      if (!values.vehicleInfo || !values.ownerInfo || !values.driverInfo) {
        throw new Error("Missing required information");
      }

      const payload = {
        vehicleInfo: cleanVehicleInfo(values.vehicleInfo),
        ownerInfo: cleanOwnerInfo(values.ownerInfo),
        driverInfo: cleanDriverInfo(values.driverInfo),
        routeInfo: {
          routeCode: values.route.toUpperCase(),
          state: values.routeState,
        },
      };

      const response = await fetcher<RegisterResponse>({
        url: "/api/vehicles/register",
        method: "POST",
        data: payload,
      });

      return response;
    },
    onSuccess: (response) => {
      if (response.success && response.data.paymentUrl) {
        Object.values(CookieType).forEach((cookieType) => {
          removeCookie(cookieType);
        });
        window.open(response.data.paymentUrl, "_self");
      } else {
        toast.error("Registration successful but payment URL not received");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error.message || "Failed to register vehicle. Please try again."
      );
      console.error("Registration error:", error);
    },
  });
};
