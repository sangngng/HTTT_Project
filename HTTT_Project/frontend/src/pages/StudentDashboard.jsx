import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/hcmut.png';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');
  const [userName, setUserName] = useState('');

  // --- DỮ LIỆU MẪU (Thêm trường Priority như UC-06 mô tả) ---
  const [myIssues, setMyIssues] = useState([
    { 
      id: 'REQ-2025-001', 
      location: 'H6-402', 
      type: 'Electrical', 
      priority: 'High', // Thêm priority
      status: 'In Progress', 
      date: '12/11/2025',
      image: null 
    }
  ]);

  // --- STATE CHO FORM & FILTER ---
  // UC-03: Thêm priority mặc định là Medium
  const [formData, setFormData] = useState({ location: '', type: '', description: '', priority: 'Medium' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // UC-05: Thêm các state cho bộ lọc và tìm kiếm
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'student') navigate('/');
    setUserName(localStorage.getItem('name') || 'Student');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // UC-03: Validate Description >= 20 ký tự
    if (formData.description.length < 20) {
      alert('Description must be at least 20 characters.');
      return;
    }

    const newIssue = {
      id: `REQ-2025-${Math.floor(100 + Math.random() * 900)}`,
      location: formData.location,
      type: formData.type,
      priority: formData.priority, 
      status: 'New',
      date: new Date().toLocaleDateString('en-GB'),
      image: imagePreview 
    };

    setMyIssues([newIssue, ...myIssues]);
    alert('Request submitted successfully!');
    
    setFormData({ location: '', type: '', description: '', priority: 'Medium' });
    setSelectedImage(null);
    setImagePreview(null);
    setActiveTab('list');
  };

  // --- UC-05 LOGIC LỌC & TÌM KIẾM ---
  const filteredIssues = myIssues.filter(issue => {
    const matchStatus = filterStatus === 'All' || issue.status === filterStatus;
    const matchCategory = filterCategory === 'All' || issue.type === filterCategory;
    const matchSearch = issue.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        issue.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchCategory && matchSearch;
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
            <button className={`nav-item ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>New Request</button>
            <button className={`nav-item ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>Request History</button>
          </div>
        </div>
      </div>

      <main className="container">
        {/* === UC-03: TẠO PHIẾU === */}
        {activeTab === 'create' && (
          <div className="content-card">
            <h3 style={{color: '#034ea2', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px'}}>Report an Issue</h3>
            <form onSubmit={handleSubmit}>
              {/* UC-03: Location Dropdown */}
              <div className="form-group">
                <label>Location (Building - Room) *</label>
                <input type="text" required placeholder="Ex: H6 - 402" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              
              {/* UC-03: Category Dropdown */}
              <div className="form-group">
                <label>Issue Category *</label>
                <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="">-- Select Category --</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* UC-03: Priority Level (Radio Buttons) */}
              <div className="form-group">
                <label>Priority Level *</label>
                <div style={{display: 'flex', gap: '20px', marginTop: '5px'}}>
                  {['Low', 'Medium', 'High', 'Urgent'].map(level => (
                    <label key={level} style={{fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}>
                      <input 
                        type="radio" 
                        name="priority" 
                        value={level} 
                        checked={formData.priority === level}
                        onChange={e => setFormData({...formData, priority: e.target.value})}
                        style={{width: 'auto', margin: 0}}
                      /> {level}
                    </label>
                  ))}
                </div>
              </div>

              {/* UC-03: Description (Min 20 chars) */}
              <div className="form-group">
                <label>Description * (Min 20 characters)</label>
                <textarea 
                  required 
                  rows="3" 
                  placeholder="Describe the issue..." 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              {/* UC-04: Attach Photo */}
              <div className="form-group">
                <label>Evidence Photo (Optional)</label>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{border: '1px dashed #ccc', padding: '20px'}}/>
                {imagePreview && <img src={imagePreview} alt="Preview" style={{maxHeight: '100px', marginTop: '10px', borderRadius: '4px'}} />}
              </div>
              
              <button className="btn-primary">Submit Request</button>
            </form>
          </div>
        )}

        {/* === UC-05: DANH SÁCH === */}
        {activeTab === 'list' && (
          <div className="content-card">
            <h3 style={{color: '#034ea2', marginBottom: '15px'}}>My Requests</h3>
            
            {/* UC-05: Search & Filters Tools */}
            <div style={{display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap'}}>
              {/* Search Box */}
              <input 
                type="text" 
                placeholder="Search ID or Location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{flex: 2, minWidth: '200px'}}
              />
              {/* Category Filter */}
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{flex: 1}}>
                <option value="All">All Categories</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="HVAC">HVAC</option>
                <option value="Furniture">Furniture</option>
              </select>
              {/* Status Filter */}
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{flex: 1}}>
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <table className="ticket-table">
              <thead>
                <tr><th>ID</th><th>Location</th><th>Category</th><th>Priority</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {filteredIssues.map(issue => (
                  <tr key={issue.id}>
                    <td style={{fontWeight: 'bold', color: '#034ea2'}}>{issue.id}</td>
                    <td>{issue.location}</td>
                    <td>{issue.type}</td>
                    <td>
                      <span style={{
                        color: issue.priority === 'Urgent' ? 'red' : (issue.priority === 'High' ? 'orange' : 'black'),
                        fontWeight: issue.priority === 'Urgent' ? 'bold' : 'normal'
                      }}>
                        {issue.priority}
                      </span>
                    </td>
                    <td><span className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>{issue.status}</span></td>
                    <td>{issue.date}</td>
                  </tr>
                ))}
                 {filteredIssues.length === 0 && <tr><td colspan="6" style={{textAlign: 'center', padding: '20px', color: '#999'}}>No requests found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;