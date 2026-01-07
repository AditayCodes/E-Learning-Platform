import { useEffect, useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', price: 0, category: '', difficulty: 'Beginner'
  });
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
    const fetchCourses = async () => {
      const res = await API.get('/courses');
      setCourses(res.data);
    };
    fetchCourses();
  }, [navigate, user]);

  const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value});
  const handleCreate = async e => {
    e.preventDefault();
    await API.post('/courses', formData, { headers: { Authorization: `Bearer ${token}` } });
    alert('Course created!');
    setFormData({ title: '', slug: '', description: '', price: 0, category: '', difficulty: 'Beginner' });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark">Admin Panel</h2>

      {/* Create Course Form */}
      <form className="mb-5" onSubmit={handleCreate}>
        <div className="row g-3">
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Slug" name="slug" value={formData.slug} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <textarea className="form-control" placeholder="Description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <input type="number" className="form-control" placeholder="Price" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Category" name="category" value={formData.category} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <select className="form-select" name="difficulty" value={formData.difficulty} onChange={handleChange}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3 shadow-sm"
                style={{transition:"transform 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          Create Course
        </button>
      </form>

      {/* Courses List */}
      <div className="row g-4">
        {courses.map(course => (
          <div className="col-lg-4 col-md-6" key={course._id}>
            <div className="card h-100 shadow-sm border-0 bg-white"
                 style={{transition:"transform 0.3s, box-shadow 0.3s"}}
                 onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="0 10px 25px rgba(0,0,0,0.15)"}}
                 onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 10px rgba(0,0,0,0.1)"}}>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{course.title}</h5>
                <p className="card-text flex-grow-1">{course.description}</p>
                <div className="mb-2">
                  <span className="badge bg-secondary me-1">{course.category}</span>
                  <span className="badge bg-info text-dark">{course.difficulty}</span>
                </div>
                <p className="fw-bold">Price: ${course.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
