import { useState } from 'react';
import { ArrowRight, BookOpen, Check, CheckCircle2, ChevronRight, Clock3, Flame, Flag, Leaf, Sparkles, Target, X } from 'lucide-react';
import { adaptMenu, drills, figures, getDrill, glossary, issues, lessons, menus } from './content';
import { HeroArt, Illustration } from './Illustration';
import { CheckList, Empty, FigureCard, HandToggle, Meta, Modal, PageHeading, SectionHeading, useApp } from './ui';
import { menuForDrill } from './Practice';

function LessonCard({id}:{id:string}) {
  const {data}=useApp(),lesson=lessons.find(l=>l.id===id)!;
  const read=data.read.some(r=>r.id===id);
  return <a className="lesson-card" href={`#/lesson/${id}`}>
    <div className={`lesson-cover ${lesson.color}`}><Illustration id={lesson.figures[0]} hand={data.preferences.hand}/><span className="lesson-number">{id.slice(1)}</span>{read&&<span className="read-badge"><Check size={14}/>読了</span>}</div>
    <div className="lesson-card-content"><span className="eyebrow">{lesson.category}</span><h3>{lesson.title}</h3><p>{lesson.subtitle}</p><div className="card-bottom"><Meta minutes={lesson.minutes}/><span className="circle-arrow"><ArrowRight size={16}/></span></div></div>
  </a>;
}
export function HomePage() {
  const {data,update}=useApp();
  const [install,setInstall]=useState(false);
  const standalone=matchMedia('(display-mode: standalone)').matches||('standalone' in navigator&&(navigator as Navigator & {standalone:boolean}).standalone);
  const p=data.preferences;
  const base=menus.find(m=>m.place===p.place&&m.minutes===p.minutes)!;
  const eligible=drills.filter(d=>d.place===p.place);
  const done=new Set(data.records.flatMap(r=>r.results.map(x=>x.drillId)));
  const next=data.records.length?eligible.find(d=>!done.has(d.id)&&menuForDrill(d.id,p)):undefined;
  const menu=next?menuForDrill(next.id,p):adaptMenu(base,p);
  const minutes=Math.round(data.records.reduce((sum,r)=>sum+r.elapsedMs,0)/60000);
  const days=new Set(data.records.map(r=>r.localDate)).size;
  const continueLesson=lessons.find(l=>!data.read.some(r=>r.id===l.id))||lessons[0];
  const focus=menu?.steps.find(s=>s.drillId)?.drillId;
  return <>
    <div className="home-heading"><div><span className="eyebrow">LET’S ENJOY GOLF</span><h1>今日も、一歩ずつ。<span className="greeting-spark">✳</span></h1><p>あなたのペースで、ゴルフの「できた」を増やそう。</p></div><span className="date-label">{new Intl.DateTimeFormat('ja-JP',{month:'long',day:'numeric',weekday:'short'}).format(new Date())}</span></div>
    <section className="hero"><div className="hero-copy"><span className="hero-label"><span/>はじめての、その先へ。</span><h2>小さな練習が、<br/>大きな一歩に。</h2><p>イラストで学んで、気軽に実践。<br/>ゴルフの基本を、ひとつずつ。</p><a href={`#/lesson/${continueLesson.id}`} className="hero-button">{data.read.length?'学習の続きを見る':'基本から学んでみる'}<ArrowRight size={18}/></a><span className="hero-caption">ONE SWING AT A TIME.</span></div><HeroArt/></section>
    {!data.onboarded&&<div className="welcome-strip"><span className="welcome-icon"><Leaf size={21}/></span><div><strong>まずは、あなたに合う練習から。</strong><p>場所・道具・打つ側を選ぶと、ぴったりのメニューが見つかります。</p></div><a className="text-link" href="#/setup">はじめる<ArrowRight size={16}/></a><button className="icon-button" aria-label="初回設定をスキップ" onClick={()=>void update(s=>({...s,onboarded:true}))}><X size={17}/></button></div>}
    <div className="stats-grid"><div className="stat-card"><span className="stat-icon sage"><Target size={20}/></span><div><p>これまでの練習</p><strong>{data.records.length}<small>回</small></strong></div><span className="stat-note">コツコツが力になる</span></div><div className="stat-card"><span className="stat-icon sand"><Clock3 size={20}/></span><div><p>練習した時間</p><strong>{minutes}<small>分</small></strong></div><span className="stat-note">自分に使った時間</span></div><div className="stat-card"><span className="stat-icon sky"><BookOpen size={20}/></span><div><p>読んだレッスン</p><strong>{data.read.length}<small>/ 8</small></strong></div><span className="stat-note">基本をひとつずつ</span></div></div>
    <div className="home-middle"><section><SectionHeading title={data.active?'練習の続きから':'今日のおすすめ'} sub="まずはひとつ。気軽にやってみよう。"/><div className="recommend-card"><div className="recommend-art"><Illustration id={focus?getDrill(focus).figure:'address-side'} hand={p.hand}/></div><div className="recommend-content"><span className="pill"><Sparkles size={13}/>{data.active?'途中の練習':'あなたに合うメニュー'}</span><h3>{data.active?.menu.title||menu?.title||'道具に合う練習を選ぼう'}</h3><p>{data.active?'前回の手順から、そのまま再開できます。':focus?getDrill(focus).focus:'場所と使える道具を設定してください。'}</p><Meta minutes={data.active?.menu.minutes||menu?.minutes||p.minutes} place={data.active?.menu.place||p.place}/><a className="primary" href={data.active?'#/session':menu?`#/menu/${menu.id}`:'#/settings'}>{data.active?'続きから再開する':menu?'この練習をやってみる':'道具・場所を設定する'}<ArrowRight size={17}/></a></div></div></section>
    <section className="journey-card"><span className="eyebrow">YOUR LITTLE PROGRESS</span><div className="journey-icon"><Flame size={24} strokeWidth={1.5}/></div><h3>{days?'積み重ねた日々に、拍手。':'最初の「できた」を、ここに。'}</h3><p>{days?`${days}日、ゴルフと向き合いました。`:'5分の練習でも、立派な一歩です。'}<br/>練習のあとに、ひとこと残そう。</p><a className="text-link" href="#/records">練習記録を見る<ChevronRight size={16}/></a><div className="journey-dots">{Array.from({length:7},(_,i)=><span key={i} className={i<Math.min(days,7)?'filled':''}>{i<Math.min(days,7)?<Check size={13}/>:i+1}</span>)}</div></section></div>
    <SectionHeading title="基本を、ひとつずつ。" sub="フォームが分かる、イラストレッスン。" href="/learn" link="レッスン一覧"/><div className="lesson-grid home-lessons">{lessons.slice(0,4).map(l=><LessonCard key={l.id} id={l.id}/>)}</div>
    {!standalone&&<div className="install-strip"><span className="install-bubble"><Flag size={24}/></span><div><strong>いつものiPhoneで、いつでも練習。</strong><p>ホーム画面に追加すると、アプリのように使えます。</p></div><button className="text-link" onClick={()=>setInstall(true)}>追加方法を見る<ArrowRight size={16}/></button></div>}
    {install&&<InstallHelp onClose={()=>setInstall(false)}/>}
  </>;
}
export function LearnPage() {
  const [category,setCategory]=useState('すべて'),[issue,setIssue]=useState<string|null>(null);
  const {data}=useApp();
  const categories=['すべて','構えの基本','スイング','ショートゲーム','ティーショット'];
  const issueIds=issues.find(x=>x.title===issue)?.lessons;
  const visible=lessons.filter(l=>(category==='すべて'||l.category===category)&&(!issueIds||issueIds.includes(l.id)));
  return <><PageHeading eyebrow="LEARN THE BASICS" title="基本を、ひとつずつ。" description="大きな図解で分かる、8つのイラストレッスン。"/><div className="learning-progress"><span><BookOpen size={18}/>{data.read.length} / 8 レッスン読了</span><div className="progress-track"><span style={{width:`${data.read.length/8*100}%`}}/></div><HandToggle/></div>
    <div className="filter-pills" aria-label="レッスンカテゴリ">{categories.map(c=><button key={c} className={category===c?'active':''} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    <details className="trouble-picker"><summary><Target size={17}/>気になることから探す</summary><p>ひとつのミスには複数の要因があります。まずは基本を確認してみましょう。</p><div className="filter-pills">{issues.map(x=><button key={x.title} className={issue===x.title?'active':''} onClick={()=>{setIssue(issue===x.title?null:x.title);setCategory('すべて');}}>{x.title}</button>)}</div></details>
    {issue&&<div className="filter-note">「{issue}」に関連する基本教材<button className="text-link" onClick={()=>setIssue(null)}>絞込みを解除<X size={14}/></button></div>}
    {visible.length?<div className="lesson-grid">{visible.map(l=><LessonCard key={l.id} id={l.id}/>)}</div>:<Empty title="関連するレッスンがありません" description="カテゴリを「すべて」に戻してみてください。"/>}
    <p className="muted-note">読了は、教材を読んだ記録です。実技の習得判定とは分けて、あなたのペースで進めましょう。</p>
  </>;
}
export function LessonPage({id}:{id:string}) {
  const lesson=lessons.find(l=>l.id===id),{data,update}=useApp();
  const [frame,setFrame]=useState(0),[term,setTerm]=useState<string|null>(null);
  const existing=data.read.find(r=>r.id===id);
  const [checks,setChecks]=useState<boolean[]>(existing?.checks||[]),[marked,setMarked]=useState(!!existing);
  if(!lesson)return <Empty title="レッスンが見つかりません" description="一覧から教材を選んでください。" href="/learn" label="レッスン一覧"/>;
  const index=lessons.indexOf(lesson);
  async function read(){const success=await update(s=>({...s,read:[...s.read.filter(r=>r.id!==id),{id:id as 'L01',at:new Date().toISOString(),checks}]}));if(success)setMarked(true);}
  return <><PageHeading back="/learn" eyebrow={`LESSON ${id.slice(1)} · ${lesson.category}`} title={lesson.title} description={lesson.subtitle}/><div className="detail-meta"><Meta minutes={lesson.minutes}/><HandToggle/></div>
    <div className="lesson-intro"><span className="stat-icon sage"><Target size={22}/></span><div><span className="eyebrow">TODAY’S POINT</span><p>{lesson.tips[0]}</p></div></div>
    {id==='L05'?<section className="swing-viewer"><FigureCard id={lesson.figures[frame]} hand={data.preferences.hand}/><div className="frame-controls"><button className="secondary" disabled={frame===0} onClick={()=>setFrame(frame-1)}>前の場面</button><span>{frame+1} / 6</span><button className="secondary" disabled={frame===5} onClick={()=>setFrame(frame+1)}>次の場面</button></div><div className="swing-strip">{lesson.figures.map((f,i)=><button key={f} aria-label={figures[f].title} aria-pressed={frame===i} className={frame===i?'active':''} onClick={()=>setFrame(i)}><Illustration id={f} hand={data.preferences.hand}/><span>{i+1}</span></button>)}</div></section>:<div className="figure-grid">{lesson.figures.map(f=><FigureCard key={f} id={f} hand={data.preferences.hand}/>)}</div>}
    <div className="lesson-notes"><section className="paper-card"><SectionHeading title="覚えておきたいこと"/><ol className="number-list">{lesson.tips.map((tip,i)=><li key={tip}><span>{String(i+1).padStart(2,'0')}</span><p>{tip}</p></li>)}</ol></section><section className="paper-card soft-yellow"><span className="eyebrow">A LITTLE TIP</span><h2>ここを気にしてみよう。</h2><p>{lesson.mistake}</p><span className="muted-note">図は基本例です。体格やクラブに合わせて、無理なく調整しましょう。</span></section></div>
    <section className="paper-card"><SectionHeading title="自分で、確認してみよう。" sub="チェックは任意。少しずつで大丈夫。"/><CheckList items={lesson.checks} values={checks} onChange={setChecks}/><button className={marked?'secondary':'primary'} onClick={()=>void read()}>{marked?<CheckCircle2 size={18}/>:<BookOpen size={18}/>} {marked?'読了メモを更新':'このレッスンを読了にする'}</button></section>
    <SectionHeading title="学んだら、やってみよう。" sub="教材につながる練習ドリル。"/><div className="related-grid">{lesson.drills.map(id=>{const d=getDrill(id);return <a className="related-card" key={id} href={`#/menu/drill-${id}`}><span className="related-art"><Illustration id={d.figure} hand={data.preferences.hand}/></span><div><span className="eyebrow">PRACTICE</span><h3>{d.title}</h3><Meta minutes={d.minutes} place={d.place}/></div><ChevronRight size={20}/></a>;})}</div>
    <div className="glossary"><span className="eyebrow">GOLF DICTIONARY</span><h3>ことばの小さな辞典</h3><div className="filter-pills">{Object.keys(glossary).map(t=><button key={t} onClick={()=>setTerm(t)}>{t}</button>)}</div></div>
    {term&&<Modal title={term} onClose={()=>setTerm(null)}><p>{glossary[term]}</p></Modal>}
    <div className="lesson-next">{index>0&&<a className="text-link" href={`#/lesson/${lessons[index-1].id}`}>前のレッスン</a>}{index<7&&<a className="text-link" href={`#/lesson/${lessons[index+1].id}`}>次：{lessons[index+1].title}<ArrowRight size={17}/></a>}</div>
    <p className="source-note">教材・図解は本アプリのオリジナル。参考：<a href="https://www.golfdigest.co.jp/beginner/" target="_blank" rel="noreferrer">GDO ゴルフ初心者ガイド</a>。専門家による監修は未実施です。</p>
  </>;
}
export function InstallHelp({onClose}:{onClose:()=>void}) {
  return <Modal title="ホーム画面に追加しよう" onClose={onClose}><p>Safariでこのページを開いてから、次の順番で追加できます。</p><div className="install-steps">{[{title:'共有メニューを開く',detail:'四角から上向き矢印が出た「共有」をタップ。',icon:'share'},{title:'ホーム画面に追加',detail:'一覧をスクロールし、「ホーム画面に追加」を選びます。',icon:'plus'},{title:'アイコンから開く',detail:'「追加」を押して、ホーム画面のアイコンから起動。',icon:'flag'}].map((s,i)=><div key={s.title}><span className="install-phone"><svg viewBox="0 0 90 110" role="img" aria-label={s.title}><rect x="14" y="3" width="62" height="101" rx="12" fill="#f1f5e9" stroke="#245340" strokeWidth="2"/><path d="M37 10h16" stroke="#245340" strokeWidth="3" strokeLinecap="round"/>{s.icon==='share'?<g stroke="#245340" strokeWidth="3" fill="none"><path d="M34 54v21h22V54M45 63V35m-7 8 7-8 7 8"/></g>:s.icon==='plus'?<g stroke="#245340" strokeWidth="3"><rect x="29" y="39" width="33" height="33" rx="7" fill="#dbe8d2"/><path d="M45 47v18m-9-9h18"/></g>:<g stroke="#245340" strokeWidth="2" fill="#d2e3c6"><rect x="29" y="39" width="33" height="33" rx="9"/><path d="M39 64V46l16 5-16 5"/></g>}<path d="M37 96h16" stroke="#245340" strokeWidth="2" strokeLinecap="round"/></svg></span><span className="install-step-number">0{i+1}</span><h3>{s.title}</h3><p>{s.detail}</p></div>)}</div><p className="muted-note">Safariとホーム画面のアプリで記録が引き継がれない場合は、設定の「書出し・取込み」で移行できます。最初の教材保存には通信が必要です。</p></Modal>;
}
