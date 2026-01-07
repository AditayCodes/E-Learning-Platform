import { useEffect, useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ title:'', slug:'', description:'', price:0, category:'', difficulty:'Beginner' });
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
    alert('Course created');
    setFormData({ title:'', slug:'', description:'', price:0, category:'', difficulty:'Beginner' });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin Panel</h2>
      <form className="mb-5" onSubmit={handleCreate}>
        <div className="row g-3">
          <div className="col-md-6"><input className="form-control" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required/></div>
          <div className="col-md-6"><input className="form-control" name="slug" placeholder="Slug" value={formData.slug} onChange={handleChange} required/></div>
          <div className="col-12"><textarea className="form-control" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required/></div>
          <div className="col-md-4"><input className="form-control" type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required/></div>
          <div className="col-md-4"><input className="form-control" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required/></div>
          <div className="col-md-4">
            <select className="form-select" name="difficulty" value={formData.difficulty} onChange={handleChange}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Create Course</button>
      </form>

      <div className="row g-4">
        {courses.map(course => (
          <div className="col-lg-4 col-md-6" key={course._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text flex-grow-1">{course.description}</p>
                <p><strong>Category:</strong> {course.category} | <strong>Difficulty:</strong> {course.difficulty}</p>
                <p><strong>Price:</strong> ${course.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
