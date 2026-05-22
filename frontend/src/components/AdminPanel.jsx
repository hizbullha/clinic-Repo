import { useState, useEffect } from 'react';
import { useAppointments } from '../context/useContextHooks';
import { Users, Calendar, Plus, Trash2 } from 'lucide-react';
import AddDoctorForm from './AddDoctorForm';

const AdminPanel = () => {
  const { appointments } = useAppointments();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');

  const loadDoctorsList = async () => {
    const token = localStorage.getItem('clinic_jwt_token');

    try {
      const response = await fetch('http://localhost:5000/api/auth/doctors', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (err) {
      console.error('Failed to reload doctors directory:', err);
    }
  };


  useEffect(() => {
    const initPanel = async () => {
      setLoading(true);
      await loadDoctorsList();
      setLoading(false);
    };

    initPanel();
  }, []);

 
  const handleDeleteClick = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${name}?`
    );

    if (!confirmDelete) return;

    setDeletingId(id);

    const token = localStorage.getItem('clinic_jwt_token');

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/doctors/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setDoctors(prev => prev.filter(doc => doc.id !== id));
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while deleting');
    } finally {
      setDeletingId(null);
    }
  };


  const getSpecialty = (doc) => {
    const name = doc.name || '';

    const match = name.match(/\((.*?)\s*-/);
    if (match && match[1]) return match[1].trim();

    return 'General Physician';
  };


  const filteredDoctors =
    selectedSpecialty === 'ALL'
      ? doctors
      : doctors.filter(doc =>
          getSpecialty(doc).toLowerCase() === selectedSpecialty.toLowerCase()
        );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-muted)', color: 'var(--primary-light)' }}>
            <Users size={20} />
          </div>
          <div>
            <div className="stat-value">{loading ? '...' : filteredDoctors.length}</div>
            <div className="stat-label">Filtered Doctors</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
            <Calendar size={20} />
          </div>
          <div>
            <div className="stat-value">{appointments?.length || 0}</div>
            <div className="stat-label">Appointments</div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Medical Directory</h3>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          
          <select
            className="form-control"
            value={selectedSpecialty}
            onChange={e => setSelectedSpecialty(e.target.value)}
          >
            <option value="ALL">All Specialties</option>
            <option value="General Physician">General Physician</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Orthopedic">Orthopedic</option>
          </select>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={14} /> Onboard Staff
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Experience</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  Loading...
                </td>
              </tr>
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map(doc => (
                <tr key={doc.id} style={{ opacity: deletingId === doc.id ? 0.5 : 1 }}>
                  
                  <td style={{ fontWeight: 600 }}>{doc.name}</td>

                  <td>{getSpecialty(doc)}</td>

                  <td>{doc.experience || 'N/A'}</td>

                  <td>
                    <span className="badge badge-green">
                      {doc.status || 'Active'}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(doc.id, doc.name)}
                      className="btn btn-ghost btn-sm btn-icon"
                      style={{ color: 'red' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No doctors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showAddModal && (
        <AddDoctorForm onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default AdminPanel;