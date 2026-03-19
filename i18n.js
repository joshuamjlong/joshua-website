// ─── JOSHUA ATELIER — INTERNATIONALISATION ────────────────────────────────────

var LANG = localStorage.getItem('joshua-lang') || 'en';

var translations = {
  en: {
    // Nav
    nav_about: 'About',
    nav_collection: 'Collection',
    nav_social: 'Social',
    nav_lang: 'FR',

    // Footer
    footer_contact: 'Contact',
    footer_sizing: 'Sizing',
    footer_shipping: 'Shipping & Returns',
    footer_legal: 'Legal',

    // Back buttons
    back: '← Back',
    back_to_bag: '← Back to bag',

    // Product detail
    select_size: 'Select size',
    size_guide: 'Size guide',
    color: 'Color',
    add_to_bag: 'Add to Bag',
    please_select_size: 'Please select a size',
    more_details: 'More details',
    made_in: 'Made in Romania',
    free_shipping: 'Complimentary standard shipping within the EU',

    // Cart drawer
    your_bag: 'Your Bag',
    bag_empty: 'Your bag is empty.',
    size_label: 'Size',
    size_label_upper: 'SIZE',
    remove: 'Remove',
    checkout: 'Checkout',
    view_bag: 'View Bag',
    checkout_arrow: 'Checkout →',
    cart_shipping_note: 'Complimentary standard shipping within the EU',
    bag_shipping_note: 'Complimentary standard shipping within the EU via DHL.',

    // Bag page
    your_bag_title: 'Your Bag',
    continue_shopping: '← Continue Shopping',
    estimated_total: 'Estimated Total',

    // About page
    about_construction_title: 'Construction',
    about_construction_p1: 'All <em>Joshua</em> garments are produced within the European Union, using exclusively European components. Each piece is sewn by a small team of seamstresses in Cluj-Napoca, Romania, whose expertise ensures precision, durability, and an uncompromising standard of finish.',
    about_li1: 'Soft, sensual Italian mesh with stretch jersey edging provides a snug, flexible hold that moves with the body.',
    about_li2: 'Inner seams lined with stretch silk create an almost unbreakable binding that feels soft against the skin.',
    about_li3: 'Straps designed with a soft, non-slip grip for comfort and security, while custom-forged Italian metal components add both refinement and strength.',
    about_li4: 'Crotches lined with organic cotton gussets for breathability, with exterior jersey for a clean finish.',
    about_li5: 'Precision Swiss snaps ensure easy fastening and a secure fit.',
    about_details_title: 'Details',
    about_closing: 'Intimacy without exhibitionism. Elegance without effort. Made to be used.',

    // Sizing page
    sizing_title: 'Sizing',
    sizing_p1: 'All <em>Joshua</em> mesh pieces are crafted from stretch mesh with stretch jersey edging, materials that move with the body rather than against it. Fit is forgiving across a wide range of measurements, and most pieces will adapt comfortably within that range.',
    sizing_p2: 'For bodysuits, we recommend paying particular attention to height. Vertical seams are reinforced with stretch silk, which lends structure and durability but offers less vertical give than the mesh itself.',
    sizing_p3: 'When in between sizes, we recommend sizing down for the most comfortable fit.',
    sizing_guide_title: 'Size Guide',
    sizing_measurements_cm: 'Body Measurements',
    sizing_measurements_ftin: 'Body Measurements',
    sizing_height: 'Height',
    sizing_bust: 'Bust',
    sizing_waist: 'Waist',
    sizing_hips: 'Hips',
    sizing_eu: 'EU Size',
    sizing_us: 'US Size',
    sizing_uk: 'UK Size',
    sizing_it: 'IT Size',
    sizing_fr: 'FR Size',

    // Shipping page
    shipping_packaging_label: 'Packaging',
    shipping_packaging_p: 'Every <em>Joshua</em> order comes in a presentation box that is meant to be kept. It arrives within a discreet outer carton.',
    shipping_label: 'Shipping',
    shipping_p: 'Complimentary standard shipping within the EU via DHL. Express shipping and international delivery options are available at checkout. Orders are dispatched within 1–2 business days.',
    returns_label: 'Returns',
    returns_p1: 'We accept returns within 14 days of delivery. Items must be unworn, in their original condition, and in original packaging with all tags attached.',
    returns_p2: 'Due to the intimate nature of our products, items showing any signs of wear will not be accepted for return on hygiene grounds. This does not affect your statutory rights.',
    returns_p3: 'before sending anything back. Return shipping costs are the responsibility of the customer unless the item is faulty or incorrectly sent.',
    returns_p3_prefix: 'To initiate a return, contact us at',
    returns_p4: 'Refunds are issued to the original payment method within 5–10 business days of receiving the returned item.',

    // Checkout page
    checkout_title: 'Checkout',
    checkout_secure: 'Secure',
    checkout_contact: 'Contact',
    checkout_email: 'Email address',
    checkout_shipping_address: 'Shipping address',
    checkout_first_name: 'First name',
    checkout_last_name: 'Last name',
    checkout_address: 'Address',
    checkout_city: 'City',
    checkout_postal: 'Postal code',
    checkout_country: 'Country',
    checkout_select_country: 'Select country',
    checkout_shipping_method: 'Shipping method',
    checkout_select_country_above: 'Please select a country above.',
    checkout_free: 'Free',
    checkout_continue: 'Continue to payment',
    checkout_note: 'You will be redirected to a secure payment page powered by Stripe.',
    checkout_order_summary: 'Order summary',
    checkout_subtotal: 'Subtotal',
    checkout_shipping: 'Shipping',
    checkout_total: 'Total',
    checkout_qty: 'Qty',
    checkout_error_select_shipping: 'Please select a shipping method.',
    paczkomat_placeholder: 'InPost Paczkomat map will load here.',
    paczkomat_note: 'Integration available once InPost business account is active.',
    dhl_placeholder: 'DHL drop-off point map will load here.',
    dhl_note: 'Integration available once DHL business account is active.',

    // Shipping options
    shipping_inpost_address: 'InPost — to address',
    shipping_inpost_paczkomat: 'InPost — Paczkomat',
    shipping_dhl_address: 'DHL — to address',
    shipping_dhl_dropoff: 'DHL — drop-off point',
    shipping_eu_standard: 'Standard shipping',
    shipping_eu_express: 'Express shipping',
    shipping_intl_standard: 'Standard international',
    shipping_est_1_2: '1–2 business days',
    shipping_est_next: 'Next business day',
    shipping_est_2_5: '2–5 business days',
    shipping_est_5_10: '5–10 business days',

    // Contact page
    contact_title: 'Contact — Joshua Atelier',
    contact_section: 'Contact',
    contact_general: 'General',
    contact_orders: 'Orders & Support',
    contact_press: 'Press',
    contact_collaborate: 'Collaborate',
    newsletter_title: 'Stay Close',
    newsletter_statement: 'Early access to new collections and private events.',
    newsletter_placeholder: 'Your email address',
    newsletter_btn: 'Subscribe',
    newsletter_note: 'No marketing. No frequency. Only what matters.',
    newsletter_success: 'Thank you — you will hear from us.',

    // Order success
    order_success_title: 'Thank you for your order.',
  },

  fr: {
    // Nav
    nav_about: 'À propos',
    nav_collection: 'Collection',
    nav_social: 'Social',
    nav_lang: 'EN',

    // Footer
    footer_contact: 'Contact',
    footer_sizing: 'Guide des tailles',
    footer_shipping: 'Livraison & Retours',
    footer_legal: 'Mentions légales',

    // Back buttons
    back: '← Retour',
    back_to_bag: '← Retour au panier',

    // Product detail
    select_size: 'Choisir la taille',
    size_guide: 'Guide des tailles',
    color: 'Couleur',
    add_to_bag: 'Ajouter au panier',
    please_select_size: 'Veuillez sélectionner une taille',
    more_details: 'Plus de détails',
    made_in: 'Fabriqué en Roumanie',
    free_shipping: 'Livraison standard offerte dans toute l\'UE',

    // Cart drawer
    your_bag: 'Votre panier',
    bag_empty: 'Votre panier est vide.',
    size_label: 'Taille',
    size_label_upper: 'TAILLE',
    remove: 'Supprimer',
    checkout: 'Commander',
    view_bag: 'Voir le panier',
    checkout_arrow: 'Commander →',
    cart_shipping_note: 'Livraison standard offerte dans toute l\'UE',
    bag_shipping_note: 'Livraison standard offerte dans toute l\'UE via DHL.',

    // Bag page
    your_bag_title: 'Votre panier',
    continue_shopping: '← Continuer mes achats',
    estimated_total: 'Total estimé',

    // About page
    about_construction_title: 'Fabrication',
    about_construction_p1: 'Tous les vêtements <em>Joshua</em> sont produits au sein de l\'Union européenne, exclusivement à partir de composants européens. Chaque pièce est cousue par une petite équipe de couturières à Cluj-Napoca, en Roumanie, dont le savoir-faire garantit précision, durabilité et un niveau de finition irréprochable.',
    about_li1: 'Un mesh italien doux et sensuel avec une bordure en jersey stretch offre un maintien souple et flexible qui épouse les mouvements du corps.',
    about_li2: 'Les coutures intérieures sont renforcées de soie stretch, créant une liaison presque indestructible qui reste douce au contact de la peau.',
    about_li3: 'Les bretelles sont dotées d\'une prise douce et antidérapante pour le confort et le maintien, tandis que les pièces métalliques italiennes forgées sur mesure apportent à la fois raffinement et solidité.',
    about_li4: 'Les entre-jambes sont doublés de goussets en coton biologique pour la respirabilité, avec une finition jersey nette à l\'extérieur.',
    about_li5: 'Des pressions suisses de précision garantissent une fermeture facile et un ajustement sécurisé.',
    about_details_title: 'Détails',
    about_closing: 'Intimité sans exhibitionnisme. Élégance sans effort. Fait pour être porté.',

    // Sizing page
    sizing_title: 'Guide des tailles',
    sizing_p1: 'Toutes les pièces en mesh <em>Joshua</em> sont confectionnées en mesh stretch avec une bordure en jersey stretch, des matières qui s\'adaptent au corps plutôt qu\'elles ne le contraignent. L\'ajustement est généreux sur une large plage de mensurations, et la plupart des pièces s\'adaptent confortablement dans cette fourchette.',
    sizing_p2: 'Pour les bodies, nous recommandons de porter une attention particulière à la taille. Les coutures verticales sont renforcées de soie stretch, ce qui leur confère structure et durabilité, mais offre moins d\'élasticité verticale que le mesh lui-même.',
    sizing_p3: 'En cas d\'hésitation entre deux tailles, nous recommandons de choisir la taille inférieure pour un ajustement optimal.',
    sizing_guide_title: 'Guide des tailles',
    sizing_measurements_cm: 'Mensurations corporelles',
    sizing_measurements_ftin: 'Mensurations corporelles',
    sizing_height: 'Taille',
    sizing_bust: 'Poitrine',
    sizing_waist: 'Tour de taille',
    sizing_hips: 'Hanches',
    sizing_eu: 'Taille EU',
    sizing_us: 'Taille US',
    sizing_uk: 'Taille UK',
    sizing_it: 'Taille IT',
    sizing_fr: 'Taille FR',

    // Shipping page
    shipping_packaging_label: 'Emballage',
    shipping_packaging_p: 'Chaque commande <em>Joshua</em> est livrée dans un coffret de présentation conçu pour être conservé. Il arrive dans un carton extérieur discret.',
    shipping_label: 'Livraison',
    shipping_p: 'Livraison standard offerte dans toute l\'UE via DHL. Des options de livraison express et internationale sont disponibles au moment du paiement. Les commandes sont expédiées sous 1 à 2 jours ouvrés.',
    returns_label: 'Retours',
    returns_p1: 'Nous acceptons les retours dans les 14 jours suivant la livraison. Les articles doivent être non portés, dans leur état d\'origine et dans leur emballage d\'origine avec toutes les étiquettes attachées.',
    returns_p2: 'En raison de la nature intime de nos produits, les articles présentant des signes de port ne seront pas acceptés en retour pour des raisons d\'hygiène. Cela ne porte pas atteinte à vos droits légaux.',
    returns_p3: 'avant de renvoyer quoi que ce soit. Les frais de retour sont à la charge du client, sauf si l\'article est défectueux ou envoyé par erreur.',
    returns_p3_prefix: 'Pour initier un retour, contactez-nous à',
    returns_p4: 'Les remboursements sont effectués sur le moyen de paiement d\'origine dans un délai de 5 à 10 jours ouvrés après réception de l\'article retourné.',

    // Checkout page
    checkout_title: 'Paiement',
    checkout_secure: 'Sécurisé',
    checkout_contact: 'Contact',
    checkout_email: 'Adresse e-mail',
    checkout_shipping_address: 'Adresse de livraison',
    checkout_first_name: 'Prénom',
    checkout_last_name: 'Nom',
    checkout_address: 'Adresse',
    checkout_city: 'Ville',
    checkout_postal: 'Code postal',
    checkout_country: 'Pays',
    checkout_select_country: 'Sélectionner un pays',
    checkout_shipping_method: 'Mode de livraison',
    checkout_select_country_above: 'Veuillez d\'abord sélectionner un pays.',
    checkout_free: 'Gratuit',
    checkout_continue: 'Procéder au paiement',
    checkout_note: 'Vous serez redirigé vers une page de paiement sécurisée propulsée par Stripe.',
    checkout_order_summary: 'Récapitulatif de commande',
    checkout_subtotal: 'Sous-total',
    checkout_shipping: 'Livraison',
    checkout_total: 'Total',
    checkout_qty: 'Qté',
    checkout_error_select_shipping: 'Veuillez sélectionner un mode de livraison.',
    paczkomat_placeholder: 'La carte InPost Paczkomat se chargera ici.',
    paczkomat_note: 'Disponible dès l\'activation du compte InPost.',
    dhl_placeholder: 'La carte des points de dépôt DHL se chargera ici.',
    dhl_note: 'Disponible dès l\'activation du compte DHL.',

    // Shipping options
    shipping_inpost_address: 'InPost — à domicile',
    shipping_inpost_paczkomat: 'InPost — Paczkomat',
    shipping_dhl_address: 'DHL — à domicile',
    shipping_dhl_dropoff: 'DHL — point de dépôt',
    shipping_eu_standard: 'Livraison standard',
    shipping_eu_express: 'Livraison express',
    shipping_intl_standard: 'International standard',
    shipping_est_1_2: '1 à 2 jours ouvrés',
    shipping_est_next: 'Prochain jour ouvré',
    shipping_est_2_5: '2 à 5 jours ouvrés',
    shipping_est_5_10: '5 à 10 jours ouvrés',

    // Contact page
    contact_title: 'Contact — Joshua Atelier',
    contact_section: 'Contact',
    contact_general: 'Général',
    contact_orders: 'Commandes & Support',
    contact_press: 'Presse',
    contact_collaborate: 'Collaborer',
    newsletter_title: 'Restez proches',
    newsletter_statement: 'Accès anticipé aux nouvelles collections et aux événements privés.',
    newsletter_placeholder: 'Votre adresse e-mail',
    newsletter_btn: "S'abonner",
    newsletter_note: 'Pas de marketing. Pas de fréquence. Seulement l\'essentiel.',
    newsletter_success: 'Merci — nous vous contacterons bientôt.',

    // Order success
    order_success_title: 'Merci pour votre commande.',
  }
};

function t(key) {
  var lang = translations[LANG] || translations['en'];
  return lang[key] !== undefined ? lang[key] : (translations['en'][key] || key);
}

function setLang(lang) {
  LANG = lang;
  localStorage.setItem('joshua-lang', lang);
  applyTranslations();
}

function toggleLang() {
  setLang(LANG === 'en' ? 'fr' : 'en');
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    var val = t(key);
    if (el.tagName === 'INPUT') {
      el.placeholder = val;
    } else if (el.tagName === 'OPTION') {
      el.textContent = val;
    } else {
      el.innerHTML = val;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  // Update html lang attribute
  document.documentElement.lang = LANG;
  // Highlight active language
  var enEl = document.getElementById('lang-en');
  var frEl = document.getElementById('lang-fr');
  if (enEl && frEl) {
    if (LANG === 'fr') {
      enEl.style.color = 'var(--mid-grey)';
      frEl.style.color = 'var(--dark-grey)';
    } else {
      enEl.style.color = 'var(--dark-grey)';
      frEl.style.color = 'var(--mid-grey)';
    }
  }
}

// Run on load
document.addEventListener('DOMContentLoaded', function() {
  applyTranslations();
});
