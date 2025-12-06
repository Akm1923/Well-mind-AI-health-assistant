
import React, { useState } from 'react';
import { Doctor } from '../types';
import { MapPin, Star, Clock, Stethoscope, CalendarCheck, Award, GraduationCap, Info, MessageCircle, X } from 'lucide-react';

interface DoctorProfileModalProps {
  doctor: Doctor;
  onClose: () => void;
}

const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({ doctor, onClose }) => {
  const [profileTab, setProfileTab] = useState<'about' | 'reviews'>('about');

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative">
        {/* Modal Header with Cover Image effect */}
        <div className="relative h-32 bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-800 dark:to-slate-900 flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-10 backdrop-blur-sm">
            <X size={20} />
          </button>
          <div className="absolute -bottom-12 left-6 flex items-end">
            <img src={doctor.image} alt="doc" className="w-24 h-24 rounded-xl object-cover border-4 border-white dark:border-slate-900 shadow-xl bg-white" />
          </div>
        </div>

        <div className="pt-16 px-6 pb-6 flex-1 overflow-y-auto bg-white dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{doctor.name}</h2>
              <p className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-2">
                <Stethoscope size={16} /> {doctor.specialty}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{doctor.qualification} • {doctor.experience} Years Exp.</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{doctor.fee}</p>
              <p className="text-xs text-slate-500">Consultation Fee</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800 mb-6">
            <button
              onClick={() => setProfileTab('about')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${profileTab === 'about' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              About & Info
            </button>
            <button
              onClick={() => setProfileTab('reviews')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${profileTab === 'reviews' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              Reviews & Ratings
            </button>
          </div>

          {profileTab === 'about' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="space-y-3">
                <h4 className="text-slate-900 dark:text-white font-medium flex items-center gap-2"><Info size={16} className="text-teal-500" /> About Doctor</h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {doctor.about || `Dr. ${doctor.name} is a dedicated specialist with extensive experience in ${doctor.specialty}. Committed to providing the best patient care using the latest medical advancements.`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-3">At a Glance</h4>
                  <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-3">
                      <MapPin size={16} className="text-teal-500" />
                      <span>{doctor.hospital}, {doctor.location}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <GraduationCap size={16} className="text-teal-500" />
                      <span>{doctor.qualification}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Award size={16} className="text-teal-500" />
                      <span>{doctor.experience} Years Experience</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex flex-wrap gap-1">
                        {doctor.languages?.map(l => (
                          <span key={l} className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-0.5 rounded text-xs">{l}</span>
                        ))}
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-3">Availability</h4>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 p-3 rounded-lg mb-3">
                    <CalendarCheck size={18} />
                    <span className="font-medium text-sm">Available Today</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-slate-400 dark:text-slate-500" /> {doctor.availability}
                  </p>
                  <button
                    onClick={() => alert("Booking Confirmed!")}
                    className="w-full bg-teal-600 hover:bg-teal-700 dark:hover:bg-teal-500 text-white font-bold py-2 rounded-lg transition-colors shadow-md"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-center px-4 border-r border-slate-200 dark:border-slate-700">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white block">{doctor.rating}</span>
                  <div className="flex text-amber-400 my-1 justify-center">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                  <span className="text-xs text-slate-500">{doctor.reviews} Reviews</span>
                </div>
                <div className="flex-1">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-slate-400">{star}</span>
                        <Star size={8} className="text-slate-300 dark:text-slate-600" fill="currentColor" />
                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 5}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">Patient Name</span>
                      <span className="text-xs text-slate-500">2 days ago</span>
                    </div>
                    <div className="flex text-amber-400 mb-2">
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      "Excellent doctor! Very patient and explained the diagnosis clearly. The treatment is working well."
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal;
