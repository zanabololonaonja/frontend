'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';

function ProfilPage() {
  const { user, updateUser} = useAuth();

 const [formData, setFormData] = useState({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  typeDon: '',       // 'ponctuel' ou 'récurrent'
  frequenceDon: '',  // 'mensuel', 'annuel', ou vide si ponctuel
  montantTotal: 0,
  datePremierDon: '',
  dateDernierDon: '',
  nombreDons: 0
});


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  // Fonction pour construire l'URL complète de l'image
  const buildImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Si c'est déjà une URL complète, la retourner telle quelle
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si c'est un chemin relatif, construire l'URL complète
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_URL}${normalizedPath}`;
  };

  // Initialiser les données du formulaire
useEffect(() => {
  if (user) {
    setFormData({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      typeDon: user.typeDon || '',
      frequenceDon: user.frequenceDon || '',
      montantTotal: user.montantTotal || 0,
      datePremierDon: user.datePremierDon || '',
      dateDernierDon: user.dateDernierDon || '',
      nombreDons: user.nombreDons || 0
    });

    if (user.photo_profil) {
      const imageUrl = buildImageUrl(user.photo_profil);
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage('');
    }
  }
}, [user]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ La photo ne doit pas dépasser 5MB');
      return;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Veuillez sélectionner une image valide');
      return;
    }

    // Preview immédiate
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload vers le serveur
    try {
      setImageLoading(true);
      setMessage('🔼 Upload de la photo en cours...');

      const uploadFormData = new FormData();
      uploadFormData.append('photo', file);

      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/upload/profile-photo/${user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData
      });

      // Vérifier d'abord si la réponse est OK
      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          const textError = await response.text();
          errorMessage = textError || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Si la réponse est OK, parser le JSON
      const data = await response.json();

      if (data.success) {
        // Construire l'URL complète pour la nouvelle image
        const newImageUrl = buildImageUrl(data.user.photo_profil);
        console.log('✅ Nouvelle image URL:', newImageUrl);
        
        // Mettre à jour l'utilisateur avec les nouvelles données
        updateUser(data.user);
        setPreviewImage(newImageUrl);
        setMessage('✅ Photo de profil mise à jour avec succès!');
      } else {
        setMessage('❌ ' + data.message);
        // Recharger l'ancienne photo en cas d'erreur
        if (user.photo_profil) {
          setPreviewImage(buildImageUrl(user.photo_profil));
        }
      }
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      setMessage('❌ Erreur lors de l\'upload de la photo: ' + error.message);
      // Recharger l'ancienne photo en cas d'erreur
      if (user.photo_profil) {
        setPreviewImage(buildImageUrl(user.photo_profil));
      }
    } finally {
      setImageLoading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage('');

      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Vérifier d'abord si la réponse est OK
      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          const textError = await response.text();
          errorMessage = textError || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Parser le JSON seulement si la réponse est OK
      const data = await response.json();

      if (data.success) {
        // Conserver la photo de profil lors de la mise à jour
        const updatedUser = {
          ...data.user,
          photo_profil: user.photo_profil
        };
        updateUser(updatedUser);
        setMessage('✅ Profil mis à jour avec succès!');
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour:', error);
      setMessage('❌ Erreur lors de la mise à jour du profil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setImageLoading(true);
      setMessage('🗑️ Suppression de la photo en cours...');
      
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/users/${user.id}/photo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      // Vérifier d'abord si la réponse est OK
      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          const textError = await response.text();
          errorMessage = textError || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Parser le JSON seulement si la réponse est OK
      const data = await response.json();

      if (data.success) {
        setPreviewImage('');
        updateUser(data.user);
        setMessage('✅ Photo de profil supprimée avec succès!');
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      console.error('❌ Erreur suppression photo:', error);
      setMessage('❌ Erreur lors de la suppression de la photo: ' + error.message);
    } finally {
      setImageLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Chargement du profil...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <br /><br /><br /><br />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>
 <Link  
                href="/admin/dashboard"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Retour au Dashboard
              </Link>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* En-tête avec photo */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-white">
  {previewImage ? (
    <img 
      src={previewImage} 
      alt="Photo de profil" 
      className="w-full h-full object-cover"
      onError={(e) => {
        console.error('❌ Erreur chargement image:', {
          src: previewImage,
          userPhoto: user?.photo_profil
        });
        // Fallback vers placeholder
        e.target.style.display = 'none';
      }}
      onLoad={() => {
        console.log('✅ Image chargée avec succès:', previewImage);
      }}
      key={previewImage} // ✅ FORCER le re-render quand l'URL change
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
      <span className="text-3xl">👤</span>
    </div>
  )}
</div>
                
                {imageLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                <label 
                  htmlFor="photo-upload" 
                  className={`absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors ${imageLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-white text-sm">📷</span>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={imageLoading}
                  />
                </label>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{formData.prenom} {formData.nom}</h2>
                <p className="text-blue-100 capitalize">{user.role}</p>
                <p className="text-blue-100">{formData.email}</p>
              </div>
            </div>
          </div>

          {/* Le reste du formulaire reste inchangé */}
          <div className="p-6">
            {message && (
              <div className={`p-4 rounded-md mb-6 ${
                message.includes('✅') ? 'bg-green-100 text-green-700 border border-green-200' : 
                message.includes('❌') ? 'bg-red-100 text-red-700 border border-red-200' :
                'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">
                    {message.includes('✅') ? '✅' : 
                     message.includes('❌') ? '❌' : 
                     message.includes('🔼') ? '🔼' :
                     message.includes('🗑️') ? '🗑️' : 'ℹ️'}
                  </span>
                  <span>{message.replace(/[✅❌🔼🗑️]/g, '').trim()}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Informations personnelles</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>
<div className="mt-6">
  <h3 className="text-xl font-semibold mb-4">Informations Donateur</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Type de don</label>
      <input
        type="text"
        value={formData.typeDon}
        readOnly
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence du don</label>
      <input
        type="text"
        value={formData.frequenceDon}
        readOnly
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Montant total donné</label>
      <input
        type="text"
        value={`${formData.montantTotal.toLocaleString()} Ar`}
        readOnly
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de dons</label>
      <input
        type="text"
        value={formData.nombreDons}
        readOnly
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Premier don</label>
      <input
        type="text"
        value={formData.datePremierDon}
        readOnly
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Dernier don</label>
      <input
        type="text"
        value={formData.dateDernierDon}
        readOnly
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
      />
    </div>
  </div>
</div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Contact et Photo</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-700 mb-2">Gestion de la photo</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Formats acceptés: JPG, PNG, GIF (max 5MB)
                    </p>
                    <div className="flex flex-col space-y-2">
                      <label 
                        htmlFor="photo-upload-main" 
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center cursor-pointer ${imageLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {imageLoading ? 'Upload en cours...' : 'Changer la photo'}
                      </label>
                      <input
                        id="photo-upload-main"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={imageLoading}
                      />
                      
                      {previewImage && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          disabled={imageLoading}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {imageLoading ? 'Suppression...' : 'Supprimer la photo'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <button
                type="submit"
                disabled={loading || imageLoading}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mise à jour en cours...</span>
                  </>
                ) : (
                  <span>Mettre à jour mon profil</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Profil() {
  return (
    <ProtectedRoute>
      <ProfilPage />
    </ProtectedRoute>
  );
}