import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/buttons';
import { Input } from '../../components/Input';
import { StepIndicator } from '../../components/stepindicator';
import { useWizard } from '../../context/WizardContext';
import { register } from '../../api';
import '../../../css/auth.css';

const STEPS = [{ label: 'Choose Path' }, { label: 'Set Up' }];

export default function CreateProfile() {
  const navigate = useNavigate();
  const { state, setProfileField } = useWizard();
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addSkill = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !state.profileSkills.includes(trimmed)) {
      setProfileField('profileSkills', [...state.profileSkills, trimmed]);
    }
    setTagInput('');
  };

  const removeSkill = (skill: string) => {
    setProfileField('profileSkills', state.profileSkills.filter(s => s !== skill));
  };

  const handleFile = (file: File | null | undefined) => {
    if (file) setProfileField('resumeFile', file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await register({ ...state });
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="wizard-page">
      <StepIndicator steps={STEPS} currentStep={2} />

      <div className="wizard-card">
        <h1 className="wizard-title">Create Your Profile</h1>
        <p className="wizard-subtitle">Tell us about yourself so we can assign the right role.</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={state.profileName}
            onChange={e => setProfileField('profileName', e.target.value)}
            required
          />
          <Input
            label="Role / Title"
            placeholder="e.g. Full Stack Engineer"
            value={state.profileRole}
            onChange={e => setProfileField('profileRole', e.target.value)}
            required
          />

          {/* Tag input */}
          <div className="input-group">
            <label className="input-label">Skills</label>
            <div className="tag-input-wrapper">
              {state.profileSkills.map(skill => (
                <span key={skill} className="tag-chip">
                  {skill}
                  <button type="button" className="tag-remove" onClick={() => removeSkill(skill)}>×</button>
                </span>
              ))}
              <input
                className="tag-text-input"
                placeholder="Type a skill and press Enter…"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
                }}
              />
            </div>
          </div>

          {/* File upload */}
          <div className="input-group">
            <label className="input-label">Resume (optional)</label>
            <div
              className={`file-upload-zone ${dragOver ? 'drag-over' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            >
              {state.resumeFile ? (
                <span className="file-upload-selected">📄 {state.resumeFile.name}</span>
              ) : (
                <>
                  <span className="file-upload-icon">📎</span>
                  <span className="file-upload-text">
                    <span>Click to upload</span> or drag and drop
                  </span>
                  <span className="file-upload-hint">PDF, DOC up to 5 MB</span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files?.[0])}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? 'Creating profile…' : 'Create My Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
}
