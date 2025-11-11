'use client';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ListeCampagnes() {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCampagnes = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/campagnes');
      const data = await res.json();
      if (data.success) {
  const now = new Date();
  const campagnesActives = data.campagnes.filter(c => new Date(c.date_fin) >= now);
  setCampagnes(campagnesActives);
}

      if (data.success) {
        
        setCampagnes(data.campagnes);
      } else {
        setMessage('❌ Impossible de récupérer les campagnes');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Erreur lors de la récupération');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampagnes();
  }, []);

const handleDelete = async (id) => {
  if (!confirm('Voulez-vous vraiment supprimer cette campagne ?')) return;

  try {
    const token = localStorage.getItem('token'); // ou depuis ton contexte Auth
    const res = await fetch(`http://localhost:5000/api/campagnes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data.success) {
      setCampagnes(campagnes.filter(c => c.id !== id));
      setMessage('✅ Campagne supprimée avec succès');
    } else {
      setMessage(`❌ ${data.message || 'Impossible de supprimer la campagne'}`);
    }
  } catch (err) {
    console.error(err);
    setMessage('❌ Erreur lors de la suppression');
  }
};

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Liste des Campagnes</h2>
      {message && <p className="mb-4">{message}</p>}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Titre</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Date début</th>
              <th className="p-2 border">Date fin</th>
              <th className="p-2 border">Budget</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">État</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campagnes.map((campagne, index) => (
              <tr key={campagne.id} className="text-center border-t">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{campagne.titre}</td>
                <td className="p-2 border">{campagne.description}</td>
                <td className="p-2 border">{new Date(campagne.date_debut).toLocaleDateString()}</td>
                <td className="p-2 border">{new Date(campagne.date_fin).toLocaleDateString()}</td>
                <td className="p-2 border">{campagne.budget} Ar</td>
                <td className="p-2 border">
                  {campagne.image && (
                    <img 
                      src={`http://localhost:5000/uploads/campagnes/${campagne.image}`} 
                      alt={campagne.titre} 
                      className="h-12 mx-auto"
                    />
                  )}
                </td>
                <td className="p-2 border">
  {new Date(campagne.date_fin) < new Date() ? 'Expirée' : 'Active'}
</td>

                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(campagne.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
