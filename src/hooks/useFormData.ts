import { useMemo } from "react";
import { getCookieValue } from "@/utils";
import { CookieType } from "@/cookieType";


export const useFormData = () => {
  return useMemo(() => {
    const vehicleInfo = getCookieValue<IVehicleInfo>(CookieType.VehicleInformation);
    const ownerInfo = getCookieValue<IOwnerInfo>(CookieType.OwnerInformation);
    const driverInfo = getCookieValue<IDriverInformation>(CookieType.DriverInformation);
    return {
      vehicleInfo,
      ownerInfo,
      driverInfo,
    };
  }, []);
}; 