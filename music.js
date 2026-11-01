'use strict';
/* THE DUSK GUILD — Original soundtrack player.
 * Uses three original MP3 scores and preserves save data without changing gameplay.
 */
(function () {
  const SET_KEY = 'dusk_guild_music_v1';
  const TRACKS = {
    tavern: {name:'등불과 주사위', src:'audio/tavern.mp3'},
    road: {name:'잊힌 길의 발자국', src:'audio/road.mp3'},
    battle: {name:'잉크와 강철', src:'audio/battle.mp3'}
  };
  const sources = window.DUSK_MUSIC_SRCS || {};
  let opts = {on:true, volume:52};
  try {const stored=JSON.parse(localStorage.getItem(SET_KEY));if(stored && typeof stored==='object'){
    opts.on=stored.on!==false;
    opts.volume=Math.min(100,Math.max(0,Number(stored.volume)||0));
  }}catch(err){}
  let unlocked=false, current=null, playing=null, fadeId=0, syncTimer=null;
  const audio={};
  for(const [k,info] of Object.entries(TRACKS)){
    const a=document.createElement('audio');
    a.preload='none';a.loop=true;a.volume=0;a.playsInline=true;
    // Load only the currently audible track to keep offline startup fast.
    audio[k]=a;
    a.addEventListener('error',()=>{
      const m=document.getElementById('musicStatus');
      if(m && k===current)m.textContent='음원 로드 오류';
    });
  }
  const save=()=>{try{localStorage.setItem(SET_KEY,JSON.stringify(opts));}catch(err){}};
  const desiredTrack=()=>{
    try {
      if(typeof s==='undefined' || !s || !document.getElementById('cover')?.classList.contains('hidden'))return 'tavern';
      const modal=ui.modal?.type;
      if(modal==='battle')return 'battle';
      if(['prepare','event','investigate'].includes(modal)||s.expedition)return 'road';
      return ['board','map'].includes(ui.page)?'road':'tavern';
    } catch(err){return 'tavern';}
  };
  function paint(){
    const status=document.getElementById('musicStatus');
    const caption=opts.on ? ('♬ '+TRACKS[current||desiredTrack()].name) : '♬ 음악 꺼짐';
    if(status)status.textContent=caption;
    ['musicToggle','coverMusicToggle'].forEach(id=>{
      const b=document.getElementById(id);if(!b)return;
      b.textContent=opts.on?'♫':'♪';
      b.setAttribute('aria-label',opts.on?'배경음악 끄기':'배경음악 켜기');
      b.title=opts.on?'음악 끄기 · '+TRACKS[current||desiredTrack()].name:'음악 켜기';
      b.classList.toggle('music-muted',!opts.on);
    });
    const slider=document.getElementById('musicVolume');
    if(slider && Number(slider.value)!==opts.volume)slider.value=opts.volume;
    const val=document.getElementById('musicVolumeValue');if(val)val.textContent=opts.volume+'%';
    const toggle=document.getElementById('settingsMusicToggle');
    if(toggle)toggle.textContent=opts.on?'♫ 음악 끄기':'♪ 음악 켜기';
  }
  function stopFade(){if(fadeId){cancelAnimationFrame(fadeId);fadeId=0}}
  function transition(to){
    stopFade();
    const previous=playing;
    const next=audio[to];
    if(!next.getAttribute('src'))next.src=sources[to] || TRACKS[to].src;
    if(!opts.on || !unlocked){
      if(previous){audio[previous].pause();audio[previous].volume=0}
      playing=null;current=to;paint();return;
    }
    if(playing===to){if(next.paused)next.play().catch(()=>{unlocked=false;playing=null;paint()});next.volume=opts.volume/100*.7;current=to;paint();return;}
    current=to;
    if(next.paused){next.currentTime=0;next.volume=0;next.play().catch(()=>{unlocked=false;playing=null;paint()})}
    const prevAudio=previous?audio[previous]:null;
    playing=to;
    const start=performance.now(),duration=1250,prevVolume=prevAudio?.volume||0,top=opts.volume/100*.7;
    function frame(time){
      if(!unlocked || !opts.on)return;
      const t=Math.min(1,(time-start)/duration),f=t*t*(3-2*t);
      next.volume=Math.min(1,Math.max(0,top*f));
      if(prevAudio && prevAudio!==next)prevAudio.volume=Math.max(0,prevVolume*(1-f));
      if(t<1){fadeId=requestAnimationFrame(frame)}else{
        fadeId=0;
        if(prevAudio&&prevAudio!==next){prevAudio.pause();prevAudio.currentTime=0}
      }
    }
    fadeId=requestAnimationFrame(frame);paint();
  }
  function sync(){
    if(!opts.on){for(const a of Object.values(audio)){a.pause();a.volume=0}playing=null;current=desiredTrack();paint();return}
    const desired=desiredTrack();
    if(!unlocked){current=desired;paint();return}
    if(playing!==desired)transition(desired);
    else{audio[desired].volume=opts.volume/100*.7;current=desired;paint()}
  }
  function unlock(){
    if(unlocked)return;
    unlocked=true;
    // A track is buffered on demand, not all three at the same time.
    sync();
  }
  function toggle(){opts.on=!opts.on;save();if(opts.on){unlock();sync()}else sync();paint()}
  function setVolume(value){opts.volume=Math.min(100,Math.max(0,Number(value)||0));save();if(playing && !fadeId)audio[playing].volume=opts.volume/100*.7;paint()}
  function mountAudioSettings(){
    const root=document.getElementById('modalRoot');
    if(typeof ui==='undefined' || ui.modal?.type!=='settings')return;
    const grid=root?.querySelector('.settings-grid');
    if(!grid || root.querySelector('#musicVolume'))return;
    const controls=document.createElement('div');controls.className='audio-settings';
    controls.innerHTML=`<div class="audio-settings-heading"><span>♫ 판타지 주점의 악사</span><small>ORIGINAL SOUNDTRACK</small></div>
      <div class="audio-settings-row"><button type="button" id="settingsMusicToggle" class="btn btn-plain">♫ 음악 끄기</button><span id="musicStatus" aria-live="polite">♬ 등불과 주사위</span></div>
      <label for="musicVolume">배경 음악 음량 <span id="musicVolumeValue">${opts.volume}%</span></label>
      <input id="musicVolume" type="range" min="0" max="100" step="1" value="${opts.volume}" aria-label="배경 음악 음량">
      <p>회관 · 원정 · 전투에 따라 음악이 자연스럽게 바뀝니다. 처음 재생할 때는 화면을 한 번 눌러 주세요.</p>`;
    grid.before(controls);paint();
  }
  document.addEventListener('pointerdown',e=>{
    if(e.target.closest('#musicToggle,#coverMusicToggle,#settingsMusicToggle'))return;
    if(opts.on)unlock();
  },{capture:true});
  document.addEventListener('click',e=>{
    if(e.target.closest('#musicToggle,#coverMusicToggle,#settingsMusicToggle')){toggle();return}
    if(e.target.closest('button,[data-action],[data-page]')){
      clearTimeout(syncTimer);syncTimer=setTimeout(()=>{mountAudioSettings();sync()},25);
    }
  });
  document.addEventListener('input',e=>{if(e.target?.id==='musicVolume')setVolume(e.target.value)});
  const modal=document.getElementById('modalRoot');
  if(modal){new MutationObserver(()=>{mountAudioSettings();setTimeout(sync,5)}).observe(modal,{childList:true,subtree:false})}
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){for(const a of Object.values(audio))a.pause()}
    else if(unlocked && opts.on){playing=null;sync()}
  });
  window.addEventListener('pagehide',()=>{for(const a of Object.values(audio))a.pause()});
  window.DuskMusic={sync,toggle,setVolume,getState:()=>({track:current,on:opts.on,volume:opts.volume,unlocked,playing})};
  paint();
})();
