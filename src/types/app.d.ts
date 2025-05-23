
interface IVehicleInfo {
  capacity: string;
  chassisNumber: string;
  engineNumber: string;
  fuelType: string;
  issuingState: string;
  make: string;
  model: string;
  pictureUrl: string;
  registrationNumber: string;
  type: string;
  yearOfManufacture: string;
}

interface IOwnerInfo {
  dateOfBirth: string | Date;
  address: string;
  city: string;
  email: string;
  gender: string;
  idNumber: string;
  lga: string;
  name: string;
  phoneNumber: string;
  idDocumentUrl: string;
  state: string;
  pictureUrl?: string;
}

interface IDriverInformation {
  // Personal Information
  fullName: string;
  dateOfBirth: string; // ISO string format when saved to cookie
  gender: "Male" | "Female";
  nationality: string;
  state: string;
  lga: string;
  residentialAddress: string;
  phoneNumber: string;
  email: string;

  // Identification and Verification
  nin: string;
  validIdUrl: string;
  passportUrl: string;

  // Driver's License Information
  licenseNumber: string;
  licenseClass: LicenseClass;
  issuingAuthority: IssuingAuthority;
  issueDate: string; // ISO string format when saved to cookie
  expiryDate: string; // ISO string format when saved to cookie
  licenseUrl: string;
}


interface Vehicle {
  _id: string;
  capacity: string;
  chassisNumber: string;
  engineNumber: string;
  fuelType: string;
  issuingState: string;
  make: string;
  model: string;
  vehiclePhotoUrl: string;
  registrationNumber: string;
  type: string;
  yearOfManufacture: string;
  owner: string;
  driver: string;
  route: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface VerificationResponse {
  success: boolean;
  data: {
    _id: string;
    invoiceId: string;
    status: string;
    amount: number;
    vehicle: Vehicle;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

type VehicleCertificate = {
  _id: string;
  registrationNumber: string;
  chassisNumber: string;
  engineNumber: string;
  fuelType: string;
  issuingState: string;
  make: string;
  model: string;
  vehiclePhotoUrl: string;
  type: string;
  yearOfManufacture: string;
  capacity: string;
  owner: {
    name: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: string;
    address: string;
    city: string;
    gender: string;
    idNumber: string;
    lga: string;
    idDocumentUrl: string;
    state: string;
  };
  driver: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    state: string;
    lga: string;
    residentialAddress: string;
    phoneNumber: string;
    email: string;
    nin: string;
    validIdUrl: string;
    passportUrl: string;
    licenseNumber: string;
    licenseClass: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate: string;
    licenseUrl: string;
  };
  route: {
    stateCode: string;
    route: string;
    routeCode: string;
    registrationNo?: string;
    state: string;
  };
};


enum TagType {
  VEHICLE = "vehicle",
  OWNER = "owner",
  VERIFY_PAYMENT = "verify-payment",
  REGISTER_VEHICLE = "register-vehicle",
  GET_VEHICLES = "get-vehicles",
  GET_SINGLE_VEHICLE = "get-single-vehicle",

}