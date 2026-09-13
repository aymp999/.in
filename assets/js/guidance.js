// AYMP Personal Guidance + Sacred Music
// Fixed flow: Birth Details -> Normal Personal Guidance Result -> Yantra/Herb/Thanthreeg Research button -> Research screen.
document.addEventListener('DOMContentLoaded', function () {
  const popup=document.getElementById('guidancePopup');
  const openBtn=document.getElementById('openGuidanceBtn');
  const closeBtn=document.querySelector('.close-popup');
  const form=document.getElementById('guidanceForm');
  const musicFiles=['blue-silence.mp3','celestial-breath.mp3','cosmic-peace.mp3','divine-glow.mp3','goldan-energy.mp3','heart-hermony.mp3','inner-light.mp3','moon-serenity.mp3','mystic-guidance.mp3','power-art-awakening.mp3','sacred-space.mp3'];
  const patterns=[
    ['Peace','OM • SHREEM • AIM • HREEM • YAV • VAV • OM','Peace, calmness and inner clarity.'],['Clarity','AIM • HREEM • KLEEM • YAV • SANG • MANG • AIM','Clear thinking and thoughtful decisions.'],['Confidence','SHREEM • KLEEM • HREEM • SHAV • VAV • YAV • SHREEM','Courage and self-confidence.'],['Positive Beginning','OM • AIM • SHREEM • YAV • VASI • HREEM • OM','A positive and peaceful beginning.'],['Focus','AIM • YAV • YAV • SANG • MANG • NANG • AIM','Concentration and disciplined attention.'],['Emotional Balance','HREEM • VAV • YAV • MANG • NANG • YASI • HREEM','Emotional balance and calm reflection.'],['Patience','OM • VAV • MANG • NANG • YAV • SANG • OM','Patience during difficult situations.'],['Inner Strength','HREEM • SHAV • VAV • MANG • YAV • KLEEM • HREEM','Inner strength and resilience.'],['Hope','SHREEM • YAV • AIM • VASI • YASI • OM • SHREEM','Hope and positive expectation.'],['Protection','OM • HREEM • SHAV • VAV • MANG • NANG • OM','A sense of safety, courage and protection.'],['Wisdom','AIM • SANG • MANG • YAV • VANG • HREEM • AIM','Wisdom before action.'],['Communication','YAV • VAV • AIM • YASI • VASI • MANG • YAV','Clear and respectful communication.'],['Harmony','KLEEM • SHREEM • YAV • VASI • YASI • HREEM • KLEEM','Harmony in relationships.'],['Forgiveness','OM • MANG • NANG • YASI • VASI • YAV • OM','Letting go of anger and moving toward forgiveness.'],['Renewal','SHREEM • HREEM • YAV • AIM • VAV • YASI • SHREEM','A fresh beginning.'],['Motivation','KLEEM • AIM • MANG • YAV • VANG • HREEM • KLEEM','Motivation to take constructive action.'],['Stability','VANG • MANG • NANG • YAV • VAV • SHREEM • VANG','Stability and grounded thinking.'],['Creativity','AIM • YASI • VASI • MANG • SANG • YAV • AIM','Creativity and new ideas.'],['Positive Relationships','KLEEM • VASI • YASI • MASI • YAV • SHREEM • KLEEM','Kindness, understanding and healthy relationships.'],['Letting Go','OM • NASI • YASI • VAV • NANG • HREEM • OM','Release unnecessary worry and mental tension.'],['Gratitude','SHREEM • AIM • OM • YAV • VASI • HREEM • SHREEM','Gratitude for the good things in life.'],['Inner Silence','OM • HREEM • OM • YAV • NANG • OM • HREEM','Quiet reflection and mindfulness.'],['Determination','KLEEM • MANG • YAV • VANG • SANG • HREEM • KLEEM','Determination to complete meaningful goals.'],['Understanding','AIM • SANG • VANG • YASI • VASI • YAV • AIM','Understanding before judgment.'],['Balance','SHREEM • HREEM • VAV • YAV • MANG • AIM • SHREEM','Balance between thought, emotion and action.'],['Transformation','OM • KLEEM • HREEM • MANG • YAV • VASI • OM','Positive personal transformation.'],['Compassion','YASI • VASI • NASI • YAV • MANG • SHREEM • YASI','Compassion toward yourself and others.'],['Gratitude & Hope','SHREEM • OM • YAV • AIM • HREEM • VASI • SHREEM','Gratitude today and hope for tomorrow.'],['Personal Intention','AIM • HREEM • KLEEM • YAV • VAV • SHREEM • OM','Hold one clear personal intention.'],['Universal Peace','OM • SHREEM • AIM • HREEM • KLEEM • YAV • SHREEM • OM','Peace, understanding and goodwill for all.']
  ];
  let audio=null;
  function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c];});}
  function stopMusic(){if(audio){audio.pause();audio.currentTime=0;audio=null;}}
  function playFile(file){stopMusic();audio=new Audio('assets/'+file);audio.loop=true;audio.volume=.65;const s=document.getElementById('musicStatus');audio.play().then(function(){if(s)s.textContent='🎵 Sacred music playing...';}).catch(function(){if(s)s.textContent='Tap ▶ PLAY SACRED MUSIC to start.';});audio.onerror=function(){if(s)s.textContent='⚠️ Music file could not be loaded: '+file;};}
  function getResearchSection(box){const section=box.querySelector('#aympLagnaResearchResult');if(section){section.style.display='none';return section;}return null;}
  function addResearchButton(box){
    const old=document.getElementById('aympGuidanceResearchButtonWrap');if(old)old.remove();
    const wrap=document.createElement('div');wrap.id='aympGuidanceResearchButtonWrap';wrap.style.cssText='margin-top:18px;padding:15px;border:1px solid rgba(255,215,120,.28);border-radius:16px;background:linear-gradient(135deg,rgba(100,55,150,.18),rgba(255,215,120,.05));';
    wrap.innerHTML='<button type="button" id="aympGuidanceResearchButton" style="width:100%;padding:15px;border:1px solid rgba(255,215,120,.5);border-radius:12px;background:linear-gradient(135deg,#2d1648,#5d3a78);color:#ffe39a;font-size:16px;font-weight:800;cursor:pointer;">🔱 YANTRA • HERB • THANTHREEG RESEARCH<span style="display:block;margin-top:5px;color:#fff;opacity:.68;font-size:11px;font-weight:500;">View your personalized traditional research recommendation</span></button>';
    const root=box.querySelector('.aymp-guidance-result');if(root)root.appendChild(wrap);else box.appendChild(wrap);
    document.getElementById('aympGuidanceResearchButton').onclick=function(){if(window.AYMPResultPresentation&&typeof window.AYMPResultPresentation.open==='function')window.AYMPResultPresentation.open();else alert('Yantra Research is still loading. Please try again in a moment.');};
  }
  function showGuidance(index,name,dob,time,place,chart){
    const p=patterns[index],music=musicFiles[index%musicFiles.length],box=popup.querySelector('.guidance-content');if(!box)return;
    const researchSection=getResearchSection(box);
    box.innerHTML=`<div class="aymp-guidance-result"><span class="close-popup" id="resultClose">×</span><div class="power-art-glow"><div class="energy-orbit"></div><div class="power-core">✦</div></div><h2>✨ AYMP PERSONAL GUIDANCE</h2><h3>Welcome, ${esc(name)}</h3><div class="birth-summary"><p>📅 <strong>Date:</strong> ${esc(dob)}</p><p>⏰ <strong>Time:</strong> ${esc(time)}</p><p>📍 <strong>Place:</strong> ${esc(place)}</p>${chart?`<p>🌌 <strong>Lagna:</strong> ${esc(chart.lagna)} (${esc(chart.ascendantText)})</p><p>🕰️ <strong>Time Zone:</strong> ${esc(chart.timezone)}</p>`:''}</div><div class="guidance-card"><h3>🌌 Your Cosmic Insight</h3><p>${esc(p[2])}</p></div><div class="sound-card"><div class="sound-label">🔱 AYMP SACRED MANTRA</div><div id="changingSound" class="changing-sound sound-animate">${esc(p[1])}</div><div class="sound-title">${esc(p[0])}</div><div class="music-panel"><div id="musicName">🎵 ${esc(music)}</div><button type="button" id="playMusicBtn">▶ PLAY SACRED MUSIC</button><button type="button" id="pauseMusicBtn">⏸ PAUSE</button><button type="button" id="stopMusicBtn">⏹ STOP</button><p id="musicStatus">🎵 Sacred music ready.</p></div></div><div class="guidance-card"><h3>🙏 Mantra Meaning</h3><p>${esc(p[2])}</p></div><div class="practice-card"><h3>🧘 Practice</h3><p>Repeat the mantra <strong>108 times</strong> if suitable for your personal practice.</p></div></div>`;
    if(researchSection){box.appendChild(researchSection);researchSection.style.display='none';}
    addResearchButton(box);
    document.getElementById('resultClose').onclick=function(){stopMusic();popup.style.display='none';};
    document.getElementById('playMusicBtn').onclick=function(){if(!audio)playFile(music);else audio.play().catch(function(){});};
    document.getElementById('pauseMusicBtn').onclick=function(){if(audio){audio.pause();document.getElementById('musicStatus').textContent='⏸ Sacred music paused.';}};
    document.getElementById('stopMusicBtn').onclick=function(){stopMusic();document.getElementById('musicStatus').textContent='⏹ Sacred music stopped.';};
    playFile(music);
  }
  if(openBtn)openBtn.onclick=function(){popup.style.display='block';};
  if(closeBtn)closeBtn.onclick=function(){stopMusic();popup.style.display='none';};
  if(form)form.addEventListener('submit',async function(e){
    e.preventDefault();
    const name=(document.getElementById('guidanceName')||{}).value?.trim()||'',dob=(document.getElementById('guidanceDob')||{}).value||'',time=(document.getElementById('guidanceTime')||{}).value||'',place=(document.getElementById('guidancePlace')||{}).value?.trim()||'';
    if(!name||!dob||!time||!place){alert('Please enter Name, Date of Birth, Birth Time and Place.');return;}
    try{
      if(!window.AYMPLagnaEngine||typeof window.AYMPLagnaEngine.calculateFromForm!=='function')throw Error('Global Lagna engine is not loaded.');
      const chart=await window.AYMPLagnaEngine.calculateFromForm();
      window.AYMPBirthChart={...chart,name:name,birthDate:dob,birthTime:time,birthPlace:place};
      window.dispatchEvent(new CustomEvent('aymp:birth-chart-updated',{detail:window.AYMPBirthChart}));
      let total=0;for(const c of name)total+=c.charCodeAt(0);for(const c of dob)if(!isNaN(parseInt(c)))total+=parseInt(c);for(const c of time)if(!isNaN(parseInt(c)))total+=parseInt(c);for(const c of place)total+=c.charCodeAt(0);
      showGuidance(total%patterns.length,name,dob,time,place,window.AYMPBirthChart);
    }catch(err){console.error(err);alert('Lagna calculation could not be completed. Please check the birth date, exact birth time and birth place.\n\n'+err.message);}
  });
  (function loadAYMPResearchModules(){
    if(document.getElementById('aympVedicLagnaLoader'))return;
    const lagna=document.createElement('script');lagna.id='aympVedicLagnaLoader';lagna.src='assets/js/aymp-vedic-lagna-engine.js';lagna.defer=true;document.body.appendChild(lagna);
    const planetary=document.createElement('script');planetary.id='aympPlanetaryResearchLoader';planetary.src='assets/js/planetary-research-db.js';planetary.defer=true;document.body.appendChild(planetary);
    const personal=document.createElement('script');personal.id='aympPersonalResearchEngineLoader';personal.src='assets/js/aymp-personal-research-engine.js';personal.defer=true;document.body.appendChild(personal);
    const css=document.createElement('link');css.rel='stylesheet';css.href='assets/css/yantra-herb-research.css';document.head.appendChild(css);
    const script=document.createElement('script');script.id='aympYantraHerbResearchLoader';script.src='assets/js/yantra-herb-research.js';script.defer=true;document.body.appendChild(script);
    const lagnaResearch=document.createElement('script');lagnaResearch.id='aympLagnaResearchResultLoader';lagnaResearch.src='assets/js/aymp-lagna-research-result.js';lagnaResearch.defer=true;document.body.appendChild(lagnaResearch);
    const cycle=document.createElement('script');cycle.id='aympPersonalResearchCycleLoader';cycle.src='assets/js/aymp-personal-research-cycle.js';cycle.defer=true;document.body.appendChild(cycle);
    const presentation=document.createElement('script');presentation.id='aympResultPresentationLoader';presentation.src='assets/js/aymp-result-presentation.js?v=6';presentation.defer=true;document.body.appendChild(presentation);
    const cosmicSolution=document.createElement('script');cosmicSolution.id='aympCosmicSolutionResultLoader';cosmicSolution.src='assets/js/aymp-cosmic-solution-result.js?v=1';cosmicSolution.defer=true;document.body.appendChild(cosmicSolution);
  })();
  console.log('AYMP Personal Guidance Engine Ready');
});

/* AYMP Siddha Wellness homepage integration — additive only. */
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('aymp-siddha-homepage-card')) return;
  var section = document.createElement('section');
  section.id = 'aymp-siddha-homepage-card';
  section.style.cssText = 'padding:70px 20px;';
  section.innerHTML = '<div class="container" style="max-width:1200px;margin:auto;text-align:center;">' +
    '<div style="background:linear-gradient(135deg,rgba(21,35,53,.96),rgba(61,35,82,.96));border:2px solid rgba(255,215,0,.45);border-radius:30px;padding:42px 25px;box-shadow:0 0 35px rgba(255,215,0,.16);">' +
    '<div style="font-size:46px;margin-bottom:12px;">🌿</div>' +
    '<h2 style="font-family:Cinzel,serif;color:#ffd700;font-size:38px;margin-bottom:12px;">AYMP Siddha Wellness &amp; Product Enquiry</h2>' +
    '<p style="color:#eee;font-size:18px;max-width:820px;margin:0 auto 18px;">Traditional Siddha wellness information and product enquiry for Men, Women, Children &amp; Family Well-Being.</p>' +
    '<div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;align-items:center;">' +
    '<a href="siddha-wellness.html" class="btn" style="display:inline-block;padding:16px 30px;border-radius:40px;background:linear-gradient(45deg,#c9a227,#ffdf6b);color:#111;font-weight:700;text-decoration:none;box-shadow:0 0 20px rgba(255,215,0,.35);">🌿 EXPLORE SIDDHA WELLNESS</a>' +
    '<a href="siddha-products.html" class="btn" style="display:inline-block;padding:16px 30px;border-radius:40px;background:linear-gradient(45deg,#5b3b86,#9a72d1);color:#fff;font-weight:700;text-decoration:none;border:1px solid rgba(255,215,0,.45);box-shadow:0 0 20px rgba(154,114,209,.3);">🛍️ PRODUCTS &amp; ENQUIRY</a>' +
    '</div>' +
    '<p style="margin:20px auto 0;color:#cfcfcf;font-size:13px;max-width:850px;">Fertility wellness • Skin wellness • Psoriasis information • Diabetes wellness support • Joint &amp; mobility wellness • Energy &amp; vitality • Special children support • General wellness</p>' +
    '</div></div>';
  var footer = document.querySelector('footer');
  if (footer && footer.parentNode) footer.parentNode.insertBefore(section, footer);
  else document.body.appendChild(section);
});
