import React, { useEffect, useState } from 'react'

const API = 'http://localhost:4000/api/users'

export default function App() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', email: '' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(setUsers)
      .catch(console.error)
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      fetch(`${API}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(r => r.json())
        .then(updated => {
          setUsers(users.map(u => (u.id === updated.id ? updated : u)))
          setForm({ name: '', email: '' })
          setEditingId(null)
        })
    } else {
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(r => r.json())
        .then(newUser => {
          setUsers([...users, newUser])
          setForm({ name: '', email: '' })
        })
    }
  }

  function handleEdit(user) {
    setEditingId(user.id)
    setForm({ name: user.name, email: user.email })
  }

  function handleDelete(id) {
    if (!confirm('Delete this user?')) return
    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => setUsers(users.filter(u => u.id !== id)))
  }

  return (
    <div className="container">
      <h1>Users CRUD</h1>
      <form onSubmit={handleSubmit} className="form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', email: '' }) }}>Cancel</button>}
      </form>

      <ul className="users">
        {users.map(u => (
          <li key={u.id} className="user">
            <div>
              <strong>{u.name}</strong>
              <div>{u.email}</div>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(u)}>Edit</button>
              <button onClick={() => handleDelete(u.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
