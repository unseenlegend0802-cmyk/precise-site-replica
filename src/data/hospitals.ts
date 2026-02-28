export interface Hospital {
  name: string;
  doctor: string;
  qualification: string;
  specialization: string;
  experience: string;
  city: string;
  address: string;
  phone: string;
  mapQuery: string;
}

export const hospitals: Hospital[] = [
  {
    name: "Medicover Hospital",
    doctor: "Dr. Saiteja Namala",
    qualification: "MBBS, MD (Radiodiagnosis), EDiR, FVIR, EBIR",
    specialization: "Vascular & Onco-Interventional Radiology",
    experience: "4+ years",
    city: "Hyderabad",
    address: "Hi-tech City, Hyderabad, Telangana",
    phone: "040 68334455",
    mapQuery: "Medicover+Hospital+Hitech+City+Hyderabad",
  },
  {
    name: "Maven Medical Center",
    doctor: "Dr. Balaji Patel Kola",
    qualification: "MBBS, MD (Radiodiagnosis), FVIR, FIO, FAI",
    specialization: "Vascular & Interventional Radiology",
    experience: "21+ years",
    city: "Hyderabad",
    address: "Road No 2, Banjara Hills, Hyderabad, Telangana",
    phone: "+91 9177770777",
    mapQuery: "Maven+Medical+Center+Banjara+Hills+Hyderabad",
  },
  {
    name: "Nikhil Hospital (Dilsukhnagar)",
    doctor: "Dr. Nikhil Sunkarineni",
    qualification: "MBBS, MD, DM (Neurology)",
    specialization: "Neurology & Interventional Radiology",
    experience: "15+ years",
    city: "Hyderabad",
    address: "Gaddi Annaram Cross Road, Dilsukhnagar, Hyderabad, Telangana 500036",
    phone: "040 7124 1111",
    mapQuery: "Nikhil+Hospital+Dilsukhnagar+Hyderabad",
  },
  {
    name: "Nikhil Hospital (Srinagar Colony)",
    doctor: "Dr. Nishant Sunkarineni",
    qualification: "MBBS, MD, DM (Cardiology)",
    specialization: "Interventional Cardiology",
    experience: "10+ years",
    city: "Hyderabad",
    address: "Srinagar Colony Main Rd, SBH Colony, Hyderabad, Telangana",
    phone: "040 7124 1111",
    mapQuery: "Nikhil+Hospital+Srinagar+Colony+Hyderabad",
  },
  {
    name: "Anu Neuro & Cardiac Sciences",
    doctor: "Dr. Bhavani Shankar Manam",
    qualification: "MBBS, MD, DNB (Radio Diagnosis), FIVR",
    specialization: "Endovascular & Interventional Radiology",
    experience: "8+ years",
    city: "Vijayawada",
    address: "Enikepadu, Vijayawada, Andhra Pradesh",
    phone: "+91 8662436789",
    mapQuery: "Anu+Neuro+Cardiac+Sciences+Vijayawada",
  },
  {
    name: "Capital Hospital",
    doctor: "Dr. Vineel Inampudi",
    qualification: "MBBS, MD, DNB, FVIR, EBIR, MNAMS",
    specialization: "Vascular & Interventional Radiology",
    experience: "10+ years",
    city: "Vijayawada",
    address: "Poranki, Vijayawada, Andhra Pradesh",
    phone: "+91 8662981111",
    mapQuery: "Capital+Hospital+Poranki+Vijayawada",
  },
  {
    name: "Medicover Hospital",
    doctor: "Dr. Sibasankar Dalai",
    qualification: "MD, FACP, FINR (Neurology)",
    specialization: "Neuro Vascular Intervention",
    experience: "14+ years",
    city: "Visakhapatnam",
    address: "Venkojipalem, Visakhapatnam, Andhra Pradesh",
    phone: "040 68334455",
    mapQuery: "Medicover+Hospital+Venkojipalem+Visakhapatnam",
  },
];

export const cities = [...new Set(hospitals.map((h) => h.city))];
