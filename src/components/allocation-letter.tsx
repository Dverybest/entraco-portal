import { Image as AntImage, Flex, QRCode, Typography } from "antd";
import Image from "next/image";
import React from "react";
import { AllocationCard } from "./allocation-card";
const { Title, Text } = Typography;

interface AllocationLetterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export const AllocationLetter: React.FC<AllocationLetterProps> = ({ data }) => {
  const text = `https://shop-allocation-portal-y5f2l.ondigitalocean.app/${data.id}`;
  const personalInformation: Record<string, string> = {
    "Full Name": data.shopOwner.fullName,
    "Phone Number": data.shopOwner.phoneNumber,
    Gender: data.shopOwner.gender,
    Address: data.shopOwner.address,
    City: data.shopOwner.city,
    Town: data.shopOwner.town,
    "L.G.A": data.shopOwner.lga,
    State: data.shopOwner.state,
    Country: data.shopOwner.country,
  };
  const employmentInformation: Record<string, string> = {
    "Current Employer": data.shopOwner.employmentInformation.currentEmployer,
    "Employer Address": data.shopOwner.employmentInformation.address,
    "Phone No.": data.shopOwner.employmentInformation.phoneNumber,
    email: data.shopOwner.employmentInformation.email ?? "",
    "Zip Code": data.shopOwner.employmentInformation.zipCode,
    City: data.shopOwner.employmentInformation.city,
    Town: data.shopOwner.employmentInformation.town,
    "L.G.A": data.shopOwner.employmentInformation.lga,
    State: data.shopOwner.employmentInformation.state,
    Country: data.shopOwner.employmentInformation.country,
  };
  const emergencyInformation: Record<string, string> = {
    "Name of Next Kin": data.shopOwner.emergencyContact.name,
    "Phone No.": data.shopOwner.emergencyContact.phoneNumber,
    Relationship: data.shopOwner.emergencyContact.relationship,
    Address: data.shopOwner.emergencyContact.address,
    "Zip Code": data.shopOwner.emergencyContact.zipCode,
    City: data.shopOwner.emergencyContact.city,
    Town: data.shopOwner.emergencyContact.town,
    "L.G.A": data.shopOwner.emergencyContact.lga,
    State: data.shopOwner.emergencyContact.state,
    Country: data.shopOwner.emergencyContact.country,
  };
  return (
    <main style={allocationLetterContainer}>
      <Flex style={{ justifyContent: "space-between" }}>
        <Image src={"/logo.svg"} alt="" width={120} height={120} />
        <div style={headerContent}>
          <Title>ENUGU NORTH LOCAL GOVERNMENT</Title>
          <Text>GOVERNMENT OF ENUGU STATE NIGERIA</Text>
          <Text>SHOP ALLOCATION LETTER</Text>
        </div>
        <AntImage
          src={data.shopOwner.pictureUrl}
          alt=""
          style={{ objectFit: "contain" }}
          width={142}
          height={142}
        />
      </Flex>
      <section style={allocationCardsContainer}>
        <AllocationCard
          title="Personal Information"
          data={personalInformation}
        />
        <AllocationCard
          title="Employment/Business Information"
          data={employmentInformation}
        />
        <AllocationCard
          title="Emergency Information"
          data={emergencyInformation}
        />
      </section>
      <section style={allocationConditions}>
        <ol>
          <li>
            <Text>
              I am pleased to inform you that you have been allocated Stall No.
              {data.number} at {data.market.name}, Enugu. The allocation is
              subject to the following conditions:
            </Text>
          </li>

          <li>
            <ol style={{ listStyleType: "upper-roman", marginLeft: "1rem" }}>
              <li>
                <Text>
                  The allottee will develop the stall at his/her own expense and
                  in strict compliance with the local government approved design
                </Text>
              </li>
              <li>
                <Text>
                  The cost of the development of the stall is assessed at
                  payment of the following fees:
                </Text>
                <ol
                  style={{ listStyleType: "lower-alpha", marginLeft: "1rem" }}
                >
                  <li>
                    <Text>Allocation Fee of N2,000</Text>
                  </li>
                  <li>
                    <Text>Capitation Rate for 3 years</Text>
                  </li>
                  <li>
                    <Text>Development Rate</Text>
                  </li>
                  <li>
                    <Text>Tax clearance Covering the Past 3 Years</Text>
                  </li>
                  <li>
                    <Text>Stallage Fee per Month</Text>
                  </li>
                </ol>
              </li>
              <li>
                <Text>
                  The Allottee shall develop the stall space within 6 months of
                  Allocation, in default of which the allocation stand revoked
                  without notice
                </Text>
              </li>
              <li>
                <Text>
                  The stallage fees payable will be in accordance with the rate
                  approved for Artisan Market, Ana Market, Ogbete Main Market,
                  Livestock Market and or any Bye law or notice relating thereto
                </Text>
              </li>
              <li>
                <Text>
                  The Allottee shall pay half of the stallage fees due
                </Text>
              </li>
              <li>
                <Text>Prompt payment of stallage fees when the fall due</Text>
              </li>
              <li>
                <Text>
                  The Local Government reserves the right to revoke the
                  allocation on default of payment fees and for the allienation
                  of the staff
                </Text>
              </li>
              <li>
                <Text>
                  The ownership of the stall is that of the Enugu North Local
                  Government
                </Text>
              </li>
              <li>
                <Text>
                  You are required to keep the surroundings of your Stall very
                  clean at all times
                </Text>
              </li>
            </ol>
          </li>

          <li>
            <Text style={{ marginTop: "20px" }}>
              If the above conditions are acceptable to you, you should report
              to the market superintendent with this Letter for payment of
              stipulated fees and take of the stall.
            </Text>
          </li>
        </ol>
      </section>
      <Flex style={footerContainer}>
        <QRCode value={text || "-"} />
        <Image
          src={"/chairman-signature.svg"}
          alt=""
          width={200}
          height={200}
        />
      </Flex>
    </main>
  );
};

const allocationLetterContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  padding: "1.5rem",
  height: "100%",
  overflow: "auto",
};

const headerContent: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

const footerContainer: React.CSSProperties = {
  justifyContent: "space-between",
};

const allocationCardsContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
};

const allocationConditions: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "3rem",
  borderRadius: "16px",
  color: "black",
  fontWeight: 500,
};
