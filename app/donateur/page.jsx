"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import FaireDonContent from "../components/FaireDonContent";
import { Menu } from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from "xlsx";


import {
  FileText,
  Bell,
  List,
  User,
  LogOut as LogoutIcon,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Heart,
} from "lucide-react";

import "./Dashboard.css";

export default function DonateurPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userInfo = JSON.parse(atob(token.split(".")[1]));
      setUserData(userInfo);
    }
  }, []);

  const handleMenuClick = (item) => {
    if (item.isLogout) {
      localStorage.removeItem("token");
      router.push("/");
      return;
    }

    if (item.key === "profil") {
      router.push("/profil");
      return;
    }

    setActiveTab(item.key);
  };

  const menuItems = [
    { name: "Tableau de bord", icon: FileText, key: "dashboard" },
    { name: "Campagnes", icon: List, key: "campagnes" },
    { name: "Notifications", icon: Bell, key: "notifications" },
   { name: "Historique des dons", icon: Heart, key: "historique" },

    { name: "Profil", icon: User, key: "profil" },
    { name: "Déconnexion", icon: LogoutIcon, key: "logout", isLogout: true },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "campagnes":
        return <CampagnesContent setActiveTab={setActiveTab} />;
      case "notifications":
        return <NotificationsContent />;
   case "historique":
  return <HistoriqueDonsContent userEmail={userData?.email} />;



      default:
        return <DashboardContent />;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userInfo = JSON.parse(atob(token.split(".")[1]));
      const fetchUserData = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/users/${userInfo.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success) setUserData(data.user);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUserData();
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* === MENU LATERAL === */}
      <aside
        className={`bg-sky-900 shadow-lg fixed top-0 left-0 z-40 transform transition-all duration-300 ${
          menuOpen ? "w-64" : "w-20"
        } min-h-screen flex flex-col`}
      >
        <div className="px-4 py-1 flex items-center gap-1 border-b border-sky-700">
          <img src="/logoremove.png" alt="Logo" className="h-16 w-18 object-contain" />
          {menuOpen && <h1 className="text-lg font-bold text-white">Ndao Hifanosika</h1>}
        </div>

        <nav className="flex flex-col p-4 text-white space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleMenuClick(item)}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg cursor-pointer transition-all ${
                  activeTab === item.key
                    ? "bg-blue-600 text-white"
                    : "text-white hover:bg-sky-800"
                }`}
              >
                <Icon size={20} />
                {menuOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* === HEADER === */}
      <header
        className={`flex items-center justify-between bg-neutral-50 px-6 py-3 shadow fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          menuOpen ? "md:left-64" : "md:left-20"
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
          >
            <Menu size={26} className="text-gray-800" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Tableau de bord</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-64 hidden sm:block">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-700 placeholder-gray-400 transition"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative">
              {userData?.photoNormalized ? (
                <img
                  src={userData.photoNormalized}
                  alt={`${userData.prenom} ${userData.nom}`}
                  className="w-12 h-12 rounded-full border object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-full font-semibold text-xs text-gray-700">
                  {userData?.prenom?.charAt(0) || "U"}
                  {userData?.nom?.charAt(0) || "N"}
                </div>
              )}
            </div>

            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-800">
                {userData ? `${userData.prenom} ${userData.nom}` : "Utilisateur"}
              </span>
              <span className="text-xs text-gray-500">
                {userData?.role || "Donateur"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* === CONTENU PRINCIPAL === */}
      <main
        className={`flex-1 flex flex-col mt-16 overflow-auto min-h-screen transition-all duration-300 ${
          menuOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
}

/* === TABLEAU DE BORD === */
function DashboardContent() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-9">📊 Tableau de bord</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total des dons</h3>
          <p className="text-3xl font-bold text-blue-600">2 500 000 Ar</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm mb-2">Projets financés</h3>
          <p className="text-3xl font-bold text-green-600">5</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm mb-2">Notifications</h3>
          <p className="text-3xl font-bold text-orange-500">3</p>
        </div>
      </div>
    </div>
  );
}

/* === NOTIFICATIONS === */
function NotificationsContent() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔔 Notifications</h2>
      <p className="text-gray-600">Aucune notification pour le moment.</p>
    </div>
  );
}

/* === CAMPAGNES === */
function CampagnesContent({ setActiveTab }) {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeShare, setActiveShare] = useState(null);
  const shareRef = useRef(null);
  const [selectedCampagne, setSelectedCampagne] = useState(null);

  useEffect(() => {
    const fetchCampagnes = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/campagnes");
        const data = await res.json();

        if (data.success) {
          const today = new Date();
          // ✅ Filtrer les campagnes actives seulement
          const campagnesActives = data.campagnes.filter((campagne) => {
            const dateFin = new Date(campagne.date_fin);
            const budgetRestant = campagne.budget - (campagne.total_dons || 0);
            return dateFin >= today && budgetRestant > 0;
          });
          setCampagnes(campagnesActives);
        } else {
          setMessage("❌ Impossible de récupérer les campagnes");
        }
      } catch {
        setMessage("❌ Erreur lors de la récupération");
      } finally {
        setLoading(false);
      }
    };
    fetchCampagnes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setActiveShare(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleShare = (id) => {
    setActiveShare(activeShare === id ? null : id);
  };

  const handleImageClick = (id) => {
    const campagne = campagnes.find((c) => c.id === id);
    if (campagne && campagne.image) {
      window.open(`http://localhost:5000/uploads/campagnes/${campagne.image}`, "_blank");
    }
  };

 const shareOnSocialMedia = (platform, campagne) => {
  const siteUrl = "https://ndaohifanosikaong.vercel.app/";
  const message = `Salut 👋\nJe viens de soutenir la campagne « ${campagne.titre} » sur l’ONG Ndao Hifanosika 💛\nTu peux visiter le site pour voir toutes les campagnes et aider aussi 🙏\n\nLien : ${siteUrl}`;

  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(message)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
  };

  if (urls[platform]) {
    window.open(urls[platform], "_blank", "width=600,height=400");
  }
};

  if (selectedCampagne) {
    return <FaireDonContent campagne={selectedCampagne} />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold py-20 -mb-10">Campagnes disponibles</h2>
      {message && <p className="mb-4">{message}</p>}
      {loading ? (
        <p>Chargement...</p>
      ) : campagnes.length === 0 ? (
        <p className="text-gray-600 mt-6">Aucune campagne active pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 -py-44">
          {campagnes.map((campagne) => {
            const budgetRestant = campagne.budget - (campagne.total_dons || 0);

            return (
              <div
                key={campagne.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition relative"
              >
                {campagne.image && (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleImageClick(campagne.id)}
                  >
                    <img
                      src={`http://localhost:5000/uploads/campagnes/${campagne.image}`}
                      alt={campagne.titre}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <h3 className="text-xl font-bold mb-2 text-sky-800">{campagne.titre}</h3>
                  <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {campagne.description}
                  </p>

                  <div className="bg-sky-50 rounded-xl p-3 text-sm text-gray-700 space-y-1 border border-sky-100">
                    <div className="flex flex-col gap-1">
                      <p className="text-gray-500 text-sm mb-1">
                        📅 Début :{" "}
                        {new Date(campagne.date_debut).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500 text-sm mb-1">
                        🕓 Fin : {new Date(campagne.date_fin).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="flex items-center gap-2">
                      <span className="text-green-600">💰</span>
                      <strong>Budget prévu :</strong>{" "}
                      <span className="font-semibold text-green-700">
                        {campagne.budget} Ar
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <span className="text-red-600">💸</span>
                      <strong>Budget restant :</strong>{" "}
                      <span className="font-semibold text-red-700">
                        {budgetRestant} Ar
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t flex justify-between items-center">
                  <button
                    onClick={() => setSelectedCampagne(campagne)}
                    className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg transition ${
                      budgetRestant > 0
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={budgetRestant <= 0}
                  >
                    <Heart size={18} />
                    Faire un don
                  </button>

                  <div className="relative" ref={shareRef}>
                    <button
                      onClick={() => toggleShare(campagne.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition px-4 py-2 border rounded-lg"
                    >
                      <Share2 size={18} />
                      Partager
                    </button>

                    {activeShare === campagne.id && (
                      <div className="absolute bottom-12 right-0 bg-white shadow-xl rounded-xl p-3 z-50 border">
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              shareOnSocialMedia("facebook", campagne)
                            }
                            className="text-blue-600 hover:text-blue-800 transition p-2 rounded-lg hover:bg-blue-50"
                          >
                            <Facebook size={24} />
                          </button>
                          <button
                            onClick={() =>
                              shareOnSocialMedia("twitter", campagne)
                            }
                            className="text-sky-500 hover:text-sky-700 transition p-2 rounded-lg hover:bg-sky-50"
                          >
                            <Twitter size={24} />
                          </button>
                          <button
                            onClick={() =>
                              shareOnSocialMedia("linkedin", campagne)
                            }
                            className="text-blue-700 hover:text-blue-900 transition p-2 rounded-lg hover:bg-blue-50"
                          >
                            <Linkedin size={24} />
                          </button>
                          <button
                            onClick={() =>
                              shareOnSocialMedia("whatsapp", campagne)
                            }
                            className="text-green-500 hover:text-green-700 transition p-2 rounded-lg hover:bg-green-50"
                          >
                            <MessageCircle size={24} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    
  );
}

function HistoriqueDonsContent({ userEmail }) {
  const [dons, setDons] = useState([]);
  const [activeDon, setActiveDon] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDons = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/dons/historique/email/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setDons(data.dons);
      } catch (err) {
        console.error("Erreur récupération dons:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchDons();
    }
  }, [userEmail]);

  // Fonction pour générer le PDF
  const generatePDF = (don) => {
    const doc = new jsPDF();
    
    // En-tête du reçu
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 150);
    doc.text("REÇU DE DON", 105, 20, null, null, 'center');
    
    // Ligne séparatrice
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 25, 190, 25);
    
    // Informations du don
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    let yPosition = 40;
    
    doc.setFont(undefined, 'bold');
    doc.text("Informations du don :", 20, yPosition);
    yPosition += 10;
    
    doc.setFont(undefined, 'normal');
    doc.text(`Campagne : ${don.nom_campagne}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Montant : ${don.montant} Ar`, 20, yPosition);
    yPosition += 8;
    doc.text(`Date : ${new Date(don.date_don).toLocaleString()}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Référence : ${don.reference || 'N/A'}`, 20, yPosition);
    yPosition += 15;
    
    // Informations du donateur
    doc.setFont(undefined, 'bold');
    doc.text("Informations du donateur :", 20, yPosition);
    yPosition += 10;
    
    doc.setFont(undefined, 'normal');
    doc.text(`Email : ${userEmail}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Date d'émission : ${new Date().toLocaleString()}`, 20, yPosition);
    yPosition += 15;
    
    // Message de remerciement
    doc.setFont(undefined, 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text("Nous vous remercions pour votre générosité et votre soutien.", 105, yPosition + 10, null, null, 'center');
    doc.text("Votre contribution fait une réelle différence.", 105, yPosition + 18, null, null, 'center');
    
    // Pied de page
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Ce reçu est émis électroniquement et a valeur légale.", 105, 280, null, null, 'center');
    
    // Sauvegarder le PDF
    doc.save(`reçu_don_${don.nom_campagne}_${new Date(don.date_don).toISOString().split('T')[0]}.pdf`);
  };



const generateDashboardPDF = (don) => {
  const doc = new jsPDF();

  let y = 20;
  doc.setFontSize(18);
  doc.text(`${don.nom_campagne} - Tableau de bord`, 20, y);
  
  y += 15;
  doc.setFontSize(14);
  doc.text("Projets financés :", 20, y);
  y += 10;
  doc.text("• Projet 1 : Construction d’une école", 25, y);
  y += 8;
  doc.text("• Projet 2 : Fourniture de matériel informatique", 25, y);

  y += 12;
  doc.text("Fonds utilisés :", 20, y);
  y += 10;
  doc.text(`45 000 Ar utilisés sur ${don.montant} Ar`, 25, y);

  y += 12;
  doc.text("Résultats atteints :", 20, y);
  y += 10;
  doc.text("• 150 bénéficiaires", 25, y);
  y += 8;
  doc.text("• Rapport photo disponible", 25, y);

  doc.save(`${don.nom_campagne}_Tableau_de_bord.pdf`);
};

   // Fonction pour télécharger Excel
  const exportToExcel = (don) => {
    const ws = XLSX.utils.json_to_sheet([
      { "Projets financés": "Projet 1, Projet 2" },
      { "Fonds utilisés": `45 000 / ${don.montant} Ar` },
      { "Résultats atteints": "150 bénéficiaires, rapport photo" }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tableau de bord");
    XLSX.writeFile(wb, `${don.nom_campagne}_Tableau_de_bord.xlsx`);
  };

  // Si un don est sélectionné, on affiche le dashboard
  if (activeDon) {
    
    return (
      <div className="p-6 max-w-5xl mx-auto mt-11">
        {/* Flèche retour */}
        <button
          onClick={() => setActiveDon(null)}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowBackIcon className="mr-2" fontSize="small" />
          Retour à l'historique
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeDon.nom_campagne} - Tableau de bord</h2>

        <div className="bg-white shadow-lg rounded-xl p-6 space-y-5 text-gray-700">
          {/* Projets financés */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Projets financés :</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Projet 1 : Construction d’une école</li>
              <li>Projet 2 : Fourniture de matériel informatique</li>
            </ul>
          </div>

          {/* Fonds utilisés */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Fonds utilisés :</h3>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-1">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${(45000 / activeDon.montant) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm">{45000} Ar utilisés sur {activeDon.montant} Ar</p>
          </div>

          {/* Résultats atteints */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Résultats atteints :</h3>
            <ul className="space-y-1">
              <li className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                150 bénéficiaires
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                Rapport photo disponible
              </li>
            </ul>
          </div>

          {/* Boutons téléchargement */}
          <div className="flex space-x-3 mt-4">
           <button
  onClick={() => generateDashboardPDF(activeDon)}
  className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-lg flex items-center text-sm transition-colors duration-200"
>
  <FileDownloadIcon className="mr-2" fontSize="small" />
  Télécharger PDF
</button>

            <button
              onClick={() => exportToExcel(activeDon)}
              className="bg-green-500 hover:bg-green-600 text-white py-1.5 px-4 rounded-lg flex items-center text-sm transition-colors duration-200"
            >
              <FileDownloadIcon className="mr-2" fontSize="small" />
              Télécharger Excel
            </button>
          </div>
        </div>
      </div>
    );
  }
  // Sinon, on affiche la liste des dons
  return (
    <div className="flex flex-wrap justify-center gap-6 p-4 mt-14">
      {dons.length === 0 ? (
        <p className="text-gray-500 text-lg font-medium w-full text-center">
          Vous n'avez pas encore effectué de don.
        </p>
      ) : (
        dons.map((don, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl w-full sm:w-[45%] lg:w-[30%] p-5 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">{don.nom_campagne}</h3>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                  {don.montant} Ar
                </span>
              </div>

              <p className="text-gray-700 text-sm font-medium">
                Doner ({don.montant} Ar)
              </p>

              <p className="text-gray-600 text-sm">
                <strong>Date :</strong> {new Date(don.date_don).toLocaleString()}
              </p>

              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => generatePDF(don)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-lg text-sm transition-colors duration-200"
                >
                  Télécharger
                </button>

                <button
                  onClick={() => setActiveDon(don)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded-lg text-sm transition-colors duration-200"
                >
                Détails campagne
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}