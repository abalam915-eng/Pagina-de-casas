'use client';

import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { Property } from "@/lib/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ScheduleVisitPage() {
  const t = useTranslations('PropertyDetails');
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'Active')
        .single();

      if (error || !data) {
        notFound();
      }
      setProperty(data);
      setLoading(false);
    };

    fetchProperty();
  }, [slug]);

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) return;

    // Here you would save to database
    alert('Visit scheduled successfully!');
    router.push('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEF6F6] text-[#19322F] font-display antialiased">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006655]"></div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const times = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  return (
    <div className="min-h-screen bg-[#EEF6F6] text-[#19322F] font-display antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 group text-[#19322F]/60 hover:text-[#006655] transition-colors"
          >
            <span className="material-icons text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="font-medium">Back to property details</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl shadow-[#006655]/5 overflow-hidden flex flex-col lg:flex-row border border-slate-100">
          {/* Property Info */}
          <div className="w-full lg:w-5/12 bg-slate-50 p-6 lg:p-8 flex flex-col gap-6">
            <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md aspect-[4/3]">
              <Image
                alt="Modern minimalist villa exterior with pool"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfvG-i1KZzedVz-g45_cSnQZTN6AAynCK2CgpZ3l5DcgzTHztgy6JLYA8YAYH5ZN3R0dygJ4-pGit5nKdcd6pZYP9v8XYWGUzAcMG8L8JmSOBneI6yT6R_rTsn1My_Xw71nG09GQDtWVnXu9yOTUJHc1DMTrami3fIfCePjCoPKWtid6DzYrZ7_iu2z_GGW4QHCRZoAVqmAQ7CA2DUkCLlf-3DgQR4jB-saRAv17qKViJ3UpaDAw3g-5YDJdWErV2Ykp4HRl94_-A"
                fill
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-[#006655]">
                For Sale
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-[#19322F] leading-tight">Modern Villa in Beverly Hills</h2>
                <p className="text-slate-500 mt-1 flex items-center gap-1 text-sm">
                  <span className="material-icons text-base">location_on</span>
                  1284 Sunset Blvd, Beverly Hills, CA
                </p>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-slate-200">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Price</span>
                  <span className="text-xl font-bold text-[#006655]">$4,500,000</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-slate-400">bed</span>
                    <span className="text-xs font-medium">4 Beds</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-slate-400">shower</span>
                    <span className="text-xs font-medium">3 Baths</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-slate-400">square_foot</span>
                    <span className="text-xs font-medium">3,200 sqft</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Image
                  alt="Professional woman portrait smiling"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjW8nnOPHp1gOZTOS7qhMHvipD0b7viW3jmd_eAxFO7faa8rI-l2bjqTkw5xsGNAAnbxLfoLrJwf86iz_rvrcWZ1PFCBbsJs6F9fVADumsgd1pH2AorRGRV9YWFsvenDLX89W1nX6Lmk8xN6BS-BGAypyNgxlEtcnDxTSovjH9JsrUcwKHPTLVfJpIjQE_c2pIKScAf2WlFi5sf861r5TKZaownHpiub2sbluHlfsR2sZFQCxs5Lgy6J78tn3e1OQ_hBGy1V0_ueE"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="text-sm text-slate-500 font-medium">Hosted by</p>
                  <p className="text-[#19322F] font-semibold">Sarah Jenkins</p>
                </div>
                <button className="ml-auto p-2 text-[#006655] hover:bg-[#006655]/10 rounded-full transition-colors" title="Contact Agent">
                  <span className="material-icons">chat_bubble_outline</span>
                </button>
              </div>
            </div>
          </div>

          {/* Schedule Form */}
          <div className="w-full lg:w-7/12 p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#19322F] mb-2">{t('schedule_visit')}</h1>
              <p className="text-slate-500 mb-8">Choose a date and time to tour the property in person.</p>

              {/* Date Selection */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[#19322F] uppercase tracking-wider mb-4">Select Date</h3>
                <div className="grid grid-cols-7 gap-2">
                  {dates.map((date, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                      className={`p-3 text-sm rounded-lg transition-all ${
                        selectedDate === date.toISOString().split('T')[0]
                          ? 'bg-[#006655] text-white shadow-lg'
                          : 'bg-white border border-slate-200 hover:border-[#006655] hover:text-[#006655]'
                      }`}
                    >
                      <div className="text-xs font-medium">{date.toLocaleDateString('en', { weekday: 'short' })}</div>
                      <div className="text-lg font-bold">{date.getDate()}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[#19322F] uppercase tracking-wider mb-4">Available Times</h3>
                <div className="grid grid-cols-4 gap-3">
                  {times.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg text-sm border transition-all ${
                        selectedTime === time
                          ? 'border-[#006655] text-[#006655] bg-[#006655]/5'
                          : 'border-slate-200 text-slate-500 hover:border-[#006655] hover:text-[#006655]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-[#19322F] uppercase tracking-wider mb-2">
                  Additional Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#006655] focus:border-[#006655] resize-none"
                  rows={4}
                  placeholder="Any specific questions or requests for the agent..."
                />
              </div>
            </div>

            {/* Confirm Button */}
            <div className="flex gap-4">
              <button
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 bg-[#006655] hover:bg-[#005544] disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-[#006655]/20 flex items-center justify-center gap-2"
              >
                <span className="material-icons">calendar_today</span>
                Confirm Visit
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}