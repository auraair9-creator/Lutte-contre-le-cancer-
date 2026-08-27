// PERSONNALISATION : remplacez le numéro ci-dessous par le numéro Mobile Money destiné aux dons.
const DONATION_NUMBER = "693430232";

const numberEl = document.getElementById("donationNumber");
const amountText = document.getElementById("amountText");
const customAmount = document.getElementById("customAmount");
const toast = document.getElementById("toast");
let selectedAmount = null;

numberEl.textContent = DONATION_NUMBER;

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 2200);
}
function formatFCFA(n){ return new Intl.NumberFormat("fr-FR").format(n) + " FCFA"; }
function refreshAmount(){
  const value = selectedAmount || Number(customAmount.value) || 0;
  amountText.innerHTML = "Montant sélectionné : <b>" + (value ? formatFCFA(value) : "—") + "</b>";
}
document.querySelectorAll("[data-amount]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll("[data-amount]").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    selectedAmount = Number(btn.dataset.amount);
    customAmount.value = "";
    refreshAmount();
  });
});
customAmount.addEventListener("input",()=>{
  selectedAmount = null;
  document.querySelectorAll("[data-amount]").forEach(b=>b.classList.remove("active"));
  refreshAmount();
});

document.getElementById("copyBtn").addEventListener("click", async ()=>{
  if(DONATION_NUMBER === "À REMPLACER"){ showToast("Ajoutez d'abord le numéro de collecte."); return; }
  try{ await navigator.clipboard.writeText(DONATION_NUMBER); showToast("Numéro copié ✓"); }
  catch(e){ showToast("Copie automatique non disponible."); }
});

document.getElementById("mobileBtn").addEventListener("click", ()=>{
  if(DONATION_NUMBER === "À REMPLACER"){ showToast("Ajoutez d'abord le numéro de collecte."); return; }
  const amount = selectedAmount || Number(customAmount.value);
  if(!amount || amount < 100){ showToast("Choisissez un montant."); return; }

  // Sécurité : aucun PIN ou mot de passe n'est demandé ici.
  // Pour un vrai paiement en un clic, connectez cette page à une API officielle
  // Orange Money / MTN MoMo avec un serveur sécurisé.
  navigator.clipboard?.writeText(DONATION_NUMBER);
  showToast("Numéro copié. Ouvrez votre application Mobile Money pour confirmer le transfert.");
});

document.getElementById("shareBtn").addEventListener("click", async ()=>{
  const data = {title:"Lutte contre le cancer — Soutenir Maman", text:"Aidez-nous à financer les soins de ma mère. Chaque geste compte.", url:location.href};
  if(navigator.share){ try{await navigator.share(data);}catch(e){} }
  else { try{await navigator.clipboard.writeText(location.href); showToast("Lien de la campagne copié ✓");}catch(e){showToast("Copiez l'adresse de cette page.");} }
});
