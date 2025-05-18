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
  dateOfBirth: string;
  address: string;
  city: string;
  dateOfBirth: string;
  email: string;
  gender: string;
  idNumber: string;
  lga: string;
  name: string;
  phoneNumber: string;
  pictureUrl: string;
  state: string;
}


interface IDriverInformation {
  // Personal Information
  fullName: string;
  dateOfBirth: string; // ISO string format when saved to cookie
  gender: "Male" | "Female" ;
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
  licenseClass: "A" | "B" | "C" | "D" | "E" | "F";
  issuingAuthority: "FRSC" | "State VIO";
  issueDate: string; // ISO string format when saved to cookie
  expiryDate: string; // ISO string format when saved to cookie
  licenseUrl: string;
}