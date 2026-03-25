// Dummy data for TrailMate Nepal

export type UserRole = "tourist" | "guide";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface Guide extends User {
  role: "guide";
  bio: string;
  experience: number;
  specialties: string[];
  certifications: string[];
  languages: string[];
  rating: number;
  totalReviews: number;
  totalTrips: number;
  location: string;
  verified: boolean;
}

export interface Tourist extends User {
  role: "tourist";
  wishlist: string[];
}

export interface Listing {
  id: string;
  guideId: string;
  title: string;
  category: "trekking" | "climbing" | "cultural" | "safari" | "spiritual" | "hiking";
  region: string;
  difficulty: "easy" | "moderate" | "challenging" | "extreme";
  duration: number;
  maxGroupSize: number;
  description: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  meetingPoint: string;
  pricePerPerson: number;
  groupDiscountPercent: number;
  images: string[];
  rating: number;
  totalReviews: number;
  featured: boolean;
  createdAt: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  elevation?: string;
  distance?: string;
  accommodation?: string;
}

export interface Booking {
  id: string;
  listingId: string;
  touristId: string;
  guideId: string;
  date: string;
  groupSize: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "declined" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid";
  createdAt: string;
  notes?: string;
}

export interface Review {
  id: string;
  listingId: string;
  touristId: string;
  touristName: string;
  touristAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// NPR to USD conversion rate (approximate)
export const NPR_TO_USD = 0.0075;

export function formatNPR(amount: number): string {
  return `NPR ${amount.toLocaleString()}`;
}

export function formatUSD(amount: number): string {
  return `$${(amount * NPR_TO_USD).toFixed(2)}`;
}

// Dummy Guides
export const guides: Guide[] = [
  {
    id: "guide-1",
    email: "guide@trailmate.com",
    password: "password123",
    name: "Pasang Sherpa",
    role: "guide",
    avatar: "/avatars/pasang.jpg",
    phone: "+977 9841234567",
    bio: "Born and raised in the Khumbu region, I have been guiding treks to Everest Base Camp for over 15 years. My family has a rich mountaineering heritage, and I am passionate about sharing the beauty of the Himalayas with travelers from around the world.",
    experience: 15,
    specialties: ["High Altitude Trekking", "Mountaineering", "Photography Tours"],
    certifications: ["Nepal Mountaineering Association", "Wilderness First Responder", "Leave No Trace Trainer"],
    languages: ["English", "Nepali", "Tibetan", "Hindi"],
    rating: 4.9,
    totalReviews: 156,
    totalTrips: 342,
    location: "Namche Bazaar, Solukhumbu",
    verified: true,
    createdAt: "2020-01-15",
  },
  {
    id: "guide-2",
    email: "ramesh@trailmate.com",
    password: "password123",
    name: "Ramesh Gurung",
    role: "guide",
    avatar: "/avatars/ramesh.jpg",
    phone: "+977 9851234567",
    bio: "A native of Ghandruk village in the Annapurna region, I have intimate knowledge of the trails, culture, and wildlife of this beautiful area. I specialize in cultural immersion experiences and bird watching tours.",
    experience: 12,
    specialties: ["Cultural Tours", "Bird Watching", "Village Homestays"],
    certifications: ["Licensed Trekking Guide", "Bird Guide Certification"],
    languages: ["English", "Nepali", "Gurung", "German"],
    rating: 4.8,
    totalReviews: 98,
    totalTrips: 215,
    location: "Pokhara, Kaski",
    verified: true,
    createdAt: "2021-03-20",
  },
  {
    id: "guide-3",
    email: "maya@trailmate.com",
    password: "password123",
    name: "Maya Tamang",
    role: "guide",
    avatar: "/avatars/maya.jpg",
    phone: "+977 9861234567",
    bio: "As one of the few female trekking guides in Nepal, I am passionate about empowering women in adventure tourism. I lead treks throughout the Langtang and Helambu regions, focusing on sustainable tourism and cultural exchange.",
    experience: 8,
    specialties: ["Women-Only Treks", "Sustainable Tourism", "Cultural Exchange"],
    certifications: ["Licensed Trekking Guide", "Sustainable Tourism Certificate"],
    languages: ["English", "Nepali", "Tamang", "French"],
    rating: 4.9,
    totalReviews: 72,
    totalTrips: 145,
    location: "Kathmandu",
    verified: true,
    createdAt: "2022-01-10",
  },
  {
    id: "guide-4",
    email: "bikash@trailmate.com",
    password: "password123",
    name: "Bikash Rai",
    role: "guide",
    avatar: "/avatars/bikash.jpg",
    phone: "+977 9871234567",
    bio: "Wildlife enthusiast and jungle expert with extensive experience in Chitwan National Park. I have worked with conservation projects and love sharing the incredible biodiversity of Nepal's Terai region with visitors.",
    experience: 10,
    specialties: ["Wildlife Safari", "Jungle Treks", "Conservation Tours"],
    certifications: ["Wildlife Guide License", "Conservation Education Certificate"],
    languages: ["English", "Nepali", "Tharu", "Hindi"],
    rating: 4.7,
    totalReviews: 84,
    totalTrips: 198,
    location: "Sauraha, Chitwan",
    verified: true,
    createdAt: "2021-06-15",
  },
];

// Dummy Tourist
export const tourists: Tourist[] = [
  {
    id: "tourist-1",
    email: "tourist@trailmate.com",
    password: "password123",
    name: "Sarah Johnson",
    role: "tourist",
    avatar: "/avatars/sarah.jpg",
    phone: "+1 555-123-4567",
    wishlist: ["listing-1", "listing-3"],
    createdAt: "2024-01-01",
  },
];

// Dummy Listings
export const listings: Listing[] = [
  {
    id: "listing-1",
    guideId: "guide-1",
    title: "Everest Base Camp Trek",
    category: "trekking",
    region: "Everest Region",
    difficulty: "challenging",
    duration: 14,
    maxGroupSize: 12,
    description: "Experience the ultimate Himalayan adventure on this iconic trek to Everest Base Camp. Walk in the footsteps of legends through Sherpa villages, ancient monasteries, and breathtaking mountain vistas. This journey takes you through the heart of the Khumbu region to stand at the foot of the world's highest peak.",
    highlights: [
      "Stand at Everest Base Camp (5,364m)",
      "Sunrise views from Kala Patthar",
      "Visit Tengboche Monastery",
      "Experience Sherpa culture and hospitality",
      "Cross suspension bridges over deep gorges",
      "Acclimatization at Namche Bazaar",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Kathmandu", description: "Welcome to Nepal! Transfer to hotel and trip briefing.", elevation: "1,400m" },
      { day: 2, title: "Fly to Lukla, Trek to Phakding", description: "Scenic mountain flight and easy trek along the Dudh Koshi river.", elevation: "2,610m", distance: "8km" },
      { day: 3, title: "Trek to Namche Bazaar", description: "Climb through rhododendron forests with first Everest views.", elevation: "3,440m", distance: "11km" },
      { day: 4, title: "Acclimatization Day in Namche", description: "Hike to Everest View Hotel and explore the bustling Sherpa town.", elevation: "3,440m" },
      { day: 5, title: "Trek to Tengboche", description: "Visit the famous monastery with stunning Everest and Ama Dablam views.", elevation: "3,860m", distance: "10km" },
      { day: 6, title: "Trek to Dingboche", description: "Enter the high alpine zone with dramatic mountain scenery.", elevation: "4,410m", distance: "14km" },
      { day: 7, title: "Acclimatization Day in Dingboche", description: "Day hike to Nangkartshang Peak for panoramic views.", elevation: "4,410m" },
      { day: 8, title: "Trek to Lobuche", description: "Pass memorial chortens and enter the Khumbu glacier valley.", elevation: "4,940m", distance: "8km" },
      { day: 9, title: "Trek to Gorak Shep and Everest Base Camp", description: "Reach the legendary base camp and return to Gorak Shep.", elevation: "5,364m", distance: "13km" },
      { day: 10, title: "Kala Patthar Sunrise and Trek to Pheriche", description: "Pre-dawn hike for best Everest views, then descend.", elevation: "4,371m", distance: "15km" },
      { day: 11, title: "Trek to Namche Bazaar", description: "Retrace steps through familiar terrain.", elevation: "3,440m", distance: "20km" },
      { day: 12, title: "Trek to Lukla", description: "Final day on the trail with celebration dinner.", elevation: "2,860m", distance: "15km" },
      { day: 13, title: "Fly to Kathmandu", description: "Morning flight back to Kathmandu, free afternoon.", elevation: "1,400m" },
      { day: 14, title: "Departure", description: "Transfer to airport for your onward journey.", elevation: "1,400m" },
    ],
    included: [
      "Airport transfers in Kathmandu",
      "Domestic flights (Kathmandu-Lukla-Kathmandu)",
      "All accommodations during trek",
      "Three meals a day during trek",
      "Experienced licensed guide",
      "Porter service (1 porter for 2 trekkers)",
      "All necessary permits",
      "First aid kit and oximeter",
    ],
    excluded: [
      "International flights",
      "Nepal visa fees",
      "Travel insurance",
      "Personal expenses",
      "Tips for guide and porters",
      "Extra meals in Kathmandu",
      "Hot showers and wifi during trek",
    ],
    meetingPoint: "Tribhuvan International Airport, Kathmandu",
    pricePerPerson: 185000,
    groupDiscountPercent: 10,
    images: ["/listings/ebc-1.jpg", "/listings/ebc-2.jpg", "/listings/ebc-3.jpg"],
    rating: 4.9,
    totalReviews: 45,
    featured: true,
    createdAt: "2024-01-15",
  },
  {
    id: "listing-2",
    guideId: "guide-2",
    title: "Annapurna Circuit Trek",
    category: "trekking",
    region: "Annapurna Region",
    difficulty: "challenging",
    duration: 18,
    maxGroupSize: 10,
    description: "The classic Annapurna Circuit is one of the world's greatest treks, circling the entire Annapurna massif through diverse landscapes from subtropical forests to high alpine deserts. Cross the legendary Thorong La Pass and experience the unique Tibetan-influenced culture of Manang and Mustang.",
    highlights: [
      "Cross Thorong La Pass (5,416m)",
      "Visit sacred Muktinath Temple",
      "Experience diverse ecosystems and cultures",
      "Natural hot springs at Tatopani",
      "Stunning views of Annapurna range",
      "Authentic village homestays",
    ],
    itinerary: [
      { day: 1, title: "Drive to Besisahar", description: "Scenic drive from Kathmandu to the trek starting point.", elevation: "760m" },
      { day: 2, title: "Trek to Bahundanda", description: "Begin trekking through rice paddies and villages.", elevation: "1,310m", distance: "14km" },
      { day: 3, title: "Trek to Chamje", description: "Follow the Marsyangdi River through lush forests.", elevation: "1,410m", distance: "12km" },
      { day: 4, title: "Trek to Dharapani", description: "Enter the Manang district with changing landscape.", elevation: "1,960m", distance: "15km" },
      { day: 5, title: "Trek to Chame", description: "First views of Annapurna II and Lamjung Himal.", elevation: "2,710m", distance: "14km" },
      { day: 6, title: "Trek to Pisang", description: "Walk through apple orchards and pine forests.", elevation: "3,200m", distance: "15km" },
      { day: 7, title: "Trek to Manang", description: "Enter the rain shadow with Tibetan-style villages.", elevation: "3,540m", distance: "18km" },
      { day: 8, title: "Acclimatization in Manang", description: "Explore glacial lakes and monastery.", elevation: "3,540m" },
      { day: 9, title: "Trek to Yak Kharka", description: "Gradual ascent into high alpine terrain.", elevation: "4,110m", distance: "11km" },
      { day: 10, title: "Trek to Thorong Phedi", description: "Base camp for the pass crossing.", elevation: "4,450m", distance: "7km" },
      { day: 11, title: "Cross Thorong La to Muktinath", description: "Early start for the challenging pass crossing.", elevation: "5,416m / 3,800m", distance: "18km" },
      { day: 12, title: "Trek to Kagbeni", description: "Descend into the Mustang valley.", elevation: "2,800m", distance: "18km" },
      { day: 13, title: "Trek to Marpha", description: "Famous apple village with delicious apple pie.", elevation: "2,670m", distance: "15km" },
      { day: 14, title: "Trek to Kalopani", description: "Views of Dhaulagiri and Annapurna I.", elevation: "2,530m", distance: "15km" },
      { day: 15, title: "Trek to Tatopani", description: "Relax in natural hot springs.", elevation: "1,190m", distance: "20km" },
      { day: 16, title: "Trek to Ghorepani", description: "Climb to the famous viewpoint village.", elevation: "2,860m", distance: "13km" },
      { day: 17, title: "Sunrise at Poon Hill, Trek to Nayapul", description: "Best panoramic sunrise views, then descend.", elevation: "1,070m", distance: "18km" },
      { day: 18, title: "Drive to Pokhara", description: "Short drive to lakeside city for celebration.", elevation: "820m" },
    ],
    included: [
      "Transportation from Kathmandu",
      "All accommodations",
      "Three meals daily",
      "Licensed trekking guide",
      "Porter service",
      "All permits (ACAP, TIMS)",
      "First aid kit",
    ],
    excluded: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Personal expenses",
      "Tips",
      "Hot showers and charging",
    ],
    meetingPoint: "Tourist Bus Park, Kathmandu",
    pricePerPerson: 165000,
    groupDiscountPercent: 8,
    images: ["/listings/annapurna-1.jpg", "/listings/annapurna-2.jpg", "/listings/annapurna-3.jpg"],
    rating: 4.8,
    totalReviews: 38,
    featured: true,
    createdAt: "2024-02-01",
  },
  {
    id: "listing-3",
    guideId: "guide-2",
    title: "Poon Hill Trek",
    category: "hiking",
    region: "Annapurna Region",
    difficulty: "easy",
    duration: 5,
    maxGroupSize: 15,
    description: "Perfect for beginners and those short on time, the Poon Hill trek offers incredible mountain views without the challenges of high altitude. Watch the sunrise illuminate the Annapurna and Dhaulagiri ranges from the famous viewpoint.",
    highlights: [
      "Sunrise from Poon Hill viewpoint",
      "Views of Annapurna, Dhaulagiri, and Machhapuchhre",
      "Beautiful rhododendron forests",
      "Charming Gurung villages",
      "Hot springs at Jhinu Danda",
    ],
    itinerary: [
      { day: 1, title: "Drive to Nayapul, Trek to Tikhedhunga", description: "Begin trek through villages and farmland.", elevation: "1,540m", distance: "12km" },
      { day: 2, title: "Trek to Ghorepani", description: "Climb stone steps through beautiful forests.", elevation: "2,860m", distance: "10km" },
      { day: 3, title: "Sunrise at Poon Hill, Trek to Tadapani", description: "Early morning hike for stunning views.", elevation: "2,630m", distance: "12km" },
      { day: 4, title: "Trek to Jhinu Danda", description: "Descend through forests to hot springs.", elevation: "1,780m", distance: "10km" },
      { day: 5, title: "Trek to Nayapul, Drive to Pokhara", description: "Final trek section and transfer.", elevation: "1,070m", distance: "8km" },
    ],
    included: [
      "Transportation from Pokhara",
      "Accommodations in teahouses",
      "Three meals daily",
      "Licensed guide",
      "ACAP permit",
    ],
    excluded: [
      "Travel insurance",
      "Personal expenses",
      "Tips",
      "Hot springs entry fee",
    ],
    meetingPoint: "Lakeside, Pokhara",
    pricePerPerson: 45000,
    groupDiscountPercent: 5,
    images: ["/listings/poonhill-1.jpg", "/listings/poonhill-2.jpg", "/listings/poonhill-3.jpg"],
    rating: 4.7,
    totalReviews: 67,
    featured: true,
    createdAt: "2024-02-15",
  },
  {
    id: "listing-4",
    guideId: "guide-3",
    title: "Langtang Valley Trek",
    category: "trekking",
    region: "Langtang Region",
    difficulty: "moderate",
    duration: 10,
    maxGroupSize: 12,
    description: "Explore the beautiful Langtang Valley, known as the 'Valley of Glaciers'. This less crowded trek offers intimate mountain experiences, rich Tamang culture, and stunning views of Langtang Lirung and surrounding peaks.",
    highlights: [
      "Kyanjin Gompa monastery visit",
      "Climb Kyanjin Ri for panoramic views",
      "Tamang cultural experiences",
      "Yak cheese factory visit",
      "Diverse wildlife and flora",
    ],
    itinerary: [
      { day: 1, title: "Drive to Syabrubesi", description: "Scenic drive through hills to trek start.", elevation: "1,550m" },
      { day: 2, title: "Trek to Lama Hotel", description: "Follow Langtang Khola through forests.", elevation: "2,380m", distance: "13km" },
      { day: 3, title: "Trek to Langtang Village", description: "Enter the beautiful glacial valley.", elevation: "3,430m", distance: "11km" },
      { day: 4, title: "Trek to Kyanjin Gompa", description: "Reach the highest settlement with monastery.", elevation: "3,870m", distance: "8km" },
      { day: 5, title: "Exploration Day", description: "Climb Kyanjin Ri or Tserko Ri for views.", elevation: "4,773m" },
      { day: 6, title: "Trek to Lama Hotel", description: "Retrace steps down the valley.", elevation: "2,380m", distance: "19km" },
      { day: 7, title: "Trek to Thulo Syabru", description: "Side route through different terrain.", elevation: "2,260m", distance: "12km" },
      { day: 8, title: "Trek to Dhunche", description: "Descend to road head town.", elevation: "1,960m", distance: "9km" },
      { day: 9, title: "Drive to Kathmandu", description: "Return drive with mountain views.", elevation: "1,400m" },
      { day: 10, title: "Departure", description: "Airport transfer for departure.", elevation: "1,400m" },
    ],
    included: [
      "Transportation",
      "Accommodations",
      "Meals during trek",
      "Licensed guide",
      "Porter service",
      "Langtang National Park permit",
    ],
    excluded: [
      "Travel insurance",
      "Personal items",
      "Tips",
      "Extra meals in Kathmandu",
    ],
    meetingPoint: "Thamel, Kathmandu",
    pricePerPerson: 95000,
    groupDiscountPercent: 10,
    images: ["/listings/langtang-1.jpg", "/listings/langtang-2.jpg", "/listings/langtang-3.jpg"],
    rating: 4.8,
    totalReviews: 29,
    featured: false,
    createdAt: "2024-03-01",
  },
  {
    id: "listing-5",
    guideId: "guide-3",
    title: "Kathmandu Cultural Day Tour",
    category: "cultural",
    region: "Kathmandu Valley",
    difficulty: "easy",
    duration: 1,
    maxGroupSize: 20,
    description: "Discover the rich cultural heritage of Kathmandu Valley in this comprehensive day tour. Visit UNESCO World Heritage Sites including ancient temples, stupas, and durbar squares while learning about Nepal's fascinating history and traditions.",
    highlights: [
      "Swayambhunath (Monkey Temple)",
      "Boudhanath Stupa",
      "Pashupatinath Temple",
      "Kathmandu Durbar Square",
      "Traditional Nepali lunch",
    ],
    itinerary: [
      { day: 1, title: "Full Day Cultural Tour", description: "Visit Swayambhunath for sunrise, Pashupatinath Temple, Boudhanath Stupa, and Kathmandu Durbar Square with traditional lunch and expert cultural commentary." },
    ],
    included: [
      "Private transportation",
      "Licensed cultural guide",
      "All entrance fees",
      "Traditional Nepali lunch",
      "Bottled water",
    ],
    excluded: [
      "Personal expenses",
      "Tips",
      "Camera fees at sites",
    ],
    meetingPoint: "Your hotel in Thamel",
    pricePerPerson: 12000,
    groupDiscountPercent: 0,
    images: ["/listings/cultural-1.jpg", "/listings/cultural-2.jpg", "/listings/cultural-3.jpg"],
    rating: 4.9,
    totalReviews: 112,
    featured: true,
    createdAt: "2024-01-20",
  },
  {
    id: "listing-6",
    guideId: "guide-4",
    title: "Chitwan Safari Adventure",
    category: "safari",
    region: "Chitwan",
    difficulty: "easy",
    duration: 3,
    maxGroupSize: 8,
    description: "Experience the wild side of Nepal in Chitwan National Park, a UNESCO World Heritage Site. Search for rhinos, tigers, elephants, and over 500 bird species in this incredible biodiversity hotspot. Includes jungle walks, canoe rides, and cultural programs.",
    highlights: [
      "One-horned rhinoceros sightings",
      "Elephant safari through grasslands",
      "Canoe ride on Rapti River",
      "Crocodile and bird watching",
      "Tharu cultural program",
      "Jungle walks with naturalist",
    ],
    itinerary: [
      { day: 1, title: "Arrive in Chitwan", description: "Transfer from Kathmandu or Pokhara, check-in, and evening Tharu cultural program with dinner." },
      { day: 2, title: "Full Day Safari", description: "Early morning bird watching, elephant safari, canoe ride, jungle walk, and crocodile breeding center visit." },
      { day: 3, title: "Morning Activity and Departure", description: "Optional morning jeep safari or bird watching before transfer to next destination." },
    ],
    included: [
      "Resort accommodation",
      "All meals",
      "All safari activities",
      "Park entrance fees",
      "Expert naturalist guide",
      "Cultural program",
    ],
    excluded: [
      "Transportation to/from Chitwan",
      "Personal expenses",
      "Tips",
      "Alcoholic beverages",
    ],
    meetingPoint: "Sauraha Bus Park, Chitwan",
    pricePerPerson: 35000,
    groupDiscountPercent: 5,
    images: ["/listings/chitwan-1.jpg", "/listings/chitwan-2.jpg", "/listings/chitwan-3.jpg"],
    rating: 4.7,
    totalReviews: 56,
    featured: true,
    createdAt: "2024-02-10",
  },
  {
    id: "listing-7",
    guideId: "guide-1",
    title: "Upper Mustang Trek",
    category: "trekking",
    region: "Mustang",
    difficulty: "moderate",
    duration: 12,
    maxGroupSize: 10,
    description: "Journey into the forbidden kingdom of Lo in Upper Mustang, a remote trans-Himalayan region that remained closed to outsiders until 1992. Explore ancient cave monasteries, dramatic desert landscapes, and the medieval walled city of Lo Manthang.",
    highlights: [
      "Walled city of Lo Manthang",
      "Ancient cave monasteries",
      "Tibetan Buddhist culture",
      "Dramatic desert landscapes",
      "Restricted area permit",
    ],
    itinerary: [
      { day: 1, title: "Fly Pokhara to Jomsom, Trek to Kagbeni", description: "Spectacular mountain flight and trek start.", elevation: "2,800m", distance: "10km" },
      { day: 2, title: "Trek to Chele", description: "Enter Upper Mustang restricted area.", elevation: "3,050m", distance: "15km" },
      { day: 3, title: "Trek to Syangboche", description: "Cross high passes with dramatic views.", elevation: "3,800m", distance: "18km" },
      { day: 4, title: "Trek to Ghami", description: "Longest mani wall in Nepal.", elevation: "3,520m", distance: "14km" },
      { day: 5, title: "Trek to Lo Manthang", description: "Arrive at the ancient walled capital.", elevation: "3,840m", distance: "14km" },
      { day: 6, title: "Explore Lo Manthang", description: "Visit monasteries and royal palace.", elevation: "3,840m" },
      { day: 7, title: "Trek to Dhakmar", description: "Via ancient Ghar Gompa cave monastery.", elevation: "3,820m", distance: "16km" },
      { day: 8, title: "Trek to Ghiling", description: "Red and white cliffs landscape.", elevation: "3,570m", distance: "12km" },
      { day: 9, title: "Trek to Chhusang", description: "Dramatic canyon scenery.", elevation: "2,980m", distance: "18km" },
      { day: 10, title: "Trek to Jomsom", description: "Return to the main trail.", elevation: "2,720m", distance: "20km" },
      { day: 11, title: "Fly to Pokhara", description: "Morning flight with Annapurna views.", elevation: "820m" },
      { day: 12, title: "Transfer to Kathmandu", description: "Drive or fly back to Kathmandu.", elevation: "1,400m" },
    ],
    included: [
      "All flights",
      "Upper Mustang permit ($500)",
      "ACAP permit",
      "Accommodations",
      "Meals during trek",
      "Licensed guide",
      "Porter service",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips",
    ],
    meetingPoint: "Pokhara Airport",
    pricePerPerson: 275000,
    groupDiscountPercent: 8,
    images: ["/listings/mustang-1.jpg", "/listings/mustang-2.jpg", "/listings/mustang-3.jpg"],
    rating: 4.9,
    totalReviews: 18,
    featured: false,
    createdAt: "2024-03-15",
  },
  {
    id: "listing-8",
    guideId: "guide-2",
    title: "Nagarkot Sunrise Hike",
    category: "hiking",
    region: "Kathmandu Valley",
    difficulty: "easy",
    duration: 1,
    maxGroupSize: 15,
    description: "Wake up early for a magical sunrise experience at Nagarkot, one of the best viewpoints near Kathmandu. Watch as the first light illuminates the Himalayan range from Annapurna to Everest, then enjoy a hearty breakfast with mountain views.",
    highlights: [
      "Panoramic Himalayan sunrise",
      "Views from Annapurna to Everest",
      "Traditional breakfast with mountain views",
      "Easy morning hike",
      "Perfect for all fitness levels",
    ],
    itinerary: [
      { day: 1, title: "Nagarkot Sunrise Experience", description: "Early morning drive (4am), sunrise viewing, short hike to different viewpoints, traditional breakfast, and return by noon." },
    ],
    included: [
      "Private transportation",
      "Licensed guide",
      "Traditional breakfast",
      "Viewpoint fees",
    ],
    excluded: [
      "Personal expenses",
      "Tips",
    ],
    meetingPoint: "Your hotel in Kathmandu",
    pricePerPerson: 8500,
    groupDiscountPercent: 0,
    images: ["/listings/nagarkot-1.jpg", "/listings/nagarkot-2.jpg", "/listings/nagarkot-3.jpg"],
    rating: 4.6,
    totalReviews: 89,
    featured: false,
    createdAt: "2024-02-20",
  },
];

// Dummy Bookings
export const bookings: Booking[] = [
  {
    id: "booking-1",
    listingId: "listing-1",
    touristId: "tourist-1",
    guideId: "guide-1",
    date: "2024-04-15",
    groupSize: 2,
    totalPrice: 333000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2024-03-01",
    notes: "Celebrating our anniversary!",
  },
  {
    id: "booking-2",
    listingId: "listing-5",
    touristId: "tourist-1",
    guideId: "guide-3",
    date: "2024-03-20",
    groupSize: 1,
    totalPrice: 12000,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2024-03-15",
  },
  {
    id: "booking-3",
    listingId: "listing-3",
    touristId: "tourist-1",
    guideId: "guide-2",
    date: "2024-05-10",
    groupSize: 4,
    totalPrice: 171000,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2024-03-25",
  },
  {
    id: "booking-4",
    listingId: "listing-6",
    touristId: "tourist-1",
    guideId: "guide-4",
    date: "2024-03-10",
    groupSize: 2,
    totalPrice: 66500,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2024-02-28",
  },
  {
    id: "booking-5",
    listingId: "listing-2",
    touristId: "tourist-1",
    guideId: "guide-2",
    date: "2024-06-01",
    groupSize: 3,
    totalPrice: 455400,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2024-03-20",
  },
];

// Dummy Reviews
export const reviews: Review[] = [
  {
    id: "review-1",
    listingId: "listing-1",
    touristId: "tourist-1",
    touristName: "Sarah Johnson",
    rating: 5,
    comment: "Absolutely life-changing experience! Pasang was an incredible guide who made sure we were safe and comfortable throughout the trek. The views from Kala Patthar were beyond words.",
    createdAt: "2024-04-30",
  },
  {
    id: "review-2",
    listingId: "listing-1",
    touristId: "tourist-2",
    touristName: "Michael Chen",
    rating: 5,
    comment: "Best trek of my life. Pasang's knowledge of the region and his genuine care for our wellbeing made all the difference. Highly recommend!",
    createdAt: "2024-04-25",
  },
  {
    id: "review-3",
    listingId: "listing-1",
    touristId: "tourist-3",
    touristName: "Emma Williams",
    rating: 4,
    comment: "Great experience overall. The trek was challenging but rewarding. Only suggestion would be more acclimatization days.",
    createdAt: "2024-04-20",
  },
  {
    id: "review-4",
    listingId: "listing-3",
    touristId: "tourist-4",
    touristName: "David Miller",
    rating: 5,
    comment: "Perfect short trek! The sunrise from Poon Hill was magical. Ramesh was a wonderful guide with great stories about local culture.",
    createdAt: "2024-03-15",
  },
  {
    id: "review-5",
    listingId: "listing-5",
    touristId: "tourist-1",
    touristName: "Sarah Johnson",
    rating: 5,
    comment: "Maya was an exceptional guide! Her knowledge of Kathmandu's history and culture is amazing. The lunch was delicious too.",
    createdAt: "2024-03-22",
  },
  {
    id: "review-6",
    listingId: "listing-6",
    touristId: "tourist-5",
    touristName: "James Wilson",
    rating: 5,
    comment: "Saw rhinos and crocodiles! Bikash knew exactly where to find the wildlife. The elephant safari was unforgettable.",
    createdAt: "2024-03-08",
  },
  {
    id: "review-7",
    listingId: "listing-6",
    touristId: "tourist-6",
    touristName: "Lisa Anderson",
    rating: 4,
    comment: "Great safari experience. Would have loved more time in the park but overall very satisfied with the tour.",
    createdAt: "2024-02-28",
  },
  {
    id: "review-8",
    listingId: "listing-2",
    touristId: "tourist-7",
    touristName: "Thomas Brown",
    rating: 5,
    comment: "The Annapurna Circuit exceeded all expectations. Ramesh's local knowledge and the diversity of landscapes made this trek unforgettable.",
    createdAt: "2024-02-15",
  },
  {
    id: "review-9",
    listingId: "listing-4",
    touristId: "tourist-8",
    touristName: "Anna Schmidt",
    rating: 5,
    comment: "Langtang was beautiful and much less crowded than Everest region. Maya's connections with local Tamang families made for authentic experiences.",
    createdAt: "2024-03-10",
  },
  {
    id: "review-10",
    listingId: "listing-7",
    touristId: "tourist-9",
    touristName: "Robert Taylor",
    rating: 5,
    comment: "Upper Mustang is like stepping back in time. The landscapes are otherworldly and Lo Manthang is fascinating. Worth every penny of the permit!",
    createdAt: "2024-03-28",
  },
  {
    id: "review-11",
    listingId: "listing-8",
    touristId: "tourist-10",
    touristName: "Sophie Martin",
    rating: 4,
    comment: "Perfect activity for a short visit. The sunrise was stunning though it was quite cold - bring warm layers!",
    createdAt: "2024-02-10",
  },
  {
    id: "review-12",
    listingId: "listing-3",
    touristId: "tourist-11",
    touristName: "Chris Lee",
    rating: 5,
    comment: "Did this trek with my family including kids ages 10 and 12. Ramesh was so patient and made it fun for everyone. Highly recommend for families!",
    createdAt: "2024-03-05",
  },
];

// Categories for filtering
export const categories = [
  { id: "trekking", name: "Trekking", icon: "Mountain" },
  { id: "climbing", name: "Climbing", icon: "TrendingUp" },
  { id: "cultural", name: "Cultural", icon: "Landmark" },
  { id: "safari", name: "Safari", icon: "TreePine" },
  { id: "spiritual", name: "Spiritual", icon: "Sparkles" },
  { id: "hiking", name: "Hiking", icon: "Footprints" },
] as const;

// Regions for filtering
export const regions = [
  "Everest Region",
  "Annapurna Region",
  "Langtang Region",
  "Mustang",
  "Kathmandu Valley",
  "Chitwan",
  "Manaslu Region",
  "Dolpo Region",
] as const;

// Difficulty levels
export const difficulties = [
  { id: "easy", name: "Easy", description: "Suitable for beginners" },
  { id: "moderate", name: "Moderate", description: "Some experience recommended" },
  { id: "challenging", name: "Challenging", description: "Good fitness required" },
  { id: "extreme", name: "Extreme", description: "Expert level only" },
] as const;
