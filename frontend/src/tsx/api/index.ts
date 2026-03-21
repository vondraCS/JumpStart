import type { TechStackItem, TeamMember, SkillData, Company } from '../types';

// ─── Mock data ─────────────────────────────────────────────────────────────

const MOCK_TECH_STACK: TechStackItem[] = [
  { name: 'React', category: 'Frontend', reason: 'Best fit for your team\'s JS expertise' },
  { name: 'TypeScript', category: 'Language', reason: 'Type safety across frontend and backend' },
  { name: 'Spring Boot', category: 'Backend', reason: 'Matches your Java skill set' },
  { name: 'PostgreSQL', category: 'Database', reason: 'Reliable relational DB for structured data' },
  { name: 'Docker', category: 'DevOps', reason: 'Simplifies deployment and environment parity' },
  { name: 'Railway', category: 'Hosting', reason: 'Easy zero-config deployment for early stage' },
];

const MOCK_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Alex Rivera',   role: 'Full Stack',      skills: ['React', 'Java', 'SQL'] },
  { id: '2', name: 'Jordan Lee',    role: 'Product Manager', skills: ['Roadmapping', 'Analytics', 'UX'] },
  { id: '3', name: 'Sam Patel',     role: 'Backend',         skills: ['Spring Boot', 'Docker', 'AWS'] },
  { id: '4', name: 'Casey Morgan',  role: 'Designer',        skills: ['Figma', 'CSS', 'Prototyping'] },
];

const MOCK_SKILL_DATA: Record<string, SkillData[]> = {
  '1': [
    { subject: 'Frontend',  value: 85 },
    { subject: 'Backend',   value: 75 },
    { subject: 'DevOps',    value: 50 },
    { subject: 'Design',    value: 30 },
    { subject: 'Product',   value: 40 },
  ],
  '2': [
    { subject: 'Frontend',  value: 20 },
    { subject: 'Backend',   value: 15 },
    { subject: 'DevOps',    value: 20 },
    { subject: 'Design',    value: 65 },
    { subject: 'Product',   value: 95 },
  ],
  '3': [
    { subject: 'Frontend',  value: 30 },
    { subject: 'Backend',   value: 90 },
    { subject: 'DevOps',    value: 80 },
    { subject: 'Design',    value: 15 },
    { subject: 'Product',   value: 35 },
  ],
  '4': [
    { subject: 'Frontend',  value: 70 },
    { subject: 'Backend',   value: 10 },
    { subject: 'DevOps',    value: 15 },
    { subject: 'Design',    value: 95 },
    { subject: 'Product',   value: 55 },
  ],
};

const MOCK_COMPANIES: Company[] = [
  { id: 'c1', name: 'NovaSpark',  memberCount: 4, description: 'AI-powered analytics platform',     teamCode: 'NOVA01' },
  { id: 'c2', name: 'BuildFlow',  memberCount: 3, description: 'No-code workflow automation',        teamCode: 'BFLO22' },
  { id: 'c3', name: 'GreenRoute', memberCount: 6, description: 'Sustainable logistics optimization', teamCode: 'GRN99' },
];

// ─── Placeholder API functions ──────────────────────────────────────────────

export async function getTechStack(): Promise<TechStackItem[]> {
  await delay(400);
  return MOCK_TECH_STACK;
}

export async function getMembers(): Promise<TeamMember[]> {
  await delay(350);
  return MOCK_MEMBERS;
}

export async function getMemberSkills(memberId: string): Promise<SkillData[]> {
  await delay(300);
  return MOCK_SKILL_DATA[memberId] ?? [];
}

export async function searchCompanies(query: string): Promise<Company[]> {
  await delay(300);
  const q = query.toLowerCase();
  return MOCK_COMPANIES.filter(
    c => c.name.toLowerCase().includes(q) || c.teamCode?.toLowerCase().includes(q)
  );
}

export async function register(_data: object): Promise<{ success: boolean }> {
  await delay(600);
  return { success: true };
}

export async function login(_email: string, _password: string): Promise<{ success: boolean }> {
  await delay(500);
  return { success: true };
}

export async function getTeam(): Promise<{ company: Company; members: TeamMember[] }> {
  await delay(400);
  return { company: MOCK_COMPANIES[0], members: MOCK_MEMBERS };
}

// ─── Util ───────────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
