/* THE DUSK GUILD — Chronicle of Consequences, v0.2
   Pure add-on to the original game: migrates old saves and expands every system.
*/
(()=>{
'use strict';
const OLD={init:initState,hero:newHero,load,continue:continueGame,renderModal,renderHall,renderBoard,renderRoster,renderForge,renderArchive,renderRail,depart,chooseEvent,beginBattle,endExpedition,finishEnding,restDay,findQuest,importSave};
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
const names={people:'에델브룩 주민',merchant:'유리강 상단',abbey:'백색 수도원',court:'에르베인 궁정'};
const roleNames={knight:'방패 파쇄',archer:'달꿰기',mage:'문장 해석',healer:'새벽의 기도',rogue:'그림자 걸음'};
const FATES={
kael:[['무너진 성벽의 서약','카엘의 갑옷 안쪽에는 왕실 인장이 아닌 변방 병사들의 서명이 새겨져 있다. 그들은 명령보다 서로를 지키겠다고 약속했다.','그의 옛 동료에게 서신을 보낸다','과거를 묻고 현재의 길드를 선택하게 한다'],['재판받지 못한 기사','한때 카엘을 추방했던 재판관이 길드에 도움을 청했다. 카엘은 창밖의 비를 보며 아무 말도 하지 않았다.','재판 기록을 공개한다','카엘의 선택을 존중해 기록을 보관한다']],
lia:[['숲의 두 번째 목소리','리아는 실종된 동생이 남긴 작은 뿔피리를 찾았다. 숲의 바람에서 같은 선율이 들려왔다.','찾을 수 있는 길을 연다','리아에게 멈출 자유를 준다'],['이름을 되찾은 정찰병','먼 곳에서 온 정찰병은 리아의 동생이 살아 있었다는 흔적을 보였다. 이제 리아가 결심해야 한다.','길드의 정찰대를 파견한다','직접 만날 시간을 보장한다']],
seren:[['봉인된 연구 노트','세렌이 읽던 별의 지도에는 존재하지 않는 일곱 번째 별이 표시돼 있다. 그 별의 이름을 읽자 방 안의 촛불이 흔들렸다.','금서의 사본을 만든다','연구를 길드 서고에 맡긴다'],['거짓된 예언의 값','왕실의 마도 연구원은 세렌의 발견을 지워 달라고 부탁했다. 그 대가는 엄청난 후원금이었다.','진실을 공표한다','증인을 먼저 보호한다']],
mora:[['상처를 묶은 실','모라는 오래전 누군가를 돕지 못했다는 생각에 잠을 이루지 못한다. 그날의 진실은 수첩 깊은 곳에 묻혀 있다.','실종자 가족을 돕는다','모라의 이야기를 끝까지 듣는다'],['흐린 밤의 꽃','길드 회관에 이름 모를 꽃이 배달됐다. 모라가 오래 기다려 온 편지와 함께였다.','무료 진료소를 연다','모라에게 떠날 시간을 준다']],
bram:[['불타버린 다리','브람은 다리의 붕괴를 막지 못한 기억을 떠올린다. 누군가는 그를 영웅이라고 부르지만 그는 고개를 젓는다.','다리 복구를 후원한다','생존자들의 증언을 모은다'],['철의 맹세','오래된 동료가 브람에게 돌아오라고 권한다. 길드장이 누구의 말에 귀 기울이는지 브람은 지켜본다.','브람에게 지휘권을 맡긴다','길드의 약속을 다시 확인한다']],
elyne:[['유리의 반쪽','엘리네의 가문 장부에서 한쪽 서명만 남은 계약이 발견된다. 그녀는 그 계약에 자신의 유년이 걸려 있다고 말한다.','상단의 장부를 추적한다','장부를 보호할 새 상자를 만든다'],['강에 비친 별','엘리네의 어머니가 남긴 진짜 서명이 드러났다. 그녀는 이 사실을 누구에게 먼저 전할지 묻는다.','상단의 부정을 고발한다','가족에게 먼저 전한다']],
tavin:[['세 번째 열쇠','타빈이 맡긴 열쇠는 어떤 자물쇠에도 맞지 않는다. 대신 왕궁 시계탑 아래서만 노래하듯 울린다.','시계탑을 조사한다','타빈에게 소유권을 준다'],['도둑이 지킨 약속','타빈을 쫓던 정보상이 길드 회관에 나타났다. 타빈은 처음으로 거짓말을 하지 않았다.','옛 동료와 화해시킨다','길드의 방패가 되어 준다']],
yuna:[['내일 적힌 날씨','유나는 내일 비가 내리지 않는다는 꿈을 꾸었다. 그러나 골짜기에서 이미 천둥 소리가 울리고 있다.','수도원에 꿈을 기록한다','두려움보다 휴식을 선택한다'],['꿈이 바뀌는 순간','유나가 적어 둔 미래가 처음으로 틀렸다. 그녀는 그것이 불길함이 아니라 자유일지도 모른다고 말했다.','꿈의 기록을 공개한다','새 일기장을 선물한다']],
orian:[['검은 화살통','오리안이 왕실을 떠난 이유는 실패한 명령이 아니었다. 명령서에 없는 이름들을 지키고 싶었기 때문이다.','왕실의 기록을 조사한다','도움을 청한 난민을 보호한다'],['왕실의 마지막 궁수','옛 상관이 사면장을 보냈다. 오리안은 그것을 불태우지 않고 길드장의 책상 위에 올려놓았다.','사면을 거절한다','왕실과 협상한다']],
isa:[['천 개의 가면','이사는 왕궁 축제에 같은 얼굴을 가진 사람이 둘 있었다고 말한다. 둘 중 한 명은 기록에 존재하지 않았다.','가면 제작자를 찾아간다','이사의 신원을 보호한다'],['가면 뒤에 남은 사람','길드 회관에 가면 하나가 도착했다. 그 안에는 누군가 자신을 기억해 달라는 문구가 새겨져 있었다.','진짜 이름을 기록한다','자신의 이름을 정할 자유를 준다']]
};
const EXTRA_QUESTS=[
[0,'숲길의 종소리','낡은 종탑의 그림자를 따라 실종된 아이의 이름을 찾는다.','소금숲','forest','가시숲의 수호수','짐승',2,'주민의 부탁을 따라 어린아이를 찾는다. 그 아이는 어느 나무도 베어서는 안 된다고 말했다.','아이의 말을 믿는다','나무의 기억을 조사한다','people'],
[0,'북방의 우편 배달','폭설에 끊어진 국경의 편지를 전달한다.','북방 초소','forest','하얀 늑대','짐승',3,'편지는 동쪽 성문을 지키던 이름 없는 병사에게 가는 마지막 인사였다.','편지를 직접 전달한다','봉인의 출처를 조사한다','court'],
[1,'마지막 선장의 배','강 위에 정박한 배의 선장은 매일 다른 이름으로 불린다.','유리강','river','심연의 물결','망령',5,'선장은 어제의 자신을 기억하지 못했다. 그러나 배의 노래는 약속을 기억했다.','상인들의 손을 잡는다','선장의 가족을 찾는다','merchant'],
[1,'물의 세금','농부들이 알 수 없는 이름으로 작성된 세금 장부를 가져왔다.','강가 시장','river','검은 수문 경비','인간',6,'정직한 상인과 길드의 동맹은 궁정에 달갑지 않은 일이었다.','장부를 공개한다','계약의 흐름을 추적한다','people'],
[2,'침묵의 빵집','수도원 앞 빵집에서 매일 같은 손님이 사라진다.','백색 수도원','abbey','침묵의 사제','술사',8,'빵집 주인은 손님들의 이름을 매일 새로 적고 있었다. 잊는 사람이 아니라 잊혀지는 사람이었다.','수도원에 진실을 요청한다','주민과 조용히 수색한다','abbey'],
[2,'겨울의 사본','수도원 도서관에서 사라진 책의 마지막 한 장이 발견된다.','수도원 서고','abbey','서고 수호자','망령',9,'수도원장에게 보내는 편지는 이 책이 치유가 될 수도 있다고 했다.','수도원장에게 전달한다','길드의 비밀서고에 보관한다','abbey'],
[3,'붉은 연회장의 증인','가면 무도회에서 왕실의 오랜 비밀을 증언할 사람을 찾는다.','에르베인 왕도','court','가면의 기사','인간',11,'증인은 자신을 영웅으로 만들지 말아 달라고 부탁했다. 그는 그저 살아 있었다.','증인을 공개 보호한다','그의 신분을 숨긴다','court'],
[3,'후계자 없는 편지','왕위 계승 명부에 기록되지 않은 아이의 편지가 도착했다.','궁정 회랑','court','황금 문장 수호자','우두머리',12,'편지의 첫 줄은 왕의 이름으로 시작했다. 끝 줄에는 왕을 부정하는 서명이 있었다.','궁정에 정식 청원한다','기록을 백성에게 전한다','people'],
[4,'마지막 등불을 지키는 자','별이 없는 밤, 에델브룩 주민들이 길드에 등불을 맡긴다.','그림자 기록고','eclipse','밤의 파수꾼','망령',14,'이 등불은 어떤 마법보다 오래 버텼다. 여러 사람이 불씨를 서로 넘겨 주었기 때문이다.','등불을 온 왕국에 나눈다','등불에 남은 기억을 읽는다','people'],
[4,'새벽 이전의 기록','잊힌 이름을 되돌리기 전에 누군가의 유언을 찾아야 한다.','끝없는 서고','eclipse','이름 없는 기록관','술사',15,'한 장의 종이에 백 명의 이름이 쓰여 있었다. 마지막 빈 줄에는 길드장의 이름이 적힐 자리였다.','모두의 이름을 보존한다','원하는 이에게만 돌려준다','abbey']
].map((v,i)=>({id:`arc-${i}`,ch:v[0],n:50+i,name:v[1],desc:v[2],loc:v[3],art:v[4],enemy:v[5],type:v[6],difficulty:v[7],story:v[8],choices:[[v[9],'동맹의 신뢰를 얻지만 다른 세력이 경계합니다.',v[11]],[v[10],'불확실성을 줄이고 적의 약점을 조사합니다.','study']],after:'길드의 결정을 기억하는 사람이 생겼다. 작은 사건은 언젠가 더 큰 역사의 일부가 된다.',reward:150+v[7]*36,isSide:true,unique:true,faction:v[11]}));
function relationKey(a,b){return [a,b].sort().join('::')}
function relation(a,b){return s.bonds?.[relationKey(a,b)]||0}
function alterBond(a,b,delta){if(!a||!b||a===b)return;s.bonds[relationKey(a,b)]=clamp(relation(a,b)+delta,-40,80)}
function migrate(v){if(!v)return v;v.version=2;v.bonds ||= {};v.personal ||= {};v.rival ||= {name:'백은의 사자단',renown:16,pressure:12,history:[]};v.council ||= {lastDay:0,sponsor:null,debt:0,decisions:[]};v.legacy ||= [];v.interludes ||= [];v.resolvedEvents ||= [];v.flags ||= {};v.items ||= {};v.items.crystal ??= 0;v.items.herb ??= 0;v.items.iron ??= 0;v.pendingResult ??= null;
if(v.battle && !v.battle.combatVersion){v.battle.combatVersion=2;v.battle.lanes=[...v.battle.party];v.battle.ward=0;v.battle.mark=0;v.battle.phase=1;v.battle.guardBonus=0;v.battle.focus=clamp(v.battle.focus||0,0,3)}
for(const h of v.roster){h.loyalty ??= 65;h.missions ??= 0;h.runes ??= 0;h.injured ??= 0;h.talent ??= 0}
return v}
newHero = function(id){const h=OLD.hero(id);h.runes=0;return h};
initState=function(guild,mode){return migrate(OLD.init(guild,mode))};
load=function(){return migrate(OLD.load())};
function markFaction(id,amount){if(!names[id])return;s.factions[id]=clamp((s.factions[id]||0)+amount,-100,100)}
function individual(h){const key=s.personal[h.id]||0,ep=FATES[h.id]?.[key];return {index:key,episode:ep,unlocked:key===0 || (h.missions>=2 && h.loyalty>=54)}}
function featureUnlock(h){return (s.personal[h.id]||0)>=2}
function partyChemistry(){const ids=s.expedition?.party||s.party||[];return (relation(ids[0],ids[1])+relation(ids[1],ids[2])+relation(ids[0],ids[2]))/3}
function chapterClues(){const items=[];const chapter=s.chapter;
if(s.flags['decision_story-0-0']==='guard')items.push('소금숲 사람들은 길드가 조심스럽게 구조한 일을 기억합니다.');
if(s.flags['decision_story-1-0']==='merchants')items.push('상단이 건넨 장부 사본 덕분에 이후 은밀한 거래를 추적할 수 있습니다.');
if(s.flags['decision_story-2-1']==='morale')items.push('수도원의 예언을 함께 읽은 동료들이 같은 비밀을 공유하고 있습니다.');
if(s.flags['decision_story-3-1']==='court')items.push('궁정은 길드가 공개한 왕위 계승 기록에 불편해하고 있습니다.');
if(chapter>0 && s.completed?.includes('arc-0'))items.push('숲길의 아이가 남긴 나무의 경고가 아직 길드의 기록에 남아 있습니다.');
return items}
function storyContext(q){const member=(s.expedition?.party||[]).map(id=>dbHero(id)?.name?.split(' ')[0]).filter(Boolean);const who=member.length?`동행한 ${member.join('·')}의 생각도 다르다. `:'';
const last=s.legacy?.slice(-1)[0];const after=last?`지난 선택 — ${last.text} — 이 이번 원정의 이야기를 바꿨다. `:'';
const clauses={1:'유리강의 수문에서 숲의 종소리를 기억하는 사람들이 기다리고 있었다.',2:'수도원의 정문에는 강바닥에서 건져 올린 장부의 봉인이 새겨져 있었다.',3:'왕궁 연회장은 수도원에서 사라진 예언을 조용히 회수하려 했다.',4:'기록고의 문은 길드가 이전에 선택한 모든 이름을 하나씩 다시 불렀다.'};
return `${q.story} ${who}${after}${clauses[q.ch]||''}`}
const oldFindQuest=findQuest;
findQuest=function(id){return EXTRA_QUESTS.find(q=>q.id===id&&!s.completed.includes(id))||oldFindQuest(id)};
const originalBoard=renderBoard;
renderBoard=function(){const added=EXTRA_QUESTS.filter(q=>q.ch===Math.min(s.chapter,4)&&!s.completed.includes(q.id));let html=originalBoard();if(added.length)html+=`<div class="section-heading"><h3>이름을 가진 특별 의뢰</h3><small>UNIQUE SIDE STORIES</small></div><div class="quest-list">${added.map(questHtml).join('')}</div>`;return html};
const originalHall=renderHall;
renderHall=function(){const rival=s.rival;const clues=chapterClues();const news=s.interludes.slice(-1)[0];return originalHall()+`<div class="guild-addons"><section class="surface"><div class="card-kicker">THE GUILD COUNCIL</div><h3>길드 의회 · 후원과 외교</h3><p>왕궁, 상단, 수도원과 계약을 맺거나 독립을 유지하세요. 계약은 보상뿐 아니라 적대와 후속 사건도 남깁니다.</p><div class="row"><button class="btn btn-gold" data-action="v2-council">길드 의회 열기</button><button class="btn btn-plain" data-action="v2-relations">동료 관계도</button><button class="btn btn-plain" data-action="v2-rival">경쟁 길드 대응</button></div></section><section class="surface"><div class="card-kicker">RIVAL GUILD · THE SILVER LIONS</div><h3>${esc(rival.name)}</h3><p>경쟁 길드 명성 <b class="gold">${rival.renown}</b> · 경쟁 압박 <b class="gold">${rival.pressure}</b> / 100</p><div class="mini-meter"><span style="width:${rival.pressure}%"></span></div><p>${esc(news||'그들은 왕국의 의뢰와 후원금을 두고 우리 길드와 경쟁합니다.')}</p></section></div>${clues.length?`<div class="surface story-memory"><div class="card-kicker">THE THREADS OF FATE</div><h3>지난 선택이 남긴 흔적</h3>${clues.map(t=>`<p>✦ ${esc(t)}</p>`).join('')}</div>`:''}`};
const originalRoster=renderRoster;
renderRoster=function(){let out=originalRoster();out+=`<div class="section-heading"><h3>동료들의 미완성 이야기</h3><small>PERSONAL CHRONICLES</small></div><div class="personal-cards">${s.roster.map(h=>{const p=individual(h),d=dbHero(h.id);return `<article class="surface personal-entry"><img src="${image(h.id)}" alt="${esc(d.name)}"><div><h3>${esc(d.name)}</h3><small>충성 ${h.loyalty} · 개인 연대기 ${p.index}/2 · ${featureUnlock(h)?'고유 특성 해금': '미완의 서약'}</small><p>${esc(p.episode?.[0]||'개인 이야기 완결 — 서로의 약속은 전투에서도 이어집니다.')}</p><button class="btn btn-sm btn-gold" data-action="v2-personal" data-id="${h.id}" ${!p.episode||!p.unlocked?'disabled':''}>${p.episode?'개인 이야기 열기':'완결'} ${!p.unlocked?'· 2회 원정 필요':''}</button><button class="btn btn-sm btn-plain" data-action="v2-talk" data-id="${h.id}">면담 · 30G</button></div></article>`}).join('')}</div>`;return out};
const originalForge=renderForge;
renderForge=function(){const h=getHero(ui.selectedHero)||s.roster[0];return originalForge()+`<div class="surface runeforge"><div class="card-kicker">THE CRYSTAL ARCHIVE</div><h3>월석 각인 · ${esc(dbHero(h.id).name)}</h3><p>방치돼 있던 수정 자원을 이제 장비에 사용합니다. 각인 단계마다 마법 피해·장비 외관의 문양이 조금씩 강해집니다.</p><div class="row space"><span>현재 각인 +${h.runes||0} / 3 · 보유 수정 ${s.items.crystal}</span><button class="btn btn-gold btn-sm" data-action="v2-rune" data-id="${h.id}" ${h.runes>=3||s.items.crystal<2||s.gold<130+90*h.runes?'disabled':''}>각인하기 · ◆ ${130+90*(h.runes||0)} / 수정 2</button></div></div>`};
const originalArchive=renderArchive;
renderArchive=function(){let html=originalArchive();const relations=Object.entries(s.bonds).filter(([k,v])=>v!==0).sort((a,b)=>b[1]-a[1]).slice(0,8);html+=`<div class="surface"><div class="card-kicker">THE WEIGHT OF CHOICES</div><h3>기록된 선택과 그 여파</h3>${s.legacy.length?s.legacy.slice().reverse().map(l=>`<div class="feed-item"><small>제${l.day}일 · ${esc(l.place)}</small>${esc(l.text)} <span class="gold">${esc(l.effect||'')}</span></div>`).join(''):'<p>특별 의뢰와 사건을 해결하면 이곳에 후속 기록이 남습니다.</p>'}<div class="rule"></div><h3>동료의 유대</h3>${relations.length?relations.map(([key,val])=>{const ids=key.split('::');return `<div class="rail-row"><span>${esc(dbHero(ids[0])?.name||ids[0])} ↔ ${esc(dbHero(ids[1])?.name||ids[1])}</span><b>${val>0?'+':''}${val}</b></div>`}).join(''):'<p>동료들이 함께 원정을 떠나면 관계가 발전합니다.</p>'}</div>`;return html};
const originalRail=renderRail;
renderRail=function(){return originalRail()+`<div class="rail-section"><div class="card-kicker">LEGACY REPORT</div><h3 class="rail-title">길드의 파장</h3><p>개인 이야기 ${Object.values(s.personal).reduce((a,b)=>a+b,0)} / 20 · 특별 의뢰 ${EXTRA_QUESTS.filter(q=>s.completed.includes(q.id)).length} / 10</p><p>동료 유대 평균 ${Math.round(Object.values(s.bonds).reduce((a,b)=>a+b,0)/Math.max(1,Object.keys(s.bonds).length))} · 경쟁 압박 ${s.rival.pressure}</p></div>`};
const oldDepart=depart;
depart=function(){if(!ui.modal||ui.modal.type!=='prepare')return;const q=findQuest(ui.modal.qid);if(!q)return;if(ui.modal.party.some(id=>getHero(id)?.loyalty<20)){notify('충성도가 너무 낮아 출전을 거절한 동료가 있습니다. 면담으로 신뢰를 회복하세요.');return;}oldDepart();if(s.expedition){s.expedition.quest.story=storyContext(s.expedition.quest);s.expedition.departureDay=s.day;s.expedition.afterChoice=false;render()}};
const oldChooseEvent=chooseEvent;
chooseEvent=function(idx){const q=s.expedition?.quest;if(!q)return;const opt=q.choices[idx];if(!opt)return;const kind=opt[2];
let faction={merchants:'merchant',court:'court',abbey:'abbey',people:'people'}[kind];if(faction){markFaction(faction,6);s.rival.pressure=clamp(s.rival.pressure+3,0,100)}
if(kind==='guard'){s.expedition.guardBonus=0.4;s.expedition.focusBonus=1;s.morale=clamp(s.morale+1,0,100)}
if(kind==='study'){s.expedition.studyBonus=.18;s.expedition.focusBonus=1}
if(kind==='ambush')s.expedition.ambushBonus=.17;
if(kind==='treasure')s.expedition.extraMaterial=1;
const hero=s.expedition.party.map(getHero).filter(Boolean);
for(const h of hero){h.loyalty=clamp(h.loyalty+(kind==='morale'?2:1),0,100)}
s.legacy.push({day:s.day,place:q.loc,text:`${q.name}: ${opt[0]}`,effect:kind==='guard'?'첫 턴 피해 감소':kind==='study'?'적의 약점 노출':faction?`${names[faction]}의 신뢰 변화`:'전투 조건 변화'});
s.expedition.pendingChoice=idx;ui.modal={type:'investigate'};render();
};
const oldBeginBattle=beginBattle;
beginBattle=function(){oldBeginBattle();const b=s.battle;if(!b)return;const q=s.expedition.quest,d=q.difficulty,adv=s.expedition;
const mult=s.difficulty==='hard'?1.18:1;
b.maxHp=Math.round((48+d*16+(q.boss?d*6:0))*mult);b.hp=Math.max(1,Math.round(b.maxHp*(1-(adv.ambushBonus||0))));
b.attack=Math.round((8+d*1.8+(q.boss?2:0))*mult*(adv.studyBonus?1-adv.studyBonus:1));
b.focus=clamp((s.buildings.library||0)+(adv.focusBonus||0),0,3);
b.intent='strike';b.ward=0;b.mark=0;b.ritual=0;b.phase=1;b.guardBonus=adv.guardBonus||0;b.lanes=[...b.party];b.combatVersion=2;
b.log=[`전투 시작. ${q.enemy}의 태세를 읽고 세 동료의 고유 행동을 선택하세요.`];render()};
function combatIntent(b){const q=s.expedition.quest;
if(q.boss&&b.hp<=b.maxHp*.46&&b.phase===1){b.phase=2;b.log.unshift('우두머리가 숨겨 둔 두 번째 전술을 꺼냈다.');}
if(b.phase===2 && b.round%4===0)return 'sweep';
if(b.round%6===5)return 'ritual';
if(b.round%4===3)return 'heavy';
if((q.type==='술사'||q.boss)&&b.round%4===2)return 'ward';
return 'strike'}
function intentText(b){const label={strike:'전열을 향한 공격',heavy:'강공격 준비 · 방어 권장',ritual:'의식 준비 · 방해 기술 권장',ward:'방어막 전개 · 마법 권장',sweep:'전열과 중열을 휩쓰는 광역 공격'};
return `${label[b.intent]||'불길한 움직임'} · 예상 위력 ${Math.round(b.attack*(b.intent==='heavy'?1.65:b.intent==='sweep'?1.2:1))}`}
function activeParty(b){return b.party.map(getHero).filter(h=>h&&h.hp>0)}
function applyHit(h,dmg,b,guard){let reduced=Math.max(1,Math.round(dmg-(h.def+h.armor*2+h.cloak)*.16));if(guard)reduced=Math.ceil(reduced*.31);if(h.id===b.lanes[0])reduced=Math.ceil(reduced*.83);if(b.guardBonus){reduced=Math.ceil(reduced*(1-b.guardBonus));b.guardBonus=0}h.hp=Math.max(0,h.hp-reduced);if(!h.hp)b.log.unshift(`${dbHero(h.id).name.split(' ')[0]} 전투 불능. 회복약만으로는 다시 일어날 수 없습니다.`);else b.log.unshift(`${dbHero(h.id).name.split(' ')[0]}이(가) ${reduced} 피해를 받았다.`)}
function enemyStep(b,guard=false,interrupted=false){if(interrupted){b.log.unshift('적의 행동이 끊겼다. 기회를 잡았다!');return}
if(b.intent==='ward'){b.ward=1;b.log.unshift('적의 보호막이 강화됐다.');return}
if(b.intent==='ritual'){b.ritual=1;b.log.unshift('적이 주문을 준비했다. 다음 공격을 경계하세요.');return}
const live=activeParty(b);if(!live.length)return;const base=Math.round(b.attack*(b.intent==='heavy'?1.65:b.intent==='sweep'?1.18:1)*(b.ritual?1.3:1));b.ritual=0;
if(b.intent==='sweep'){for(const h of live.slice(0,2))applyHit(h,base*.7,b,guard);return}
let target=live.find(h=>h.id===b.lanes[0])||live[0];if(s.expedition.quest.type==='술사' && b.round%3===0)target=live.find(h=>h.id===b.lanes[2])||target;
applyHit(target,base,b,guard)}
function memberSkill(hero,b){const db=dbHero(hero.id);const arc=hero.arc+hero.relic*2+(hero.runes||0)*3,atk=hero.atk+hero.sword*3;const allied=activeParty(b);const unlocked=featureUnlock(hero);
let hit=0,guard=false,interrupt=false,note='';let affinity=partyChemistry();
if(db.class==='knight'){hit=Math.round(atk*.85+hero.def*.5);guard=true;note='방패 파쇄 · 전열 엄호';}
else if(db.class==='archer'){hit=Math.round(atk*1.35+(b.mark?8:0));b.mark=2;note='달꿰기 · 약점 표식';}
else if(db.class==='mage'){hit=Math.round(arc*1.55+3);interrupt=b.intent==='ritual';b.ward=0;note='문장 해석 · 술식 관통';}
else if(db.class==='healer'){const low=allied.slice().sort((a,c)=>a.hp/a.maxHp-c.hp/c.maxHp)[0];if(low&&low.hp<low.maxHp){const healed=Math.min(low.maxHp-low.hp,Math.round(17+arc*.85+hero.level));low.hp+=healed;note=`새벽의 기도 · ${dbHero(low.id).name.split(' ')[0]} +${healed} 회복`;}else{hit=Math.round(arc*.65+3);note='새벽의 기도 · 응징의 빛'}guard=true;}
else if(db.class==='rogue'){hit=Math.round(atk*1.22+(b.intent==='ritual'?12:0));interrupt=b.intent==='ritual'||b.intent==='heavy'&&(b.round%2===0);note='그림자 걸음 · 틈새 노리기';}
else{hit=Math.round(atk*.95+arc*.3);note='공격';}
if(unlocked){hit=Math.round(hit*1.18);note+=' · 개인 서약 보너스'}
if(affinity>15)hit=Math.round(hit*1.12);
if(b.mark>0&&db.class!=='archer'){hit=Math.round(hit*1.13);b.mark--}
if(b.ward>0&&db.class!=='mage')hit=Math.round(hit*.6);
const type=s.expedition.quest.type;if((type==='망령'&&db.class==='mage')||(type==='짐승'&&db.class==='archer')||(type==='인간'&&db.class==='rogue')||(type==='술사'&&db.class==='mage')){hit=Math.round(hit*1.18);note+=' · 상성 우위'}
return {hit,guard,interrupt,note};}
function v2Combat(action){const b=s.battle;if(!b||ui.modal?.type!=='battle')return;let hit=0,guard=false,interrupt=false,note='',party=activeParty(b);
if(action.startsWith('hero:')){const id=action.slice(5),hero=party.find(h=>h.id===id);if(!hero)return;const r=memberSkill(hero,b);hit=r.hit;guard=r.guard;interrupt=r.interrupt;note=`${dbHero(hero.id).name.split(' ')[0]}: ${r.note}`;b.focus=clamp(b.focus+1,0,3)}
else if(action==='guard'){guard=true;b.focus=clamp(b.focus+2,0,3);note='수비 전술 · 적의 다음 행동에 대비한다.'}
else if(action==='combo'){if(b.focus<3)return;b.focus-=3;const damage=party.reduce((v,h)=>v+(h.atk+h.sword*3)*.62+(h.arc+h.relic*2)*.57,0);hit=Math.round(damage*(1+Math.max(0,partyChemistry())/110));interrupt=true;note='길드 연계기 · 세 사람이 하나의 서약으로 움직인다.'}
else if(action==='herb'){if(s.items.herb<=0)return;const injured=party.filter(h=>h.hp>0&&h.hp<h.maxHp).sort((a,c)=>a.hp/a.maxHp-c.hp/c.maxHp)[0];if(!injured){notify('치료할 수 있는 생존 동료가 없습니다. 전투 불능 동료는 귀환 후 치유실에서 회복해야 합니다.');return}const val=Math.round(26+s.buildings.infirmary*7);const restored=Math.min(injured.maxHp-injured.hp,val);s.items.herb--;injured.hp+=restored;note=`${dbHero(injured.id).name.split(' ')[0]} 약초 회복 +${restored}`}
else return;
if(hit>0){b.hp=Math.max(0,b.hp-hit);b.log.unshift(`${note} · 피해 ${hit}`)}else b.log.unshift(note);
if(b.hp<=0){endExpedition(true);return}
enemyStep(b,guard,interrupt);if(activeParty(b).length===0){endExpedition(false);return}
b.round++;b.intent=combatIntent(b);if(b.round>=55){endExpedition(false);return}render()}
const originalEnd=endExpedition;
endExpedition=function(won,retreated=false){const q=s.expedition?.quest;const party=[...(s.expedition?.party||[])];const earnedIron=s.expedition?.extraMaterial||0;const choice=q?s.flags['decision_'+q.id]:null;
originalEnd(won,retreated);
if(!s||!q)return;
if(won){for(let i=0;i<party.length;i++){for(let j=i+1;j<party.length;j++)alterBond(party[i],party[j],2+(q.boss?2:0))}
for(const id of party){const h=getHero(id);if(h)h.loyalty=clamp(h.loyalty+1,0,100)}
if(q.unique){markFaction(q.faction,choice===q.faction?6:2);s.items.crystal+=q.ch>=2?1:0;}if(q.isSide&&earnedIron)s.items.iron+=earnedIron;
if(q.ch>=1 && !q.isSide && q.n===0 && (s.flags['decision_story-0-0']==='guard')){s.items.herb+=1;s.interludes.push('숲에서 도운 가족이 길드 앞으로 치유 약초를 보냈습니다.')}
if(q.ch>=2&&!q.isSide&&q.n===1&&s.flags['decision_story-1-0']==='merchants'){s.gold+=90;s.interludes.push('유리강 상단의 증언이 수도원 조사의 보상을 높였습니다.')}
if(q.ch===4 && q.boss && s.factions.people>=24){s.morale=clamp(s.morale+12,0,100);s.interludes.push('주민들이 길드의 마지막 원정을 응원했습니다.')}
s.rival.renown+=q.isSide?5:8;s.rival.pressure=clamp(s.rival.pressure+(q.isSide?3:6),0,100);
}else{s.rival.pressure=clamp(s.rival.pressure+7,0,100)}
s.pendingResult=structuredClone(ui.modal.result);s.pendingResult.after=(s.pendingResult.after||'')+(won?` ${s.interludes.at(-1)||''}`:'');
ui.modal={type:'result',result:s.pendingResult};save();render()};
function advanceCore(){const upkeep=s.roster.reduce((a,h)=>a+Math.max(2,Math.floor(h.level/2)+2),0)+(s.council.sponsor==='court'?5:0);
s.gold=Math.max(0,s.gold-upkeep);s.day++;
for(const h of s.roster){h.hp=Math.min(h.maxHp,h.hp+12+s.buildings.infirmary*11);h.stamina=Math.min(100,h.stamina+25+s.buildings.hall*3);h.injured=Math.max(0,h.injured-1);if(h.loyalty<30 && s.day%3===0)h.loyalty=clamp(h.loyalty-2,0,100)}
s.morale=clamp(s.morale+3,0,100);
if(s.day%3===0){const available=HERO_DB.filter(h=>!getHero(h.id)&&!s.recruits.includes(h.id));if(available.length)s.recruits.push(available[(s.day*5)%available.length].id)}
if(s.day%4===0){s.rival.renown+=10+s.chapter*3;s.rival.pressure=clamp(s.rival.pressure+8,0,100);s.interludes.push(`${s.rival.name}이(가) 중요한 의뢰를 선점했습니다.`);}
if(s.rival.pressure>=80){s.rival.pressure=40;s.gold=Math.max(0,s.gold-60);markFaction('merchant',-4);s.interludes.push('경쟁 길드의 홍보전으로 후원 계약이 흔들렸습니다. 은화 60G와 상단 신뢰를 잃었습니다.');journal(s.interludes.at(-1));}
if(s.council.sponsor==='merchant' && s.day%3===0){s.gold+=80;markFaction('court',-1)}
if(s.council.sponsor==='abbey'&&s.day%3===0){for(const h of s.roster)h.hp=Math.min(h.maxHp,h.hp+8);markFaction('abbey',1)}
if(s.council.debt>0 && s.day%5===0){const due=Math.min(s.council.debt,55),paid=Math.min(s.gold,due);s.gold-=paid;s.council.debt-=paid;if(paid<due){s.council.debt+=10;s.morale=clamp(s.morale-4,0,100);journal(`계약 채무 ${due-paid}G를 갚지 못해 연체료가 발생했습니다.`)}else journal(`계약 채무 ${paid}G를 상환했습니다.`)}
if(s.day%7===0&&s.roster.length>3){const deserter=s.roster.find(h=>h.loyalty<12);if(deserter){const n=dbHero(deserter.id).name;s.roster=s.roster.filter(h=>h.id!==deserter.id);s.party=s.party.filter(id=>id!==deserter.id);if(!s.recruits.includes(deserter.id))s.recruits.push(deserter.id);s.rival.renown+=7;journal(`${n}이(가) 길드와의 신뢰를 잃고 떠났다. 이후 다시 영입할 수 있지만 관계는 처음부터 회복해야 한다.`)}}
if(s.day%5===0){const ids=s.roster.map(h=>h.id);if(ids.length>=2){const a=ids[s.day%ids.length],b=ids[(s.day+1)%ids.length];alterBond(a,b,-4);s.interludes.push(`${dbHero(a).name.split(' ')[0]}과(와) ${dbHero(b).name.split(' ')[0]} 사이에 임무 분배 문제로 작은 갈등이 생겼습니다.`)}}
}
finishResult=function(){if(ui.modal?.type!=='result'||!s.pendingResult)return;const r=s.pendingResult,wasNext=!!r.next;
s.pendingResult=null;advanceCore();if(s.chapter>=5&&!s.ending)ui.modal={type:'endingChoice'};else if(wasNext)ui.modal={type:'chapter',chapter:s.chapter};else ui.modal=null;save();render()};
const originalRest=restDay;
restDay=function(silent=false){if(s.battle||s.expedition)return;advanceCore();if(!silent)journal(`제${s.day}일. 길드 운영비를 정산하고 하루 쉬었습니다.`);render()};
continueGame=function(){let loaded=load();if(!loaded){notify('저장된 기록이 없습니다.');return}s=loaded;ui.page='hall';ui.modal=s.battle?{type:'battle'}:s.expedition?{type:s.expedition.pendingChoice==null?'event':'investigate'}:s.pendingResult?{type:'result',result:s.pendingResult}:s.flags?.pendingEnding?{type:'endingChoice'}:null;$('cover').classList.add('hidden');$('app').classList.remove('hidden');render()};
importSave=function(f){if(!f)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(String(reader.result));if(!Array.isArray(data.roster)||typeof data.gold!=='number'||!data.buildings)throw Error('invalid');s=migrate(data);ui.modal=s.pendingResult?{type:'result',result:s.pendingResult}:s.battle?{type:'battle'}:s.expedition?{type:s.expedition.pendingChoice==null?'event':'investigate'}:null;save();render();notify('v0.2 세이브 불러오기 완료')}catch{notify('저장 파일을 읽을 수 없습니다')}};reader.readAsText(f)};
const originalEnding=finishEnding;
finishEnding=function(id){originalEnding(id);if(!s.ending)return;let annex='';if(s.completed.filter(x=>x.startsWith('arc-')).length>=6)annex+=' 열 가지 특별 의뢰 가운데 대부분의 이름은 새 왕국의 역사에 남았다.';
if(s.council.sponsor==='court')annex+=' 궁정과의 동맹은 새로운 시대에도 끝없는 협상을 요구했다.';
if(s.rival.pressure>=50)annex+=' 백은의 사자단은 길드를 향한 경쟁을 멈추지 않았다.';
if(s.factions.abbey>=15)annex+=' 백색 수도원은 기록의 진실을 밝히는 데 협력했다.';
const fully=s.roster.filter(h=>featureUnlock(h));if(fully.length>=3)annex+=' 자신만의 이야기를 완성한 동료들은 누구보다 굳게 길드의 곁에 남았다.';
if(id==='truth'&&s.factions.people<10)annex+=' 그러나 주민들의 신뢰를 충분히 얻지 못해 이 진실은 쉽게 받아들여지지 않았다.';
s.ending.text+=annex;save();render()};
function newModal(title,tag,body,footer=''){return modalShell(title,tag,body,footer,true)}
function portraitName(id){return esc(dbHero(id)?.name||id)}
function tacticalModal(){const b=s.battle,q=s.expedition.quest;const hp=b.party.reduce((n,id)=>n+Math.max(0,getHero(id)?.hp||0),0),total=b.party.reduce((n,id)=>n+(getHero(id)?.maxHp||0),0);
const partyCards=b.lanes.map((id,i)=>{const h=getHero(id),d=dbHero(id);return `<div class="battle-unit ${h.hp<=0?'unconscious':''}"><img src="${image(id)}" alt=""><div><small>${['전열 · 수호','중열 · 지원','후열 · 원거리'][i]}</small><b>${esc(d.name.split(' ')[0])} <span>${esc(d.role)}</span></b><div class="healthtrack party"><span style="width:${pct(h.hp,h.maxHp)}%"></span></div><small>${h.hp} / ${h.maxHp} · 신뢰 ${h.loyalty}</small></div></div>`}).join('');
const options=b.party.map(id=>{const h=getHero(id),d=dbHero(id);return `<button class="choice tactical-choice" data-action="v2-fight" data-id="hero:${id}" ${h.hp<=0?'disabled':''}><b>${esc(d.name.split(' ')[0])} · ${roleNames[d.class]||'공격'}</b><small>${d.class==='healer'?'생존 동료 회복 · 약초 소모 없음':d.class==='mage'?'마법 공격 · 의식 차단':d.class==='rogue'?'틈새 공격 · 적 행동 방해':d.class==='archer'?'약점 표식 부여': '공격과 전열 엄호'}</small></button>`}).join('');
return `<div class="dialog-scrim"><section class="dialog tactical-dialog" role="dialog" aria-modal="true"><div class="battle-header" style="background-image:url('${image(q.art)}')"><div><div class="eyebrow">TACTICAL CHRONICLE · TURN ${b.round} · ${b.phase===2?'SECOND PHASE':'FIRST PHASE'}</div><h2>${esc(b.enemy)}</h2><small>${esc(q.loc)} · ${q.boss?'우두머리전':'원정 전투'}</small></div></div><div class="battle-panel"><div class="combat-side"><div class="card-kicker">ENEMY · ${b.phase===2?'2단계':''}</div><div class="healthtrack"><span style="width:${pct(b.hp,b.maxHp)}%"></span></div><small>${b.hp} / ${b.maxHp} · 위협 ${b.attack} ${b.ward?'· 보호막':''}</small></div><div class="combat-side"><div class="card-kicker">YOUR COMPANY</div><div class="healthtrack party"><span style="width:${pct(hp,total)}%"></span></div><small>${hp} / ${total} · 집중 ${b.focus}/3</small></div></div><div class="intent-v2">◈ ${esc(intentText(b))}</div><div class="tactical-roster">${partyCards}</div><div class="tactical-actions">${options}<button class="choice tactical-choice" data-action="v2-fight" data-id="guard"><b>⛨ 방패 결진</b><small>이번 공격 방어 · 집중 +2</small></button><button class="choice tactical-choice" data-action="v2-fight" data-id="combo" ${b.focus<3?'disabled':''}><b>✦ 길드 연계기</b><small>집중 3 소모 · 3인 연계 공격과 행동 차단</small></button><button class="choice tactical-choice" data-action="v2-fight" data-id="herb" ${s.items.herb<1?'disabled':''}><b>✚ 치유 약초 ${s.items.herb}</b><small>생존 동료만 회복 · 전투 불능 부활 불가</small></button></div><div class="combat-log">${b.log.slice(0,5).map(x=>`<div>✦ ${esc(x)}</div>`).join('')}</div><div class="dialog-footer"><button class="btn btn-red btn-sm" data-action="retreat">원정 철수</button></div></section></div>`}

const INVESTIGATION_BEATS=[
'발자국의 끝에는 두 번째 신발 자국이 있었다. 누군가 일부러 흔적을 되돌려 놓은 것이다.',
'초소의 문에는 최근에 교체된 잠금쇠가 있었다. 이곳의 과거는 누군가에게 현재의 비밀이었다.',
'검은 나무의 깊은 곳에서 종 하나가 떨렸다. 나뭇잎마다 서로 다른 이름이 적혀 있었다.',
'세금 영수증의 글씨는 한 사람의 필체가 아니었다. 서명자가 존재하지 않는 이름으로 기록돼 있었다.',
'수문 아래의 계단은 바닥보다 훨씬 깊었다. 그곳에는 인간이 숨겨둔 공포가 있었다.',
'선주의 배는 강물을 거슬러 움직였다. 누군가 다른 날의 장부를 이곳으로 보내고 있었다.',
'침묵의 종지기에게는 소리가 없는 목소리가 있었다. 성문을 지켜온 이유를 묻자 눈을 감았다.',
'금서의 찢긴 부분에는 아직 살아 있는 사람의 이름이 있었다. 세렌은 한참 동안 침묵했다.',
'대사제가 흰 천으로 가려 둔 서고에서 오래전 모험가의 이름이 발견됐다.',
'연회장의 모든 거울은 왕궁의 다른 날짜를 비추고 있었다. 초대장을 받은 이유가 조금씩 드러났다.',
'왕위계승자의 숨겨진 방에는 네 개의 왕관이 있었다. 세 개만이 역사책에 남아 있다.',
'국왕의 서약서는 종이의 앞면에 없었다. 촛불을 비추자 다른 문장이 떠올랐다.',
'아이의 낡은 장난감은 이름을 잃지 않았다. 작은 물건 하나가 왕국보다 오래 기억하고 있었다.',
'미래의 필경사는 빈 책에서 문장을 읽어 내고 있었다. 그러나 길드의 다음 선택은 아직 적히지 않았다.',
'마지막 책상 위에는 길드원 세 사람의 초상화가 있었다. 세 가지 결말과 수많은 미완의 이름이 기다렸다.'
];
function investigateText(q){if(q.unique)return q.after+' 조사의 끝에서 다른 기록과 연결되는 작은 문장이 발견됐다.';
if(!q.isSide){const i=q.ch*3+q.n;return INVESTIGATION_BEATS[i]||q.after}
return '어둠 속에서 사건의 목격자가 나타났다. 그의 짧은 증언을 믿을지 결정해야 한다.'}
function resolveInvestigation(idx){const e=s.expedition;if(!e||e.pendingChoice==null)return;const q=e.quest;
const choice=idx===0?'증거를 더 모아 안전한 진입로를 찾았다.':'즉시 전진해 적보다 먼저 자리를 잡았다.';
if(idx===0){e.guardBonus=Math.max(e.guardBonus||0,.22);e.focusBonus=(e.focusBonus||0)+1;markFaction(q.ch===2?'abbey':q.ch===3?'court':'people',2)}
else{e.ambushBonus=Math.max(e.ambushBonus||0,.1);s.rival.pressure=clamp(s.rival.pressure+2,0,100)}
s.flags['investigation_'+q.id]=idx===0?'evidence':'rush';s.legacy.push({day:s.day,place:q.loc,text:`${q.name}: ${choice}`,effect:idx===0?'증언 확보 · 수비 강화':'기습 준비 · 경쟁 압박'});journal(`${q.loc}: ${choice}`);
const first=e.pendingChoice;delete e.pendingChoice;oldChooseEvent(first)}

const prevModal=renderModal;
renderModal=function(){if(!ui.modal)return prevModal();const m=ui.modal,root=$('modalRoot');
if(m.type==='investigate'){const q=s.expedition?.quest;if(!q){ui.modal=null;return prevModal()};root.innerHTML=newModal('원정 중간 기록 · '+q.name,'A SECOND DECISION',`<img class="event-image" src="${image(q.art)}" alt="${esc(q.loc)}"><p>${esc(investigateText(q))}</p><p>첫 번째 판단을 바탕으로 이번에는 어떤 길을 택하시겠습니까?</p><div class="choice-list"><button class="choice" data-action="v2-investigate" data-id="0"><b>증거를 모아 안전한 진입로를 찾는다</b><small>첫 턴 피해 감소 · 전술 집중 증가 · 증언 확보</small></button><button class="choice" data-action="v2-investigate" data-id="1"><b>기회를 놓치지 않고 전진한다</b><small>적의 시작 체력 감소 · 경쟁 길드가 눈치챌 수 있음</small></button></div>`);return}
if(m.type==='rival'){const r=s.rival;root.innerHTML=newModal('백은의 사자단과의 경쟁','A RIVAL COMPANY',`<p>${esc(r.name)}이(가) 왕국 각지에서 길드의 의뢰를 노리고 있습니다. 경쟁 압박 <b class="gold">${r.pressure}</b> · 그들의 명성 <b>${r.renown}</b>.</p><p>어떻게 대응하느냐에 따라 비용과 평판이 달라집니다.</p><div class="choice-list"><button class="choice" data-action="v2-rival-choice" data-id="public"><b>공개적인 봉사 의뢰를 수락한다</b><small>70G 지출 · 주민 평판 +8 · 경쟁 압박 -15</small></button><button class="choice" data-action="v2-rival-choice" data-id="negotiation"><b>정식 길드 협상을 요청한다</b><small>상단 평판 +4 · 명성 10 이상 필요 · 경쟁 압박 -10</small></button><button class="choice" data-action="v2-rival-choice" data-id="challenge"><b>길드 간 실력 겨루기를 제안한다</b><small>길드원 사기에 따라 성공이 달라짐 · 압박과 명성 변화</small></button></div>`);return}
if(m.type==='battle'&&s.battle?.combatVersion===2){root.innerHTML=tacticalModal();return}
if(m.type==='personal'){const h=getHero(m.id),ep=FATES[m.id]?.[s.personal[m.id]||0];if(!h||!ep){ui.modal=null;return prevModal()}root.innerHTML=newModal(ep[0],`PERSONAL CHRONICLE · ${portraitName(m.id)}`,`<div class="personal-story"><img src="${image(m.id)}" alt="${portraitName(m.id)}"><div><p>${esc(ep[1])}</p><div class="excerpt">“이름을 기억한다는 건, 그가 선택할 자유도 기억하는 일입니다.”</div></div></div><div class="choice-list"><button class="choice" data-action="v2-personal-choice" data-id="0"><b>${esc(ep[2])}</b><small>공개적인 결단 · 세력 신뢰 변화</small></button><button class="choice" data-action="v2-personal-choice" data-id="1"><b>${esc(ep[3])}</b><small>동료의 자율성 존중 · 충성 상승</small></button></div>`);return}
if(m.type==='council'){const cd=s.council;root.innerHTML=newModal('길드의 작은 의회','PATRONS · POLITICS · CONSEQUENCES',`<p>후원 계약에는 대가가 있습니다. 새로운 후원자를 선택하면 이전 계약은 해지됩니다.</p><div class="row space"><span>현재 후원: <b>${esc(cd.sponsor?names[cd.sponsor]:'독립 운영')}</b></span><span>계약 채무 ${cd.debt}G</span></div><div class="choice-list"><button class="choice" data-action="v2-sponsor" data-id="merchant"><b>◆ 유리강 상단의 후원</b><small>즉시 190G · 매 3일 80G · 궁정 평판 감소</small></button><button class="choice" data-action="v2-sponsor" data-id="abbey"><b>✧ 백색 수도원과 치유 협정</b><small>정기 회복 · 수도원 평판 상승 · 상단 신뢰 하락</small></button><button class="choice" data-action="v2-sponsor" data-id="court"><b>♛ 궁정의 공식 인가</b><small>즉시 330G · 일일 유지비 +5 · 주민들의 경계</small></button><button class="choice" data-action="v2-sponsor" data-id="independent"><b>⚑ 독립 길드 선언</b><small>후원 해지 · 길드 사기 증가 · 즉시 보너스 없음</small></button></div><p class="inline-note">계약을 바꾼 뒤 5일이 지나야 다시 선택할 수 있습니다.</p>`,`<button class="btn btn-plain" data-action="close-modal">돌아가기</button>`);return}
if(m.type==='relations'){root.innerHTML=newModal('길드원 유대 지도','COMPANIONS & TRUST',`<p>같은 원정에 참여한 동료는 친해지고, 갈등과 면담으로 관계가 변합니다. 신뢰가 높은 팀은 연계기와 전투 피해에 보너스가 있습니다.</p><div class="relation-grid">${s.roster.map(h=>`<div class="relation-row"><b>${portraitName(h.id)}</b><span>충성 ${h.loyalty}</span><span>동료 유대 ${Math.round(s.roster.filter(x=>x.id!==h.id).reduce((n,x)=>n+relation(h.id,x.id),0)/Math.max(1,s.roster.length-1))}</span></div>`).join('')}</div>`,`<button class="btn btn-plain" data-action="close-modal">닫기</button>`);return}
const result=prevModal();if(m.type==='prepare'){const row=root.querySelector('.party-selector');if(row){const party=m.party;const labels=['전열','중열','후열'];const div=document.createElement('div');div.className='formation-picker';div.innerHTML='<div class="card-kicker">FORMATION · 원정 진형</div><p>'+party.map((id,i)=>`${labels[i]}: ${esc(dbHero(id)?.name.split(' ')[0]||'-')}`).join(' / ')+'</p><button class="btn btn-sm btn-plain" data-action="v2-rotate" '+(party.length!==3?'disabled':'')+'>진형 순서 바꾸기 ↻</button>';row.insertAdjacentElement('afterend',div)}}return result};
function resolveRival(id){if(id==='public'){if(s.gold<70){notify('경비가 부족합니다.');return}s.gold-=70;markFaction('people',8);s.rival.pressure=clamp(s.rival.pressure-15,0,100)}
else if(id==='negotiation'){if(s.renown<10){notify('협상할 명성이 부족합니다.');return}markFaction('merchant',4);s.rival.pressure=clamp(s.rival.pressure-10,0,100)}
else if(id==='challenge'){if(s.morale>=65){s.renown+=18;s.rival.pressure=clamp(s.rival.pressure-20,0,100)}else{s.morale=clamp(s.morale-7,0,100);s.rival.pressure=clamp(s.rival.pressure+7,0,100)}}
else return;s.legacy.push({day:s.day,place:'에델브룩',text:'경쟁 길드 대응: '+id,effect:'명성과 세력 변화'});journal('백은의 사자단과의 경쟁에 대응했다.');ui.modal=null;render()}
function treatTalk(id){const h=getHero(id);if(!h)return;if(s.gold<30){notify('면담에 필요한 경비 30G가 부족합니다.');return}s.gold-=30;h.loyalty=clamp(h.loyalty+6,0,100);for(const x of s.roster)if(x.id!==id)alterBond(x.id,id,1);journal(`${dbHero(id).name}과(와) 길드의 미래에 관해 긴 이야기를 나눴다.`);render();notify('면담 완료 · 충성 +6 · 유대 +1')}
function choosePersonal(idx){const id=ui.modal?.id,h=getHero(id);if(!h)return;const entry=individual(h);if(!entry.episode||!entry.unlocked)return;const choice=entry.episode[2+idx];h.loyalty=clamp(h.loyalty+(idx===0?5:9),0,100);if(idx===0){markFaction(h.id==='seren'||h.id==='yuna'?'abbey':h.id==='orian'||h.id==='isa'?'court':'people',4);s.rival.pressure=clamp(s.rival.pressure+2,0,100)}else s.morale=clamp(s.morale+3,0,100);
s.personal[id]=(s.personal[id]||0)+1;s.legacy.push({day:s.day,place:'길드 회관',text:`${dbHero(id).name}: ${choice}`,effect:idx===0?'세력 관계에 변화':'충성과 사기 상승'});journal(`${dbHero(id).name}의 개인 연대기 ${s.personal[id]}장 완결: ${choice}`);if(s.personal[id]===2)journal(`${dbHero(id).name}의 고유 전투 특성이 해금됐다.`);ui.modal=null;render()}
function chooseSponsor(id){if(s.day-s.council.lastDay<5 && s.council.lastDay>0){notify('후원 계약 변경에는 5일의 간격이 필요합니다.');return}if(s.council.sponsor===id){notify('이미 체결한 계약입니다.');return}
s.council.sponsor=id==='independent'?null:id;s.council.lastDay=s.day;
if(id==='merchant'){s.gold+=190;markFaction('merchant',12);markFaction('court',-9);s.council.debt+=80;s.rival.pressure=clamp(s.rival.pressure+8,0,100)}
if(id==='abbey'){for(const h of s.roster)if(['seren','isa'].includes(h.id))h.loyalty=clamp(h.loyalty-3,0,100);markFaction('abbey',13);markFaction('merchant',-6);s.items.herb+=2}
if(id==='court'){for(const h of s.roster)if(['lia','seren','mora'].includes(h.id))h.loyalty=clamp(h.loyalty-4,0,100);s.gold+=330;markFaction('court',14);markFaction('people',-12);s.council.debt+=120;s.rival.pressure=clamp(s.rival.pressure+11,0,100)}
if(id==='independent'){s.morale=clamp(s.morale+8,0,100);markFaction('people',6)}
const label=id==='independent'?'독립 운영':names[id];journal(`길드 의회 결정: ${label}. 협약에 따른 의무가 새로 생겼다.`);s.legacy.push({day:s.day,place:'길드 의회',text:`새로운 후원: ${label}`,effect:'왕국의 세력 구도가 바뀜'});ui.modal=null;render()}
function applyRune(id){const h=getHero(id);if(!h)return;const cost=130+90*(h.runes||0);if((h.runes||0)>=3||s.gold<cost||s.items.crystal<2){notify('각인 한도 또는 자원이 부족합니다.');return}s.gold-=cost;s.items.crystal-=2;h.runes++;journal(`${dbHero(id).name}의 장비에 월석 문양 +${h.runes}을 새겼다.`);render();notify('장비 각인 완료 · 마력과 고유 전투 효과 증가')}
document.addEventListener('click',evt=>{const e=evt.target.closest('[data-action^="v2-"]');if(!e)return;evt.preventDefault();evt.stopImmediatePropagation();const act=e.dataset.action,id=e.dataset.id;
if(act==='v2-fight')v2Combat(id);
if(act==='v2-investigate')resolveInvestigation(Number(id));
if(act==='v2-rival'){ui.modal={type:'rival'};renderModal()}
if(act==='v2-rival-choice')resolveRival(id);
if(act==='v2-council'){ui.modal={type:'council'};renderModal()}
if(act==='v2-relations'){ui.modal={type:'relations'};renderModal()}
if(act==='v2-talk')treatTalk(id);
if(act==='v2-personal'){const h=getHero(id);if(!h||!individual(h).episode||!individual(h).unlocked)return;ui.modal={type:'personal',id};renderModal()}
if(act==='v2-personal-choice')choosePersonal(Number(id));
if(act==='v2-sponsor')chooseSponsor(id);
if(act==='v2-rune')applyRune(id);
if(act==='v2-rotate'&&ui.modal?.type==='prepare'&&ui.modal.party.length===3){ui.modal.party.unshift(ui.modal.party.pop());renderModal()}
},true);
window.DuskGuildV2={getState:()=>s,migrate,extraQuests:EXTRA_QUESTS,combat:v2Combat,finishResult,advanceCore,relation,chooseSponsor};
})();
