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
import BhavyashreeImg from "@/assets/doctors/Bhavyashree.png";
import CharudattasambhajiImg from "@/assets/doctors/Charudattasambhaji.png";
import DeepashreeImg from "@/assets/doctors/Deepashree.png";
import JithusubhashbabuImg from "@/assets/doctors/Jithusubhashbabu.png";
import juniadImg from "@/assets/doctors/juniad.png";
import karthikeyanImg from "@/assets/doctors/karthikeyan.png";
import ManishKumaryadavImg from "@/assets/doctors/ManishKumaryadav.png";
import minalchaudhryImg from "@/assets/doctors/minalchaudhry.png";
import muthurajanImg from "@/assets/doctors/muthurajan.png";
import NishantSunkarineniImg from "@/assets/doctors/NishantSunkarineni.png";
import NikhilSunkarineniImg from "@/assets/doctors/NikhilSunkarineni.png";
import ParthaPratimSamuiImg from "@/assets/doctors/ParthaPratimSamui.png";
import praveenkesavImg from "@/assets/doctors/praveenkesav.png";
import PushparajansundarrajanImg from "@/assets/doctors/Pushparajansundarrajan.png";
import RajsoniImg from "@/assets/doctors/Rajsoni.png";
import RohitKsrinivasImg from "@/assets/doctors/RohitKsrinivas.png";
import RohitmadhukarImg from "@/assets/doctors/Rohitmadhukar.png";
import SKiranKumarImg from "@/assets/doctors/SKiranKumar.png";
import SahilBansalImg from "@/assets/doctors/SahilBansal.png";
import SaitejaImg from "@/assets/doctors/Saiteja.png";
import sankeshmehtaImg from "@/assets/doctors/sankeshmehta.png";
import SeetamKumarImg from "@/assets/doctors/SeetamKumar.png";
import sibashankardalaiImg from "@/assets/doctors/sibashankardalai.png";
import ThoufiqaliImg from "@/assets/doctors/Thoufiqali.png";
import VivekMavaniImg from "@/assets/doctors/VivekMavani.png";

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
    city: "Bengaluru",
    image: BhaskarMVImg,
  },
  {
    name: "Dr. Bhavyashree Tn",
    slug: "dr-bhavyashree-tn",
    qualification: "MBBS, MDDNB, FRCR, PDCC",
    specialization: "Interventional Radiologist",
    city: "Bengaluru",
    image: BhavyashreeImg,
  },
  {
    name: "Dr. Charudutt Jayant Sambhaji",
    slug: "dr-charudutt-jayant-sambhaji",
    qualification: "MBBS, MD",
    specialization: "Interventional Radiology",
    city: "Goa",
    image: CharudattasambhajiImg,
  },
  {
    name: "Dr. Deepashree",
    slug: "dr-depashree",
    qualification: "MBBS, MRCP, PGCHR, FRCR, CCT(UK), EBIR",
    specialization: "Interventional Radiology",
    city: "Chennai",
    image: DeepashreeImg,
  },
  {
    name: "Dr. Jithu subhash babu",
    slug: "dr-jithu-subhash-babu",
    qualification: "MBBS, MD (Radiodiagnosis), CCT(South Korea), Post Doctorial Fellowship",
    specialization: "Interventional Radiology",
    city: "Kozhikode",
    image: JithusubhashbabuImg,
  },
    {
    name: "Dr. Junaid Ahmed Jamadar",
    slug: "dr-Junaid-ahmed-jamadar",
    qualification: "MBBS, MD, DNB, FRCR(UK), EDiR",
    specialization: "Fetal Medicine and Interventional Radiologist",
    city: "Bengaluru",
    image: juniadImg,
  },
  {
    name: "Dr. Karthikeyan M A",
    slug: "dr-Karthikeyan-m-a",
    qualification: "MBBS.,MD.,DrNB(EVIR).,EBIR",
    specialization: "Interventional Radiologist",
    city: "Salem",
    image: karthikeyanImg,
  },
   {
    name: "Dr. Manish Kumar Yadav",
    slug: "dr-manish-kumar-yadav",
    qualification: "MBBS, DMRD, DNB, FNVIR, EBIR",
    specialization: "Neuro and vascular Interventional Radiologist",
    city: "Trivandrum",
    image: ManishKumaryadavImg,
  },
  {
    name: "Dr. Minal Chaudhry",
    slug: "dr-minal-chaudhry",
    qualification: "MBBS, DNB (RadioDiagnosis)",
    specialization: "Neuro and vascular Interventional Radiologist",
    city: "Dwarka",
    image: minalchaudhryImg,
  },
  {
    name: "Dr. P MUTHURAJAN",
    slug: "dr-p-muthurajan",
    qualification: "DMRD, DNB, FNVIR",
    specialization: "Neuro And Vascular Interventional Radiologist",
    city: "Coimbatore",
    image: muthurajanImg,
  },
  {
    name: "Dr. Nishant Sunkarineni",
    slug: "dr-nishant-sunkarineni",
    qualification: "MBBS, MD, DM",
    specialization: "Interventional Cardiology",
    city: "Hyderabad",
    image: NishantSunkarineniImg,
  },
  {
    name: "Dr. Nikhil Sunkarineni",
    slug: "dr-nikhil-sunkarineni",
    qualification: "MBBS, MD, DM (Neurology)",
    specialization: "Interventional Cardiology",
    city: "Hyderabad",
    image: NikhilSunkarineniImg,
  },
  {
    name: "Dr. Partha Pratim Samui",
    slug: "dr-partha-pratim-samui",
    qualification: "MBBS, MD",
    specialization: "Interventional Radiologist",
    city: "Kolkata",
    image: ParthaPratimSamuiImg,
  },
  {
    name: "Dr. Praveen Kesav",
    slug: "dr-praveen-kesav",
    qualification: "MBBS, MD",
    specialization: "Interventional Radiologist",
    city: "Trivandrum",
    image: praveenkesavImg,
  },
  {
    name: "Dr. Pushparajan Sundarrajan",
    slug: "dr-pushparajan-sundarrajan",
    qualification: "MBBS, DMRD, DNB",
    specialization: "Interventional Radiologist",
    city: "Chennai",
    image: PushparajansundarrajanImg,
  },
  {
    name: "Dr. Raj Soni",
    slug: "dr-raj-soni",
    qualification: "MBBS, MD, DMIR",
    specialization: "Interventional Radiologist",
    city: "Ahmedabad",
    image: RajsoniImg,
  },
  {
    name: "Dr. Rohit K Srinivas",
    slug: "dr-rohit-k-srinivas",
    qualification: "MBBS, MD PGIMER",
    specialization: "Interventional Radiologist",
    city: "Bengaluru",
    image: RohitKsrinivasImg,
  },
  {
    name: "Dr. Rohit Madhurkar",
    slug: "dr-rohit-madhurkar",
    qualification: "MBBS, MD (Radio Diagnosis/Radiology), FIR-PDCC, SITAT (S. Korea)",
    specialization: "Interventional Radiologist",
    city: "Bengaluru",
    image: RohitmadhukarImg,
  },
  {
    name: "Dr. S Kiran Kumar",
    slug: "dr-s-kiran-kumar",
    qualification: "MBBS, DNB (RD), FVIR, EBIR",
    specialization: "Interventional Radiologist",
    city: "Chennai",
    image: SKiranKumarImg,
  },
  {
    name: "Dr. Sahil Bansal",
    slug: "dr-sahil-bansal",
    qualification: "MBBS, MD (Radiodiagnosis), FVIR, FRCR 2A",
    specialization: "Interventional Radiologist",
    city: "Dwarka",
    image: SahilBansalImg,
  },
  {
    name: "Dr. Saiteja Namala",
    slug: "dr-saiteja-namala",
    qualification: "MBBS, MD (Radiodiagnosis), EDIR, FVIR, EBIR (Vienna), PDCC (Interventional Radiology)",
    specialization: "Interventional Radiologist",
    city: "Hyderabad",
    image: SaitejaImg,
  },
  {
    name: "Dr. Sankesh Mehta",
    slug: "dr-sankesh-mehta",
    qualification: "MBBS, MD (Radiodiagnosis), FENVIR",
    specialization: "Interventional Radiologist",
    city: "Chennai",
    image: sankeshmehtaImg,
  },
  {
    name: "Dr. T Seetam Kumar",
    slug: "dr-t-seetam-kumar",
    qualification: "MBBS | MD | DNB | FRCR | DM-NIIR (NIMHANS)",
    specialization: "Interventional Radiologist",
    city: "Bhubaneswar",
    image: SeetamKumarImg,
  },
  {
    name: "Dr. Siba Sankar Dalai",
    slug: "dr-siba-sankar-dalai",
    qualification: "MD, FACP, FINR",
    specialization: "Interventional Radiologist",
    city: "Vizag",
    image: sibashankardalaiImg,
  },
  {
    name: "Dr. Thoufiq Ali M",
    slug: "dr-thoufiq-ali-m",
    qualification: "MBBS, MD (Radiodiagnosis), PDCC (Interventional Radiology)",
    specialization: "Interventional Radiologist",
    city: "Perinthalmanna",
    image: ThoufiqaliImg,
  },
  {
    name: "Dr. Vivek Mavani",
    slug: "dr-vivek-mavani",
    qualification: "MBBS, DNB, FVIR",
    specialization: "Interventional Radiologist",
    city: "Surat",
    image: VivekMavaniImg,
  },
];
