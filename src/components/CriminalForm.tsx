import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CriminalFormProps {
  initialData?: any;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const crimeTypes = [
  'Theft', 'Robbery', 'Murder', 'Assault', 'Fraud', 'Kidnapping',
  'Drug Trafficking', 'Cybercrime', 'Arson', 'Burglary', 'Extortion',
  'Smuggling', 'Terrorism', 'Sexual Assault', 'Other'
];

const statusOptions = ['Active', 'Wanted', 'Captured', 'Deceased', 'Released', 'Unknown'];

export const CriminalForm: React.FC<CriminalFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formState, setFormState] = useState({
    case_id: '',
    criminal_id: '',
    criminal_name: '',
    nickname: '',
    crime_type: '',
    father_name: '',
    gender: '',
    arrest_date: '',
    crime_date: '',
    address: '',
    age: '',
    occupation: '',
    birth_mark: '',
    police_station: '',
    status: 'Active',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormState({
        case_id: initialData.case_id || '',
        criminal_id: initialData.criminal_id || '',
        criminal_name: initialData.criminal_name || '',
        nickname: initialData.nickname || '',
        crime_type: initialData.crime_type || '',
        father_name: initialData.father_name || '',
        gender: initialData.gender || '',
        arrest_date: initialData.arrest_date ? initialData.arrest_date.split('T')[0] : '',
        crime_date: initialData.crime_date ? initialData.crime_date.split('T')[0] : '',
        address: initialData.address || '',
        age: initialData.age?.toString() || '',
        occupation: initialData.occupation || '',
        birth_mark: initialData.birth_mark || '',
        police_station: initialData.police_station || '',
        status: initialData.status || 'Active',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.criminal_name.trim()) {
      alert('Criminal name is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        fd.append(key, value);
      });
      if (imageFile) {
        fd.append('image', imageFile);
      }
      await onSubmit(fd);
    } catch (err) {
      console.error('Form submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(12, 16, 26, 0.7)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '5px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '20px', position: 'relative' }}>
      <button 
        onClick={onCancel}
        style={{ 
          position: 'absolute', top: '12px', right: '12px', background: 'transparent', 
          border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px'
        }}
      >
        <X size={20} />
      </button>

      <h3 style={{ 
        color: 'var(--neon-cyan)', fontFamily: 'var(--font-display)', fontSize: '1rem',
        marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px'
      }}>
        {initialData ? '✏️ Edit Criminal Record' : '➕ Add New Criminal Record'}
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Case ID</label>
            <input type="text" name="case_id" value={formState.case_id} onChange={handleChange} style={inputStyle} placeholder="e.g., CASE-2026-001" />
          </div>
          <div>
            <label style={labelStyle}>Criminal ID</label>
            <input type="text" name="criminal_id" value={formState.criminal_id} onChange={handleChange} style={inputStyle} placeholder="e.g., CR-001" />
          </div>
          <div>
            <label style={labelStyle}>Criminal Name *</label>
            <input type="text" name="criminal_name" value={formState.criminal_name} onChange={handleChange} style={inputStyle} placeholder="Full name" required />
          </div>
          <div>
            <label style={labelStyle}>Nickname</label>
            <input type="text" name="nickname" value={formState.nickname} onChange={handleChange} style={inputStyle} placeholder="Alias / Nickname" />
          </div>
          <div>
            <label style={labelStyle}>Crime Type</label>
            <select name="crime_type" value={formState.crime_type} onChange={handleChange} style={inputStyle}>
              <option value="">Select Crime Type</option>
              {crimeTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Father's Name</label>
            <input type="text" name="father_name" value={formState.father_name} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Gender</label>
            <select name="gender" value={formState.gender} onChange={handleChange} style={inputStyle}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Age</label>
            <input type="number" name="age" value={formState.age} onChange={handleChange} style={inputStyle} min="1" max="120" />
          </div>
          <div>
            <label style={labelStyle}>Arrest Date</label>
            <input type="date" name="arrest_date" value={formState.arrest_date} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Crime Date</label>
            <input type="date" name="crime_date" value={formState.crime_date} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Occupation</label>
            <input type="text" name="occupation" value={formState.occupation} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Birth Mark</label>
            <input type="text" name="birth_mark" value={formState.birth_mark} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Police Station</label>
            <input type="text" name="police_station" value={formState.police_station} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" value={formState.status} onChange={handleChange} style={inputStyle}>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ ...inputStyle, padding: '8px' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Address</label>
            <textarea name="address" value={formState.address} onChange={handleChange} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            onClick={onCancel}
            style={{
              padding: '10px 24px', background: 'transparent', border: '1px solid var(--border-color)',
              color: 'var(--text-muted)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase', fontSize: '0.85rem', transition: 'all 0.2s'
            }}
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', opacity: isSubmitting ? 0.6 : 1 }}
          >
            {isSubmitting ? 'Saving...' : (initialData ? 'Update Record' : 'Add Record')}
          </button>
        </div>
      </form>
    </div>
  );
};
