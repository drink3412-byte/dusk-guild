/* The Dusk Guild v0.5 — First Day Companion. Non-destructive add-on. */
(()=>{
'use strict';
const PAGES={
hall:['이곳은 길드의 본부입니다','은화·명성·사기와 다음 줄거리를 확인하는 곳입니다. 첫날에는 자금을 쓰기보다 메인 의뢰부터 진행하세요.'],
board:['의뢰가 게임의 중심입니다','운명의 의뢰서는 5장으로 이어지는 메인 스토리입니다. 지역 의뢰는 자원과 경험치를 모으는 곳이고, 특별 의뢰는 다른 이야기입니다.'],
roster:['모험가는 전투에 나서는 동료입니다','체력은 생존, 피로는 출전 여부, 충성은 길드에 남을 의지를 뜻합니다. 인물을 눌러 능력치를 확인하세요.'],
forge:['상점은 출전 준비를 돕습니다','은화로 약초와 장비를 마련하고 철광석으로 강화할 수 있습니다. 첫날에는 무리하게 구매하지 않아도 됩니다.'],
map:['왕국의 무대입니다','지도에서는 왕국과 세력의 배경을 파악합니다. 첫 원정은 의뢰 게시판에서 시작합니다.'],
archive:['선택의 결과가 남는 곳입니다','의뢰의 결과, 세력 관계, 후일담과 결말을 확인합니다. 첫날에는 첫 의뢰부터 진행하세요.']
};
const TABS={
basics:{name:'시작하기',title:'길드장은 무엇을 하나요?',body:"<p><b>목표:</b> 세 명의 모험가를 이끌어 의뢰를 해결하고, 총 5장으로 이어지는 이야기를 완성합니다.</p><ol><li><b>회관:</b> 길드 상태 확인</li><li><b>의뢰 게시판:</b> 첫 번째 운명의 의뢰서 선택</li><li><b>원정대 편성:</b> 동료 세 명 배치</li><li><b>사건 판단:</b> 전투 보너스와 평판에 영향을 주는 선택</li><li><b>전투:</b> 적의 행동 예고에 맞춰 공격·방어·기술 선택</li><li><b>귀환:</b> 보상 수령, 휴식, 성장 후 다음 의뢰</li></ol><p class='guide-muted'>처음부터 모든 메뉴를 알 필요는 없습니다. 첫 원정을 한 번 해보는 것이 가장 빠릅니다.</p>"},
resources:{name:'능력치',title:'화면의 숫자들은 무슨 뜻일까요?',body:"<dl class='guide-dictionary'><div><dt>◆ 은화(G)</dt><dd>훈련·영입·장비 강화에 사용하는 돈</dd></div><div><dt>✧ 명성</dt><dd>의뢰를 해결할수록 오르는 길드 평판과 등급의 기준</dd></div><div><dt>길드 사기</dt><dd>길드원들의 전체 분위기</dd></div><div><dt>체력(HP)</dt><dd>전투 중 0이 되면 전투 불능. 귀환 후 회복 필요</dd></div><div><dt>피로 / 기력</dt><dd>원정으로 소모. 너무 지친 동료는 출전 불가능</dd></div><div><dt>충성도 / 유대</dt><dd>동료의 신뢰와 동료 사이의 관계</dd></div><div><dt>철광석 / 수정</dt><dd>장비 강화와 월석 각인에 쓰는 재료</dd></div></dl>"},
battle:{name:'전투',title:'적의 다음 행동부터 확인하세요',body:"<p>전투에서는 <b>매 턴 행동 하나</b>를 선택해야 합니다. 선택 후 적이 반응합니다.</p><ol><li><b>적의 의도:</b> 강공격은 방어, 의식은 차단 기술을 고려하세요.</li><li><b>개별 기술:</b> 기사·궁수·마도사 등 직업별 공격과 지원</li><li><b>방패 결진:</b> 받는 피해 감소, 집중 획득</li><li><b>집중 3:</b> 길드 연계기를 사용해 공격과 행동 차단</li><li><b>약초:</b> 전투 불능이 아닌 동료의 체력 회복</li><li><b>철수:</b> 손실을 감수하고 전투에서 돌아오기</li></ol><p class='guide-muted'>강한 공격이 보일 때는 무조건 공격하기보다 방어하는 편이 안전합니다.</p>"},
menus:{name:'전체 메뉴',title:'여섯 메뉴 한눈에',body:"<dl class='guide-dictionary'><div><dt>♜ 길드 회관</dt><dd>길드 현황, 후원, 전령 사건, 경쟁 길드</dd></div><div><dt>✉ 의뢰 게시판</dt><dd>메인·지역·특별 임무 시작</dd></div><div><dt>♟ 모험가 명부</dt><dd>길드원 확인, 영입과 성장</dd></div><div><dt>⚒ 대장간·상점</dt><dd>강화·약초·재료·시설</dd></div><div><dt>⌖ 왕국 지도</dt><dd>세계의 지리와 배경</dd></div><div><dt>❖ 황혼의 기록</dt><dd>이전 선택과 결과</dd></div></dl>"}
};
const TIPS={
prepare:'동료 <b>세 명</b>을 골라야 출발할 수 있습니다. 첫 원정은 카엘(기사) · 리아(궁수) · 세렌(마도사)를 그대로 사용해 보세요. 진형 순서는 회전 버튼으로 바꿀 수 있습니다.',
event:'이 화면은 <b>전투 전 판단</b>입니다. 선택지 아래 작은 글씨를 읽으면 어떤 준비 효과를 얻는지 알 수 있습니다.',
investigate:'현장 조사 단계입니다. <b>안전한 진입</b>은 방어와 집중에, <b>빠른 전진</b>은 기습에 유리합니다.',
battle:'<b>적의 다음 행동</b>을 먼저 보세요. 강공격에는 방패 결진, 의식에는 차단 기술을 고려하세요. 집중 3을 모으면 연계기를 쓸 수 있습니다.',
result:'원정이 끝났습니다. <b>길드로 돌아가기</b>로 결과를 정산한 뒤, 모험가의 체력과 피로를 확인하세요.'
};
function guideState(){
 if(!s)return null;
 if(!s.tutorial||s.tutorial.version!==1){
  s.tutorial={version:1,hidden:!!((s.completed?.length||0)>0||s.day>3)};
 }
 return s.tutorial;
}
function stage(){
 if(!s)return 'none';
 if(ui.modal?.type==='result')return 'result';
 if(ui.modal?.type==='battle')return 'battle';
 if(ui.modal?.type==='prepare')return 'prepare';
 if(['event','investigate'].includes(ui.modal?.type)||s.expedition)return 'decision';
 if((s.completed?.length||0)>0)return 'done';
 return ui.page==='board'?'board':'hall';
}
function card(){
 const st=guideState();if(!st||st.hidden)return '';
 const step=stage(),done=step==='done',q=currentStory(),help=PAGES[ui.page]||PAGES.hall;
 const title=done?'첫 원정을 마쳤습니다!':step==='board'?'첫 번째 의뢰를 골라 보세요':'첫날, 무엇부터 해야 하나요?';
 const copy=done?'이제 동료의 체력·피로를 확인한 뒤 지역 의뢰로 성장하거나 다음 메인 이야기를 진행하세요.':step==='board'?'가장 위에 있는 운명의 의뢰서가 메인 이야기입니다. 처음에는 여기서 출발하는 것이 좋습니다.':'처음에는 의뢰 하나만 해결해 보세요. 동료 세 명을 고르고 전투를 마치면 보상과 성장 방식을 자연스럽게 배울 수 있습니다.';
 const button=done?'<button class="btn btn-gold btn-sm" data-tutorial="hide">알겠어요 · 안내 접기</button>':step==='board'&&q?'<button class="btn btn-gold btn-sm" data-tutorial="first-quest">첫 의뢰 편성하기 →</button>':'<button class="btn btn-gold btn-sm" data-tutorial="board">의뢰 게시판 가기 →</button>';
 return '<section class="guide-first" aria-label="처음 플레이 안내"><div class="guide-topline"><span>✧ FIRST DAY · 처음 시작하는 길드장</span><span class="guide-sequence">'+(done?'완료':step==='board'?'02 / 04':'01 / 04')+'</span></div><div class="guide-main"><span class="guide-crest">✥</span><div><h3>'+title+'</h3><p>'+copy+'</p></div></div><div class="guide-actions">'+button+'<button class="btn btn-plain btn-sm" data-tutorial="open">전체 게임 설명</button><button class="guide-hide" data-tutorial="hide">안내 접기 ×</button></div><div class="guide-current"><b>'+help[0]+'</b><span>'+help[1]+'</span></div></section>';
}
function sync(){
 const t=guideState(),root=$('pageContent');if(!t||!root)return;
 root.querySelector('.guide-first')?.remove();
 const html=card();if(html)root.insertAdjacentHTML('afterbegin',html);
 const fab=$('guildHelpFab');if(fab)fab.hidden=$('app').classList.contains('hidden');
 const gold=$('headerGold')?.closest('.res');if(gold)gold.title='은화(G): 길드 운영 및 훈련·장비·영입에 쓰는 돈';
 const rep=$('headerRep')?.closest('.res');if(rep)rep.title='명성: 의뢰를 해결하며 높이는 길드 평판';
}
function annotate(){
 if(!s)return;
 const type=ui.modal?.type,tip=TIPS[type];if(!tip)return;
 const root=$('modalRoot');if(root.querySelector('.guide-modal-tip'))return;
 const dialog=root.querySelector('.dialog');if(!dialog)return;
 const node=document.createElement('div');node.className='guide-modal-tip';
 const step=type==='prepare'?'03 / 04 · 원정대 편성':type==='battle'?'04 / 04 · 전술 전투':type==='result'?'첫 원정 마무리':'03 / 04 · 현장 판단';
 node.innerHTML=guideState()?.hidden?'<span>✦ 길드장 안내</span><button type="button" data-tutorial="open">? 이 화면 설명 보기 ↗</button>':'<span>✦ 길드장 조언 · '+step+'</span><p>'+tip+'</p><button type="button" data-tutorial="open">자세히 알아보기 ↗</button>';
 const anchor=dialog.querySelector(ui.modal.type==='battle'?'.intent-v2':'.dialog-header')||dialog.querySelector(ui.modal.type==='battle'?'.battle-panel':'.battle-header');
 if(anchor)anchor.insertAdjacentElement('afterend',node);else dialog.insertAdjacentElement('afterbegin',node);
}
let active='basics',lastFocus=null;
function overlay(){let e=document.getElementById('tutorialOverlay');if(!e){e=document.createElement('div');e.id='tutorialOverlay';e.hidden=true;document.body.appendChild(e)}return e}
function open(tab){
 if(!TABS[tab])tab='basics';active=tab;
 if(overlay().hidden)lastFocus=document.activeElement;
 const root=overlay();root.hidden=false;
 root.innerHTML='<div class="guide-backdrop" data-tutorial="close"><section class="guide-book" role="dialog" aria-modal="true" aria-label="초보 길드장 안내서"><header class="guide-book-top"><div><div class="card-kicker">GUILDMASTER HANDBOOK</div><h2>초보 길드장 안내서</h2></div><button type="button" class="guide-x" data-tutorial="close" aria-label="닫기">×</button></header><nav class="guide-tabs">'+Object.entries(TABS).map(([id,x])=>'<button type="button" data-tutorial="tab" data-tab="'+id+'" class="'+(id===active?'active':'')+'" aria-pressed="'+(id===active?'true':'false')+'">'+x.name+'</button>').join('')+'</nav><article class="guide-book-content"><h3>'+TABS[active].title+'</h3>'+TABS[active].body+'</article><footer class="guide-book-actions"><button class="btn btn-plain btn-sm" data-tutorial="show">첫 원정 안내 다시 표시</button><button class="btn btn-gold btn-sm" data-tutorial="close">게임으로 돌아가기</button></footer></section></div>';
 root.querySelector('.guide-x')?.focus();
}
function close(){overlay().hidden=true;overlay().innerHTML='';lastFocus?.focus?.();lastFocus=null}
function fab(){
 if($('guildHelpFab'))return;
 const b=document.createElement('button');b.type='button';b.id='guildHelpFab';b.className='guild-help-fab';b.dataset.tutorial='open';b.setAttribute('aria-label','게임 도움말');b.textContent='? 도움말';b.hidden=true;document.body.appendChild(b);
}
const oldRender=render;
render=function(...args){const result=oldRender(...args);sync();annotate();return result};
const oldModal=renderModal;
renderModal=function(...args){const result=oldModal(...args);annotate();return result};
fab();overlay();
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-tutorial]');if(!el)return;
 e.preventDefault();e.stopImmediatePropagation();
 const action=el.dataset.tutorial;
 if(action==='close'){if(el.classList.contains('guide-backdrop')&&e.target!==el)return;close();return}
 if(action==='open'){open(ui.modal?.type==='battle'?'battle':'basics');return}
 if(action==='tab'){open(el.dataset.tab);return}
 if(action==='hide'){const t=guideState();if(t){t.hidden=true;save();sync()}return}
 if(action==='show'){const t=guideState();if(t){t.hidden=false;save();close();sync();annotate()}return}
 if(action==='board'){if(!s.battle&&!s.expedition)navigate('board');return}
 if(action==='first-quest'){if(s.battle||s.expedition)return;const q=currentStory();if(q)prepare(q.id);return}
},true);
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay().hidden){e.preventDefault();e.stopImmediatePropagation();close()}},true);
window.DuskGuildGuide={state:guideState,stage,open,refresh:sync};
})();