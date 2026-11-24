/**
 * Single source of truth for Hotel Waldhaus am See.
 * Figures are harmonised here once (the old site contradicted itself across pages).
 */

export const px = (id: number, w = 1800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const hotel = {
  name: "Waldhaus am See",
  fullName: "Hotel Waldhaus am See",
  tagline: "On the shore of Lake St. Moritz since 1885",
  address: "Via Dim Lej 6",
  city: "7500 St. Moritz",
  country: "Switzerland",
  phone: "+41 81 836 60 00",
  phoneHref: "tel:+41818366000",
  email: "info@waldhaus-am-see.ch",
  founded: 1885,
  stars: "3★ Superior",
};

export const figures = {
  whiskies: "2,500+",
  whiskiesNum: 2500,
  wines: "1,300+",
  bottlesInCellar: "25,000",
  countries: "20+",
  rooms: "~50",
  recordYears: 30,
};

export const images = {
  heroLake: px(37650625, 2400),
  lakeSummer: px(37650646),
  /** the house across the lake in autumn (owner photo) */
  welcomeAutumn: "/images/welcome-lake-autumn.jpg",
  winter: px(625403),
  whiskyShelf: px(18324681, 1400),
  whiskyBottles: px(2606387),
  whiskyJapanese: px(372959),
  whiskyWall: px(6752359),
  whiskyGlass2: px(7254798, 1200),
  roomView: px(2346091),
  roomSun: px(2346090),
  roomVintage: px(7609139),
  dineCandle: px(37968303),
  dineSetting: px(17294730),
  dineRomance: px(29110868, 1200),
  cellarArch: px(32523794, 1200),
  cellarRack: px(31960205, 1200),
  cellarStone: px(36542248, 1200),
  cellarBottles: px(31960204, 1200),

  /* the hotel's own photos (Photos.zip, 2026-11-16): booking-site copies, at most 1024px wide */
  balconyLake: "/images/hotel/balcony-lake-view.jpg",
  roomSingle: "/images/hotel/room-single.jpg",
  roomSingle2: "/images/hotel/room-single-2.jpg",
  roomSingle3: "/images/hotel/room-single-3.jpg",
  roomSingleLake: "/images/hotel/room-single-lake.jpg",
  roomDoubleComfort: "/images/hotel/room-double-comfort.jpg",
  roomDoubleComfort2: "/images/hotel/room-double-comfort-2.jpg",
  roomDoubleComfort3: "/images/hotel/room-double-comfort-3.jpg",
  roomDoubleLake: "/images/hotel/room-double-lake.jpg",
  roomDoubleLake2: "/images/hotel/room-double-lake-2.jpg",
  roomDoubleLake3: "/images/hotel/room-double-lake-3.jpg",
  apartmentLiving: "/images/hotel/apartment-living.jpg",
  apartmentLiving2: "/images/hotel/apartment-living-2.jpg",
  apartmentLounge: "/images/hotel/apartment-lounge.jpg",
  loungePiano: "/images/hotel/lounge-piano.jpg",
  terraceWinter: "/images/hotel/terrace-winter-lake.jpg",
  dineWindowTable: "/images/hotel/dine-window-table.jpg",
  spaWhirlpool: "/images/hotel/spa-whirlpool.jpg",
  spaWhirlpoolPanorama: "/images/hotel/spa-whirlpool-panorama.jpg",
  spaSteamBath: "/images/hotel/spa-steam.jpg",
  spaSaunaWood: "/images/hotel/spa-sauna.jpg",
  spaAdventureShower: "/images/hotel/spa-adventure-shower.jpg",
  spaInfrared: "/images/hotel/spa-infrared.jpg",
  spaRelax: "/images/hotel/spa-relax.jpg",
  winterSunLake: "/images/hotel/winter-sun-lake.jpg",
  lakeDusk: "/images/hotel/lake-dusk.jpg",
  whiskyPour: "/images/hotel/whisky-pour.jpg",
  devilsLounge: "/images/hotel/devils-place-lounge.jpg",
  houseFacade: "/images/hotel/house-facade-summer.jpg",
  houseAutumn: "/images/hotel/house-autumn.jpg",
  houseDusk: "/images/hotel/house-dusk.jpg",
};

export type Room = {
  slug: string;
  name: string;
  short: string;
  from: number;
  size: string;
  view: string;
  guests: string;
  image: string;
  /** the room page's hero, when it differs from the card image */
  hero?: string;
  gallery: string[];
  description: string[];
  features: string[];
};

export const rooms: Room[] = [
  {
    slug: "single",
    name: "Single Room",
    short: "Small, cosy and completely renovated — a quiet retreat in Swiss stone pine.",
    from: 100,
    size: "11–13 m²",
    view: "Village or forest",
    guests: "1 adult",
    image: images.roomSingle,
    gallery: [images.roomSingle, images.roomSingle2, images.roomSingle3],
    description: [
      "Small but beautifully considered. Every single room has been completely renovated, with a new bathroom featuring either a bathtub or a rain shower.",
      "Windows open onto the rooftops of St. Moritz or the larch forest behind the hotel — a quiet, restful base for the solo traveller.",
    ],
    features: ["Bathtub or rain shower", "Traditional stone-pine furnishings", "Free Wi-Fi", "Breakfast buffet included", "Ski storage", "Free station shuttle"],
  },
  {
    slug: "single-lake-view",
    name: "Single Room · Lake View",
    short: "Wake up to the lake — the village and the Maloja peaks framed in your window.",
    from: 125,
    size: "15–17 m²",
    view: "Lake & village",
    guests: "1 adult",
    image: images.roomSingleLake,
    /* the room page keeps its current photos (by request); only the cards use the hotel photo */
    hero: images.roomView,
    gallery: [images.roomView, images.roomSun, images.roomVintage],
    description: [
      "A generous single room facing Lake St. Moritz, with views across the water to the village and the mountains towards Maloja.",
      "The bathroom offers a bath or rain shower; the furnishings are warm alpine wood, each room with its own character.",
    ],
    features: ["Direct lake view", "Bath or rain shower", "Stone-pine furnishings", "Free Wi-Fi", "Breakfast buffet included", "Free station shuttle"],
  },
  {
    slug: "double-comfort",
    name: "Double Room · Comfort",
    short: "Spacious and warm, overlooking the village or the forest.",
    from: 230,
    size: "19–25 m²",
    view: "Village or forest",
    guests: "2 adults",
    image: images.roomDoubleComfort,
    gallery: [images.roomDoubleComfort, images.roomDoubleComfort2, images.roomDoubleComfort3],
    description: [
      "Our comfort doubles look out over the village of St. Moritz or into the quiet of the forest. No two are identical — layout, orientation and style differ from room to room.",
      "Traditional Engadin wood meets modern bathrooms, renovated as part of our ongoing investment in the house.",
    ],
    features: ["Village or forest view", "Renovated bathroom", "Stone-pine furnishings", "Free Wi-Fi", "Half-board available", "Free parking & EV charging"],
  },
  {
    slug: "double-lake-view",
    name: "Double Room · Lake View",
    short: "The signature room — the only hotel directly on the lake, and it shows.",
    from: 240,
    size: "19–25 m²",
    view: "Lake St. Moritz & Maloja",
    guests: "2 adults",
    image: images.roomDoubleLake,
    gallery: [images.roomDoubleLake, images.roomDoubleLake2, images.roomDoubleLake3],
    description: [
      "The view that made the Waldhaus famous: straight across Lake St. Moritz towards the peaks of Maloja, with nothing but water between you and the mountains.",
      "Warm wood, soft linens and a bathroom renovated in recent years. Ask for an upper floor for the widest panorama.",
    ],
    features: ["Direct lake view towards Maloja", "Renovated bathroom", "Stone-pine furnishings", "Free Wi-Fi", "Half-board available", "Free station shuttle"],
  },
  {
    slug: "apartment-suite",
    name: "Apartment · Suite",
    short: "3.5 rooms, exclusively furnished, with balcony or terrace — for families and longer stays.",
    from: 420,
    size: "3.5 rooms",
    view: "Lake or village",
    guests: "Up to 4 adults + 2 children",
    image: images.apartmentLiving,
    gallery: [images.apartmentLiving, images.apartmentLiving2, images.apartmentLounge],
    description: [
      "Our most generous accommodation: 3.5-room apartments and suites, very exclusively furnished, each with two separate bedrooms and a living room opening onto a balcony or terrace.",
      "A full bathroom, separate WC with shower and a private kitchen make them ideal for families, friends travelling together, or anyone staying a little longer.",
    ],
    features: ["Two separate bedrooms", "Living room with balcony or terrace", "Private kitchen", "Bath/WC + separate shower/WC", "Up to 4 adults + 2 children", "Hotel services included"],
  },
];

export const services = [
  "Free rail-station shuttle",
  "Free parking",
  "EV charging",
  "Ski storage & ski passes",
  "Bicycles",
  "Pets welcome",
  "Half-board",
  "Open 365 days",
];

export const hours = [
  { key: "breakfast", label: "Breakfast Buffet & Brunch", time: "7:00 – 11:00" },
  { key: "restaurant", label: "Restaurant · hot meals", time: "until 22:00" },
  { key: "devils", label: "Devil's Place Whisky Bar", time: "16:00 – 00:30" },
  { key: "cigar", label: "Cigar Lounge", time: "16:00 – 00:30" },
  { key: "lounge", label: "Lake View Lounge", time: "7:00 – 24:00" },
  { key: "terrace", label: "Waldhaus Terrace", time: "11:00 – 18:00*" },
  { key: "spa", label: "Alpine Spa", time: "15:00 – 21:00" },
];

export const awards = [
  { key: "guinness", title: "Guinness World Record", sub: "World's largest whisky selection · since 1999" },
  { key: "best3", title: "Best 3-Star Hotel", sub: "Switzerland · multiple-time winner" },
  { key: "wineSpectator", title: "Wine Spectator", sub: "Grand Award & Best of Award of Excellence" },
  { key: "leadingBars", title: "Leading Bars of the World", sub: "Devil's Place" },
  { key: "forbes", title: "Forbes, 2026", sub: "\u201CThirty years of a world record\u201D" },
];

export const timeline = [
  { year: "1885", title: "The house opens", text: "The Waldhaus opens its doors on the shore of Lake St. Moritz — the only hotel directly on the water." },
  { year: "1985", title: "The Bernasconi era", text: "A century later, Claudio Bernasconi acquires the hotel and begins shaping its singular character." },
  { year: "1996", title: "First world record", text: "Devil's Place enters the Guinness Book of Records with 1,000 bottles of whisky." },
  { year: "1999", title: "The record grows", text: "A second Guinness entry with more than 2,500 bottlings — a record held ever since." },
  { year: "2013", title: "CHF 2.2 million renewal", text: "11 new rooms, 25 new bathrooms, 105 new beds, a new entrance, dining room and the Sela Guardalej." },
  { year: "2019", title: "CHF 3 million renewal", text: "A complete renovation of the wellness area, 25 further rooms and 20 bathrooms, and a wider window front in the restaurant." },
  { year: "Today", title: "The next generation", text: "Claudio's son Sandro leads the house — the tradition, and the welcome, live on." },
];

export const nav = [
  {
    key: "nav.stay",
    label: "Stay",
    href: "/stay",
    children: [
      { key: "nav.stayRooms", label: "Rooms & Suites", href: "/stay" },
      { key: "nav.stayPackage", label: "Weekly Package", href: "/stay#package" },
      { key: "nav.stayServices", label: "Services", href: "/stay#services" },
    ],
  },
  {
    key: "nav.dine",
    label: "Dine",
    href: "/dine",
    children: [
      { key: "nav.dineRestaurant", label: "Restaurant", href: "/dine" },
      { key: "nav.dineLounge", label: "Lake View Lounge", href: "/dine#lounge" },
      { key: "nav.dineTerrace", label: "The Terrace", href: "/dine#terrace" },
      { key: "nav.dineEvents", label: "Celebrations & Events", href: "/dine#events" },
    ],
  },
  {
    key: "nav.whisky",
    label: "Whisky & Wine",
    href: "/whisky-wine",
    children: [
      { key: "nav.whiskyDevils", label: "Devil's Place", href: "/whisky-wine" },
      { key: "nav.whiskyCigar", label: "Cigar Lounge", href: "/whisky-wine#cigar" },
      { key: "nav.whiskyShop", label: "Whisky Shop", href: "/whisky-wine#shop" },
      { key: "nav.whiskyCave", label: "Cave Waldhaus", href: "/whisky-wine#cave" },
    ],
  },
  {
    key: "nav.spa",
    label: "Spa & Alps",
    href: "/spa",
    children: [
      { key: "nav.spaSpa", label: "Alpine Spa", href: "/spa" },
      { key: "nav.spaActivities", label: "Activities", href: "/spa#activities" },
    ],
  },
  {
    key: "nav.heritage",
    label: "Heritage",
    href: "/heritage",
    children: [
      { key: "nav.heritageStory", label: "Our Story", href: "/heritage" },
      { key: "nav.heritageTimeline", label: "Timeline", href: "/heritage#timeline" },
    ],
  },
];

export const inquiryTypes = [
  { value: "room", label: "Stay · Room request" },
  { value: "table", label: "Dine · Table reservation" },
  { value: "event", label: "Celebration or event" },
  { value: "spa", label: "Alpine Spa slot" },
  { value: "whisky", label: "Whisky shop appointment" },
] as const;

export type InquiryType = (typeof inquiryTypes)[number]["value"];

/* ——— Elevation: additive exports (existing content above is frozen) ——— */

const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** 1 → "I" … 10 → "X"; falls back to the arabic numeral beyond ten. */
export const toRoman = (n: number) => romans[n - 1] ?? String(n);

/** The five chapters of the house (I Stay … V Heritage), used for chapter numerals. */
export const chapters = nav.map((n, i) => ({ ...n, numeral: toRoman(i + 1) }));

export type BrandId = "waldhaus" | "devils" | "cave" | "stubli";

/** The house family, for emblems and lockups. */
export const brands: Record<BrandId, { name: string; descriptor: string; est?: number; href: string }> = {
  waldhaus: { name: hotel.name, descriptor: "St. Moritz", est: hotel.founded, href: "/" },
  devils: { name: "Devil's Place", descriptor: "Whisky Bar", href: "/whisky-wine" },
  cave: { name: "Cave Waldhaus", descriptor: "The wine cellar", href: "/whisky-wine#cave" },
  stubli: { name: "Fondue Stübli", descriptor: "Stüvetta & Fonduestübli", href: "/dine" },
};

/** From the existing map marker. */
export const geo = { lat: 46.4921, lon: 9.8375, label: "46°29′32″ N · 9°50′15″ E" };

export const seasonal = { nye: { until: "2027-01-01" } };
