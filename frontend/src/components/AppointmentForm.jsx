import { useState, useEffect } from 'react';
import { useAppointments } from '../context/useContextHooks'; 
import { STATUS } from '../context/AuthTypes'; 
import { X, ChevronRight } from 'lucide-react';

const AppointmentForm = ({ onClose, existing }) => {
  const { bookAppointment, updateAppointmentStatus } = useAppointments();

  const [activeDoctors, setActiveDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [error, setError] = useState('');

  // 🟢 NEW FILTER STATE
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');

  const [formData, setFormData] = useState({
    doctorId: existing ? existing.doctorId : '',
    date: existing ? existing.date : '',
    time: existing ? existing.time : '',
    reason: existing ? existing.reason : '',
  });

  /**
   * FETCH DOCTORS
   */
  useEffect(() => {
    const fetchSystemDoctors = async () => {
      const token = localStorage.getItem('clinic_jwt_token');

      try {
        setLoadingDoctors(true);

        const response = await fetch(
          'http://localhost:5000/api/auth/doctors',
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setActiveDoctors(data);

          if (!existing && data.length > 0) {
            setFormData(prev => ({
              ...prev,
              doctorId: data[0].id
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load doctors:', err);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchSystemDoctors();
  }, [existing]);

  /**
   * 🟢 FILTER LOGIC
   */
  const filteredDoctors =
    selectedSpecialty === 'ALL'
      ? activeDoctors
      : activeDoctors.filter(
          d =>
            (d.specialty || 'General Physician') ===
            selectedSpecialty
        );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.date ||
      !formData.time ||
      !formData.doctorId ||
      !formData.reason.trim()
    ) {
      setError('Please fill out all fields.');
      return;
    }

    const payload = {
      doctorId: parseInt(formData.doctorId, 10),
      reason: formData.reason,
      appointmentDate: formData.date,
      appointmentTime: formData.time
    };

    if (existing) {
      const result = await updateAppointmentStatus(existing.id, {
        status: STATUS.COMPLETED
      });

      if (result.success) onClose();
      else setError(result.error);
    } else {
      const result = await bookAppointment(payload);

      if (result.success) onClose();
      else setError(result.error);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {existing ? 'Update Status' : 'Book Appointment'}
            </h2>
          </div>

          <button onClick={onClose} className="icon-btn">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ color: 'red', padding: '10px 24px' }}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          {/* 🟢 SPECIALTY FILTER */}
          {!existing && (
            <div className="form-group">
              <label className="form-label">
                Filter by Specialty
              </label>

              <select
                className="form-control"
                value={selectedSpecialty}
                onChange={e =>
                  setSelectedSpecialty(e.target.value)
                }
              >
                <option value="ALL">All Specialties</option>
                <option value="General Physician">
                  General Physician
                </option>
                <option value="Dermatologist">
                  Dermatologist
                </option>
                <option value="Pediatrician">
                  Pediatrician
                </option>
                <option value="Orthopedic">
                  Orthopedic
                </option>
              </select>
            </div>
          )}

          {/* DOCTOR SELECT */}
          {!existing && (
            <div className="form-group">
              <label className="form-label">
                Select Practitioner
              </label>

              <select
                className="form-control"
                value={formData.doctorId}
                onChange={e =>
                  setFormData(p => ({
                    ...p,
                    doctorId: e.target.value
                  }))
                }
                disabled={loadingDoctors}
              >
                {loadingDoctors ? (
                  <option>Loading doctors...</option>
                ) : filteredDoctors.length > 0 ? (
                  filteredDoctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))
                ) : (
                  <option>No doctors found</option>
                )}
              </select>
            </div>
          )}

          {/* DATE + TIME */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}
          >
            <input
              type="date"
              className="form-control"
              value={formData.date}
              onChange={e =>
                setFormData(p => ({
                  ...p,
                  date: e.target.value
                }))
              }
            />

            <input
              type="time"
              className="form-control"
              value={formData.time}
              onChange={e =>
                setFormData(p => ({
                  ...p,
                  time: e.target.value
                }))
              }
            />
          </div>

          {/* REASON */}
          <input
            type="text"
            className="form-control"
            placeholder="Reason"
            value={formData.reason}
            onChange={e =>
              setFormData(p => ({
                ...p,
                reason: e.target.value
              }))
            }
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              !existing && filteredDoctors.length === 0
            }
          >
            {existing ? 'Complete' : 'Book'}
            <ChevronRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;