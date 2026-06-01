// Location qatorini API javobiga aylantiruvchi yagona serializer.
// priceAmount Decimal -> string, createdBy ixtiyoriy (yo'q bo'lsa null).

export interface LocationRow {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: string;
  priceType: string;
  priceAmount: { toString(): string };
  rating: number;
  reviewCount: number;
  images: string[];
  createdById: string | null;
  createdAt: Date;
  createdBy?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

export function serializeLocation(location: LocationRow) {
  return {
    id: location.id,
    name: location.name,
    address: location.address,
    latitude: location.latitude,
    longitude: location.longitude,
    type: location.type,
    priceType: location.priceType,
    priceAmount: location.priceAmount.toString(),
    rating: location.rating,
    reviewCount: location.reviewCount,
    images: location.images,
    createdById: location.createdById,
    createdAt: location.createdAt,
    createdBy: location.createdBy ?? null,
  };
}
