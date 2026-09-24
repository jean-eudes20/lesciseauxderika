// Charge les données éditables (tarifs, horaires, contact) et remplit la page.
// La coiffeuse modifie les fichiers dans data/ via /admin, ce script se charge de l'affichage.

async function chargerJSON(chemin) {
  const reponse = await fetch(chemin);
  if (!reponse.ok) throw new Error(`Impossible de charger ${chemin}`);
  return reponse.json();
}

function creerParagraphe(texte) {
  const p = document.createElement('p');
  p.textContent = texte;
  return p;
}

async function afficherTarifs() {
  try {
    const { extras, categories } = await chargerJSON('data/tarifs.json');

    const zoneExtras = document.getElementById('tarifs-extras');
    extras.forEach(({ label, prix }) => {
      zoneExtras.appendChild(creerParagraphe(`${label} : ${prix}`));
    });

    const zoneCategories = document.getElementById('tarifs-categories');
    categories.forEach((categorie, index) => {
      const bloc = document.createElement('div');
      bloc.className = index === 1 ? 'coupef1' : 'coupef';

      const contenu = document.createElement('div');
      const titre = document.createElement('h3');
      titre.textContent = categorie.nom;
      contenu.appendChild(titre);

      const listePrestations = document.createElement('div');
      listePrestations.className = 'court';
      categorie.prestations.forEach(({ label, prix }) => {
        listePrestations.appendChild(creerParagraphe(`${label} : ${prix}`));
      });
      contenu.appendChild(listePrestations);
      bloc.appendChild(contenu);

      const image = document.createElement('img');
      image.src = categorie.image;
      image.alt = '';
      bloc.appendChild(image);

      zoneCategories.appendChild(bloc);
    });
  } catch (erreur) {
    console.error('Erreur de chargement des tarifs :', erreur);
  }
}

async function afficherHoraires() {
  try {
    const { jours } = await chargerJSON('data/horaires.json');
    const zoneJours = document.getElementById('horaires-jours');
    const zoneHeures = document.getElementById('horaires-heures');
    jours.forEach(({ jour, horaire }) => {
      zoneJours.appendChild(creerParagraphe(jour));
      zoneHeures.appendChild(creerParagraphe(horaire));
    });
  } catch (erreur) {
    console.error('Erreur de chargement des horaires :', erreur);
  }
}

async function afficherContact() {
  try {
    const contact = await chargerJSON('data/contact.json');

    const zoneContact = document.getElementById('contact-infos');
    const lignes = [
      ['Nom :', contact.nom],
      ['Adresse : ', contact.adresse],
      ['Tel :', contact.telephone],
    ];
    lignes.forEach(([label, valeur]) => {
      const pLabel = document.createElement('p');
      pLabel.className = 'bl';
      pLabel.textContent = label;
      zoneContact.appendChild(pLabel);
      zoneContact.appendChild(creerParagraphe(valeur));
    });

    const nav = document.getElementById('reseaux');
    if (contact.instagram) {
      const divRose = document.createElement('div');
      divRose.className = 'rose';
      const lienInsta = document.createElement('a');
      lienInsta.href = contact.instagram;
      lienInsta.textContent = 'Instagram';
      divRose.appendChild(lienInsta);
      nav.appendChild(divRose);
    }
    if (contact.facebook) {
      const divBleu = document.createElement('div');
      divBleu.className = 'bleu';
      const lienFacebook = document.createElement('a');
      lienFacebook.href = contact.facebook;
      lienFacebook.textContent = 'Facebook';
      divBleu.appendChild(lienFacebook);
      nav.appendChild(divBleu);
    }

    const mentions = document.getElementById('mentions-legales');
    const proprietaire = document.createElement('p');
    proprietaire.innerHTML = `<strong>Propriétaire du site :</strong> ${contact.nom}`;
    const adresseMention = document.createElement('p');
    adresseMention.innerHTML = `<strong>Adresse :</strong> ${contact.adresse}`;
    const contactMention = document.createElement('p');
    contactMention.innerHTML = `<strong>Contact :</strong> ${contact.telephone}`;
    mentions.prepend(contactMention);
    mentions.prepend(adresseMention);
    mentions.prepend(proprietaire);
  } catch (erreur) {
    console.error('Erreur de chargement du contact :', erreur);
  }
}

afficherTarifs();
afficherHoraires();
afficherContact();
