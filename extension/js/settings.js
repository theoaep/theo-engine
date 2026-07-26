/* TheoEngine — personalization settings */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const LANGS = [
    ["en", "🇬🇧", "English"], ["es", "🇪🇸", "Español"], ["zh", "🇨🇳", "中文"], ["hi", "🇮🇳", "हिन्दी"],
    ["ar", "🇸🇦", "العربية"], ["pt", "🇧🇷", "Português"], ["fr", "🇫🇷", "Français"], ["ru", "🇷🇺", "Русский"],
    ["ja", "🇯🇵", "日本語"], ["de", "🇩🇪", "Deutsch"]
  ];
  const COLORS = () => JSON.parse(localStorage.getItem("tr_settings_colors") || "{}") || {};
  const T = {
    en: { Settings:"Settings", "Personalize your panel.":"Personalize your panel.", "Your name":"Your name", "Accent colors":"Accent colors", Primary:"Primary", Accent:"Accent", Highlight:"Highlight", Language:"Language", "Reset colors":"Reset colors", Save:"Save", Close:"Close", "Settings saved":"Settings saved." },
    es: { Settings:"Ajustes", "Personalize your panel.":"Personaliza tu panel.", "Your name":"Tu nombre", "Accent colors":"Colores de acento", Primary:"Principal", Accent:"Acento", Highlight:"Resaltado", Language:"Idioma", "Reset colors":"Restablecer colores", Save:"Guardar", Close:"Cerrar", "Settings saved":"Ajustes guardados." },
    fr: { Settings:"Paramètres", "Personalize your panel.":"Personnalisez votre panneau.", "Your name":"Votre nom", "Accent colors":"Couleurs d’accent", Primary:"Principal", Accent:"Accent", Highlight:"Surlignage", Language:"Langue", "Reset colors":"Réinitialiser les couleurs", Save:"Enregistrer", Close:"Fermer", "Settings saved":"Paramètres enregistrés." },
    de: { Settings:"Einstellungen", "Personalize your panel.":"Personalisiere dein Panel.", "Your name":"Dein Name", "Accent colors":"Akzentfarben", Primary:"Primär", Accent:"Akzent", Highlight:"Highlight", Language:"Sprache", "Reset colors":"Farben zurücksetzen", Save:"Speichern", Close:"Schließen", "Settings saved":"Einstellungen gespeichert." },
    pt: { Settings:"Configurações", "Personalize your panel.":"Personalize seu painel.", "Your name":"Seu nome", "Accent colors":"Cores de destaque", Primary:"Primária", Accent:"Acento", Highlight:"Realce", Language:"Idioma", "Reset colors":"Redefinir cores", Save:"Salvar", Close:"Fechar", "Settings saved":"Configurações salvas." },
    zh: { Settings:"设置", "Personalize your panel.":"个性化你的面板。", "Your name":"你的名字", "Accent colors":"主题颜色", Primary:"主色", Accent:"强调色", Highlight:"高亮色", Language:"语言", "Reset colors":"重置颜色", Save:"保存", Close:"关闭", "Settings saved":"设置已保存。" },
    hi: { Settings:"सेटिंग्स", "Personalize your panel.":"अपने पैनल को व्यक्तिगत बनाएं।", "Your name":"आपका नाम", "Accent colors":"रंग", Primary:"मुख्य", Accent:"एक्सेंट", Highlight:"हाइलाइट", Language:"भाषा", "Reset colors":"रंग रीसेट करें", Save:"सहेजें", Close:"बंद करें", "Settings saved":"सेटिंग्स सहेजी गईं।" },
    ar: { Settings:"الإعدادات", "Personalize your panel.":"خصص لوحتك.", "Your name":"اسمك", "Accent colors":"ألوان التمييز", Primary:"أساسي", Accent:"تمييز", Highlight:"إبراز", Language:"اللغة", "Reset colors":"إعادة ضبط الألوان", Save:"حفظ", Close:"إغلاق", "Settings saved":"تم حفظ الإعدادات." },
    ru: { Settings:"Настройки", "Personalize your panel.":"Настройте свою панель.", "Your name":"Ваше имя", "Accent colors":"Цвета акцента", Primary:"Основной", Accent:"Акцент", Highlight:"Подсветка", Language:"Язык", "Reset colors":"Сбросить цвета", Save:"Сохранить", Close:"Закрыть", "Settings saved":"Настройки сохранены." },
    ja: { Settings:"設定", "Personalize your panel.":"パネルをカスタマイズします。", "Your name":"名前", "Accent colors":"アクセントカラー", Primary:"プライマリ", Accent:"アクセント", Highlight:"ハイライト", Language:"言語", "Reset colors":"色をリセット", Save:"保存", Close:"閉じる", "Settings saved":"設定を保存しました。" }
  };
  let lang = localStorage.getItem("tr_settings_language") || "en";
  const text = (key) => (T[lang] && T[lang][key]) || T.en[key] || key;
  function renderLanguage() {
    const grid = $("languageGrid"); grid.innerHTML = "";
    LANGS.forEach(([id, flag, name]) => { const b = document.createElement("button"); b.type = "button"; b.className = "language-choice" + (id === lang ? " active" : ""); b.innerHTML = "<span>" + flag + "</span><b>" + name + "</b>"; b.onclick = () => { lang = id; localStorage.setItem("tr_settings_language", id); renderLanguage(); translate(); }; grid.appendChild(b); });
  }
  function translate() {
    $("settingsTitle").textContent = text("Settings"); $("settingsHint").textContent = text("Personalize your panel."); $("languageLabel").textContent = text("Language"); $("color1Label").textContent = text("Primary"); $("color2Label").textContent = text("Accent"); $("color3Label").textContent = text("Highlight"); $("settingsReset").textContent = text("Reset colors"); $("settingsSave").textContent = text("Save"); $("settingsClose").title = text("Close");
    document.documentElement.lang = lang;
  }
  function load() { const c = Object.assign({}, TR.DEFAULT_COLORS, COLORS()); $("settingsName").value = TR.getName(); $("color1").value = c.g1; $("color2").value = c.g2; $("color3").value = c.g3; renderLanguage(); translate(); }
  $("settingsOpen").onclick = () => { load(); $("settingsModal").classList.remove("hidden"); };
  $("settingsClose").onclick = () => $("settingsModal").classList.add("hidden");
  $("settingsModal").onclick = (e) => { if (e.target === $("settingsModal")) $("settingsModal").classList.add("hidden"); };
  $("settingsReset").onclick = () => { const c = TR.DEFAULT_COLORS; $("color1").value = c.g1; $("color2").value = c.g2; $("color3").value = c.g3; };
  $("settingsSave").onclick = () => { const name = $("settingsName").value.trim(); if (name) localStorage.setItem("tr_name", name); const c = { g1: $("color1").value, g2: $("color2").value, g3: $("color3").value }; localStorage.setItem("tr_settings_colors", JSON.stringify(c)); TR.applyColors(c); $("who").textContent = name ? "hi, " + name : ""; $("settingsModal").classList.add("hidden"); TR.toast(text("Settings saved"), "ok"); };
  renderLanguage(); translate();
})();
