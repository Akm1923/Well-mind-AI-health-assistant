import React, { useState } from 'react';
import { Doctor } from '../types';
import { Search, MapPin, Star, Stethoscope } from 'lucide-react';

// Export data so ChatInterface can use it
export const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    qualification: "MBBS, MD (Cardiology)",
    hospital: "Apollo Hospitals, Delhi",
    experience: 12,
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    fee: 1500,
    availability: "Mon-Fri, 10:00 AM - 2:00 PM",
    about: "Dr. Priya Sharma is a senior cardiologist with over a decade of experience in treating complex heart conditions. She specializes in interventional cardiology and preventive heart care.",
    languages: ["English", "Hindi", "Punjabi"],
    location: "New Delhi, India"
  },
  {
    id: 2,
    name: "Dr. Rajesh Verma",
    specialty: "Neurologist",
    qualification: "MBBS, DM (Neurology)",
    hospital: "Fortis Escorts, Jaipur",
    experience: 18,
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
    fee: 2000,
    availability: "Tue-Sat, 11:00 AM - 4:00 PM",
    about: "Dr. Verma is a renowned neurologist known for his expertise in stroke management and epilepsy. He has published multiple research papers in international journals.",
    languages: ["English", "Hindi", "Rajasthani"],
    location: "Jaipur, Rajasthan"
  },
  {
    id: 3,
    name: "Dr. Amit Patel",
    specialty: "Orthopedic",
    qualification: "MS (Orthopedics)",
    hospital: "Lilavati Hospital, Mumbai",
    experience: 15,
    rating: 4.7,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
    fee: 1200,
    availability: "Mon-Sat, 9:00 AM - 1:00 PM",
    about: "Specializing in joint replacement and sports injuries, Dr. Patel helps patients regain mobility with advanced surgical and non-surgical techniques.",
    languages: ["English", "Hindi", "Gujarati", "Marathi"],
    location: "Mumbai, Maharashtra"
  },
  {
    id: 4,
    name: "Dr. Anjali Gupta",
    specialty: "Pediatrician",
    qualification: "MBBS, MD (Pediatrics)",
    hospital: "Max Healthcare, Noida",
    experience: 10,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
    fee: 1000,
    availability: "Mon-Fri, 4:00 PM - 8:00 PM",
    about: "Dr. Anjali loves working with children and specializes in neonatal care, child development, and adolescent health issues.",
    languages: ["English", "Hindi"],
    location: "Noida, UP"
  },
  {
    id: 5,
    name: "Dr. Vikram Singh",
    specialty: "General Physician",
    qualification: "MBBS, MD (Internal Medicine)",
    hospital: "AIIMS, Delhi",
    experience: 22,
    rating: 4.6,
    reviews: 340,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
    fee: 800,
    availability: "Mon-Sat, 9:00 AM - 12:00 PM",
    about: "A veteran physician with extensive experience in diagnosing and treating a wide range of acute and chronic illnesses.",
    languages: ["English", "Hindi"],
    location: "New Delhi, India"
  },
  {
    id: 6,
    name: "Dr. Meera Reddy",
    specialty: "Dermatologist",
    qualification: "MBBS, DVD",
    hospital: "Skin & Hair Clinic, Bangalore",
    experience: 8,
    rating: 4.8,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=300&h=300",
    fee: 1200,
    availability: "Wed-Sun, 10:00 AM - 6:00 PM",
    about: "Dr. Reddy is an expert in clinical and aesthetic dermatology. She provides personalized treatments for acne, aging, and hair loss.",
    languages: ["English", "Hindi", "Telugu", "Kannada"],
    location: "Bangalore, Karnataka"
  },
  {
    id: 7,
    name: "Dr. Sanjay Kumar",
    specialty: "Oncologist",
    qualification: "MBBS, DM (Oncology)",
    hospital: "Tata Memorial, Mumbai",
    experience: 25,
    rating: 4.9,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1582750433449-d22b1c74caf6?auto=format&fit=crop&q=80&w=300&h=300",
    fee: 2500,
    availability: "Thu-Sat, 10:00 AM - 2:00 PM",
    about: "One of the leading oncologists in the country, Dr. Kumar is dedicated to providing compassionate and cutting-edge cancer care.",
    languages: ["English", "Hindi", "Marathi"],
    location: "Mumbai, Maharashtra"
  },
  {
    id: 8,
    name: "Dr. Neha Verma",
    specialty: "Gynecologist",
    qualification: "MBBS, MS (OBG)",
    hospital: "Cloudnine Hospital, Pune",
    experience: 14,
    rating: 4.8,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1651008325506-71d34d847bc3?auto=format&fit=crop&q=80&w=300&h=300",
    fee: 1500,
    availability: "Mon-Fri, 10:00 AM - 5:00 PM",
    about: "Dr. Neha specializes in high-risk pregnancy, laparoscopic surgery, and women's wellness at all stages of life.",
    languages: ["English", "Hindi", "Marathi"],
    location: "Pune, Maharashtra"
  },
  {
    id: 9,
    name: "Dr. Arjun Nair",
    specialty: "Psychiatrist",
    qualification: "MBBS, MD (Psychiatry)",
    hospital: "Mind Care Clinic, Kochi",
    experience: 11,
    rating: 4.7,
    reviews: 88,
    image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=300&h=300",
    fee: 1800,
    availability: "Mon-Sat, 2:00 PM - 8:00 PM",
    about: "Dr. Nair adopts a holistic approach to mental health, combining therapy and medication to help patients lead fulfilling lives.",
    languages: ["English", "Malayalam"],
    location: "Kochi, Kerala"
  },
  {
    id: 10,
    name: "Dr. Kavita Iyer",
    specialty: "ENT Specialist",
    qualification: "MBBS, MS (ENT)",
    hospital: "Madras ENT Research, Chennai",
    experience: 16,
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1594824476961-b7aa8a179ab6?auto=format&fit=crop&q=80&w=300&h=300",
    fee: 1000,
    availability: "Mon-Sat, 9:00 AM - 1:00 PM",
    about: "Dr. Iyer is an expert in microscopic ear surgery and endoscopic sinus surgery, ensuring minimal discomfort and quick recovery.",
    languages: ["English", "Tamil"],
    location: "Chennai, Tamil Nadu"
  },
  // --- ADDED 20 MORE DOCTORS ---
  { id: 11, name: "Dr. Suresh Menon", specialty: "Cardiologist", qualification: "MBBS, MD", hospital: "KIMS, Trivandrum", experience: 20, rating: 4.7, reviews: 210, image: "https://randomuser.me/api/portraits/men/11.jpg", fee: 1600, availability: "Mon-Fri, 9 AM - 1 PM", location: "Trivandrum, Kerala" },
  { id: 12, name: "Dr. Aarav Malhotra", specialty: "Dermatologist", qualification: "MBBS, MD", hospital: "Skin Alive, Delhi", experience: 9, rating: 4.5, reviews: 78, image: "https://randomuser.me/api/portraits/men/12.jpg", fee: 1100, availability: "Tue-Sun, 11 AM - 7 PM", location: "New Delhi, Delhi" },
  { id: 13, name: "Dr. Ishaan Chatterjee", specialty: "General Physician", qualification: "MBBS", hospital: "AMRI, Kolkata", experience: 14, rating: 4.4, reviews: 132, image: "https://randomuser.me/api/portraits/men/13.jpg", fee: 700, availability: "Mon-Sat, 8 AM - 2 PM", location: "Kolkata, WB" },
  { id: 14, name: "Dr. Zara Khan", specialty: "Pediatrician", qualification: "MBBS, DCH", hospital: "Rainbow Children, Hyderabad", experience: 7, rating: 4.9, reviews: 65, image: "https://randomuser.me/api/portraits/women/14.jpg", fee: 900, availability: "Mon-Fri, 3 PM - 8 PM", location: "Hyderabad, Telangana" },
  { id: 15, name: "Dr. Rohan Das", specialty: "Orthopedic", qualification: "MS (Ortho)", hospital: "Sparsh Hospital, Bangalore", experience: 13, rating: 4.6, reviews: 150, image: "https://randomuser.me/api/portraits/men/15.jpg", fee: 1300, availability: "Mon-Sat, 10 AM - 4 PM", location: "Bangalore, Karnataka" },
  { id: 16, name: "Dr. Sneha Patil", specialty: "Gynecologist", qualification: "MD (OBG)", hospital: "Motherhood, Mumbai", experience: 11, rating: 4.8, reviews: 190, image: "https://randomuser.me/api/portraits/women/16.jpg", fee: 1400, availability: "Tue-Sat, 9 AM - 3 PM", location: "Mumbai, Maharashtra" },
  { id: 17, name: "Dr. Abhinav Joshi", specialty: "Neurologist", qualification: "DM (Neuro)", hospital: "Medanta, Gurgaon", experience: 19, rating: 4.9, reviews: 220, image: "https://randomuser.me/api/portraits/men/17.jpg", fee: 2200, availability: "Wed-Sat, 10 AM - 2 PM", location: "Gurgaon, Haryana" },
  { id: 18, name: "Dr. Fatima Sheikh", specialty: "Oncologist", qualification: "MD, DM", hospital: "Apollo Cancer, Chennai", experience: 15, rating: 4.7, reviews: 105, image: "https://randomuser.me/api/portraits/women/18.jpg", fee: 2000, availability: "Mon-Thu, 9 AM - 1 PM", location: "Chennai, Tamil Nadu" },
  { id: 19, name: "Dr. Vihaan Reddy", specialty: "Psychiatrist", qualification: "MD (Psych)", hospital: "Asha Hospital, Hyderabad", experience: 10, rating: 4.5, reviews: 60, image: "https://randomuser.me/api/portraits/men/19.jpg", fee: 1500, availability: "Mon-Fri, 4 PM - 9 PM", location: "Hyderabad, Telangana" },
  { id: 20, name: "Dr. Riya Kapoor", specialty: "ENT Specialist", qualification: "MS (ENT)", hospital: "Sir Ganga Ram, Delhi", experience: 12, rating: 4.6, reviews: 98, image: "https://randomuser.me/api/portraits/women/20.jpg", fee: 1100, availability: "Mon-Sat, 10 AM - 2 PM", location: "New Delhi, Delhi" },
  { id: 21, name: "Dr. Kabir Bedi", specialty: "Cardiologist", qualification: "MBBS, DNB", hospital: "Max, Mohali", experience: 14, rating: 4.6, reviews: 140, image: "https://randomuser.me/api/portraits/men/21.jpg", fee: 1400, availability: "Mon-Fri, 9 AM - 5 PM", location: "Mohali, Punjab" },
  { id: 22, name: "Dr. Ananya Desai", specialty: "Dermatologist", qualification: "MD", hospital: "Desai Skin Clinic, Surat", experience: 16, rating: 4.8, reviews: 300, image: "https://randomuser.me/api/portraits/women/22.jpg", fee: 900, availability: "Mon-Sat, 10 AM - 6 PM", location: "Surat, Gujarat" },
  { id: 23, name: "Dr. Dev Narayanan", specialty: "General Physician", qualification: "MD", hospital: "Aster Medcity, Kochi", experience: 25, rating: 4.8, reviews: 410, image: "https://randomuser.me/api/portraits/men/23.jpg", fee: 600, availability: "Mon-Sat, 8 AM - 12 PM", location: "Kochi, Kerala" },
  { id: 24, name: "Dr. Maya Singh", specialty: "Pediatrician", qualification: "MD", hospital: "Surya Hospital, Jaipur", experience: 8, rating: 4.7, reviews: 85, image: "https://randomuser.me/api/portraits/women/24.jpg", fee: 800, availability: "Mon-Sat, 4 PM - 8 PM", location: "Jaipur, Rajasthan" },
  { id: 25, name: "Dr. Kunal Shah", specialty: "Orthopedic", qualification: "MS", hospital: "Shelby, Ahmedabad", experience: 17, rating: 4.6, reviews: 205, image: "https://randomuser.me/api/portraits/men/25.jpg", fee: 1200, availability: "Tue-Sat, 9 AM - 1 PM", location: "Ahmedabad, Gujarat" },
  { id: 26, name: "Dr. Tanvi Rao", specialty: "Gynecologist", qualification: "DGO", hospital: "Fernandez Hospital, Hyderabad", experience: 9, rating: 4.5, reviews: 120, image: "https://randomuser.me/api/portraits/women/26.jpg", fee: 1000, availability: "Mon-Fri, 10 AM - 4 PM", location: "Hyderabad, Telangana" },
  { id: 27, name: "Dr. Aryan Gill", specialty: "Neurologist", qualification: "DM", hospital: "CMC, Ludhiana", experience: 13, rating: 4.7, reviews: 110, image: "https://randomuser.me/api/portraits/men/27.jpg", fee: 1800, availability: "Mon-Fri, 9 AM - 2 PM", location: "Ludhiana, Punjab" },
  { id: 28, name: "Dr. Nida Fazli", specialty: "Oncologist", qualification: "MD", hospital: "Rajiv Gandhi Cancer Inst, Delhi", experience: 18, rating: 4.9, reviews: 160, image: "https://randomuser.me/api/portraits/women/28.jpg", fee: 2100, availability: "Mon-Thu, 10 AM - 3 PM", location: "New Delhi, Delhi" },
  { id: 29, name: "Dr. Sameer Rizvi", specialty: "Psychiatrist", qualification: "MD", hospital: "Vimhans, Delhi", experience: 22, rating: 4.8, reviews: 190, image: "https://randomuser.me/api/portraits/men/29.jpg", fee: 2500, availability: "Mon-Sat, 11 AM - 6 PM", location: "New Delhi, Delhi" },
  { id: 30, name: "Dr. Leela Thomas", specialty: "ENT Specialist", qualification: "MS", hospital: "Lisie Hospital, Kochi", experience: 20, rating: 4.7, reviews: 250, image: "https://randomuser.me/api/portraits/women/30.jpg", fee: 900, availability: "Mon-Sat, 9 AM - 1 PM", location: "Kochi, Kerala" }
];

interface DoctorDirectoryProps {
  onSelectDoctor: (doctor: Doctor) => void;
}

const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({ onSelectDoctor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Find Specialists</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Book appointments with top doctors across India</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search doctors, specialties, clinics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 transition-colors"
          />
        </div>
        <div className="overflow-x-auto pb-2 md:pb-0">
          <div className="flex gap-2">
            {specialties.map(specialty => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedSpecialty === specialty
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-teal-500/40 transition-all hover:shadow-xl hover:shadow-teal-900/5 dark:hover:shadow-teal-900/10">
            <div className="flex gap-4 cursor-pointer" onClick={() => onSelectDoctor(doctor)}>
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-20 h-20 rounded-lg object-cover border-2 border-slate-200 dark:border-slate-600 group-hover:border-teal-500/50 transition-colors bg-slate-100 dark:bg-slate-700"
              />
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{doctor.name}</h3>
                <p className="text-teal-600 dark:text-teal-500 text-sm font-medium flex items-center gap-1">
                    <Stethoscope size={12} /> {doctor.specialty}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{doctor.qualification}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2" onClick={() => onSelectDoctor(doctor)}>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <MapPin size={14} className="text-slate-400 dark:text-slate-500" />
                <span className="truncate">{doctor.hospital}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                    <Star size={14} fill="currentColor" />
                    <span className="font-bold">{doctor.rating}</span>
                    <span className="text-slate-500 dark:text-slate-500 font-normal">({doctor.reviews} reviews)</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                    {doctor.experience}+ Yrs Exp.
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500">Consultation Fee</p>
                    <p className="text-slate-900 dark:text-white font-bold flex items-center">
                        ₹{doctor.fee}
                    </p>
                </div>
                <button 
                    onClick={() => onSelectDoctor(doctor)}
                    className="bg-teal-600 hover:bg-teal-700 dark:hover:bg-teal-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-teal-600/10"
                >
                    View Profile
                </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                <Search size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No doctors found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default DoctorDirectory;
