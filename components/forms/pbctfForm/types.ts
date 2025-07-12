export type ParticipantData = {
  // Basic Info
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  
  // Participant Background
  experienceLevel: string;
  affiliation: string;
  affiliationName: string;
  previousCTF: string;
  ctfNames?: string;
};

export type FormData = {
  participationType: "solo" | "duo";
  participant1: ParticipantData;
  participant2?: ParticipantData;
  
  // How did you hear about CTF
  howDidYouHear: string[];
  howDidYouHearOther?: string;
  
  // Bot verification
  secretFlag: string;
  
  // Rules & Agreements
  agreeRules: boolean;
  consentLeaderboard: boolean;
  allowContact: boolean;
}; 