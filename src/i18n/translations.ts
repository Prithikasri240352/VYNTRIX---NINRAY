/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedLanguage = 'en' | 'hi' | 'ta';

export interface TranslationDictionary {
  // Common & Navigation
  portalTitle: string;
  councilHindi: string;
  councilEnglish: string;
  ministrySubtext: string;
  yuktiScrutinyBadge: string;
  approvalSessionActive: string;
  wefDate: string;
  searchPlaceholder: string;
  screenReaderAccess: string;
  screenReaderAnnouncement: string;
  webPortalLogin: string;
  switchAccount: string;
  signOut: string;
  loggedInAs: string;
  officialTerminalActive: string;
  secureChannel: string;
  switchDemoAccount: string;

  // Language names
  langEnglish: string;
  langHindi: string;
  langTamil: string;
  selectLanguage: string;

  // Main Tabs
  tabDirectory: string;
  tabScrutiny: string;
  tabPortal: string;
  tabSpoc: string;
  tabCopilot: string;
  tabDocuments: string;
  tabWorkspace: string;

  // Direct Links
  linkApprovedInstitutions: string;
  linkAicteWebsite: string;
  linkPublicNotices: string;

  // Directory View
  directoryTitle: string;
  directorySubtitle: string;
  totalInstitutions: string;
  searchInstitutionsPlaceholder: string;
  allDistricts: string;
  allStatuses: string;
  filterByStatus: string;
  filterByDistrict: string;
  thCollege: string;
  thDistrict: string;
  thPid: string;
  thAppId: string;
  thStatus: string;
  thDocs: string;
  thAction: string;
  btnInspect: string;
  btnScrutiny: string;
  btnCallSpoc: string;
  emptyDirectory: string;

  // Scrutiny Workbench
  scrutinyTitle: string;
  scrutinySubtitle: string;
  sacEvcTitle: string;
  btnRunScrutiny: string;
  scrutinyInProgress: string;
  scrutinyComplete: string;
  validationChecklist: string;
  landBuiltupCheck: string;
  cadreRatioCheck: string;
  fireNocCheck: string;
  structuralCheck: string;
  fdrCheck: string;

  // Document Authenticator
  docVerifierTitle: string;
  docVerifierSubtitle: string;
  uploadDocuments: string;
  dragDropText: string;
  supportedFormatsText: string;
  btnVerifyDocument: string;
  btnConvertPdf: string;
  gpsTimestampTag: string;
  extractedMetadata: string;

  // Compliance Copilot
  copilotTitle: string;
  copilotSubtitle: string;
  askCopilotPlaceholder: string;
  btnAsk: string;
  quickPromptsTitle: string;
  promptLand: string;
  promptFire: string;
  promptCadre: string;
  promptFdr: string;

  // SPOC & Hearing View
  spocTitle: string;
  spocSubtitle: string;
  btnInitiateAudioCall: string;
  btnInitiateVideoCall: string;
  btnScheduleHearing: string;
  spocContactHeading: string;

  // Institution Dashboard
  instDashboardTitle: string;
  instDashboardSubtitle: string;
  mandatoryDocsHeading: string;
  gpsCaptureTitle: string;
  btnCaptureGps: string;
  gpsCapturedSuccess: string;
  btnSubmitApplication: string;
  previousSubmissions: string;

  // Officer Detail View
  backToDirectory: string;
  officerWorkbench: string;
  tabPipeline: string;
  tabInfrastructure: string;
  tabRules: string;
  tabReport: string;
  btnApproveEoa: string;
  btnIssueDeficiency: string;
  btnGenerateReport: string;

  // Yukti Officer Extension
  extensionTitle: string;
  extensionSubtitle: string;
  extensionSroBadge: string;
  extensionReadyHeadline: string;
  extensionReadySubtext: string;
  extensionPrivacyNote: string;
  btnViewQueue: string;
  btnHideQueue: string;
  queueTitle: string;
  searchQueuePlaceholder: string;

  // 8 Queue Sections
  secAll: string;
  secNewSubmissions: string;
  secPendingReviews: string;
  secAwaitingDocs: string;
  secClarificationReq: string;
  secResubmissions: string;
  secIncompleteExpired: string;
  secAnomalies: string;
  secCompleted: string;

  // Workload Matrix
  statNew: string;
  statAwaiting: string;
  statVerified: string;
  statAttention: string;
  btnListen: string;

  // Speech & Voice Controls
  voiceTitle: string;
  btnVoiceBriefing: string;
  btnStopVoice: string;
  btnTestVoice: string;
  btnRefreshSummary: string;
  tooltipMuteVoice: string;
  tooltipUnmuteVoice: string;
  voiceAutoplayNotice: string;
  btnPlayAudio: string;
  voiceTamilFallbackNotice: string;

  // Footer & Social
  footerCouncilTitle: string;
  footerCouncilSub: string;
  footerQuickLinks: string;
  footerContactUs: string;
  footerLegal: string;
  footerAddress: string;
  footerPhone: string;
  footerEmail: string;
  footerCopyright: string;

  // Mobile navigation
  mobileMenuToggle: string;
  mobileMenuClose: string;
  mobileNavigation: string;

  // Statuses
  statusVerified: string;
  statusIssuerConfirmed: string;
  statusMatched: string;
  statusAiChecked: string;
  statusIncomplete: string;
  statusExpired: string;
  statusInconsistent: string;
  statusAnomaly: string;
  statusUnableToVerify: string;
  statusHumanReview: string;
  statusApproved: string;
  statusUnderScrutiny: string;
  statusClarificationReq: string;
  statusDeficiencyIssued: string;
  statusDraft: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    portalTitle: 'Nirnay — Application Validation & Compliance Assistant',
    councilHindi: 'निर्णय — विनियामक सत्यापन एवं अनुपालन मंच',
    councilEnglish: 'Nirnay — Regulatory Validation & Compliance Portal',
    ministrySubtext: 'Technical Education Approval & Automated Scrutiny System',
    yuktiScrutinyBadge: 'Nirnay Scrutiny Portal 2026-27',
    approvalSessionActive: 'Approval Process 2026-2027 Active',
    wefDate: 'w.e.f 28th Nov, 2025',
    searchPlaceholder: 'Search circulars, institutions, APH norms...',
    screenReaderAccess: 'Screen Reader Access',
    screenReaderAnnouncement: 'Welcome to Nirnay Automated Scrutiny & Compliance Assistant',
    webPortalLogin: 'Web Portal Login',
    switchAccount: 'Switch Role / Account',
    signOut: 'Sign Out',
    loggedInAs: 'Logged in as',
    officialTerminalActive: 'Official Terminal Active',
    secureChannel: 'Secure Channel: NIRNAY-SRO-TN-EAL4+',
    switchDemoAccount: 'Switch Demo Account',

    langEnglish: 'English',
    langHindi: 'हिन्दी',
    langTamil: 'தமிழ்',
    selectLanguage: 'Select Language',

    tabDirectory: 'TN College Directory',
    tabScrutiny: 'Nirnay Scrutiny Engine',
    tabPortal: 'Approval Portal',
    tabSpoc: 'SPOC & Hearings',
    tabCopilot: 'APH Compliance Copilot',
    tabDocuments: 'Document Authenticator',
    tabWorkspace: 'My College EOA Workspace',

    linkApprovedInstitutions: 'Approved Institutions',
    linkAicteWebsite: 'AICTE Website',
    linkPublicNotices: 'Public Notice',

    directoryTitle: 'Tamil Nadu Approved Technical Institutions Directory',
    directorySubtitle: 'Southern Regional Office (SRO Chennai) · Regulatory EOA Dossier & Real-time Scrutiny Tracking',
    totalInstitutions: 'Total Institutions',
    searchInstitutionsPlaceholder: 'Search college name, PID, application ID, or district...',
    allDistricts: 'All Districts',
    allStatuses: 'All Compliance Statuses',
    filterByStatus: 'Filter by Status',
    filterByDistrict: 'Filter by District',
    thCollege: 'College / Institution',
    thDistrict: 'District',
    thPid: 'AICTE PID',
    thAppId: 'Application ID',
    thStatus: 'EOA Status',
    thDocs: 'Documents',
    thAction: 'Action',
    btnInspect: 'Inspect Application',
    btnScrutiny: 'Launch Scrutiny',
    btnCallSpoc: 'Contact SPOC',
    emptyDirectory: 'No institutions found matching the search criteria.',

    scrutinyTitle: 'Nirnay Automated Scrutiny Engine',
    scrutinySubtitle: 'Standing Appellate Committee (SAC) & Expert Verification Committee (EVC) AI Workbench',
    sacEvcTitle: 'AI-Assisted Scrutiny & Deficiency Extraction (AY 2026-27)',
    btnRunScrutiny: 'Execute Automated Scrutiny',
    scrutinyInProgress: 'Running APH Compliance Pipeline...',
    scrutinyComplete: 'Scrutiny Execution Completed',
    validationChecklist: 'Statutory Verification Checklist',
    landBuiltupCheck: 'Land & Built-up Area Contiguity',
    cadreRatioCheck: 'Faculty Cadre & SFR 1:20 Norms',
    fireNocCheck: 'TNFRS Fire Safety NOC Validity',
    structuralCheck: 'PWD / Structural Stability Endorsement',
    fdrCheck: 'Joint Fixed Deposit Receipt (Lien Verified)',

    docVerifierTitle: 'Nirnay Document Authenticator & OCR Pipeline',
    docVerifierSubtitle: 'Tamper-Evident Forensic Validation & GPS Geotag Verification',
    uploadDocuments: 'Upload Institutional Documents',
    dragDropText: 'Drag and drop PDF or image documents here, or click to browse',
    supportedFormatsText: 'Supported: PDF, JPG, PNG, TIFF (Max 25MB per file)',
    btnVerifyDocument: 'Verify Document',
    btnConvertPdf: 'Convert to Archival PDF',
    gpsTimestampTag: 'GPS & Hardware Geotag Verified',
    extractedMetadata: 'Extracted OCR & Metadata Fields',

    copilotTitle: 'Nirnay APH Compliance Copilot',
    copilotSubtitle: 'Intelligent Query Engine for Approval Process Handbook 2024–27 & Gazette Amendments',
    askCopilotPlaceholder: 'Ask a question regarding APH clauses, land norms, faculty cadre...',
    btnAsk: 'Ask Nirnay',
    quickPromptsTitle: 'Suggested Statutory Queries',
    promptLand: 'Land & Built-up Norms for Tamil Nadu',
    promptFire: 'TNFRS Fire Safety NOC Rules',
    promptCadre: 'Faculty Cadre Ratio 1:2:6 & SFR 1:20',
    promptFdr: 'Joint FDR Pledging Requirements',

    spocTitle: 'Institution SPOC & Quasi-Judicial Hearing Portal',
    spocSubtitle: 'Direct WebRTC Communications & Deficiency Redressal with Regional Officers',
    btnInitiateAudioCall: 'Initiate Audio Call',
    btnInitiateVideoCall: 'Initiate Video Hearing',
    btnScheduleHearing: 'Schedule Formal Hearing',
    spocContactHeading: 'Authorized Institutional SPOC Details',

    instDashboardTitle: 'Extension of Approval (EOA) Application Portal',
    instDashboardSubtitle: 'Academic Year 2026-2027 · Mandatory Document Dossier Submission',
    mandatoryDocsHeading: 'Mandatory Institutional Compliance Submissions',
    gpsCaptureTitle: 'Geographic Location Verification (GPS Geofence)',
    btnCaptureGps: 'Capture Current Device Coordinates',
    gpsCapturedSuccess: 'Institutional Coordinates Validated',
    btnSubmitApplication: 'Submit EOA Application Dossier',
    previousSubmissions: 'Submission History & Previous Versions',

    backToDirectory: 'Back to Institutions Directory',
    officerWorkbench: 'AICTE Officer Scrutiny Terminal',
    tabPipeline: 'Verification Pipeline',
    tabInfrastructure: 'Infrastructure & Land',
    tabRules: 'Compliance Rules Engine',
    tabReport: 'Scrutiny Report & Export',
    btnApproveEoa: 'Grant Recommended Approval',
    btnIssueDeficiency: 'Issue Formal Deficiency Notice',
    btnGenerateReport: 'Generate Official PDF Scrutiny Report',

    extensionTitle: 'Nirnay — Verification Assistant',
    extensionSubtitle: 'Nirnay Service Desk · Regulatory Assistant',
    extensionSroBadge: 'SRO Chennai',
    extensionReadyHeadline: 'Nirnay — Verification Assistant',
    extensionReadySubtext: '“Your verification workspace is ready.”',
    extensionPrivacyNote: 'All newly received submissions, college names, and pending document counts are protected under AICTE Officer Privacy Policy (EAL4+).',
    btnViewQueue: 'View Verification Queue',
    btnHideQueue: 'Hide Queue',
    queueTitle: 'Protected Verification Queue',
    searchQueuePlaceholder: 'Search by college name, PID, application ID, or district...',

    secAll: 'All Applications',
    secNewSubmissions: 'Newly Received',
    secPendingReviews: 'Pending Review',
    secAwaitingDocs: 'Awaiting Verification',
    secClarificationReq: 'Clarification Requested',
    secResubmissions: 'Resubmissions',
    secIncompleteExpired: 'Expired / Incomplete',
    secAnomalies: 'Anomalies & Flags',
    secCompleted: 'Approved / Completed',

    statNew: 'New',
    statAwaiting: 'Awaiting',
    statVerified: 'Verified',
    statAttention: 'Attention',
    btnListen: 'Listen',

    voiceTitle: 'Voice Intelligence',
    btnVoiceBriefing: 'Voice Briefing',
    btnStopVoice: 'Stop',
    btnTestVoice: 'Test Voice',
    btnRefreshSummary: 'Refresh Data',
    tooltipMuteVoice: 'Mute Voice Audio',
    tooltipUnmuteVoice: 'Unmute Voice Audio',
    voiceAutoplayNotice: 'Your briefing is ready. Browser autoplay requires a click.',
    btnPlayAudio: 'Play Audio',
    voiceTamilFallbackNotice: 'Tamil speech voice not installed on device. Falling back to English announcement.',

    footerCouncilTitle: 'All India Council for Technical Education',
    footerCouncilSub: 'Nelson Mandela Marg, Vasant Kunj, New Delhi-110070',
    footerQuickLinks: 'Quick Links',
    footerContactUs: 'Regional Office Contact',
    footerLegal: 'Legal & Compliance',
    footerAddress: 'Southern Regional Office (SRO), AICTE, Shastri Bhavan, 26 Haddows Road, Nungambakkam, Chennai 600006',
    footerPhone: 'Phone: 044-28275650 / 28279998',
    footerEmail: 'Email: sro@aicte-india.org',
    footerCopyright: '© 2026 All India Council for Technical Education. All Rights Reserved. Govt. of India.',

    mobileMenuToggle: 'Open Navigation Menu',
    mobileMenuClose: 'Close Navigation Menu',
    mobileNavigation: 'Navigation',

    statusVerified: 'Verified against an authorised source',
    statusIssuerConfirmed: 'Issuer-confirmed',
    statusMatched: 'Matched to an authorised record',
    statusAiChecked: 'AI-checked only',
    statusIncomplete: 'Incomplete',
    statusExpired: 'Expired',
    statusInconsistent: 'Inconsistent',
    statusAnomaly: 'Potential anomaly',
    statusUnableToVerify: 'Unable to verify',
    statusHumanReview: 'Requires human review',
    statusApproved: 'Approved / Compliant',
    statusUnderScrutiny: 'Under Automated Scrutiny',
    statusClarificationReq: 'Clarification Required',
    statusDeficiencyIssued: 'Deficiency Issued',
    statusDraft: 'Draft'
  },
  hi: {
    portalTitle: 'निर्णय — आवेदन सत्यापन एवं अनुपालन सहायक',
    councilHindi: 'निर्णय — विनियामक सत्यापन एवं अनुपालन मंच',
    councilEnglish: 'Nirnay — Regulatory Validation & Compliance Portal',
    ministrySubtext: 'तकनीकी शिक्षा अनुमोदन एवं स्वचालित जांच प्रणाली',
    yuktiScrutinyBadge: 'निर्णय जांच पोर्टल 2026-27',
    approvalSessionActive: 'अनुमोदन प्रक्रिया 2026-2027 सक्रिय',
    wefDate: 'प्रभावी तिथि 28 नवंबर, 2025',
    searchPlaceholder: 'परिपत्र, संस्थान, ए.पी.एच. मानक खोजें...',
    screenReaderAccess: 'स्क्रीन रीडर अभिगम्यता',
    screenReaderAnnouncement: 'निर्णय स्वचालित जांच एवं अनुपालन पोर्टल में आपका स्वागत है',
    webPortalLogin: 'वेब पोर्टल लॉगिन',
    switchAccount: 'भूमिका / खाता बदलें',
    signOut: 'लॉग आउट',
    loggedInAs: 'लॉगिन स्थिति',
    officialTerminalActive: 'आधिकारिक टर्मिनल सक्रिय',
    secureChannel: 'सुरक्षित चैनल: NIRNAY-SRO-TN-EAL4+',
    switchDemoAccount: 'डेमो खाता बदलें',

    langEnglish: 'English',
    langHindi: 'हिन्दी',
    langTamil: 'தமிழ்',
    selectLanguage: 'भाषा चुनें',

    tabDirectory: 'तमिलनाडु कॉलेज निर्देशिका',
    tabScrutiny: 'निर्णय स्वचालित जांच इंजन',
    tabPortal: 'मुख्य पोर्टल',
    tabSpoc: 'एसपीओसी / सुनवाई',
    tabCopilot: 'अनुपालन सहायक',
    tabDocuments: 'दस्तावेज़ सत्यापन',
    tabWorkspace: 'मेरा संस्थान कार्यक्षेत्र',

    linkApprovedInstitutions: 'स्वीकृत संस्थान',
    linkAicteWebsite: 'एआईसीटीई वेबसाइट',
    linkPublicNotices: 'सार्वजनिक सूचना',

    directoryTitle: 'तमिलनाडु स्वीकृत तकनीकी संस्थान निर्देशिका',
    directorySubtitle: 'दक्षिणी क्षेत्रीय कार्यालय (एसआरओ चेन्नई) · विनियामक ईओए डोज़ियर एवं वास्तविक समय जांच',
    totalInstitutions: 'कुल संस्थान',
    searchInstitutionsPlaceholder: 'कॉलेज नाम, पीआईडी, आवेदन संख्या या जिला खोजें...',
    allDistricts: 'सभी जिले',
    allStatuses: 'सभी अनुपालन स्थितियां',
    filterByStatus: 'स्थिति के अनुसार छांटें',
    filterByDistrict: 'जिले के अनुसार छांटें',
    thCollege: 'कॉलेज / संस्थान',
    thDistrict: 'जिला',
    thPid: 'एआईसीटीई पीआईडी',
    thAppId: 'आवेदन संख्या',
    thStatus: 'ईओए स्थिति',
    thDocs: 'दस्तावेज़',
    thAction: 'कार्यवाही',
    btnInspect: 'आवेदन निरीक्षण',
    btnScrutiny: 'जांच प्रारंभ करें',
    btnCallSpoc: 'एसपीओसी से संपर्क',
    emptyDirectory: 'खोज मानदंडों से मेल खाने वाले कोई संस्थान नहीं मिले।',

    scrutinyTitle: 'निर्णय स्वचालित जांच इंजन',
    scrutinySubtitle: 'स्थायी अपीलीय समिति (एसएसी) एवं विशेषज्ञ सत्यापन समिति (ईवीसी) एआई कार्यपीठ',
    sacEvcTitle: 'एआई-सहायक जांच एवं कमी निष्कर्षण (सत्र 2026-27)',
    btnRunScrutiny: 'स्वचालित जांच चलाएं',
    scrutinyInProgress: 'ए.पी.एच. अनुपालन प्रक्रिया चल रही है...',
    scrutinyComplete: 'जांच निष्पादन पूर्ण हुआ',
    validationChecklist: 'सांविधिक सत्यापन चेकलिस्ट',
    landBuiltupCheck: 'भूमि एवं निर्मित क्षेत्र निरंतरता',
    cadreRatioCheck: 'संकाय संवर्ग एवं एसएफआर 1:20 मानक',
    fireNocCheck: 'तमिलनाडु अग्निशमन एनओसी वैधता',
    structuralCheck: 'पीडब्ल्यूडी संरचनात्मक स्थिरता प्रमाणन',
    fdrCheck: 'संयुक्त सावधि जमा रसीद (ग्रहणाधिकार सत्यापित)',

    docVerifierTitle: 'निर्णय दस्तावेज़ प्रमाणक एवं ओसीआर पाइपलाइन',
    docVerifierSubtitle: 'छेड़छाड़-रोधी फोरेंसिक सत्यापन एवं जीपीएस जियोटैग सत्यापन',
    uploadDocuments: 'संस्थागत दस्तावेज़ अपलोड करें',
    dragDropText: 'यहाँ पीडीएफ या छवि दस्तावेज़ खींचें और छोड़ें, या चयन करने के लिए क्लिक करें',
    supportedFormatsText: 'समर्थित प्रारूप: PDF, JPG, PNG, TIFF (अधिकतम 25MB प्रति फ़ाइल)',
    btnVerifyDocument: 'दस्तावेज़ सत्यापित करें',
    btnConvertPdf: 'अभिलेखागार पीडीएफ में बदलें',
    gpsTimestampTag: 'जीपीएस एवं हार्डवेयर जियोटैग सत्यापित',
    extractedMetadata: 'निष्कर्षित ओसीआर एवं मेटाडेटा फ़ील्ड',

    copilotTitle: 'निर्णय ए.पी.एच. अनुपालन सहायक',
    copilotSubtitle: 'अनुमोदन प्रक्रिया पुस्तिका 2024–27 एवं राजपत्र संशोधनों हेतु बुद्धिमान परामर्श इंजन',
    askCopilotPlaceholder: 'ए.पी.एच. नियमों, भूमि मानकों, संकाय अनुपात के बारे में पूछें...',
    btnAsk: 'निर्णय से पूछें',
    quickPromptsTitle: 'सुझाए गए विनियामक प्रश्न',
    promptLand: 'तमिलनाडु हेतु भूमि एवं निर्मित क्षेत्र मानक',
    promptFire: 'तमिलनाडु अग्निशमन सुरक्षा एनओसी नियम',
    promptCadre: 'संकाय संवर्ग अनुपात 1:2:6 एवं एसएफआर 1:20',
    promptFdr: 'संयुक्त एफडीआर गिरवी रखने की आवश्यकताएं',

    spocTitle: 'संस्थान एसपीओसी एवं अर्ध-न्यायिक सुनवाई पोर्टल',
    spocSubtitle: 'क्षेत्रीय अधिकारियों के साथ सीधा वेबआरटीसी संचार एवं विसंगति निवारण',
    btnInitiateAudioCall: 'ऑडियो कॉल प्रारंभ करें',
    btnInitiateVideoCall: 'वीडियो सुनवाई प्रारंभ करें',
    btnScheduleHearing: 'औपचारिक सुनवाई निर्धारित करें',
    spocContactHeading: 'अधिकृत संस्थागत एसपीओसी विवरण',

    instDashboardTitle: 'अनुमोदन विस्तार (ईओए) आवेदन पोर्टल',
    instDashboardSubtitle: 'शैक्षणिक सत्र 2026-2027 · अनिवार्य दस्तावेज़ डोज़ियर प्रस्तुतीकरण',
    mandatoryDocsHeading: 'अनिवार्य संस्थागत अनुपालन प्रस्तुतियाँ',
    gpsCaptureTitle: 'भौगोलिक स्थिति सत्यापन (जीपीएस जियोफेंसिंग)',
    btnCaptureGps: 'वर्तमान डिवाइस निर्देशांक कैप्चर करें',
    gpsCapturedSuccess: 'संस्थागत निर्देशांक सफलतापूर्वक सत्यापित',
    btnSubmitApplication: 'ईओए आवेदन डोज़ियर जमा करें',
    previousSubmissions: 'प्रस्तुति इतिहास एवं पिछले संस्करण',

    backToDirectory: 'संस्थान निर्देशिका पर वापस जाएं',
    officerWorkbench: 'एआईसीटीई अधिकारी जांच टर्मिनल',
    tabPipeline: 'सत्यापन पाइपलाइन',
    tabInfrastructure: 'बुनियादी ढांचा एवं भूमि',
    tabRules: 'अनुपालन नियम इंजन',
    tabReport: 'जांच रिपोर्ट एवं निर्यात',
    btnApproveEoa: 'अनुशंसा अनुमोदन प्रदान करें',
    btnIssueDeficiency: 'औपचारिक कमी नोटिस जारी करें',
    btnGenerateReport: 'आधिकारिक पीडीएफ जांच रिपोर्ट बनाएं',

    extensionTitle: 'निर्णय — सत्यापन सहायक',
    extensionSubtitle: 'निर्णय सेवा डेस्क · विनियामक सहायक',
    extensionSroBadge: 'एसआरओ चेन्नई',
    extensionReadyHeadline: 'निर्णय — सत्यापन सहायक',
    extensionReadySubtext: '“आपका सत्यापन कार्यक्षेत्र तैयार है।”',
    extensionPrivacyNote: 'सभी नव प्राप्त प्रस्तुतियां, कॉलेज नाम एवं लंबित दस्तावेज़ संख्या एआईसीटीई अधिकारी गोपनीयता नीति (EAL4+) के तहत सुरक्षित हैं।',
    btnViewQueue: 'सत्यापन कतार देखें',
    btnHideQueue: 'कतार छुपाएं',
    queueTitle: 'सुरक्षित सत्यापन कतार',
    searchQueuePlaceholder: 'कॉलेज नाम, पीआईडी, आवेदन संख्या या जिले द्वारा खोजें...',

    secAll: 'सभी आवेदन',
    secNewSubmissions: 'नव प्राप्त प्रस्तुतियाँ',
    secPendingReviews: 'लंबित प्रारंभिक समीक्षा',
    secAwaitingDocs: 'सत्यापन हेतु प्रतीक्षित',
    secClarificationReq: 'स्पष्टीकरण अपेक्षित',
    secResubmissions: 'पुनः प्रस्तुतियाँ',
    secIncompleteExpired: 'अपूर्ण / समाप्त दस्तावेज़',
    secAnomalies: 'विसंगतियाँ एवं विसंगत ध्वज',
    secCompleted: 'स्वीकृत / पूर्ण आवेदन',

    statNew: 'नया',
    statAwaiting: 'प्रतीक्षित',
    statVerified: 'सत्यापित',
    statAttention: 'ध्यान दें',
    btnListen: 'सुनें',

    voiceTitle: 'ध्वनि आसूचना',
    btnVoiceBriefing: 'ध्वनि ब्रीफिंग',
    btnStopVoice: 'रोकें',
    btnTestVoice: 'ध्वनि परीक्षण',
    btnRefreshSummary: 'डेटा ताज़ा करें',
    tooltipMuteVoice: 'ध्वनि म्यूट करें',
    tooltipUnmuteVoice: 'ध्वनि अनम्यूट करें',
    voiceAutoplayNotice: 'आपकी ब्रीफिंग तैयार है। ब्राउज़र स्वतः प्ले हेतु एक क्लिक आवश्यक है।',
    btnPlayAudio: 'ऑडियो चलाएं',
    voiceTamilFallbackNotice: 'डिवाइस पर तमिल आवाज स्थापित नहीं है। अंग्रेजी घोषणा का उपयोग किया जा रहा है।',

    footerCouncilTitle: 'अखिल भारतीय तकनीकी शिक्षा परिषद्',
    footerCouncilSub: 'नेल्सन मंडेला मार्ग, वसंत कुंज, नई दिल्ली-110070',
    footerQuickLinks: 'त्वरित लिंक',
    footerContactUs: 'क्षेत्रीय कार्यालय संपर्क',
    footerLegal: 'कानूनी एवं अनुपालन',
    footerAddress: 'दक्षिणी क्षेत्रीय कार्यालय (एसआरओ), एआईसीटीई, शास्त्री भवन, 26 हैडोज़ रोड, नुंगमबक्कम, चेन्नई 600006',
    footerPhone: 'दूरभाष: 044-28275650 / 28279998',
    footerEmail: 'ईमेल: sro@aicte-india.org',
    footerCopyright: '© 2026 अखिल भारतीय तकनीकी शिक्षा परिषद्। सर्वाधिकार सुरक्षित। भारत सरकार।',

    mobileMenuToggle: 'नेविगेशन मेनू खोलें',
    mobileMenuClose: 'नेविगेशन मेनू बंद करें',
    mobileNavigation: 'नेविगेशन',

    statusVerified: 'अधिकृत स्रोत से सत्यापित',
    statusIssuerConfirmed: 'जारीकर्ता द्वारा पुष्ट',
    statusMatched: 'अधिकृत रिकॉर्ड से मेल खाया',
    statusAiChecked: 'केवल एआई द्वारा जांचा गया',
    statusIncomplete: 'अपूर्ण दस्तावेज़',
    statusExpired: 'समाप्त हो चुका',
    statusInconsistent: 'परस्पर विरोधी / असंगत',
    statusAnomaly: 'संभावित विसंगति',
    statusUnableToVerify: 'सत्यापित करने में असमर्थ',
    statusHumanReview: 'मानव समीक्षा आवश्यक',
    statusApproved: 'स्वीकृत / अनुपालन पूर्ण',
    statusUnderScrutiny: 'स्वचालित जांच के अधीन',
    statusClarificationReq: 'स्पष्टीकरण अपेक्षित',
    statusDeficiencyIssued: 'कमी नोटिस जारी',
    statusDraft: 'प्रारूप'
  },
  ta: {
    portalTitle: 'நிர்ணய் — விண்ணப்ப சரிபார்ப்பு மற்றும் இணக்கத் துணை',
    councilHindi: 'निर्णय — विनियामक सत्यापन एवं अनुपालन मंच',
    councilEnglish: 'Nirnay — Regulatory Validation & Compliance Portal',
    ministrySubtext: 'தொழில்நுட்பக் கல்வி ஒப்புதல் மற்றும் தானியங்கி ஆய்வு அமைப்பு',
    yuktiScrutinyBadge: 'நிர்ணய் ஆய்வு தளம் 2026-27',
    approvalSessionActive: 'ஒப்புதல் செயல்முறை 2026-2027 செயலில் உள்ளது',
    wefDate: 'செயல்முறை தொடக்கம்: 28 நவம்பர், 2025',
    searchPlaceholder: 'அறிவிப்புகள், கல்லூரிகள், விதிகளைத் தேடவும்...',
    screenReaderAccess: 'திரை வாசகர் அணுகல்',
    screenReaderAnnouncement: 'நிர்ணய் தானியங்கி ஆய்வு தளத்திற்கு நல்வரவு',
    webPortalLogin: 'வலைத்தள உள்நுழைவு',
    switchAccount: 'பொறுப்பு / கணக்கை மாற்றவும்',
    signOut: 'வெளியேறு',
    loggedInAs: 'உள்நுழைவு விவரம்',
    officialTerminalActive: 'அதிகாரப்பூர்வ முனையம் செயலில் உள்ளது',
    secureChannel: 'பாதுகாப்பான இணைப்பு: NIRNAY-SRO-TN-EAL4+',
    switchDemoAccount: 'மாதிரிக் கணக்கை மாற்றவும்',

    langEnglish: 'English',
    langHindi: 'हिन्दी',
    langTamil: 'தமிழ்',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',

    tabDirectory: 'தமிழ்நாடு கல்லூரி அடைவு',
    tabScrutiny: 'நிர்ணய் தானியங்கி ஆய்வு இயந்திரம்',
    tabPortal: 'முதன்மை தளம்',
    tabSpoc: 'ஸ்போக் / விசாரணை',
    tabCopilot: 'இணக்க வழிகாட்டி',
    tabDocuments: 'ஆவண சரிபார்ப்பு',
    tabWorkspace: 'கல்லூரி பணியிடம்',

    linkApprovedInstitutions: 'அங்கீகரிக்கப்பட்ட கல்லூரிகள்',
    linkAicteWebsite: 'ஏஐசிடிஇ இணையதளம்',
    linkPublicNotices: 'பொது அறிவிப்பு',

    directoryTitle: 'தமிழ்நாடு அங்கீகரிக்கப்பட்ட தொழில்நுட்பக் கல்லூரிகள் அடைவு',
    directorySubtitle: 'தென் மண்டல அலுவலகம் (எஸ்ஆர்ஓ சென்னை) · ஒழுங்குமுறை ஆய்வு மற்றும் கண்காணிப்பு',
    totalInstitutions: 'மொத்த நிறுவனங்கள்',
    searchInstitutionsPlaceholder: 'கல்லூரி பெயர், பிஐடி, விண்ணப்ப எண் அல்லது மாவட்டம் தேடவும்...',
    allDistricts: 'அனைத்து மாவட்டங்கள்',
    allStatuses: 'அனைத்து நிலைகளும்',
    filterByStatus: 'நிலை வாரியாக வடிகட்டவும்',
    filterByDistrict: 'மாவட்ட வாரியாக வடிகட்டவும்',
    thCollege: 'கல்லூரி / நிறுவனம்',
    thDistrict: 'மாவட்டம்',
    thPid: 'ஏஐசிடிஇ பிஐடி',
    thAppId: 'விண்ணப்ப எண்',
    thStatus: 'ஒப்புதல் நிலை',
    thDocs: 'ஆவணங்கள்',
    thAction: 'செயல்பாடு',
    btnInspect: 'விண்ணப்பத்தை ஆய்வு செய்',
    btnScrutiny: 'ஆய்வைத் தொடங்கு',
    btnCallSpoc: 'ஸ்போக் தொடர்பு',
    emptyDirectory: 'தேடல் வரம்புகளுக்கு ஏற்ப கல்லூரிகள் எதுவும் கிடைக்கவில்லை.',

    scrutinyTitle: 'நிர்ணய் தானியங்கி ஆய்வு இயந்திரம்',
    scrutinySubtitle: 'மேல்முறையீட்டுக் குழு (எஸ்ஏசி) மற்றும் நிபுணர் சரிபார்ப்புக் குழு (இவிசி) ஏஐ பணித்தளம்',
    sacEvcTitle: 'ஏஐ உதவியுடன் கூடிய ஆய்வு மற்றும் குறைபாடு பகுப்பாய்வு (2026-27)',
    btnRunScrutiny: 'தானியங்கி ஆய்வை இயக்கு',
    scrutinyInProgress: 'ஒழுங்குமுறை விதிகள் சரிபார்க்கப்படுகின்றன...',
    scrutinyComplete: 'ஆய்வு வெற்றிகரமாக முடிந்தது',
    validationChecklist: 'சட்டப்பூர்வ சரிபார்ப்பு பட்டியல்',
    landBuiltupCheck: 'நிலம் மற்றும் கட்டிடப் பரப்பளவு இணக்கம்',
    cadreRatioCheck: 'பேராசிரியர் விகிதம் மற்றும் எஸ்எஃப்ஆர் 1:20',
    fireNocCheck: 'தீயணைப்புத் துறை தடையில்லா சான்றிதழ்',
    structuralCheck: 'பொதுப்பணித்துறை கட்டட உறுதிச் சான்று',
    fdrCheck: 'கூட்டு நிலையான வைப்பு ரசீது (சரிபார்க்கப்பட்டது)',

    docVerifierTitle: 'நிர்ணய் ஆவண சரிபார்ப்பு மற்றும் ஓசிஆர் தளம்',
    docVerifierSubtitle: 'மோசடி தடுப்பு தடயவியல் சரிபார்ப்பு மற்றும் ஜிபிஎஸ் இருப்பிட ஆய்வு',
    uploadDocuments: 'கல்லூரி ஆவணங்களை பதிவேற்றவும்',
    dragDropText: 'பிடிஎஃப் அல்லது பட ஆவணங்களை இங்கே இழுத்துப் போடவும் அல்லது தேர்ந்தெடுக்க கிளிக் செய்யவும்',
    supportedFormatsText: 'ஆதரிக்கப்படும் வடிவங்கள்: PDF, JPG, PNG, TIFF (ஒரு கோப்பிற்கு அதிகபட்சம் 25MB)',
    btnVerifyDocument: 'ஆவணத்தைச் சரிபார்க்கவும்',
    btnConvertPdf: 'காப்பக பிடிஎஃப் ஆக மாற்றவும்',
    gpsTimestampTag: 'ஜிபிஎஸ் இருப்பிடம் உறுதிப்படுத்தப்பட்டது',
    extractedMetadata: 'பிரித்தெடுக்கப்பட்ட ஓசிஆர் விவரங்கள்',

    copilotTitle: 'நிர்ணய் ஒழுங்குமுறை இணக்க வழிகாட்டி',
    copilotSubtitle: 'ஒப்புதல் செயல்முறை கையேடு 2024–27 மற்றும் அரசு விதிகளுக்கான அறிவுசார் இயந்திரம்',
    askCopilotPlaceholder: 'விதிகள், நிலப்பரப்பு, பேராசிரியர்கள் குறித்து கேளுங்கள்...',
    btnAsk: 'நிர்ணயிடம் கேட்கவும்',
    quickPromptsTitle: 'பரிந்துரைக்கப்பட்ட வினாக்கள்',
    promptLand: 'தமிழ்நாட்டிற்கான நிலம் மற்றும் கட்டட விதிகள்',
    promptFire: 'தீயணைப்பு பாதுகாப்பு தடையில்லா சான்றிதழ் விதிகள்',
    promptCadre: 'பேராசிரியர் விகிதம் 1:2:6 மற்றும் மாணவர்-ஆசிரியர் விகிதம் 1:20',
    promptFdr: 'கூட்டு எஃப்டிஆர் வைப்புத் தேவைகள்',

    spocTitle: 'நிறுவன ஸ்போக் மற்றும் விசாரணை தளம்',
    spocSubtitle: 'மண்டல அதிகாரிகளுடன் நேரடி வெப்ஆர்டிசி தொடர்பு மற்றும் குறைதீர்ப்பு',
    btnInitiateAudioCall: 'ஆடியோ அழைப்பைத் தொடங்கு',
    btnInitiateVideoCall: 'வீடியோ விசாரணையைத் தொடங்கு',
    btnScheduleHearing: 'விசாரணை நேரத்தைத் திட்டமிடு',
    spocContactHeading: 'அங்கீகரிக்கப்பட்ட ஸ்போக் தொடர்பு விவரங்கள்',

    instDashboardTitle: 'ஒப்புதல் நீட்டிப்பு (EOA) விண்ணப்ப தளம்',
    instDashboardSubtitle: 'கல்வியாண்டு 2026-2027 · கட்டாய ஆவணப் பட்டியல் சமர்ப்பிப்பு',
    mandatoryDocsHeading: 'கட்டாய நிறுவன இணக்க ஆவணங்கள்',
    gpsCaptureTitle: 'புவியியல் இருப்பிட சரிபார்ப்பு (GPS Geofence)',
    btnCaptureGps: 'தற்போதைய சாதன இருப்பிடத்தைப் பதிவு செய்',
    gpsCapturedSuccess: 'இருப்பிட ஆயத்தொலைவுகள் சரிபார்க்கப்பட்டன',
    btnSubmitApplication: 'விண்ணப்பத்தை சமர்ப்பிக்கவும்',
    previousSubmissions: 'சமர்ப்பிப்பு வரலாறு மற்றும் முந்தைய பதிப்புகள்',

    backToDirectory: 'கல்லூரி அடைவிற்குத் திரும்பு',
    officerWorkbench: 'ஏஐசிடிஇ அதிகாரி ஆய்வு முனையம்',
    tabPipeline: 'சரிபார்ப்பு செயல்முறை',
    tabInfrastructure: 'கட்டமைப்பு மற்றும் நிலம்',
    tabRules: 'இணக்க விதிமுறைகள்',
    tabReport: 'ஆய்வு அறிக்கை மற்றும் ஏற்றுமதி',
    btnApproveEoa: 'பரிந்துரைக்கப்பட்ட ஒப்புதல் வழங்கு',
    btnIssueDeficiency: 'குறைபாடு அறிவிப்பை வெளியிடு',
    btnGenerateReport: 'அதிகாரப்பூர்வ பிடிஎஃப் அறிக்கை உருவாக்கு',

    extensionTitle: 'நிர்ணய் — சரிபார்ப்புத் துணை',
    extensionSubtitle: 'நிர்ணய் சேவை மையம் · ஒழுங்குமுறை துணை',
    extensionSroBadge: 'எஸ்ஆர்ஓ சென்னை',
    extensionReadyHeadline: 'நிர்ணய் — சரிபார்ப்புத் துணை',
    extensionReadySubtext: '“உங்கள் சரிபார்ப்புப் பணியிடம் தயாராக உள்ளது.”',
    extensionPrivacyNote: 'அனைத்து புதிய சமர்ப்பிப்புகள், கல்லூரி பெயர்கள் மற்றும் நிலுவை ஆவணங்களின் எண்ணிக்கை ஏஐசிடிஇ அதிகாரி தனியுரிமைக் கொள்கையின்படி (EAL4+) பாதுகாக்கப்பட்டுள்ளன.',
    btnViewQueue: 'சரிபார்ப்பு வரிசையைக் காண்க',
    btnHideQueue: 'வரிசையை மறைக்கவும்',
    queueTitle: 'பாதுகாக்கப்பட்ட சரிபார்ப்பு வரிசை',
    searchQueuePlaceholder: 'கல்லூரி பெயர், பிஐடி, விண்ணப்ப எண் அல்லது மாவட்டம் மூலம் தேடவும்...',

    secAll: 'அனைத்து விண்ணப்பங்கள்',
    secNewSubmissions: 'புதிதாகப் பெறப்பட்டவை',
    secPendingReviews: 'ஆரம்ப ஆய்வுக்கு நிலுவையில் உள்ளவை',
    secAwaitingDocs: 'சரிபார்ப்புக்கு காத்திருப்பவை',
    secClarificationReq: 'விளக்கம் கோரப்பட்டவை',
    secResubmissions: 'மறுசமர்ப்பிப்புகள்',
    secIncompleteExpired: 'காலாவதியான / முழுமையற்றவை',
    secAnomalies: 'முரண்பாடுகள் மற்றும் சந்தேகங்கள்',
    secCompleted: 'ஒப்புதல் பெற்றவை / முடிந்தவை',

    statNew: 'புதியவை',
    statAwaiting: 'காத்திருப்பு',
    statVerified: 'சரிபார்க்கப்பட்டது',
    statAttention: 'கவனம் தேவை',
    btnListen: 'கேட்க',

    voiceTitle: 'குரல் நுண்ணறிவு',
    btnVoiceBriefing: 'குரல் சுருக்கம்',
    btnStopVoice: 'நிறுத்து',
    btnTestVoice: 'குரல் சோதனை',
    btnRefreshSummary: 'தரவைப் புதுப்பி',
    tooltipMuteVoice: 'குரலை முடக்கு',
    tooltipUnmuteVoice: 'குரலை இயக்கு',
    voiceAutoplayNotice: 'உங்கள் குரல் அறிவிப்பு தயாராக உள்ளது. இயக்க ஒருமுறை கிளிக் செய்யவும்.',
    btnPlayAudio: 'ஆடியோவை இயக்கு',
    voiceTamilFallbackNotice: 'சாதனத்தில் தமிழ் குரல் வசதி இல்லை. ஆங்கில குரல் அறிவிப்பு இயக்கப்படுகிறது.',

    footerCouncilTitle: 'அனைத்திந்திய தொழில்நுட்பக் கல்விக் குழு',
    footerCouncilSub: 'நெல்சன் மண்டேலா மார்க், வசந்த் குஞ்ச், புது தில்லி-110070',
    footerQuickLinks: 'விரைவு இணைப்புகள்',
    footerContactUs: 'மண்டல அலுவலக தொடர்பு',
    footerLegal: 'சட்டம் மற்றும் இணக்கம்',
    footerAddress: 'தென் மண்டல அலுவலகம் (எஸ்ஆர்ஓ), ஏஐசிடிஇ, சாஸ்திரி பவன், 26 ஹாடோஸ் ரோடு, நுங்கம்பாக்கம், சென்னை 600006',
    footerPhone: 'தொலைபேசி: 044-28275650 / 28279998',
    footerEmail: 'மின்னஞ்சல்: sro@aicte-india.org',
    footerCopyright: '© 2026 அனைத்திந்திய தொழில்நுட்பக் கல்விக் குழு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. இந்திய அரசு.',

    mobileMenuToggle: 'மெனுவை திறக்கவும்',
    mobileMenuClose: 'மெனுவை மூடவும்',
    mobileNavigation: 'வழிகாட்டல்',

    statusVerified: 'அங்கீகரிக்கப்பட்ட மூலத்திலிருந்து சரிபார்க்கப்பட்டது',
    statusIssuerConfirmed: 'வழங்கியவரால் உறுதிப்படுத்தப்பட்டது',
    statusMatched: 'அங்கீகரிக்கப்பட்ட பதிவோடு பொருந்தியது',
    statusAiChecked: 'ஏஐ மூலம் மட்டும் சரிபார்க்கப்பட்டது',
    statusIncomplete: 'முழுமையற்ற ஆவணம்',
    statusExpired: 'காலாவதியானது',
    statusInconsistent: 'முரண்பாடானது / பொருத்தமற்றது',
    statusAnomaly: 'சாத்தியமான முரண்பாடு',
    statusUnableToVerify: 'சரிபார்க்க முடியவில்லை',
    statusHumanReview: 'மனித ஆய்வு தேவை',
    statusApproved: 'ஒப்புதல் அளிக்கப்பட்டது / இணக்கமானது',
    statusUnderScrutiny: 'தானியங்கி ஆய்வில் உள்ளது',
    statusClarificationReq: 'விளக்கம் தேவைப்படுகிறது',
    statusDeficiencyIssued: 'குறைபாடு அறிவிப்பு வெளியிடப்பட்டது',
    statusDraft: 'வரைவு நிலை'
  }
};
