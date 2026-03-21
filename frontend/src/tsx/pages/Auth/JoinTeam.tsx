import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/buttons';
import { Input } from '../../components/Input';
import { StepIndicator } from '../../components/stepindicator';
import { searchCompanies } from '../../api';
import type { Company } from '../../types';
import '../../../css/auth.css';

const STEPS = [{ label: 'Choose Path' }, { label: 'Set Up' }];

export default function JoinTeam() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Company[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = await searchCompanies(query);
    setResults(data);
    setSearched(true);
    setLoading(false);
  };

  return (
    <div className="wizard-page">
      <StepIndicator steps={STEPS} currentStep={2} />

      <div className="wizard-card">
        <h1 className="wizard-title">Join a Team</h1>
        <p className="wizard-subtitle">Search by company name or team code.</p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Input
              label="Company name or team code"
              placeholder="e.g. NovaSpark or NOVA01"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" size="md" disabled={loading} style={{ marginBottom: '1rem' }}>
            {loading ? '…' : 'Search'}
          </Button>
        </form>

        {searched && (
          <div className="join-results">
            {results.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>
                No companies found. Try a different name or code.
              </p>
            ) : (
              results.map(company => (
                <div key={company.id} className="join-result-card">
                  <div className="join-result-info">
                    <span className="join-result-name">{company.name}</span>
                    <span className="join-result-meta">
                      {company.memberCount} members · {company.description}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                  >
                    Request to Join
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
