import { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', price: 0, category: '', difficulty: 'Beginner'
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/courses', formData, { headers: { Authorization: `Bearer ${token}` } });
      setCourses(prev => [...prev, res.data]);
      setFormData({ title: '', slug: '', description: '', price: 0, category: '', difficulty: 'Beginner' });
      alert('Course created!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await API.delete(`/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="container">Loading courses...</p>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Admin Panel</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: '2rem' }}>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input type="text" name="slug" placeholder="Slug" value={formData.slug} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button className="primary" type="submit">Create Course</button>
      </form>

      <div className="course-list">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Category: {course.category} | Difficulty: {course.difficulty}</p>
            <p>Price: ${course.price}</p>
            <button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDelete(course._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
