import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/hcmut.png';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('Pending'); 

  // Dữ liệu mẫu (Có thêm Priority và Assigned Date)
  const [jobs, setJobs] = useState([
    { id: 'REQ-2025-001', location: 'H6-402', desc: 'AC not cooling', priority: 'High', status: 'In Progress', assignedDate: '10/11/2025' },
    { id: 'REQ-2025-005', location: 'B4-Hall', desc: 'Projector broken', priority: 'Urgent', status: 'New', assignedDate: '12/11/2025' }, 
    { id: 'REQ-2025-008', location: 'C4-101', desc: 'Door jammed', priority: 'Low', status: 'Resolved', assignedDate: '05/11/2025' },
    { id: 'REQ-2025-009', location: 'A4-301', desc: 'Fan making noise', priority: 'Medium', status: 'New', assignedDate: '13/11/2025' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', note: '' });

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'technician') navigate('/');
    setUserName(localStorage.getItem('name') || 'Technician');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const openModal = (job) => {
    setSelectedJob(job);
    setUpdateForm({ status: job.status === 'New' ? 'In Progress' : job.status, note: '' });
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    if (updateForm.status === 'Resolved' && updateForm.note.trim().length < 10) {
      alert('Resolution Note must be at least 10 characters for Resolved status (UC-08).');
      return;
    }

    const updatedJobs = jobs.map(job => 
      job.id === selectedJob.id ? { ...job, status: updateForm.status } : job
    );
    setJobs(updatedJobs);
    setIsModalOpen(false);
    alert(`Ticket ${selectedJob.id} updated to ${updateForm.status}!`);
  };

  // --- Logic lọc và SẮP XẾP theo Tabs (UC-07) ---
  const getFilteredAndSortedJobs = () => {
    // 1. Lọc theo Tab
    let filtered = jobs.filter(job => {
      if (activeTab === 'Pending') return job.status === 'New';
      return job.status === activeTab;
    });

    // 2. TỐI ƯU 2: Sắp xếp theo Priority (Urgent > High > Medium > Low)
    const priorityWeight = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
    
    return filtered.sort((a, b) => {
      // So sánh độ ưu tiên trước
      const weightDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (weightDiff !== 0) return weightDiff;
      // Nếu cùng độ ưu tiên thì cái nào giao trước làm trước (Assigned Date)
      return new Date(a.assignedDate) - new Date(b.assignedDate);
    });
  };

  const displayedJobs = getFilteredAndSortedJobs();

  // Style cho Tab
  const tabStyle = (tabName) => ({
    padding: '10px 20px',
    background: 'none',
    border: 'none',
    borderBottom: activeTab === tabName ? '2px solid #034ea2' : '2px solid transparent',
    color: activeTab === tabName ? '#034ea2' : '#666',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px'
  });

  return (
    <div>
      <div className="main-header">
        <div className="header-top">
          <div className="container">
            <div className="header-logo-section">
              <img src={logo} alt="HCMUT" className="header-logo" />
              <div>
                <div className="header-title">HCMUT FACILITY</div>
                <div className="header-subtitle">Maintenance Management System</div>
              </div>
            </div>
            <div className="user-info">
              <span style={{marginRight: '10px'}}>Welcome, <strong>{userName}</strong></span>
              <button onClick={handleLogout} className="logout-button">LOGOUT</button>
            </div>
          </div>
        </div>
        
        <div className="main-nav">
          <div className="nav-container">
            <button className="nav-item active">Assigned Jobs</button>
          </div>
        </div>
      </div>

      <main className="container">
        <div className="content-card">
          <h3 style={{color: '#034ea2', marginBottom: '15px'}}>My Tasks</h3>
          
          <div style={{display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '20px'}}>
            <button style={tabStyle('Pending')} onClick={() => setActiveTab('Pending')}>
              Pending ({jobs.filter(j => j.status === 'New').length})
            </button>
            <button style={tabStyle('In Progress')} onClick={() => setActiveTab('In Progress')}>
              In Progress ({jobs.filter(j => j.status === 'In Progress').length})
            </button>
            <button style={tabStyle('Resolved')} onClick={() => setActiveTab('Resolved')}>
              Completed ({jobs.filter(j => j.status === 'Resolved').length})
            </button>
          </div>

          <table className="ticket-table">
            <thead>
              <tr><th>ID</th><th>Priority</th><th>Location</th><th>Description</th><th>Assigned Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {displayedJobs.map(job => (
                <tr key={job.id}>
                  <td style={{fontWeight: 'bold', color: '#034ea2'}}>{job.id}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '11px',
                      background: job.priority === 'Urgent' ? '#ffebee' : (job.priority === 'High' ? '#fff3e0' : '#f5f5f5'),
                      color: job.priority === 'Urgent' ? '#d32f2f' : (job.priority === 'High' ? '#ef6c00' : 'black'),
                      fontWeight: 'bold', border: '1px solid #eee'
                    }}>
                      {job.priority}
                    </span>
                  </td>
                  <td>{job.location}</td>
                  <td>{job.desc}</td>
                  <td style={{fontSize: '12px', color: '#666'}}>{job.assignedDate}</td>
                  <td>
                    {job.status !== 'Resolved' ? (
                      <button 
                        className="btn-primary" 
                        style={{padding: '5px 10px', fontSize: '11px', width: 'auto'}}
                        onClick={() => openModal(job)}
                      >
                        Update
                      </button>
                    ) : (
                      <span style={{color: 'green', fontSize: '12px', fontWeight: 'bold'}}>✓ Done</span>
                    )}
                  </td>
                </tr>
              ))}
              {displayedJobs.length === 0 && <tr><td colspan="6" style={{textAlign: 'center', padding: '20px', color: '#999'}}>No jobs in this tab.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{color: '#034ea2', marginBottom: '20px'}}>Update Status</h3>
            
            <div style={{background: '#f8f9fa', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px'}}>
              <strong>ID:</strong> {selectedJob?.id} <br/>
              <strong>Issue:</strong> {selectedJob?.desc} <br/>
              <strong>Priority:</strong> {selectedJob?.priority}
            </div>

            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label>New Status</label>
                <select 
                  value={updateForm.status} 
                  onChange={e => setUpdateForm({...updateForm, status: e.target.value})}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>
                  Resolution Note 
                  {updateForm.status === 'Resolved' && <span style={{color:'red', marginLeft:'5px'}}>* (Min 30 chars)</span>}
                </label>
                <textarea 
                  rows="3" 
                  placeholder={updateForm.status === 'Resolved' ? "Describe detail work done..." : "Add notes (Optional)..."}
                  value={updateForm.note}
                  onChange={e => setUpdateForm({...updateForm, note: e.target.value})}
                ></textarea>
              </div>
              
              <div className="modal-buttons">
                <button type="submit" className="btn-primary" style={{flex: 1}}>Save</button>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{flex: 1}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;