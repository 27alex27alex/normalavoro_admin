/* ============================================================
   NORMALAVORO — Cookie Banner
   Conforme alle Linee guida Garante Privacy 10/06/2021 (in vigore
   dal 10/01/2022): pulsanti Accetta tutto / Rifiuta tutto /
   Personalizza / X, cookie non tecnici disattivati di default,
   nessun "cookie wall", consenso valido 6 mesi.
   Includere questo file in OGNI pagina del sito con:
   <script src="cookie-banner.js"></script>
   ============================================================ */

(function () {
  const CONSENT_KEY = 'normalavoro_cookie_consent';
  const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

  function getConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (Date.now() - data.timestamp > SIX_MONTHS_MS) return null;
      return data;
    } catch (e) { return null; }
  }

  function saveConsent(analytics) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      necessari: true,
      analytics: analytics,
      timestamp: Date.now()
    }));
  }

  function injectStyles() {
    const css = `
      #nl-cookie-banner{
        position:fixed; left:0; right:0; bottom:0; z-index:9999;
        background:#182338; color:#f7f5ef;
        padding:20px 20px calc(20px + env(safe-area-inset-bottom));
        box-shadow:0 -4px 24px rgba(0,0,0,0.25);
        font-family:'Inter', Arial, sans-serif;
        animation:nlSlideUp 0.3s ease;
      }
      @keyframes nlSlideUp{ from{transform:translateY(100%);} to{transform:translateY(0);} }
      #nl-cookie-banner .nl-close{
        position:absolute; top:14px; right:16px;
        background:none; border:none; color:#9aa4bd;
        font-size:18px; cursor:pointer; line-height:1;
      }
      #nl-cookie-banner p{
        font-size:13.5px; line-height:1.55; color:#c7cede;
        margin:0 30px 16px 0; max-width:560px;
      }
      #nl-cookie-banner a{ color:#e0b45f; text-decoration:underline; }
      .nl-cookie-btns{ display:flex; flex-wrap:wrap; gap:10px; }
      .nl-cookie-btns button{
        font-family:'Inter', Arial, sans-serif; font-weight:700; font-size:13px;
        padding:11px 18px; border-radius:9px; cursor:pointer; border:1px solid transparent;
      }
      .nl-btn-accept{ background:#e0b45f; color:#182338; }
      .nl-btn-reject{ background:transparent; color:#f7f5ef; border-color:rgba(247,245,239,0.35); }
      .nl-btn-custom{ background:transparent; color:#c7cede; border-color:transparent; text-decoration:underline; }
      #nl-cookie-panel{
        display:none; margin-top:16px; padding-top:16px;
        border-top:1px solid rgba(247,245,239,0.15);
      }
      #nl-cookie-panel.open{ display:block; }
      .nl-toggle-row{
        display:flex; justify-content:space-between; align-items:center;
        padding:10px 0; font-size:13px; color:#c7cede;
      }
      .nl-toggle-row b{ color:#f7f5ef; display:block; font-size:13.5px; margin-bottom:2px; }
      .nl-toggle-row .desc{ font-size:12px; color:#9aa4bd; max-width:400px; }
      .nl-switch{ position:relative; width:42px; height:24px; flex-shrink:0; margin-left:14px; }
      .nl-switch input{ opacity:0; width:0; height:0; }
      .nl-switch .slider{
        position:absolute; inset:0; background:#3a4560; border-radius:100px; cursor:pointer; transition:0.2s;
      }
      .nl-switch .slider:before{
        content:''; position:absolute; width:18px; height:18px; left:3px; top:3px;
        background:#f7f5ef; border-radius:50%; transition:0.2s;
      }
      .nl-switch input:checked + .slider{ background:#e0b45f; }
      .nl-switch input:checked + .slider:before{ transform:translateX(18px); }
      .nl-switch input:disabled + .slider{ opacity:0.5; cursor:not-allowed; }
      #nl-cookie-save{
        margin-top:14px; background:#e0b45f; color:#182338;
        font-family:'Inter'; font-weight:700; font-size:13px;
        padding:11px 18px; border-radius:9px; border:none; cursor:pointer;
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildBanner() {
    const el = document.createElement('div');
    el.id = 'nl-cookie-banner';
    el.innerHTML = `
      <button class="nl-close" id="nl-close-x" aria-label="Chiudi">✕</button>
      <p>Questo sito utilizza cookie tecnici, necessari al funzionamento, e — solo previo consenso — cookie di analisi statistica. Nessun dato viene ceduto a terzi per finalità pubblicitarie. Consulta la <a href="cookie-policy.html">Cookie Policy</a> e l'<a href="privacy.html">Informativa Privacy</a> per i dettagli.</p>
      <div class="nl-cookie-btns">
        <button class="nl-btn-accept" id="nl-accept-all">Accetta tutto</button>
        <button class="nl-btn-reject" id="nl-reject-all">Rifiuta tutto</button>
        <button class="nl-btn-custom" id="nl-customize">Personalizza</button>
      </div>
      <div id="nl-cookie-panel">
        <div class="nl-toggle-row">
          <div><b>Cookie tecnici</b><div class="desc">Necessari al funzionamento del sito. Sempre attivi, non richiedono consenso.</div></div>
          <label class="nl-switch"><input type="checkbox" checked disabled><span class="slider"></span></label>
        </div>
        <div class="nl-toggle-row">
          <div><b>Cookie analitici</b><div class="desc">Ci aiutano a capire come viene usato il sito, in forma aggregata. Disattivi di default.</div></div>
          <label class="nl-switch"><input type="checkbox" id="nl-toggle-analytics"><span class="slider"></span></label>
        </div>
        <button id="nl-cookie-save">Salva le preferenze</button>
      </div>
    `;
    document.body.appendChild(el);

    document.getElementById('nl-accept-all').onclick = function () {
      saveConsent(true);
      el.remove();
    };
    document.getElementById('nl-reject-all').onclick = function () {
      saveConsent(false);
      el.remove();
    };
    document.getElementById('nl-close-x').onclick = function () {
      // Per le linee guida del Garante, la chiusura (X) equivale al rifiuto
      // dei cookie non necessari: si naviga senza essere tracciati.
      saveConsent(false);
      el.remove();
    };
    document.getElementById('nl-customize').onclick = function () {
      document.getElementById('nl-cookie-panel').classList.toggle('open');
    };
    document.getElementById('nl-cookie-save').onclick = function () {
      const analytics = document.getElementById('nl-toggle-analytics').checked;
      saveConsent(analytics);
      el.remove();
    };
  }

  function init() {
    if (getConsent() !== null) return; // scelta già espressa e ancora valida (< 6 mesi)
    injectStyles();
    buildBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Espone una funzione globale per riaprire le preferenze (utile in un link "Gestisci cookie" nel footer)
  window.nlOpenCookiePreferences = function () {
    const existing = document.getElementById('nl-cookie-banner');
    if (existing) existing.remove();
    injectStyles();
    buildBanner();
    document.getElementById('nl-cookie-panel').classList.add('open');
  };
})();
