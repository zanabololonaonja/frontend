'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaUserTie, FaPhone, FaUserCog, FaEnvelope, FaLock } from 'react-icons/fa';

import './login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
   const [formData, setFormData] = useState({
    email: "",
    password: "",
    nom: "",
    prenom: "",
    telephone: "",
    role: "donateur", // valeur par défaut
    donateurType: "", // ajouté
    nomEntreprise: "", // ajouté
    poste: "" // ajouté
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // ✅ Détecte production ou local
      const API_URL = process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:5000';
      console.log('🌐 API_URL utilisée:', API_URL);

      if (isLogin) {
        // Connexion
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });

        const data = await response.json();
        console.log('🔐 Réponse login:', data);

        if (response.ok && data.success) {
          login(data.token, data.user);
          console.log('✅ Login réussi - Redirection:', data.user.role);

          switch (data.user.role) {
            case 'admin':
              router.push('/admin/dashboard');
              break;
            case 'personnel':
              router.push(data.user.statut === 'actif' ? '/personnel/dashboard' : '/pending-validation');
              break;
            case 'donateur':
              router.push('/donateur');
              break;
            default:
              router.push('/');
          }
        } else {
          setMessage(data.message || 'Erreur de connexion');
        }
      } else {
        // Inscription
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log('🔐 Réponse inscription:', data);

        setMessage(data.message || '');
        if (response.ok && data.success && data.token && data.user) {
          login(data.token, data.user);

          if (data.user.role === 'personnel' && data.user.statut !== 'actif') {
            router.push('/pending-validation');
          } else if (data.user.role === 'donateur') {
            router.push('/donateur');
          } else {
            router.push('/');
          }
        } else {
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error('❌ Erreur auth:', error);
      setMessage('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };
  return (
<div className="min-h-screen flex items-center justify-center top-19 bg-sky-900 relative overflow-hidden"> {/* 🎨 Background shapes */}
   <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-b from-[#1845ad] to-[#23a2f6] -top-40 -left-22 opacity-70"></div> <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#7f00ff] to-[#e100ff] -bottom-40 -right-20 opacity-70"></div>
      {/* 🧊 Formulaire */}
     <form
  onSubmit={handleSubmit}
className={`relative z-10 w-full  mt-19  mb-5 max-w-md ${
  !isLogin ? 'pt-20' : 'pt-19'
} pb-10 px-10 bg-white backdrop-blur-xl border-4 border-sky-700 rounded-2xl shadow-lg text-gray-900`}

>
  {/* Logo ONG */}
  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg">
    <img src="/logoremove.png" alt="Logo ONG" className="h-24 w-24 object-contain" />
  </div>

 <h3 className="text-3xl font-bold text-center mb-1 text-sky-800">
  {isLogin ? 'Se connecter' : 'Inscription'}
</h3>


  {/* ✅ Petite phrase sous le titre */}
  <p className="text-center text-gray-600 mb-6 text-sm">
    {isLogin
      ? 'Heureux de vous revoir parmi nous 🌸'
      : "Rejoignez notre communauté et faites la différence 🌍"}
  </p>

  {/* Message */}
  {message && (
    <div
      className={`text-center mb-4 p-2 rounded-md ${
        message.includes('succès')
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {message}
    </div>
  )}

{!isLogin && (
  <>
    {/* Nom avec icône */}
    <div className="relative mb-4">
      <FaUser className="absolute left-1 top-4 text-gray-500 text-sm" />
      <input
        type="text"
        name="nom"
        placeholder="Nom"
        value={formData.nom || ""}
        onChange={handleChange}
        required
        className="w-full pl-7 p-3 bg-transparent text-gray-900 placeholder-gray-500 border-b-2 border-blue-400 focus:border-blue-600 focus:outline-none"
      />
    </div>

    {/* Prénom avec icône */}
    <div className="relative mb-4">
      <FaUserTie className="absolute left-1 top-4 text-gray-500 text-sm" />
      <input
        type="text"
        name="prenom"
        placeholder="Prénom"
        value={formData.prenom || ""}
        onChange={handleChange}
        required
        className="w-full pl-7 p-3 bg-transparent text-gray-900 placeholder-gray-500 border-b-2 border-blue-400 focus:border-blue-600 focus:outline-none"
      />
    </div>

    {/* Téléphone avec icône */}
    <div className="relative mb-4">
      <FaPhone className="absolute left-1 top-4 text-gray-500 text-sm" />
      <input
        type="tel"
        name="telephone"
        placeholder="Téléphone"
        value={formData.telephone || ""}
        onChange={handleChange}
        required
        className="w-full pl-7 p-3 bg-transparent text-gray-900 placeholder-gray-500 border-b-2 border-blue-400 focus:border-blue-600 focus:outline-none"
      />
    </div>

    {/* Rôle avec icône */}
    <div className="relative mb-4">
      <FaUserCog className="absolute left-1 top-3 text-gray-500 text-sm" />
      <select
        name="role"
        value={formData.role || ""}
        onChange={handleChange}
        required
        className="w-full pl-7 p-3 bg-transparent text-gray-900 placeholder-gray-500 border-b-2 border-blue-400 focus:border-blue-600 focus:outline-none"
      >
        <option value="">-- Sélectionnez votre rôle --</option>
        <option value="donateur">Donateur / Visiteur</option>
        <option value="personnel">Personnel</option>
      </select>
    </div>
  </>
)}

        {/* Email avec icône */}
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-1 top-4 text-gray-500 text-sm" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email || ""}
            onChange={handleChange}
            required
            className="w-full pl-7 p-3 bg-transparent text-gray-900 placeholder-gray-500 border-b-2 border-blue-400 focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* Mot de passe avec icône */}
        <div className="relative mb-6">
          <FaLock className="absolute left-1 top-4 text-gray-500 text-sm" />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password || ""}
            onChange={handleChange}
            required
            className="w-full pl-7 p-3 bg-transparent text-gray-900 placeholder-gray-500 border-b-2 border-blue-400 focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-sky-900 text-white font-semibold hover:bg-sky-800 transition"
        >
          {loading
            ? "Chargement..."
            : isLogin
            ? "Se connecter"
            : "S'inscrire"}
        </button>

        {/* Lien bas */}
        <p className="text-center mt-6 text-gray-700">
          {isLogin
            ? "Vous n'avez pas de compte ? "
            : "Vous avez déjà un compte ? "}
          <span
            className="text-blue-600 cursor-pointer font-bold  hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "S'inscrire" : "Se connecter"}
          </span>
        </p>
      </form>
     
    </div>
  );
}