import React, { useState } from 'react';
import './SearchForm.css';

const SearchForm = ({ onSearch, loading }) => {
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');
  const [sector, setSector] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ city, department, sector });
  };

  return (
    <div className="card">
      <h2>Rechercher des prospects</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-row">
          <div className="form-group">
            <label>Ville</label>
            <input
              type="text"
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Paris, Lyon..."
            />
          </div>

          <div className="form-group">
            <label>Département</label>
            <input
              type="text"
              className="input"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Ex: 75, 69..."
            />
          </div>

          <div className="form-group">
            <label>Secteur</label>
            <input
              type="text"
              className="input"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="Ex: Commerce, Services..."
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Recherche en cours...' : 'Rechercher'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
