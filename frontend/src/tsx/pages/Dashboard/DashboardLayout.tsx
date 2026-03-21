import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../components/avatar';
import { Badge } from '../../components/badge';
import { getTechStack, getTeam } from '../../api';
import type { TechStackItem, TeamMember, Company } from '../../types';
import '../../../css/dashboard.css';

const NAV_LINKS = [
  { icon: '⬡', label: 'Overview',   id: 'overview'  },
  { icon: '👥', label: 'Team',       id: 'team'       },
  { icon: '⚡', label: 'Tech Stack', id: 'techstack'  },
  { icon: '⚙', label: 'Settings',   id: 'settings'   },
];

export default function DashboardLayout() {
  const [activeSection, setActiveSection] = useState('overview');
  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    getTechStack().then(setTechStack);
    getTeam().then(({ company, members }) => {
      setCompany(company);
      setMembers(members);
    });
  }, []);

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo">
          <span className="brand-gradient">JumpStart</span>
        </Link>

        <nav className="sidebar-nav">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              className={`sidebar-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={() => setActiveSection(link.id)}
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <Avatar name="User" size="sm" />
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">My Account</span>
              <span className="sidebar-user-role">Founder</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main panel */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-greeting">
            Welcome back 👋
          </h1>
          <p className="dashboard-subtitle">Here's what's happening with your startup.</p>
        </div>

        {/* Team overview + Tech stack row */}
        <div className="dashboard-grid">
          {/* Team overview card */}
          <div className="dash-section-card">
            <p className="dash-section-title">Team Overview</p>
            {company ? (
              <>
                <h2 className="team-overview-name">{company.name}</h2>
                <p className="team-overview-meta">{members.length} members</p>
                <p className="team-overview-desc">{company.description}</p>
              </>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
            )}
          </div>

          {/* Tech stack */}
          <div className="dash-section-card">
            <p className="dash-section-title">Recommended Tech Stack</p>
            <div className="tech-stack-list">
              {techStack.map(item => (
                <div key={item.name} className="tech-stack-item">
                  <Badge variant="brand">{item.category}</Badge>
                  <div className="tech-stack-info">
                    <span className="tech-stack-name">{item.name}</span>
                    <span className="tech-stack-reason">{item.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radar chart placeholder */}
        <div className="dash-section-card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <p className="dash-section-title">Skill Radar Charts</p>
          <div className="radar-placeholder">
            <span className="radar-placeholder-icon">📊</span>
            <span className="radar-placeholder-text">
              Install <code>recharts</code> to enable radar charts.<br />
              Run: <code>npm install recharts</code> in the frontend directory.
            </span>
          </div>
        </div>

        {/* Members list */}
        <div className="dash-section-card">
          <p className="dash-section-title">Team Members</p>
          <div className="members-list">
            {members.map(member => (
              <div key={member.id} className="member-row">
                <Avatar name={member.name} size="md" />
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <Badge variant="tertiary">{member.role}</Badge>
                  <div className="member-skills">
                    {member.skills.map(skill => (
                      <Badge key={skill} variant="neutral">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
