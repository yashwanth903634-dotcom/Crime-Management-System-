export type CriminalStatus = "Wanted" | "Arrested" | "Released" | "In Custody";

export interface Criminal {
  caseId: string;
  criminalId: string;
  name: string;
  nickname: string;
  crimeType: string;
  arrestDate: string;
  dateOfCrime: string;
  address: string;
  age: number;
  occupation: string;
  gender: "Male" | "Female" | "Other";
  status: CriminalStatus;
  fatherName?: string;
  birthMark?: string;
  policeStation?: string;
  photo?: string;
}

export const CRIME_TYPES = [
  "Theft", "Robbery", "Assault", "Cyber Fraud", "Drug Trafficking",
  "Homicide", "Burglary", "Smuggling", "Kidnapping", "Forgery",
];

export const STATUSES: CriminalStatus[] = ["Wanted", "Arrested", "Released", "In Custody"];

const NAMES = [
  ["Marcus Vega", "The Ghost"], ["Elena Rios", "Viper"], ["Dimitri Volkov", "Iron Fist"],
  ["Aiden Cross", "Shadow"], ["Sofia Lin", "Whisper"], ["Rashid Khan", "Falcon"],
  ["Nora Blake", "Lynx"], ["Tomás Reyes", "Cobra"], ["Yuki Tanaka", "Phantom"],
  ["Liam Donovan", "Wolf"], ["Anya Petrova", "Raven"], ["Carlos Mendez", "Bull"],
  ["Priya Shah", "Saffron"], ["Ethan Pierce", "Ace"], ["Zara Malik", "Stardust"],
];

const ADDRESSES = [
  "1247 Brookline Ave, Boston", "88 Lex St, Brooklyn", "42 Marina Rd, Miami",
  "9 Riverside Dr, Chicago", "501 Oak Blvd, Austin", "23 Sunset Ln, LA",
];

const STATIONS = ["Precinct 14", "Central HQ", "Eastside Division", "Harbor Station"];
const OCCUPATIONS = ["Unemployed", "Mechanic", "Trader", "Hacker", "Driver", "Freelancer", "Bartender"];

export const mockCriminals: Criminal[] = Array.from({ length: 24 }, (_, i) => {
  const [name, nickname] = NAMES[i % NAMES.length];
  const crimeType = CRIME_TYPES[i % CRIME_TYPES.length];
  const status = STATUSES[i % STATUSES.length];
  const year = 2023 + (i % 3);
  return {
    caseId: `CS-${String(1024 + i).padStart(5, "0")}`,
    criminalId: `CR-${String(7100 + i).padStart(5, "0")}`,
    name,
    nickname,
    crimeType,
    arrestDate: `${year}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
    dateOfCrime: `${year}-${String(((i + 3) % 12) + 1).padStart(2, "0")}-${String(((i + 5) % 27) + 1).padStart(2, "0")}`,
    address: ADDRESSES[i % ADDRESSES.length],
    age: 22 + ((i * 3) % 30),
    occupation: OCCUPATIONS[i % OCCUPATIONS.length],
    gender: (i % 3 === 0 ? "Female" : i % 7 === 0 ? "Other" : "Male") as Criminal["gender"],
    status,
    fatherName: "—",
    birthMark: i % 2 === 0 ? "Scar on left cheek" : "Tattoo on right arm",
    policeStation: STATIONS[i % STATIONS.length],
  };
});

export const stats = {
  totalCriminals: 1248,
  activeCases: 327,
  wantedCriminals: 86,
  solvedCases: 921,
};

export const crimesByMonth = [
  { month: "Jan", cases: 42, solved: 30 },
  { month: "Feb", cases: 58, solved: 41 },
  { month: "Mar", cases: 49, solved: 35 },
  { month: "Apr", cases: 71, solved: 52 },
  { month: "May", cases: 63, solved: 48 },
  { month: "Jun", cases: 80, solved: 61 },
  { month: "Jul", cases: 74, solved: 59 },
  { month: "Aug", cases: 88, solved: 70 },
];

export const crimeDistribution = [
  { name: "Theft", value: 312 },
  { name: "Cyber Fraud", value: 248 },
  { name: "Assault", value: 187 },
  { name: "Drug", value: 162 },
  { name: "Homicide", value: 74 },
  { name: "Other", value: 265 },
];
