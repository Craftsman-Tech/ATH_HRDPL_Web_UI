/**
 * ============================================================================
 *  i18n — Vexoo
 * ============================================================================
 *
 *  Three languages are first-class: English, Hindi, Telugu — matching the
 *  Sign-In page in the original mockups. To add a fourth (e.g. Tamil), copy
 *  the `en` block, translate values, add to the LANGS export below, and add
 *  a button in the Sign-In language switcher.
 *
 *  Convention: namespace by surface — `signIn.heading`, `nav.dashboard`, etc.
 *  Don't reach into another namespace's keys; copy them if needed.
 * ============================================================================
 */

export type LangCode = 'en' | 'hi' | 'te';

// English — the source of truth. Other languages must mirror this shape.
const en = {
  signIn: {
    welcome:    'Welcome back',
    heading:    'Sign in to Vexoo',
    sub:        'Choose your role and enter your credentials to continue.',
    role:       'Your role',
    email:      'Email',
    password:   'Password',
    forgot:     'Forgot?',
    signin:     'Sign in to Vexoo',
    demo:       'Demo mode · any password unlocks the matched email.',
    invalid:    "Those credentials don't match any account.",
    tagline1:   'Calm software for busy clinics',
    headlineA:  'Quiet tools.',
    headlineB:  'Crisp',
    headlineC:  'care.',
    desc:       'One workspace for patients, queue, consultation, billing, pharmacy and stock — designed to disappear into the work.',
    statRoles:    'Roles',
    statModules:  'Modules',
    statSearch:   'Search anywhere',
    estLine:    'Clinic Operations · Est. 2026',
    copyright:  '© 2026 Vexoo Health Systems',
    newClinic:  'New clinic?',
    register:   'Register here',
    help:       'Need help?',
    language:   'Language',
  },
  roles: {
    Admin:        'Admin',
    Doctor:       'Doctor',
    Receptionist: 'Reception',
    Pharmacist:   'Pharmacist',
    LabTech:      'Lab Tech',
    Patient:      'Patient',
  },
  nav: {
    dashboard:     'Dashboard',
    patients:      'Patients',
    appointments:  'Appointments',
    emr:           'Medical Records',
    pharmacy:      'Pharmacy',
    lab:           'Lab & Diagnostics',
    inventory:     'Inventory',
    analytics:     'Analytics',
    notifications: 'Notifications',
    logout:        'Logout',
  },
  common: {
    search:    'Search',
    cancel:    'Cancel',
    save:      'Save',
    confirm:   'Confirm',
    loading:   'Loading…',
    today:     'Today',
    yesterday: 'Yesterday',
  },
};
// NOTE: intentionally NOT `as const`. With `as const`, every English value
// becomes a *literal* type (e.g. 'Welcome back'), and `typeof en` would then
// force hi/te to use those exact English strings — making translation
// impossible. Plain object widens values to `string`, so all three locales
// share one shape: `Strings` below.

// Hindi — translations preserved from the original Sign-In HTML.
const hi: typeof en = {
  signIn: {
    welcome:    'वापसी पर स्वागत है',
    heading:    'Vexoo में साइन इन करें',
    sub:        'जारी रखने के लिए अपनी भूमिका चुनें और अपने क्रेडेंशियल दर्ज करें।',
    role:       'आपकी भूमिका',
    email:      'ईमेल',
    password:   'पासवर्ड',
    forgot:     'भूल गए?',
    signin:     'Vexoo में साइन इन करें',
    demo:       'डेमो मोड · कोई भी पासवर्ड मेल खाते ईमेल को अनलॉक करता है।',
    invalid:    'ये क्रेडेंशियल किसी भी खाते से मेल नहीं खाते।',
    tagline1:   'व्यस्त क्लीनिकों के लिए शांत सॉफ्टवेयर',
    headlineA:  'शांत उपकरण।',
    headlineB:  'सटीक',
    headlineC:  'देखभाल।',
    desc:       'मरीज़, क्यू, परामर्श, बिलिंग, फार्मेसी और स्टॉक के लिए एक ही कार्यक्षेत्र।',
    statRoles:    'भूमिकाएँ',
    statModules:  'मॉड्यूल',
    statSearch:   'कहीं भी',
    estLine:    'क्लिनिक संचालन · स्था. 2026',
    copyright:  '© 2026 Vexoo हेल्थ सिस्टम्स',
    newClinic:  'नया क्लीनिक?',
    register:   'यहाँ पंजीकरण करें',
    help:       'सहायता चाहिए?',
    language:   'भाषा',
  },
  roles: {
    Admin:        'प्रशासक',
    Doctor:       'डॉक्टर',
    Receptionist: 'रिसेप्शन',
    Pharmacist:   'फार्मासिस्ट',
    LabTech:      'लैब तकनीशियन',
    Patient:      'रोगी',
  },
  nav: {
    dashboard:     'डैशबोर्ड',
    patients:      'मरीज़',
    appointments:  'अपॉइंटमेंट',
    emr:           'मेडिकल रिकॉर्ड',
    pharmacy:      'फार्मेसी',
    lab:           'लैब और निदान',
    inventory:     'इन्वेंटरी',
    analytics:     'विश्लेषण',
    notifications: 'सूचनाएँ',
    logout:        'लॉगआउट',
  },
  common: {
    search:    'खोजें',
    cancel:    'रद्द करें',
    save:      'सहेजें',
    confirm:   'पुष्टि करें',
    loading:   'लोड हो रहा है…',
    today:     'आज',
    yesterday: 'कल',
  },
};

// Telugu — translations preserved from the original Sign-In HTML.
const te: typeof en = {
  signIn: {
    welcome:    'తిరిగి స్వాగతం',
    heading:    'Vexoo లోకి సైన్ ఇన్ చేయండి',
    sub:        'కొనసాగించడానికి మీ పాత్రను ఎంచుకుని, మీ వివరాలను నమోదు చేయండి.',
    role:       'మీ పాత్ర',
    email:      'ఇమెయిల్',
    password:   'పాస్‌వర్డ్',
    forgot:     'మరిచిపోయారా?',
    signin:     'Vexoo లోకి సైన్ ఇన్ చేయండి',
    demo:       'డెమో మోడ్ · ఏదైనా పాస్‌వర్డ్ సరిపోయే ఇమెయిల్‌ను అన్‌లాక్ చేస్తుంది.',
    invalid:    'ఈ వివరాలు ఏ ఖాతాకూ సరిపోలడం లేదు.',
    tagline1:   'రద్దీగా ఉన్న క్లినిక్‌ల కోసం ప్రశాంతమైన సాఫ్ట్‌వేర్',
    headlineA:  'ప్రశాంత సాధనాలు.',
    headlineB:  'సునిశిత',
    headlineC:  'సంరక్షణ.',
    desc:       'రోగులు, క్యూ, సంప్రదింపులు, బిల్లింగ్, ఫార్మసీ మరియు స్టాక్ కోసం ఒకే వర్క్‌స్పేస్.',
    statRoles:    'పాత్రలు',
    statModules:  'మాడ్యూల్స్',
    statSearch:   'ఎక్కడైనా',
    estLine:    'క్లినిక్ కార్యకలాపాలు · స్థా. 2026',
    copyright:  '© 2026 Vexoo హెల్త్ సిస్టమ్స్',
    newClinic:  'కొత్త క్లినిక్?',
    register:   'ఇక్కడ నమోదు చేసుకోండి',
    help:       'సహాయం కావాలా?',
    language:   'భాష',
  },
  roles: {
    Admin:        'అడ్మిన్',
    Doctor:       'డాక్టర్',
    Receptionist: 'రిసెప్షన్',
    Pharmacist:   'ఫార్మసిస్ట్',
    LabTech:      'ల్యాబ్ టెక్',
    Patient:      'రోగి',
  },
  nav: {
    dashboard:     'డ్యాష్‌బోర్డ్',
    patients:      'రోగులు',
    appointments:  'అపాయింట్‌మెంట్‌లు',
    emr:           'వైద్య రికార్డులు',
    pharmacy:      'ఫార్మసీ',
    lab:           'ల్యాబ్ & డయాగ్నోస్టిక్స్',
    inventory:     'ఇన్వెంటరీ',
    analytics:     'విశ్లేషణలు',
    notifications: 'నోటిఫికేషన్‌లు',
    logout:        'లాగౌట్',
  },
  common: {
    search:    'శోధన',
    cancel:    'రద్దు',
    save:      'సేవ్',
    confirm:   'నిర్ధారించు',
    loading:   'లోడ్ అవుతోంది…',
    today:     'నేడు',
    yesterday: 'నిన్న',
  },
};

export const LANGS = { en, hi, te };

export type Strings = typeof en;
