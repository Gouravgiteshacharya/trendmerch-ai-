export type FashionRetailRecord = {
  orderId: string;
  date: string;
  productId: string;
  productName: string;
  category: string;
  subCategory: string;
  size: string;
  color: string;
  price: number;
  quantitySold: number;
  revenue: number;
  stockAvailable: number;
  returns: number;
  state: string;
  city: string;
  customerAge: number;
  customerGender: "Women" | "Men" | "Non-binary";
  rating: number;
  trendKeyword: string;
};

type ProductSeed = {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  demand: number;
  stock: number;
  returnBias: number;
  colors: string[];
  sizes: string[];
  trendKeyword: string;
};

const products: ProductSeed[] = [
  {
    id: "DR-101",
    name: "Soleil Linen Midi",
    category: "Dresses",
    subCategory: "Midi Dress",
    price: 3299,
    demand: 6,
    stock: 38,
    returnBias: 0,
    colors: ["Ivory", "Sage", "Terracotta"],
    sizes: ["XS", "S", "M", "L", "XL"],
    trendKeyword: "linen",
  },
  {
    id: "DR-118",
    name: "Luna Satin Slip Dress",
    category: "Dresses",
    subCategory: "Slip Dress",
    price: 2899,
    demand: 5,
    stock: 44,
    returnBias: 1,
    colors: ["Black", "Plum", "Champagne"],
    sizes: ["XS", "S", "M", "L"],
    trendKeyword: "occasionwear",
  },
  {
    id: "TP-204",
    name: "Cloud Rib Tank",
    category: "Tops",
    subCategory: "Tank Top",
    price: 1199,
    demand: 7,
    stock: 62,
    returnBias: 0,
    colors: ["White", "Lilac", "Cocoa"],
    sizes: ["XS", "S", "M", "L", "XL"],
    trendKeyword: "quiet luxury",
  },
  {
    id: "TP-226",
    name: "Orchid Mesh Shirt",
    category: "Tops",
    subCategory: "Statement Shirt",
    price: 1899,
    demand: 3,
    stock: 96,
    returnBias: 2,
    colors: ["Orchid", "Black", "Stone"],
    sizes: ["S", "M", "L", "XL"],
    trendKeyword: "sheer layers",
  },
  {
    id: "BT-309",
    name: "Nova Wide-Leg Denim",
    category: "Bottoms",
    subCategory: "Jeans",
    price: 2599,
    demand: 6,
    stock: 41,
    returnBias: 1,
    colors: ["Mid Blue", "Ecru", "Charcoal"],
    sizes: ["26", "28", "30", "32", "34"],
    trendKeyword: "wide leg",
  },
  {
    id: "BT-334",
    name: "Aster Cargo Trouser",
    category: "Bottoms",
    subCategory: "Cargo Pants",
    price: 2399,
    demand: 5,
    stock: 33,
    returnBias: 1,
    colors: ["Olive", "Sand", "Black"],
    sizes: ["26", "28", "30", "32", "34"],
    trendKeyword: "utility",
  },
  {
    id: "OW-402",
    name: "Mica Cropped Blazer",
    category: "Outerwear",
    subCategory: "Blazer",
    price: 4299,
    demand: 2,
    stock: 112,
    returnBias: 2,
    colors: ["Oat", "Black", "Dusty Rose"],
    sizes: ["XS", "S", "M", "L"],
    trendKeyword: "soft tailoring",
  },
  {
    id: "OW-417",
    name: "Pebble Utility Jacket",
    category: "Outerwear",
    subCategory: "Jacket",
    price: 3799,
    demand: 3,
    stock: 86,
    returnBias: 1,
    colors: ["Khaki", "Navy", "Stone"],
    sizes: ["S", "M", "L", "XL"],
    trendKeyword: "utility",
  },
  {
    id: "ET-503",
    name: "Noor Linen Kurta Set",
    category: "Ethnic Wear",
    subCategory: "Kurta Set",
    price: 3499,
    demand: 6,
    stock: 35,
    returnBias: 0,
    colors: ["Indigo", "Marigold", "Ivory"],
    sizes: ["XS", "S", "M", "L", "XL"],
    trendKeyword: "modern ethnic",
  },
  {
    id: "ET-528",
    name: "Meher Chanderi Saree",
    category: "Ethnic Wear",
    subCategory: "Saree",
    price: 4599,
    demand: 4,
    stock: 51,
    returnBias: 0,
    colors: ["Rose", "Teal", "Gold"],
    sizes: ["Free Size"],
    trendKeyword: "festive edit",
  },
  {
    id: "MS-604",
    name: "Arlo Oxford Shirt",
    category: "Menswear",
    subCategory: "Casual Shirt",
    price: 2099,
    demand: 5,
    stock: 48,
    returnBias: 0,
    colors: ["Sky Blue", "White", "Sage"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    trendKeyword: "relaxed prep",
  },
  {
    id: "MT-622",
    name: "Core Pima Tee",
    category: "Menswear",
    subCategory: "T-Shirt",
    price: 999,
    demand: 7,
    stock: 71,
    returnBias: 0,
    colors: ["White", "Black", "Rust"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    trendKeyword: "elevated basics",
  },
  {
    id: "AC-706",
    name: "Iris Mini Shoulder Bag",
    category: "Accessories",
    subCategory: "Handbag",
    price: 2199,
    demand: 5,
    stock: 29,
    returnBias: 0,
    colors: ["Burgundy", "Black", "Butter Yellow"],
    sizes: ["One Size"],
    trendKeyword: "burgundy accessories",
  },
  {
    id: "FT-808",
    name: "Mira Platform Sandal",
    category: "Footwear",
    subCategory: "Sandals",
    price: 2799,
    demand: 4,
    stock: 57,
    returnBias: 2,
    colors: ["Tan", "Black", "Metallic"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    trendKeyword: "platforms",
  },
  {
    id: "AT-901",
    name: "Pulse Seamless Co-ord",
    category: "Activewear",
    subCategory: "Co-ord Set",
    price: 2499,
    demand: 5,
    stock: 46,
    returnBias: 1,
    colors: ["Mauve", "Graphite", "Sea Green"],
    sizes: ["XS", "S", "M", "L", "XL"],
    trendKeyword: "studio to street",
  },
];

const locations = [
  { state: "Maharashtra", city: "Mumbai", demand: 3 },
  { state: "Maharashtra", city: "Pune", demand: 2 },
  { state: "Karnataka", city: "Bengaluru", demand: 3 },
  { state: "Delhi", city: "New Delhi", demand: 3 },
  { state: "Odisha", city: "Bhubaneswar", demand: 1 },
  { state: "West Bengal", city: "Kolkata", demand: 2 },
  { state: "Tamil Nadu", city: "Chennai", demand: 2 },
  { state: "Telangana", city: "Hyderabad", demand: 2 },
  { state: "Gujarat", city: "Ahmedabad", demand: 2 },
  { state: "Rajasthan", city: "Jaipur", demand: 1 },
  { state: "Uttar Pradesh", city: "Lucknow", demand: 2 },
] as const;

const genders: FashionRetailRecord["customerGender"][] = ["Women", "Women", "Men", "Women", "Men", "Non-binary"];
const endDate = Date.UTC(2026, 5, 12);

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export const fashionRetailData: FashionRetailRecord[] = Array.from(
  { length: 180 },
  (_, index) => {
    const product = products[(index * 7 + Math.floor(index / 15)) % products.length];
    const location = locations[(index * 5 + product.demand) % locations.length];
    const daysAgo = (index * 11 + Math.floor(index / 9)) % 72;
    const date = new Date(endDate - daysAgo * 86_400_000);
    const demandPulse = (index + product.demand + location.demand) % 4;
    const quantitySold = Math.max(
      1,
      Math.min(8, product.demand - 2 + location.demand + demandPulse),
    );
    const priceAdjustment = ((index % 5) - 2) * 25;
    const price = product.price + priceAdjustment;
    const returnTrigger = (index * 3 + product.returnBias) % 13;
    const returns =
      returnTrigger < product.returnBias
        ? Math.min(quantitySold, 1 + (index % 2))
        : index % 41 === 0
          ? 1
          : 0;
    const stockAvailable = Math.max(
      3,
      product.stock - ((index * product.demand + daysAgo) % Math.max(18, product.stock)),
    );
    const rating = Math.min(
      5,
      Math.max(3.1, 4.1 + ((index * 7) % 10) / 10 - product.returnBias * 0.12),
    );

    return {
      orderId: `TM-${String(index + 1).padStart(4, "0")}`,
      date: date.toISOString().slice(0, 10),
      productId: product.id,
      productName: product.name,
      category: product.category,
      subCategory: product.subCategory,
      size: product.sizes[(index + location.demand) % product.sizes.length],
      color: product.colors[(index * 2 + location.demand) % product.colors.length],
      price,
      quantitySold,
      revenue: roundCurrency(price * quantitySold),
      stockAvailable,
      returns,
      state: location.state,
      city: location.city,
      customerAge: 19 + ((index * 7 + product.demand) % 36),
      customerGender: genders[(index + product.demand) % genders.length],
      rating: Math.round(rating * 10) / 10,
      trendKeyword: product.trendKeyword,
    };
  },
);

