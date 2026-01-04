import { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 0,
    category: '',
    difficulty: 'Beginner',
    thumbnailUrl: '',
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
  }, [user, navigate]);

  // Fetch all courses
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

  // Handle input change
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle course create
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/courses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(prev => [...prev, res.data]);
      setFormData({
        title: '',
        slug: '',
        description: '',
        price: 0,
        category: '',
        difficulty: 'Beginner',
        thumbnailUrl: '',
      });
      alert('Course created successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create course');
    }
  };

  // Handle delete course
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await API.delete(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(prev => prev.filter(c => c._id !== id));
      alert('Course deleted successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="container">
      <h2>Admin Panel</h2>

      <h3>Create New Course</h3>
      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
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
        <input type="text" name="thumbnailUrl" placeholder="Thumbnail URL" value={formData.thumbnailUrl} onChange={handleChange} />
        <button type="submit">Create Course</button>
      </form>

      <h3>Existing Courses</h3>
      <ul>
        {courses.map(course => (
          <li key={course._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
            <h4>{course.title}</h4>
            <p>{course.description}</p>
            <p>Category: {course.category} | Difficulty: {course.difficulty}</p>
            <p>Price: ${course.price}</p>
            <button onClick={() => handleDelete(course._id)} style={{ backgroundColor: 'red', color: 'white', padding: '0.3rem 0.6rem', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
