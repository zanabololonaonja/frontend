import React, { useState } from "react";

const Campagne = () => {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [budget, setBudget] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  
 const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("titre", titre);
  formData.append("description", description);
  formData.append("dateDebut", dateDebut);
  formData.append("dateFin", dateFin);
  formData.append("budget", budget);
  if (image) formData.append("image", image);

  try {
    setLoading(true);
    setMessage("");

    // 🔐 Récupérer le token JWT stocké après le login
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("⚠️ Vous devez être connecté pour créer une campagne.");
      setLoading(false);
      return;
    }

    const response = await fetch("http://localhost:5000/api/campagnes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ On ajoute le token ici
      },
      body: formData, // Pas besoin de Content-Type, FormData le gère automatiquement
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur serveur:", errorText);
      throw new Error("Erreur lors de la création de la campagne");
    }

    const data = await response.json();
    console.log("✅ Campagne créée :", data);

    setMessage("✅ Campagne créée avec succès !");
    // Réinitialiser le formulaire
    setTitre("");
    setDescription("");
    setDateDebut("");
    setDateFin("");
    setBudget("");
    setImage(null);
  } catch (error) {
    console.error("❌ Erreur :", error);
    setMessage("❌ Une erreur est survenue, veuillez réessayer.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-4 bg-white rounded shadow max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Créer une nouvelle campagne</h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {/* Titre */}
        <div>
          <label htmlFor="titre" className="block text-sm font-medium">Titre</label>
          <input
            type="text"
            id="titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Titre de la campagne"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Description de la campagne"
            rows={4}
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="dateDebut" className="block text-sm font-medium">Date de début</label>
            <input
              type="date"
              id="dateDebut"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="dateFin" className="block text-sm font-medium">Date de fin</label>
            <input
              type="date"
              id="dateFin"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
              required
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium">Budget</label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Budget de la campagne"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium">Image</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            className="mt-1 block w-full text-sm"
            accept="image/*"
          />
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer la campagne"}
        </button>
      </form>

      {/* Message */}
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
};

export default Campagne;
