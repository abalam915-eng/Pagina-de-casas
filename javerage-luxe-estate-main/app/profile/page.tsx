import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { Property } from "@/lib/types";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

async function getSavedProperties(userId: string) {
  const supabase = await createClient();
  // Assuming there's a favorites table or a field in properties
  // For now, return empty array, will implement later
  return [];
}

async function getScheduledVisits(userId: string) {
  // Placeholder
  return [];
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const profile = await getUserProfile(user.id);
  const savedProperties = await getSavedProperties(user.id);
  const scheduledVisits = await getScheduledVisits(user.id);

  const t = await getTranslations('Profile');

  return (
    <div className="min-h-screen bg-[#EEF6F6] text-[#19322F] font-display antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <header className="bg-[#D9ECC8] p-8 rounded-3xl shadow-sm border border-[#19322F]/5 mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Image
                  alt="Profile portrait of a young woman with a friendly smile"
                  className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd_ouiePtERQTSfbcLEHNMJhNFxSXP8beK-4DetlBD_G0XENGPBbXjEfk08cNoUsGBoIWZRMRRoQTdL6tgGLyjrYglYUnUw7ce2O3Y6cHRIWZBN2BXU6YPG0jHhit2hPdam7opmhwpFjsGY68pDpCqMVQ6yj3wPulKs2X3PG2UcHOfoCZgt12BZpZ_XHj9-xT3VJHunaR-f6j8HYVS8FrTtKh_io3Iu2E7JIucJmHGGc4J0AF5MISFaObH51sFDruLCdwyyBAC3Cs"
                  width={128}
                  height={128}
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 lg:w-10 lg:h-10 bg-[#006655] text-white rounded-full flex items-center justify-center hover:bg-[#19322F] transition-colors shadow-md">
                  <span className="material-icons text-sm lg:text-base">edit</span>
                </button>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#19322F] mb-2">
                  {profile?.full_name || user.email}
                </h1>
                <p className="text-[#19322F]/70 font-light flex items-center gap-2">
                  <span className="material-icons text-sm">location_on</span>
                  {profile?.location || "Location not set"}
                  <span className="mx-2">•</span>
                  Member since {new Date(user.created_at).getFullYear()}
                </p>
              </div>
            </div>
            <div className="flex gap-6 lg:gap-12 bg-white px-8 py-4 rounded-xl shadow-sm border border-[#19322F]/5">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#19322F]">{savedProperties.length}</div>
                <div className="text-xs uppercase tracking-wider text-[#19322F]/50 font-medium">Saved</div>
              </div>
              <div className="w-px bg-[#19322F]/10"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#006655]">{scheduledVisits.length}</div>
                <div className="text-xs uppercase tracking-wider text-[#19322F]/50 font-medium">Visits</div>
              </div>
              <div className="w-px bg-[#19322F]/10"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#19322F]">0</div>
                <div className="text-xs uppercase tracking-wider text-[#19322F]/50 font-medium">Sold</div>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-[#19322F]/10 mb-10 overflow-x-auto">
          <button className="pb-4 px-2 text-[#19322F] font-semibold border-b-2 border-[#006655] transition-colors whitespace-nowrap">
            {t('saved_properties')}
          </button>
          <button className="pb-4 px-2 text-[#19322F]/50 hover:text-[#19322F] font-medium border-b-2 border-transparent hover:border-[#19322F]/20 transition-colors whitespace-nowrap">
            {t('scheduled_visits')}
          </button>
          <button className="pb-4 px-2 text-[#19322F]/50 hover:text-[#19322F] font-medium border-b-2 border-transparent hover:border-[#19322F]/20 transition-colors whitespace-nowrap">
            {t('preferences_settings')}
          </button>
        </div>

        {/* Saved Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedProperties.length > 0 ? (
            savedProperties.map((property: Property) => (
              <div key={property.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#19322F]/5">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={property.images[0]}
                    fill
                  />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#006655] shadow-sm hover:bg-white transition-colors">
                    <span className="material-icons">favorite</span>
                  </button>
                  <div className="absolute bottom-4 left-4 bg-[#19322F]/90 backdrop-blur-sm text-white px-3 py-1 rounded text-sm font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(property.price)}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#19322F] mb-1">{property.title}</h3>
                      <p className="text-[#19322F]/60 text-sm">{property.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[#19322F]/70 text-sm border-t border-[#19322F]/10 pt-4">
                    <div className="flex items-center gap-1.5">
                      <span className="material-icons text-base">bed</span> {property.beds} Beds
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-icons text-base">bathtub</span> {property.baths} Baths
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-icons text-base">square_foot</span> {property.area} sqm
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              {/* Placeholder properties from reference */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#19322F]/5">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      alt="Modern minimalist house exterior with large glass windows and pool"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY5c3oO38DokKCiZGOahYlceVCLTCEuUx4Bd1yPQcJPdx53wvBLx46euxTiwkVIkMqxnDOPflllhhs3ed7UiZy52kwVUTpuXxgdiclfK9Tkqlaqu98vnxcdNwLre6lkqywgPyMOGLnkuvlxbOslzOHa9LCVl43Pow0t65Zo7ISXp7abzdL8WNHVb4YcQojRyANBH_cgg4nxrp-OO14-sUi6Zv57WggKS8Wov9sfZZjqpGwLibOW363ruRNGm28k5JuNa6jPu2iLsU"
                      fill
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#006655] shadow-sm hover:bg-white transition-colors">
                      <span className="material-icons">favorite</span>
                    </button>
                    <div className="absolute bottom-4 left-4 bg-[#19322F]/90 backdrop-blur-sm text-white px-3 py-1 rounded text-sm font-medium">
                      $2,450,000
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#19322F] mb-1">The Glass Pavilion</h3>
                        <p className="text-[#19322F]/60 text-sm">Montecito, California</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[#19322F]/70 text-sm border-t border-[#19322F]/10 pt-4">
                      <div className="flex items-center gap-1.5">
                        <span className="material-icons text-base">bed</span> 4 Beds
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-icons text-base">bathtub</span> 3.5 Baths
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-icons text-base">square_foot</span> 3,200 sqft
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#19322F]/5">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      alt="Luxury bright living room with mid-century modern furniture"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWM5ok9o0Mm6XSR8UNo8-uSRfHLg_8kZb_U_2Hn_c8nJwgpTjSs57FUw2rZ8CPr6YCjmgAB9c_A3ir6KmagO7uhin57rUO1LnBTo8WnE8dmr1lL4mjJCk7l-gfZanXQ6fmlFcy-xvfnamkSdnsOw9jmV56tf7UxPzd374M6EnLOMh0E-0mr34lk0lB7u25P5cXqCcA4_K7pypFr-9EdQdr3NvwLIZlANWHrSDONl6vx8zHPe5HziP269xAtPPbUbRuePLd_bbIX18"
                      fill
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#006655] shadow-sm hover:bg-white transition-colors">
                      <span className="material-icons">favorite</span>
                    </button>
                    <div className="absolute bottom-4 left-4 bg-[#19322F]/90 backdrop-blur-sm text-white px-3 py-1 rounded text-sm font-medium">
                      $1,895,000
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#19322F] mb-1">Modern Loft</h3>
                        <p className="text-[#19322F]/60 text-sm">SoHo, New York</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[#19322F]/70 text-sm border-t border-[#19322F]/10 pt-4">
                      <div className="flex items-center gap-1.5">
                        <span className="material-icons text-base">bed</span> 2 Beds
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-icons text-base">bathtub</span> 2 Baths
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-icons text-base">square_foot</span> 1,850 sqft
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#19322F]/5">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      alt="Contemporary dark grey house facade surrounded by greenery"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv4b1Zc2wOTyM6fvVjsphfw0-uEDRN7o42ckLRR-fHYPwxM74HEHwQF2N3KB661cBYBx2AP4ZgROqms4o-QZOhFbNSSb3PAGpLG5jg3v1V8TMmiHUbG07yDRkHAm9L2mOzl4EQYyRntpdLn9j-jRyS0uQ8FIYIq3QlCN7348LexMmmyPrJ70RxH5X4EsN8Ij7ZVcXKEWftSUBKAfHLZK1-XxSV4pczQxzOv6670_gWowJL74RL0wwW1W7s_bxeU4KAh7dq6BfVSQ8"
                      fill
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#006655] shadow-sm hover:bg-white transition-colors">
                      <span className="material-icons">favorite</span>
                    </button>
                    <div className="absolute bottom-4 left-4 bg-[#19322F]/90 backdrop-blur-sm text-white px-3 py-1 rounded text-sm font-medium">
                      $3,100,000
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#19322F] mb-1">Contemporary Villa</h3>
                        <p className="text-[#19322F]/60 text-sm">Aspen, Colorado</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[#19322F]/70 text-sm border-t border-[#19322F]/10 pt-4">
                      <div className="flex items-center gap-1.5">
                        <span className="material-icons text-base">bed</span> 5 Beds
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-icons text-base">bathtub</span> 4 Baths
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-icons text-base">square_foot</span> 4,500 sqft
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}