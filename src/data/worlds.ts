export interface WorldData {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  mediaType: "video" | "image";
  background: string;
  playlistId: string;
}

export const WORLDS: WorldData[] = [
  {
    id: "1997",
    title: "1997",
    description: "वो साल जहाँ सब कुछ थोड़ा धीमा था।",
    mediaType: "video",
    background: "/Duniya/1997.mp4",
    playlistId: "PL4OqLl4qvLkd0AwxCIJVAD0U3fUAKVzM_",
  },
  {
    id: "general-dibba",
    title: "जनरल डिब्बा",
    description: "सीट मिले या न मिले, सफ़र अपना है।",
    mediaType: "video",
    background: "/Duniya/General Dibba.mp4",
    playlistId: "PLluqBUTOXDHUjNguM2wgfaVJhC0OHTTqB",
  },
  {
    id: "pehli-cutting",
    title: "पहली कटिंग",
    description: "बैठो भैया, कैसी कटिंग करें?",
    mediaType: "video",
    background: "/Duniya/Pehli cutting.mp4",
    playlistId: "PLVwbgC8mRDea4xoSwC0ZNMiIr8OHiaFog",
  },
  {
    id: "chalti-bus",
    title: "चलती बस",
    description: "सीट मिले या ना मिले, गाना चलता रहना चाहिए।",
    mediaType: "video",
    background: "/Duniya/Chalti bus.mp4",
    playlistId: "PL0umg_TNpoZTTdZVIi5tfX69pRmoMFGna",
  },
  {
    id: "khidki-wali-seat",
    title: "खिड़की वाली सीट",
    description: "बाहर रास्ता बदलता रहा, अंदर गाना चलता रहा।",
    mediaType: "video",
    background: "/Duniya/Khidki wali seat.mp4",
    playlistId: "PLQdfb6nEJz_X-0Tkwec2N2Sj83d_DM36d",
  },
  {
    id: "raju-saloon",
    title: "राजू सलून",
    description: "बाल कटेंगे, बातें मुफ्त हैं।",
    mediaType: "video",
    background: "/Duniya/Raju saloon.mp4",
    playlistId: "PLq-bT4s33RYADNkcClDkLPovaKJx0HTDM",
  },
  {
    id: "apna-adda",
    title: "अपना अड्डा",
    description: "जहाँ बिना बुलाए भी दोस्त मिल जाते थे।",
    mediaType: "video",
    background: "/Duniya/Apna Adda.mp4",
    playlistId: "PL-sdNC-scxHZ90pEFtsibiOGF3alAjDt1",
  },
  {
    id: "chai-tapri",
    title: "चाय की टपरी",
    description: "एक चाय, थोड़ी बारिश और बहुत सारी बातें।",
    mediaType: "video",
    background: "/Duniya/Chai tapri.mp4",
    playlistId: "PLNNomYCQbLQRslpaFund4g0dw7UGAUlE0",
  },
  {
    id: "kahin-door",
    title: "कहीं दूर",
    description: "आज बस कहीं दूर जाना है।",
    mediaType: "video",
    background: "/Duniya/Kahin door.mp4",
    playlistId: "PLahHeeDRaiOO3WvdazYlvG3TyqVuKmy-O",
  },
  {
    id: "hanuman-shakti-kendra",
    title: "हनुमान शक्ति केंद्र",
    description: "लोहे से दोस्ती करो।",
    mediaType: "image",
    background: "/Duniya/Hanuman Sakti Kendra.png",
    playlistId: "PLukBxAs_Vyp69OL-v_92bMtdeoVoca29r",
  },
  {
    id: "chhat-pe",
    title: "छत पे",
    subtitle: "कुछ देर यहीं बैठते हैं...",
    description: "सूरज ढल गया है, लेकिन शाम अभी बाकी है।",
    mediaType: "video",
    background: "/Duniya/Chhat wali shaam.mp4",
    playlistId: "PLO6WOx_nE9UI7WTcetgVrt97UCWCNwL27",
  },
];
