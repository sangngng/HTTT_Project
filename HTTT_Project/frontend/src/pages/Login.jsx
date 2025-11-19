import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/hcmut.png'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra nếu đã đăng nhập thì chuyển trang luôn
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'student') navigate('/student');
    if (role === 'technician') navigate('/technician');
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Giả lập gọi API
    setTimeout(() => {
      // Validate đuôi email
      if (!email.endsWith('@hcmut.edu.vn')) {
        setError('Please use official HCMUT email (@hcmut.edu.vn)');
        setIsLoading(false);
        return;
      }

      // Mock Login Logic
      if (email === 'student@hcmut.edu.vn') {
        localStorage.setItem('role', 'student');
        localStorage.setItem('name', 'Student');
        navigate('/student');
      } else if (email === 'tech@hcmut.edu.vn') {
        localStorage.setItem('role', 'technician');
        localStorage.setItem('name', 'Technician');
        navigate('/technician');
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="login-wrapper">
      <div className="login-overlay"></div>
      
      <div className="login-box">
        <img src={logo} alt="HCMUT Logo" style={{ width: '80px', marginBottom: '15px' }} />
        
        <h2 style={{ color: '#034ea2', fontWeight: 'bold', marginBottom: '5px', textTransform: 'uppercase', fontSize: '18px' }}>
          Facility Maintenance
        </h2>
        <p style={{ color: '#666', marginBottom: '25px', fontSize: '13px' }}>
          Ho Chi Minh City University of Technology
        </p>

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label>HCMUT Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="first.last@hcmut.edu.vn" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>
          
          {error && (
            <div style={{ 
              color: '#d32f2f', 
              background: '#ffebee', 
              padding: '10px', 
              borderRadius: '3px', 
              fontSize: '12px', 
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          <button type="submit" className="btn-primary" disabled={isLoading} style={{width: '100%'}}>
            {isLoading ? 'Authenticating...' : 'LOGIN (CENTRAL AUTH)'}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '11px', color: '#999', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          &copy; 2025 Data Center & Software Technology
        </div>
      </div>
    </div>
  );
};

export default Login;