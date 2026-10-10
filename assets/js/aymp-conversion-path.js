/* AYMP Homepage Conversion Path — clear next steps, no visitor data collection */
(function () {
  const WHATSAPP = 'https://wa.me/918903924996?text=' + encodeURIComponent(
    'Hello AYMPONSOMU, I found your website and would like to enquire about your services. Please share the available options and fees before I decide.'
  );
  function track(label) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', 'aymp_conversion_path_click', {
        event_category: 'engagement',
        event_label: label
      });
    } catch (_) {}
  }
  function addPath() {
    if (document.getElementById('aymp-start-here')) return;
    const hero = document.querySelector('body > header');
    if (!hero) return;
    const section = document.createElement('section');
    section.id = 'aymp-start-here';
    section.style.cssText = 'padding:32px 16px 56px;';
    section.innerHTML = `
      <div style="max-width:1100px;margin:auto;padding:clamp(20px,4vw,38px);border:1px solid rgba(255,215,0,.38);border-radius:24px;background:linear-gradient(135deg,rgba(20,28,58,.96),rgba(49,29,69,.96));box-shadow:0 12px 38px rgba(0,0,0,.22)">
        <div style="text-align:center;color:#ffdf6b;letter-spacing:2px;font-size:12px;font-weight:700">START HERE · AYMP</div>
        <h2 style="font-family:Cinzel,serif;color:#ffd700;text-align:center;font-size:clamp(27px,4.8vw,40px);margin:8px 0 10px">What Would You Like Help With?</h2>
        <p style="max-width:760px;margin:0 auto 24px;text-align:center;color:#e2e2e2">Choose one clear next step. Explore the free resources first, or send an enquiry to ask about services and fees. No payment is required to enquire.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:14px">
          <article style="padding:20px;border-radius:16px;border:1px solid rgba(255,215,0,.24);background:rgba(255,255,255,.045)">
            <div style="font-size:27px">🔮</div><h3 style="color:#ffd700;margin:8px 0">Personal Astrology Guidance</h3>
            <p style="color:#ddd;font-size:14px;margin-bottom:15px">Enter birth details to explore the AYMP guidance experience. It is reflective guidance, not a guaranteed prediction.</p>
            <button type="button" id="aymp-path-guidance" class="btn" style="display:block;width:100%;white-space:normal;cursor:pointer">Open Free Guidance</button>
          </article>
          <article style="padding:20px;border-radius:16px;border:1px solid rgba(255,215,0,.24);background:rgba(255,255,255,.045)">
            <div style="font-size:27px">🧮</div><h3 style="color:#ffd700;margin:8px 0">AYMP Formula Insights</h3>
            <p style="color:#ddd;font-size:14px;margin-bottom:15px">Explore the research frameworks and learn how AYMP approaches astrology questions.</p>
            <a href="aymp-formula-insights.html" class="btn" data-aymp-path="formula-insights" style="display:block;white-space:normal">Explore Formula Insights</a>
          </article>
          <article style="padding:20px;border-radius:16px;border:1px solid rgba(255,215,0,.24);background:rgba(255,255,255,.045)">
            <div style="font-size:27px">🌿</div><h3 style="color:#ffd700;margin:8px 0">Siddha Wellness</h3>
            <p style="color:#ddd;font-size:14px;margin-bottom:15px">Read traditional wellness information and browse product enquiry options. Not a substitute for medical care.</p>
            <a href="siddha-wellness.html" class="btn" data-aymp-path="siddha-wellness" style="display:block;white-space:normal;margin-bottom:9px">Explore Wellness</a>
            <a href="siddha-products.html" data-aymp-path="siddha-products" style="display:block;text-align:center;color:#ffdf6b;padding:7px">Products &amp; Enquiry →</a>
          </article>
          <article style="padding:20px;border-radius:16px;border:1px solid rgba(255,215,0,.24);background:rgba(255,255,255,.045)">
            <div style="font-size:27px">🤝</div><h3 style="color:#ffd700;margin:8px 0">Consultation / Collaboration</h3>
            <p style="color:#ddd;font-size:14px;margin-bottom:15px">Ask about consultation, learning, research or a professional collaboration. Confirm the scope and fee before booking.</p>
            <a href="${WHATSAPP}" target="_blank" rel="noopener noreferrer" id="aymp-path-whatsapp" class="btn" style="display:block;white-space:normal;background:linear-gradient(45deg,#187c43,#25d366);color:#fff">Enquire on WhatsApp</a>
          </article>
        </div>
        <p style="text-align:center;color:#c8c8c8;font-size:12px;margin:18px 0 0">Privacy tip: do not send passwords, OTPs, wallet seed phrases or sensitive medical records through public forms or chat.</p>
      </div>`;
    hero.insertAdjacentElement('afterend', section);
    const guidance = document.getElementById('aymp-path-guidance');
    if (guidance) guidance.addEventListener('click', function () {
      track('free-guidance');
      const open = document.getElementById('openGuidanceBtn');
      if (open) open.click();
      else {
        const popup = document.getElementById('guidancePopup');
        if (popup) { popup.style.display = 'block'; popup.scrollIntoView({behavior:'smooth', block:'center'}); }
      }
    });
    section.querySelectorAll('[data-aymp-path]').forEach(el => el.addEventListener('click', () => track(el.getAttribute('data-aymp-path'))));
    const wa = document.getElementById('aymp-path-whatsapp');
    if (wa) wa.addEventListener('click', () => track('whatsapp-enquiry'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addPath);
  else addPath();
})();
