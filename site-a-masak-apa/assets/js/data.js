/* Shahid site data: the ten pastes and the contact details.
 * Everything marked PLACEHOLDER still needs confirming with the client
 * (see README.md). Pack facts (names, what to add, servings) are copied
 * from the real packs. */
(function (root) {
  var S = (root.SHAHID = root.SHAHID || {});

  var storeQuery = 'Berkat Sauda Supply, Taman Idaman, Kluang, Johor';

  S.config = {
    brand: 'Shahid',
    whatsapp: '60123456789',             // PLACEHOLDER: client's WhatsApp number, digits only
    whatsappDisplay: '+60 12-345 6789',  // PLACEHOLDER
    store: {
      name: 'Berkat Sauda Supply',
      area: 'Taman Idaman',
      city: 'Kluang',
      state: 'Johor',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(storeQuery)
    },
    hours: 'Open daily, 9am to 9pm',     // PLACEHOLDER
    handle: '@shahidpes',                // PLACEHOLDER
    socials: {                           // PLACEHOLDER links
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
      tiktok: 'https://www.tiktok.com/'
    },
    modes: {
      pickup: 'Pickup at Berkat Sauda Supply, Taman Idaman, Kluang',
      delivery: 'Delivery, please'
    }
  };

  // Protein chips used by the dinner decider (A) and the "best with" copy.
  S.proteins = [
    { id: 'ayam', label: 'Ayam', en: 'Chicken' },
    { id: 'ikan', label: 'Ikan', en: 'Fish' },
    { id: 'daging', label: 'Daging', en: 'Beef' },
    { id: 'udang', label: 'Udang', en: 'Prawns' },
    { id: 'telur', label: 'Telur', en: 'Eggs' },
    { id: 'sayur', label: 'Sayur', en: 'Veg' }
  ];

  function flavour(o) {
    o.photo = 'assets/img/photos/dish-' + o.id + '.jpg';
    o.pouchPhoto = 'assets/img/photos/pouch-' + o.id + '.jpg';
    return o;
  }

  // In the client's own order. heat, minutes, proteins and bestWith are
  // PLACEHOLDERS drawn from common Malaysian cooking; confirm with the client.
  S.flavours = [
    flavour({
      id: 'beriyani', pack: 'Pes Beriyani Batu Pahat', short: 'Beriyani Batu Pahat',
      en: 'Batu Pahat beriyani paste', sub: 'Batu Pahat Beriyani Paste', lines: ['BERIYANI', 'BATU PAHAT'],
      add: 'susu sejat', addLabel: 'Tambah Susu Sejat Saja', addEn: 'Just add evaporated milk',
      serves: '4–5', color: '#A3324A', textOn: 'light', heat: 1, minutes: 40,
      proteins: ['ayam', 'daging'], bestWith: 'Ayam, daging or kambing',
      desc: 'Fragrant Batu Pahat-style rice, warm with whole spices.'
    }),
    flavour({
      id: 'masak-merah', pack: 'Pes Masak Merah', short: 'Masak Merah',
      en: 'Masak merah paste', sub: 'Spicy Tomato Paste', lines: ['MASAK', 'MERAH'],
      add: 'air', addLabel: 'Tambah Air Saja', addEn: 'Just add water',
      serves: '4–5', color: '#E2A92B', textOn: 'dark', heat: 1, minutes: 25,
      proteins: ['ayam', 'udang', 'telur'], bestWith: 'Ayam, udang or telur',
      desc: 'Sweet, tangy tomato gravy the kids ask for twice.'
    }),
    flavour({
      id: 'kari-daging', pack: 'Pes Kari Daging', short: 'Kari Daging',
      en: 'Beef curry paste', sub: 'Meat Curry Paste', lines: ['KARI', 'DAGING'],
      add: 'santan', addLabel: 'Tambah Santan Saja', addEn: 'Just add santan',
      serves: '4–5', color: '#D9891F', textOn: 'dark', heat: 2, minutes: 35,
      proteins: ['daging', 'ayam'], bestWith: 'Daging, ayam or kambing',
      desc: 'A rich, santan-thick curry made for beef and potatoes.'
    }),
    flavour({
      id: 'asam-pedas', pack: 'Pes Asam Pedas', short: 'Asam Pedas',
      en: 'Asam pedas paste', sub: 'Asam Pedas Paste', lines: ['ASAM', 'PEDAS'],
      add: 'air', addLabel: 'Tambah Air Saja', addEn: 'Just add water',
      serves: '4–5', color: '#EE5A21', textOn: 'dark', heat: 3, minutes: 20,
      proteins: ['ikan', 'ayam'], bestWith: 'Ikan tenggiri, ikan pari or ayam',
      desc: 'Sour, fiery Johor-style gravy that loves ikan tenggiri.',
      packArt: 'assets/img/pack-asam-pedas.jpg'
    }),
    flavour({
      id: 'lemak-cili-api', pack: 'Pes Lemak Cili Api', short: 'Lemak Cili Api',
      en: 'Lemak cili api paste', sub: 'Creamy Thai Chillies Paste', lines: ['LEMAK', 'CILI API'],
      add: 'santan', addLabel: 'Tambah Santan Saja', addEn: 'Just add santan',
      serves: '4–5', color: '#237A42', textOn: 'light', heat: 3, minutes: 25,
      proteins: ['ayam', 'ikan', 'daging', 'udang', 'sayur'], bestWith: 'Ayam, ikan, daging salai or udang',
      desc: 'Creamy turmeric santan with a sharp cili padi kick.'
    }),
    flavour({
      id: 'rendang', pack: 'Pes Rendang', short: 'Rendang',
      en: 'Rendang paste', sub: 'Rendang Paste', lines: ['RENDANG'],
      add: 'santan', addLabel: 'Masukkan Santan Saja', addEn: 'Just add santan',
      serves: '4–5', color: '#C8302B', textOn: 'light', heat: 2, minutes: 45,
      proteins: ['daging', 'ayam'], bestWith: 'Daging or ayam',
      desc: 'Deep, dark rendang with the rempah already done for you.',
      sticker: 'Resepi Baru'
    }),
    flavour({
      id: 'tomyam', pack: 'Pes Tomyam', short: 'Tomyam',
      en: 'Tomyam paste', sub: 'Tomyam Paste', lines: ['TOMYAM'],
      add: 'air', addLabel: 'Tambah Air Saja', addEn: 'Just add water',
      serves: '4–5', color: '#9C3478', textOn: 'light', heat: 2, minutes: 20,
      proteins: ['udang', 'ayam', 'ikan', 'sayur'], bestWith: 'Udang, sotong, ayam or ikan',
      desc: 'Hot, sour and fragrant with lemongrass and lime leaf.'
    }),
    flavour({
      id: 'mi-bandung', pack: 'Pes Mi Bandung', short: 'Mi Bandung',
      en: 'Mi bandung paste', sub: 'Mi Bandung Paste', lines: ['MI', 'BANDUNG'],
      add: 'air', addLabel: 'Tambah Air Saja', addEn: 'Just add water',
      serves: '3–4', color: '#C8317A', textOn: 'light', heat: 1, minutes: 20,
      proteins: ['udang', 'daging', 'telur'], bestWith: 'Udang, daging and telur, over yellow mee',
      desc: 'The thick, savoury Muar-style gravy for a proper mi bandung.'
    }),
    flavour({
      id: 'soto', pack: 'Pes Soto', short: 'Soto',
      en: 'Soto paste', sub: 'Soto Paste', lines: ['SOTO'],
      add: 'air', addLabel: 'Tambah Air Saja', addEn: 'Just add water',
      serves: '4–5', color: '#B3A532', textOn: 'dark', heat: 1, minutes: 30,
      proteins: ['ayam'], bestWith: 'Ayam, with nasi impit or bihun',
      desc: 'A clear, gently spiced broth for soto ayam.'
    }),
    flavour({
      id: 'sambal-tumis', pack: 'Pes Sambal Tumis Serbaguna', short: 'Sambal Tumis',
      en: 'All-purpose sambal tumis paste', sub: 'Multipurpose Sambal Tumis Paste', lines: ['SAMBAL TUMIS', 'SERBAGUNA'],
      add: 'air', addLabel: 'Tambah Air Saja', addEn: 'Just add water',
      serves: '3–4', color: '#8DB03A', textOn: 'dark', heat: 2, minutes: 15,
      proteins: ['telur', 'udang', 'ikan'], bestWith: 'Ikan bilis, udang, telur or sotong',
      desc: 'One sambal for nasi lemak, telur, bilis and whatever else.'
    })
  ];

  S.flavourById = function (id) {
    for (var i = 0; i < S.flavours.length; i++) if (S.flavours[i].id === id) return S.flavours[i];
    return null;
  };
})(typeof window !== 'undefined' ? window : globalThis);
