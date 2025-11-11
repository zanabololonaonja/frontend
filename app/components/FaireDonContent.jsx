"use client";
import { useState } from "react";
import { CreditCard, Lock, Banknote, Pen, Heart, Smartphone } from "lucide-react";

const amounts = [5000, 10000, 20000, 50000, 100000]; // en Ariary
const civilites = ["Monsieur", "Madame", "Mademoiselle"];
const formesJuridique = ["SARL", "SA", "SAS", "Association", "Autre"];

export default function FaireDonContent({ campagne }) {
  const [selectedPayment, setSelectedPayment] = useState(null); // ex: "Mvola", "Orange Money", "PayPal", "Stripe", "CB"
  const [selectedType, setSelectedType] = useState("once");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [montantLibre, setMontantLibre] = useState("");
  const [isOrganisation, setIsOrganisation] = useState(false);

  const [donateurInfo, setDonateurInfo] = useState({
    nom: "",
    prenom: "",
    email: "",
    adresse: "",
    // complement_adresse: "",
    code_postal: "",
    ville: "",
    pays: "",
    telephone: "",
    organisation: {
      raison_sociale: "",
      siren: "",
      forme_juridique: "",
      civilite: "",
      nom_representant: "",
      prenom_representant: "",
    },
  });

  // détails spécifiques au mode de paiement (numéro tel, email paypal...)
  const [paymentDetails, setPaymentDetails] = useState({
    numero: "",
    emailPaypal: "",
  });

  const montantChoisi = Number(montantLibre || selectedAmount || 0);
  const budgetRestant = campagne ? Number(campagne.budget) : 0;
  const montantValide = montantChoisi > 0 && montantChoisi <= budgetRestant;

  const handleInputChange = (e, field, subField = null) => {
    if (subField) {
      setDonateurInfo((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subField]: e.target.value,
        },
      }));
    } else {
      setDonateurInfo((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    }
  };

  const handlePaymentDetailChange = (e, field) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForPayment = () => {
    if (!montantValide) return { ok: false, message: "Montant invalide ou supérieur au budget restant." };
    if (!donateurInfo.email) return { ok: false, message: "Email du donateur requis." };
    if (!donateurInfo.prenom || !donateurInfo.nom) return { ok: false, message: "Nom et prénom requis." };
    if (!selectedPayment) return { ok: false, message: "Veuillez sélectionner un moyen de paiement." };

    // validations selon moyen
    if (selectedPayment === "Mvola" || selectedPayment === "Orange Money") {
      if (!paymentDetails.numero || paymentDetails.numero.trim().length < 6) return { ok: false, message: "Veuillez entrer un numéro de téléphone valide." };
    }
    if (selectedPayment === "PayPal") {
      if (!paymentDetails.emailPaypal || !paymentDetails.emailPaypal.includes("@")) return { ok: false, message: "Veuillez entrer un email PayPal valide." };
    }
    // Stripe / CB: we just redirect or display message (no extra field required here)
    return { ok: true };
  };

 const handleSubmit = async () => {
  const valid = validateForPayment();
  if (!valid.ok) {
    alert(valid.message);
    return;
  }

  // Préparer le payload commun
  const payload = {
    id_campagne: campagne?.id ?? null,
    montant: montantChoisi,
    type_don: selectedType,
    moyen_paiement: selectedPayment,
    donateur: { 
      ...donateurInfo, 
      is_organisation: isOrganisation,
      // Ajouter le téléphone pour MVola
      telephone: selectedPayment === "Mvola" ? paymentDetails.numero.trim() : donateurInfo.telephone
    },
  };

  // SI MVOLA - envoyer le même format mais avec le téléphone
  if (selectedPayment === "Mvola") {
    try {
      const res = await fetch("http://localhost:5000/api/dons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) // Utiliser le même payload
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Don enregistré ! " + data.message);
      } else {
        alert("❌ Erreur : " + (data.message || "Erreur inconnue"));
      }
      return;
    } catch (err) {
      console.error(err);
      alert("❌ Erreur serveur.");
      return;
    }
  }
  
  // Pour les autres paiements
  try {
    const res = await fetch("http://localhost:5000/api/dons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      alert("✅ Don effectué avec succès !");
      // reset simple fields si nécessaire
      setSelectedAmount(null);
      setMontantLibre("");
      setSelectedPayment(null);
      setPaymentDetails({ numero: "", emailPaypal: "" });
    } else {
      alert("❌ Erreur lors du don : " + (data.message || "erreur inconnue"));
    }
  } catch (err) {
    console.error(err);
    alert("❌ Erreur serveur.");
  }
};

// ⭐ AJOUTER CETTE FONCTION formatAr ICI (en dehors de handleSubmit)
const formatAr = (n) => {
  try {
    return Number(n).toLocaleString("fr-FR") + " Ar";
  } catch {
    return n + " Ar";
  }
};

  return (
    <div className="bg-cover bg-center min-h-screen py-20 px-4" style={{ backgroundImage: "url('/images/don-bg.jpg')" }}>
      <h2 className="text-2xl font-bold text-center mb-6">
        Faire un don {campagne ? `pour "${campagne.titre}"` : ""}
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* -------- MON DON -------- */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-sky-600 text-white text-center py-3 font-semibold text-lg">Mon don</div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between bg-gray-100 rounded-lg overflow-hidden mb-4">
              <button
                onClick={() => setSelectedType("once")}
                className={`flex-1 py-2 font-medium ${selectedType === "once" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                Je donne une fois
              </button>
              <button
                onClick={() => setSelectedType("monthly")}
                className={`flex-1 py-2 font-medium flex items-center justify-center gap-1 ${selectedType === "monthly" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                <Heart size={16} /> Je donne tous les mois
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setSelectedAmount(amt); setMontantLibre(""); }}
                  className={`border rounded-lg py-3 font-semibold hover:bg-gray-50 ${selectedAmount === amt ? "ring-2 ring-sky-400" : ""}`}
                >
                  {formatAr(amt)}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Montant libre (en Ariary)"
              className="w-full border rounded-lg p-2 mt-2"
              value={montantLibre}
              onChange={(e) => { setMontantLibre(e.target.value); setSelectedAmount(null); }}
            />

            <div className={`border rounded-lg p-3 text-center text-xl font-bold mt-2 ${montantValide ? "text-red-600" : "text-red-900"}`}>
              {formatAr(montantChoisi)} {!montantValide && montantChoisi > 0 && `(Ne peut pas dépasser ${formatAr(budgetRestant)})`}
            </div>

            <p className="text-sm text-gray-600 text-center border-t pt-4">
              Après déduction fiscale estimée : {montantChoisi ? `${formatAr(Math.round(montantChoisi * 0.25))}` : formatAr(0)}
            </p>
          </div>
        </div>

       {/* -------- MES COORDONNÉES -------- */}
<div className="bg-white rounded-2xl shadow-md overflow-hidden">
  <div className="bg-sky-600 text-white text-center py-3 font-semibold text-lg">
    Mes coordonnées
  </div>
  <div className="p-6 space-y-4">
    <input
      type="email"
      placeholder="Email *"
      className="w-full border rounded-lg p-2"
      value={donateurInfo.email}
      onChange={(e) => handleInputChange(e, "email")}
    />

    <input
      type="text"
      placeholder="Prénom *"
      className="w-full border rounded-lg p-2"
      value={donateurInfo.prenom}
      onChange={(e) => handleInputChange(e, "prenom")}
    />

    <input
      type="text"
      placeholder="Nom *"
      className="w-full border rounded-lg p-2"
      value={donateurInfo.nom}
      onChange={(e) => handleInputChange(e, "nom")}
    />

    <input
      type="text"
      placeholder="Adresse *"
      className="w-full border rounded-lg p-2"
      value={donateurInfo.adresse}
      onChange={(e) => handleInputChange(e, "adresse")}
    />

    {/* <input
      type="text"
      placeholder="Complément adresse"
      className="w-full border rounded-lg p-2"
      value={donateurInfo.complement_adresse}
      onChange={(e) => handleInputChange(e, "complement_adresse")}
    /> */}

    <input
      type="text"
      placeholder="Code postal *"
      className="w-full border rounded-lg p-2"
      value={donateurInfo.code_postal}
      onChange={(e) => handleInputChange(e, "code_postal")}
    />

    <input
      type="text"
      placeholder="Ville *"
      className="w-full border rounded-lg p-2"
      value={donateurInfo.ville}
      onChange={(e) => handleInputChange(e, "ville")}
    />

    <input
      type="text"
      placeholder="Pays *"
      className="w-full border rounded-lg p-2"
      value={donateurInfo.pays}
      onChange={(e) => handleInputChange(e, "pays")}
    />

    <input
      type="text"
      placeholder="Téléphone"
      className="w-full border rounded-lg p-2"
      value={donateurInfo.telephone}
      onChange={(e) => handleInputChange(e, "telephone")}
    />

    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" className="border-gray-300 rounded" />
      J'accepte d'être contacté par téléphone
    </label>

    <label className="flex items-center gap-2 mt-2 text-sm">
      <input
        type="checkbox"
        className="border-gray-300 rounded"
        checked={isOrganisation}
        onChange={() => setIsOrganisation(!isOrganisation)}
      />
      Je fais un don au nom d'une organisation ou d'une société
    </label>

    {isOrganisation && (
      <div className="space-y-2 mt-2">
        <input
          type="text"
          placeholder="Raison sociale *"
          className="w-full border rounded-lg p-2"
          value={donateurInfo.organisation.raison_sociale}
          onChange={(e) => handleInputChange(e, "organisation", "raison_sociale")}
        />
        <input
          type="text"
          placeholder="SIREN *"
          className="w-full border rounded-lg p-2"
          value={donateurInfo.organisation.siren}
          onChange={(e) => handleInputChange(e, "organisation", "siren")}
        />
        <select
          className="w-full border rounded-lg p-2"
          value={donateurInfo.organisation.forme_juridique}
          onChange={(e) => handleInputChange(e, "organisation", "forme_juridique")}
        >
          <option>Forme juridique</option>
          {formesJuridique.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <select
          className="w-full border rounded-lg p-2"
          value={donateurInfo.organisation.civilite}
          onChange={(e) => handleInputChange(e, "organisation", "civilite")}
        >
          <option>Civilité</option>
          {civilites.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Prénom représentant *"
          className="w-full border rounded-lg p-2"
          value={donateurInfo.organisation.prenom_representant}
          onChange={(e) => handleInputChange(e, "organisation", "prenom_representant")}
        />
        <input
          type="text"
          placeholder="Nom représentant *"
          className="w-full border rounded-lg p-2"
          value={donateurInfo.organisation.nom_representant}
          onChange={(e) => handleInputChange(e, "organisation", "nom_representant")}
        />
      </div>
    )}

    <p className="text-xs text-gray-500 mt-2">* Champs obligatoires</p>
  </div>
</div>

        {/* -------- MON RÈGLEMENT -------- */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-sky-600 text-white text-center py-3 font-semibold text-lg">Mon règlement</div>
          <div className="p-6 space-y-5">
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <Lock className="text-green-600" />
              <span>Paiements sécurisés avec les derniers protocoles de chiffrement.</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              {[
                { id: "PayPal", },
                { id: "Stripe", icon: <CreditCard size={28} /> },
                { id: "Orange Money", icon: <Smartphone size={28} /> },
                { id: "Mvola", icon: <Smartphone size={28} /> },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedPayment(m.id)}
                  className={`border rounded-lg py-3 flex flex-col items-center justify-center gap-1 ${selectedPayment === m.id ? "border-sky-600 text-sky-700 bg-sky-50" : "border-gray-300 hover:bg-gray-50"}`}
                >
                  {m.icon}
                  <span className="font-medium">{m.id}</span>
                </button>
              ))}
            </div>

            {/* petit formulaire spécifique selon le mode */}
            {selectedPayment === "Mvola" && (
              <div className="mt-4 space-y-2">
                <label className="text-sm text-gray-600">Numéro Mvola</label>
                <input type="text" placeholder="Ex : 034 12 345 67" className="w-full border rounded-lg p-2" value={paymentDetails.numero} onChange={(e) => handlePaymentDetailChange(e, "numero")} />
                <p className="text-xs text-gray-500">Un code ou confirmation local peut être envoyé sur ce numéro.</p>
              </div>
            )}

            {selectedPayment === "Orange Money" && (
              <div className="mt-4 space-y-2">
                <label className="text-sm text-gray-600">Numéro Orange Money</label>
                <input type="text" placeholder="Ex : 032 45 678 90" className="w-full border rounded-lg p-2" value={paymentDetails.numero} onChange={(e) => handlePaymentDetailChange(e, "numero")} />
                <p className="text-xs text-gray-500">Vous recevrez les instructions sur ce numéro.</p>
              </div>
            )}

            {selectedPayment === "PayPal" && (
              <div className="mt-4 space-y-2">
                <label className="text-sm text-gray-600">Email PayPal</label>
                <input type="email" placeholder="exemple@paypal.com" className="w-full border rounded-lg p-2" value={paymentDetails.emailPaypal} onChange={(e) => handlePaymentDetailChange(e, "emailPaypal")} />
              </div>
            )}

            {selectedPayment === "Stripe" && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Vous serez redirigé vers la page Stripe sécurisée pour finaliser votre paiement.</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!montantValide || montantChoisi === 0 || !selectedPayment}
              className={`w-full text-white font-semibold py-3 rounded-lg text-lg ${montantValide && selectedPayment ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}`}
            >
              VALIDER — {formatAr(montantChoisi)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
