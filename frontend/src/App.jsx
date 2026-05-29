import React, { useEffect, useState } from 'react'

const API = 'http://localhost:4000/api/users'

function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

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
    if (!form.name.trim() || !form.email.trim()) return

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

  function handleCancel() {
    setEditingId(null)
    setForm({ name: '', email: '' })
  }

  function handleDelete(id) {
    if (!confirm('Supprimer cet utilisateur ?')) return
    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => setUsers(users.filter(u => u.id !== id)))
  }

  return (
    <>
      {/* Header */}
      <div className="header">
        <h1>Gestion des Utilisateurs</h1>
        <p>TP6 – Express.js &amp; React.js</p>
      </div>

      <div className="container">

        {/* Formulaire */}
        <div className="card">
          <div className="card-title">
            {editingId ? '✏️ Modifier l\'utilisateur' : '➕ Nouvel utilisateur'}
          </div>
          <form onSubmit={handleSubmit} className="form">
            <input
              name="name"
              placeholder="Nom complet"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Adresse e-mail"
              value={form.email}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Enregistrer' : 'Ajouter'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                Annuler
              </button>
            )}
          </form>
        </div>

        {/* Liste des utilisateurs */}
        <div className="card">
          <div className="card-title">
            Liste des utilisateurs
            <span className="count-badge">{users.length}</span>
          </div>

          {users.length === 0 ? (
            <div className="empty">Aucun utilisateur pour le moment.</div>
          ) : (
            <ul className="users">
              {users.map(u => (
                <li key={u.id} className="user-item">
                  <div className="user-avatar">{getInitials(u.name)}</div>
                  <div className="user-info">
                    <div className="user-name">{u.name}</div>
                    <div className="user-email">{u.email}</div>
                  </div>
                  <div className="user-actions">
                    <button className="btn btn-edit" onClick={() => handleEdit(u)}>
                      Modifier
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(u.id)}>
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </>
  )
}
