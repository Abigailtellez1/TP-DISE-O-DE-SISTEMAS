import './App.css'
import { API_BASE_URL } from './api/client'

const featureCards = [
  {
    title: 'User profiles',
    detail: 'Create/update student profiles with email, name, and bedroom preferences.',
  },
  {
    title: 'Listings',
    detail:
      'Browse, create, edit, and delete listings with pagination so we can manage inventory.',
  },
  {
    title: 'Reviews',
    detail: 'Students can rate a listing (1-5) and leave a comment tied to a user.',
  },
  {
    title: 'Notifications',
    detail: 'When a listing matches a preferred bedroom count, show it in the user inbox.',
  },
]

function App() {
  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">UTN · Alojamiento Estudiantil</p>
          <h1>Frontend workbench for the Airbnb-style backend</h1>
          <p className="lede">
            We will add pages for users, listings, reviews, and notifications, all calling the live
            Spring Boot API.
          </p>
        </div>
        <div className="env-tag">
          Backend: <code>{API_BASE_URL}</code>
        </div>
      </header>

      <section className="card-grid">
        {featureCards.map((card) => (
          <article key={card.title} className="feature-card">
            <h2>{card.title}</h2>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="next-steps">
        <h3>Next steps</h3>
        <ol>
          <li>Wire the API client and typed endpoints.</li>
          <li>Build the User Profile page (read/upsert + notifications).</li>
          <li>Add Listings CRUD with pagination, then Reviews.</li>
        </ol>
      </section>
    </div>
  )
}

export default App
