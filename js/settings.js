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
  const COMMON = {
    en: { Main:"Main", AI:"AI", Kit:"Kit", Presets:"Presets", Projects:"Projects", Browse:"Browse", Graph:"Graph", Text:"Text", "Check version":"Check version", "Download update":"Download update", "Open TheoEngine download page":"Open TheoEngine download page", "What’s new":"What’s new", "Your creative toolkit for faster After Effects workflows.":"Your creative toolkit for faster After Effects workflows.", "Editing Bot setup":"Editing Bot setup", "Open Google AI Studio →":"Open Google AI Studio →", "Browsing":"Browsing", "Graph editor":"Graph editor", "Text animations":"Text animations" },
    es: { Main:"Inicio", AI:"IA", Kit:"Kit", Presets:"Preajustes", Projects:"Proyectos", Browse:"Explorar", Graph:"Gráfico", Text:"Texto", "Check version":"Comprobar versión", "Download update":"Descargar actualización", "Open TheoEngine download page":"Abrir página de descarga de TheoEngine", "What’s new":"Novedades", "Editing Bot setup":"Configurar Editing Bot", "Open Google AI Studio →":"Abrir Google AI Studio →", Browsing:"Explorar", "Graph editor":"Editor de gráficos", "Text animations":"Animaciones de texto" },
    fr: { Main:"Accueil", AI:"IA", Kit:"Kit", Presets:"Préréglages", Projects:"Projets", Browse:"Parcourir", Graph:"Graphe", Text:"Texte", "Check version":"Vérifier la version", "Download update":"Télécharger la mise à jour", "Open TheoEngine download page":"Ouvrir la page de téléchargement TheoEngine", "What’s new":"Nouveautés", "Editing Bot setup":"Configurer Editing Bot", "Open Google AI Studio →":"Ouvrir Google AI Studio →", Browsing:"Parcourir", "Graph editor":"Éditeur de graphe", "Text animations":"Animations de texte" },
    de: { Main:"Start", AI:"KI", Kit:"Kit", Presets:"Presets", Projects:"Projekte", Browse:"Browser", Graph:"Graph", Text:"Text", "Check version":"Version prüfen", "Download update":"Update herunterladen", "Open TheoEngine download page":"TheoEngine-Downloadseite öffnen", "What’s new":"Neuigkeiten", "Editing Bot setup":"Editing Bot einrichten", "Open Google AI Studio →":"Google AI Studio öffnen →", Browsing:"Browser", "Graph editor":"Graph-Editor", "Text animations":"Textanimationen" },
    pt: { Main:"Início", AI:"IA", Kit:"Kit", Presets:"Predefinições", Projects:"Projetos", Browse:"Navegar", Graph:"Gráfico", Text:"Texto", "Check version":"Verificar versão", "Download update":"Baixar atualização", "Open TheoEngine download page":"Abrir página de download do TheoEngine", "What’s new":"Novidades", "Editing Bot setup":"Configurar Editing Bot", "Open Google AI Studio →":"Abrir Google AI Studio →", Browsing:"Navegar", "Graph editor":"Editor de gráfico", "Text animations":"Animações de texto" },
    zh: { Main:"主页", AI:"AI", Kit:"工具包", Presets:"预设", Projects:"项目", Browse:"浏览", Graph:"曲线", Text:"文字", "Check version":"检查版本", "Download update":"下载更新", "Open TheoEngine download page":"打开 TheoEngine 下载页面", "What’s new":"更新内容", "Editing Bot setup":"设置 Editing Bot", "Open Google AI Studio →":"打开 Google AI Studio →", Browsing:"浏览", "Graph editor":"曲线编辑器", "Text animations":"文字动画" },
    hi: { Main:"मुख्य", AI:"AI", Kit:"किट", Presets:"प्रीसेट", Projects:"प्रोजेक्ट", Browse:"ब्राउज़", Graph:"ग्राफ़", Text:"टेक्स्ट", "Check version":"संस्करण जाँचें", "Download update":"अपडेट डाउनलोड करें", "Open TheoEngine download page":"TheoEngine डाउनलोड पेज खोलें", "What’s new":"नया क्या है", "Editing Bot setup":"Editing Bot सेटअप", "Open Google AI Studio →":"Google AI Studio खोलें →", Browsing:"ब्राउज़", "Graph editor":"ग्राफ़ संपादक", "Text animations":"टेक्स्ट एनिमेशन" },
    ar: { Main:"الرئيسية", AI:"الذكاء", Kit:"الأدوات", Presets:"الإعدادات المسبقة", Projects:"المشاريع", Browse:"تصفح", Graph:"الرسم", Text:"النص", "Check version":"تحقق من الإصدار", "Download update":"تنزيل التحديث", "Open TheoEngine download page":"فتح صفحة تنزيل TheoEngine", "What’s new":"ما الجديد", "Editing Bot setup":"إعداد Editing Bot", "Open Google AI Studio →":"فتح Google AI Studio →", Browsing:"تصفح", "Graph editor":"محرر الرسم", "Text animations":"تحريك النص" },
    ru: { Main:"Главная", AI:"ИИ", Kit:"Инструменты", Presets:"Пресеты", Projects:"Проекты", Browse:"Обзор", Graph:"График", Text:"Текст", "Check version":"Проверить версию", "Download update":"Скачать обновление", "Open TheoEngine download page":"Открыть страницу загрузки TheoEngine", "What’s new":"Новое", "Editing Bot setup":"Настройка Editing Bot", "Open Google AI Studio →":"Открыть Google AI Studio →", Browsing:"Обзор", "Graph editor":"Редактор графика", "Text animations":"Анимации текста" },
    ja: { Main:"メイン", AI:"AI", Kit:"ツール", Presets:"プリセット", Projects:"プロジェクト", Browse:"閲覧", Graph:"グラフ", Text:"テキスト", "Check version":"バージョンを確認", "Download update":"更新をダウンロード", "Open TheoEngine download page":"TheoEngineのダウンロードページを開く", "What’s new":"新着情報", "Editing Bot setup":"Editing Botの設定", "Open Google AI Studio →":"Google AI Studioを開く →", Browsing:"閲覧", "Graph editor":"グラフエディター", "Text animations":"テキストアニメーション" }
  };
  let lang = localStorage.getItem("tr_settings_language") || "en";
  const text = (key) => (T[lang] && T[lang][key]) || (COMMON[lang] && COMMON[lang][key]) || COMMON.en[key] || T.en[key] || key;
  function translateApp() {
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = text(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = text(el.dataset.i18nPlaceholder); });
    if (window.TR) window.TR.t = text;
  }
  function renderLanguage() {
    const grid = $("languageGrid"); grid.innerHTML = "";
    LANGS.forEach(([id, flag, name]) => { const b = document.createElement("button"); b.type = "button"; b.className = "language-choice" + (id === lang ? " active" : ""); b.innerHTML = "<span>" + flag + "</span><b>" + name + "</b>"; b.onclick = () => { lang = id; localStorage.setItem("tr_settings_language", id); renderLanguage(); translate(); translateApp(); }; grid.appendChild(b); });
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
  renderLanguage(); translate(); translateApp();
})();
