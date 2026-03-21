export interface User {
  id?: string;
  name: string;
  email?: string;
  role?: string;
  skills: string[];
  resumeFile?: File;
}

export interface Company {
  id?: string;
  name: string;
  memberCount?: number;
  description?: string;
  teamCode?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  avatarUrl?: string;
}

export interface TechStackItem {
  name: string;
  category: string;
  reason: string;
}

export interface SkillData {
  subject: string;
  value: number;
}

export type WizardPath = 'create' | 'join';

export interface WizardState {
  path: WizardPath | null;
  profileName: string;
  profileRole: string;
  profileSkills: string[];
  resumeFile: File | null;
  teamCode: string;
}
