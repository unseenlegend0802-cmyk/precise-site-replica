/**
 * Featured doctors shown on the homepage.
 * To add a new doctor:
 * 1. Place their photo in src/assets/doctors/
 * 2. Add an entry below with name, slug (lowercase, hyphenated), qualification, specialization, city, and image import
 * 3. Ensure a matching profile exists in the database (doctors + doctor_procedures tables)
 */

import vinayagamaniImg from "@/assets/doctors/vinayagamani.png";
import balajiImg from "@/assets/doctors/balaji.png";
import saileshImg from "@/assets/doctors/sailesh.png";
import bhavaniImg from "@/assets/doctors/bhavani.png";
import abhishekBansalImg from "@/assets/doctors/Abhishekbansal.png";
import AmolNagvekarImg from "@/assets/doctors/AmolNagvekar.png";
import AnildevaraImg from "@/assets/doctors/Anildevara.png";
import ArulArokiaImg from "@/assets/doctors/ArulArokia.png";
import BhaskarMVImg from "@/assets/doctors/BhaskarMV.png";

export interface FeaturedDoctor {
  name: string;
  slug: string;
  qualification: string;
  specialization: string;
  city: string;
  image: string;
}

export const featuredDoctors: FeaturedDoctor[] = [
  {
    name: "Dr. Vinayagamani",
    slug: "dr-vinayagamani",
    qualification: "MBBS, DMRD, DNB",
    specialization: "Interventional Radiology",
    city: "Madurai",
    image: vinayagamaniImg,
  },
  {
    name: "Dr. Balaji Patel Kola",
    slug: "dr-balaji-patel-kola",
    qualification: "MBBS, DMRD, DNB",
    specialization: "Interventional Radiology",
    city: "Hyderabad",
    image: balajiImg,
  },
  {
    name: "Dr. Sailesh Kumar Garge",
    slug: "dr-sailesh-kumar-garge",
    qualification: "MBBS, DMRD, DNB",
    specialization: "Interventional Radiology",
    city: "Hyderabad",
    image: saileshImg,
  },
  {
    name: "Dr. Bhavani Shankar",
    slug: "dr-bhavani-shankar-manam",
    qualification: "MBBS, MD, DNB, FIVR",
    specialization: "Endovascular & Interventional Radiology",
    city: "Vijayawada",
    image: bhavaniImg,
  },
  {
    name: "Dr. Abhishek Bansal",
    slug: "dr-abhishek-bansal",
    qualification: "MBBS, DNB, Fellowship VIR",
    specialization: "Vascular & Interventional Radiology",
    city: "Delhi",
    image: abhishekBansalImg,
  },
  {
    name: "Dr. Amol Nagvekar",
    slug: "dr-amol-nagvekar",
    qualification: "MBBS, DNB, FVIR",
    specialization: "Vascular & Interventional Radiology",
    city: "Jaipur",
    image: AmolNagvekarImg,
  },
  {
    name: "Dr. Devara Anil Kashi Vishnuvardhan",
    slug: "dr-anil-devara",
    qualification: "MD, DNB, DMRE",
    specialization: "Interventional Radiologist",
    city: "Vizag",
    image: AnildevaraImg,
  },
  {
    name: "Dr. Arul Arokia Sensan Babu",
    slug: "dr-arul-arokia",
    qualification: "MBBS MD(Radiodiagnosis), DNB(Radiodiagnosis), FRCR, FNVIR",
    specialization: "Interventional Radiologist",
    city: "Chennai",
    image: ArulArokiaImg,
  },
   {
    name: "Dr. Bhaskar M V",
    slug: "dr-bhaskar-m-v",
    qualification: "MBBS, MD Radio Diagnosis, DNB Radio Diagnosis, DM Neuroimaging and Interventional Radiology, FRCR",
    specialization: "Interventional Radiologist, Neuroradiologist, Radiologist",
    city: "Bangalore",
    image: BhaskarMVImg,
  },
];
