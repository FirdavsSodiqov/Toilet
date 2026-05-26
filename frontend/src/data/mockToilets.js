/**
 * Mock toilet data matching the expected backend contract.
 * Will be replaced by real API calls once backend is ready.
 * Schema: { id, name, lat, lng, status, distance, rating, price, type }
 */

const MOCK_TOILETS = [
  {
    id: 1,
    name: "Amir Temur Metro Station WC",
    lat: 41.3111, lng: 69.2797,
    status: "open", distance: 0.12, rating: 4.5, price: 0, type: "public",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80"],
  },
  {
    id: 2,
    name: "Tashkent City Mall Premium",
    lat: 41.3145, lng: 69.2821,
    status: "open", distance: 0.35, rating: 4.8, price: 3000, type: "premium",
    images: ["https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&q=80"],
  },
  {
    id: 3,
    name: "Chorsu Bazaar WC",
    lat: 41.3262, lng: 69.2338,
    status: "limited", distance: 0.55, rating: 3.2, price: 1000, type: "public",
    images: ["https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400&q=80"],
  },
  {
    id: 4,
    name: "Hilton Hotel Restroom",
    lat: 41.3049, lng: 69.2778,
    status: "open", distance: 0.8, rating: 4.9, price: 5000, type: "premium",
    images: ["https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80"],
  },
  {
    id: 5,
    name: "Navoiy Theatre WC",
    lat: 41.3156, lng: 69.2662,
    status: "closed", distance: 1.2, rating: 3.8, price: 2000, type: "public",
    images: ["https://images.unsplash.com/photo-1571722288435-38ece18fc7a9?w=400&q=80"],
  },
  {
    id: 6,
    name: "Minor Mosque Area",
    lat: 41.3204, lng: 69.2504,
    status: "open", distance: 1.5, rating: 4.1, price: 0, type: "public",
    images: ["https://images.unsplash.com/photo-1525774197100-06de961a2a04?w=400&q=80"],
  },
  {
    id: 7,
    name: "Mega Planet WC",
    lat: 41.3389, lng: 69.3351,
    status: "limited", distance: 2.1, rating: 3.5, price: 2000, type: "paid",
    images: ["https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&q=80"],
  },
  {
    id: 8,
    name: "Samarkand Darvoza Metro WC",
    lat: 41.2978, lng: 69.2719,
    status: "open", distance: 2.3, rating: 3.9, price: 1000, type: "public",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80"],
  },
  {
    id: 9,
    name: "Riviera Park Sanitary",
    lat: 41.3456, lng: 69.3123,
    status: "open", distance: 3.0, rating: 4.3, price: 3000, type: "paid",
    images: ["https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&q=80"],
  },
  {
    id: 10,
    name: "Magic City WC",
    lat: 41.3505, lng: 69.3285,
    status: "closed", distance: 3.8, rating: 4.0, price: 2000, type: "premium",
    images: ["https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80"],
  },
  {
    id: 11,
    name: "Tashkent Tower Area WC",
    lat: 41.3178, lng: 69.2741,
    status: "open", distance: 0.28, rating: 4.6, price: 0, type: "public",
    images: ["https://images.unsplash.com/photo-1571722288435-38ece18fc7a9?w=400&q=80"],
  },
  {
    id: 12,
    name: "Beruniy Metro WC",
    lat: 41.2913, lng: 69.2284,
    status: "limited", distance: 4.5, rating: 3.0, price: 500, type: "public",
    images: ["https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400&q=80"],
  },
];

export default MOCK_TOILETS;
