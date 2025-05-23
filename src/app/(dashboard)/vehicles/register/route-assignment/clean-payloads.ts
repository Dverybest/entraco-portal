import { Gender } from "@/types/gender";
import { IssuingAuthority } from "@/types/issuing-authority.enum";
import { LicenseClass } from "@/types/license-class.enum";
import dayjs from "dayjs";

const cleanVehicleInfo = (vehicleInfo: IVehicleInfo) => {
  return {
    ...vehicleInfo,
    yearOfManufacture: dayjs(vehicleInfo.yearOfManufacture).format("YYYY"),
    vehiclePhotoUrl: vehicleInfo.pictureUrl,
  };
};

const cleanOwnerInfo = (ownerInfo: IOwnerInfo) => {
  const { pictureUrl, ...rest } = ownerInfo;
  return {
    ...rest,
    idDocumentUrl: pictureUrl || ownerInfo.idDocumentUrl,
  };
};

const cleanDriverInfo = (driverInfo: IDriverInformation) => {
  return {
    ...driverInfo,
    gender: driverInfo.gender as Gender,
    licenseClass: driverInfo.licenseClass as LicenseClass,
    issuingAuthority: driverInfo.issuingAuthority as IssuingAuthority,
  };
};

export { cleanVehicleInfo, cleanOwnerInfo, cleanDriverInfo };
