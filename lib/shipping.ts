import type { Zone } from "./types";

export type City = {
  name: string;
  zone: Zone;
};

export type Province = {
  id: string;
  name: string;
  cities: City[];
};

export const provinces: Province[] = [
  {
    id: "sindh",
    name: "Sindh",
    cities: [
      { name: "Karachi", zone: "metro" },
      { name: "Hyderabad", zone: "major" },
      { name: "Sukkur", zone: "rest" },
      { name: "Larkana", zone: "rest" },
    ],
  },
  {
    id: "punjab",
    name: "Punjab",
    cities: [
      { name: "Lahore", zone: "metro" },
      { name: "Rawalpindi", zone: "metro" },
      { name: "Faisalabad", zone: "major" },
      { name: "Multan", zone: "major" },
      { name: "Gujranwala", zone: "major" },
      { name: "Sialkot", zone: "major" },
      { name: "Bahawalpur", zone: "rest" },
      { name: "Sargodha", zone: "rest" },
    ],
  },
  {
    id: "ict",
    name: "Islamabad Capital Territory",
    cities: [{ name: "Islamabad", zone: "metro" }],
  },
  {
    id: "khyber-pakhtunkhwa",
    name: "Khyber Pakhtunkhwa",
    cities: [
      { name: "Peshawar", zone: "major" },
      { name: "Abbottabad", zone: "rest" },
      { name: "Mardan", zone: "rest" },
    ],
  },
  {
    id: "balochistan",
    name: "Balochistan",
    cities: [
      { name: "Quetta", zone: "major" },
      { name: "Gwadar", zone: "rest" },
    ],
  },
  {
    id: "ajk",
    name: "Azad Jammu & Kashmir",
    cities: [{ name: "Muzaffarabad", zone: "rest" }],
  },
  {
    id: "gilgit-baltistan",
    name: "Gilgit-Baltistan",
    cities: [{ name: "Gilgit", zone: "rest" }],
  },
];

export function findCity(name: string): (City & { province: string }) | undefined {
  for (const province of provinces) {
    const city = province.cities.find((item) => item.name === name);
    if (city) return { ...city, province: province.name };
  }
  return undefined;
}

export function citiesFor(provinceName: string): City[] {
  return provinces.find((province) => province.name === provinceName)?.cities ?? [];
}
