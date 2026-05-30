export interface GangInfo {
  id: string;
  name: string;
  type: 'CIVIL' | 'PIPELINE' | 'E&M' | 'MIXED';
}

export const GANGS: GangInfo[] = [
  { id: "g1", name: "Ramkumar Gang", type: "CIVIL" },
  { id: "g2", name: "Suresh Construction", type: "CIVIL" },
  { id: "g3", name: "Local Gang 1", type: "MIXED" },
  { id: "g4", name: "External Fitters", type: "PIPELINE" },
  { id: "g5", name: "Other", type: "MIXED" }
];

export const getGangNames = () => GANGS.map(g => g.name);
