import { useEffect, useState } from 'react';
import { BookOpen, ChartNoAxesColumnIncreasing, Check, ChevronRight, Flag, House, Leaf, Settings, Target, WifiOff } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { DataProvider, useApp, useRoute } from './ui';
import { HomePage, LearnPage, LessonPage } from './Learning';
import { PracticePage, MenuPage, SessionPage, FinishPage, RecordsPage } from './Practice';
import { SettingsPage } from './Settings';

const navigation=[{path:'/',label:'ホーム',english:'HOME',icon:House},{path:'/learn',label:'学ぶ',english:'LEARN',icon:BookOpen},{path:'/practice',label:'練習',english:'PRACTICE',icon:Target},{path:'/records',label:'記録',english:'MY RECORD',icon:ChartNoAxesColumnIncreasing}];
function Shell() {
  const route=useRoute(),{data,saving}=useApp(),[online,setOnline]=useState(navigator.onLine),[swError,setSwError]=useState('');
  const {offlineReady:[offlineReady],needRefresh:[needRefresh],updateServiceWorker}=useRegisterSW({onRegisterError:()=>setSwError('教材を保存できませんでした。通信状態を確認して再試行してください。')});
  useEffect(()=>{const update=()=>setOnline(navigator.onLine);addEventListener('online',update);addEventListener('offline',update);return()=>{removeEventListener('online',update);removeEventListener('offline',update);};},[]);
  const section=route.startsWith('/lesson')?'/learn':route.startsWith('/menu')||route.startsWith('/session')||route.startsWith('/finish')?'/practice':route.startsWith('/records')?'/records':route.startsWith('/learn')?'/learn':route.startsWith('/practice')?'/practice':'/';
  let page;
  if(route==='/')page=<HomePage/>;
  else if(route==='/learn')page=<LearnPage/>;
  else if(route.startsWith('/lesson/'))page=<LessonPage id={route.split('/')[2]}/>;
  else if(route==='/practice')page=<PracticePage/>;
  else if(route.startsWith('/menu/'))page=<MenuPage id={route.split('/')[2]}/>;
  else if(route==='/session')page=<SessionPage/>;
  else if(route.startsWith('/finish'))page=<FinishPage partial={route.includes('partial')}/>;
  else if(route.startsWith('/records'))page=<RecordsPage id={route.split('/')[2]}/>;
  else if(route.startsWith('/settings')||route==='/setup')page=<SettingsPage setup={route==='/setup'} offlineReady={offlineReady}/>;
  else page=<div className="empty"><h1>ページが見つかりません</h1><a href="#/">ホームへ戻る</a></div>;
  return <div className="app-shell">
    <aside className="sidebar">
      <a href="#/" className="brand"><span className="brand-icon"><Flag size={24} strokeWidth={1.5}/></span><div>はじめてゴルフ<small>BEGINNER’S GOLF CLUB</small></div></a>
      <p className="nav-caption">YOUR GOLF JOURNEY</p>
      <nav aria-label="メインメニュー">{navigation.map(({path,label,english,icon:Icon})=><a key={path} className={section===path?'nav-item selected':'nav-item'} href={`#${path}`} aria-current={section===path?'page':undefined}><Icon size={21}/><span>{label}<small>{english}</small></span>{section===path&&<span className="nav-dot"/>}</a>)}</nav>
      <div className="sidebar-note"><Leaf size={26} strokeWidth={1.4}/><p>昨日より、<br/>ちょっとだけ上手に。</p><span>あなたのペースで大丈夫。</span><div className="little-line"/></div>
      <a className="sidebar-settings" href="#/settings"><Settings size={18}/>設定・データ管理</a>
      <span className="sidebar-bottom">ONE SWING AT A TIME.</span>
    </aside>
    <div className="main-shell">
      <header className="topbar"><a className="mobile-brand" href="#/"><Flag size={23}/>はじめてゴルフ</a><span className="topbar-title">学んで、練習して、少しずつ。</span><div className="topbar-right"><span className={`connection ${!online?'offline':''}`}>{!online?<WifiOff size={14}/>:<span className="status-dot"/>}{!online?'オフライン':saving?'保存中…':offlineReady?'オフライン利用OK':'練習帳'}</span><a className="icon-button" href="#/settings" aria-label="設定"><Settings size={20}/></a><span className="avatar" aria-label="初心者の練習帳"><Flag size={17}/></span></div></header>
      {!online&&!offlineReady&&<div className="notice"><WifiOff size={18}/>未保存の教材は通信が戻るまで開けない場合があります。</div>}
      {swError&&<div className="notice" role="alert">{swError}<button onClick={()=>location.reload()}>再試行</button></div>}
      {needRefresh&&<div className="notice"><Check size={18}/><span>新しい教材を用意しました。{data.active?'練習が終わってから更新できます。':''}</span><button disabled={!!data.active} onClick={()=>void updateServiceWorker(true)}>更新する</button></div>}
      <main id="main-content" tabIndex={-1} className="page" key={route}>{page}</main>
      <footer className="footer"><span><Flag size={15}/>はじめてゴルフ</span><small>焦らず、楽しく、あなたのペースで。</small><a href="#/settings">使い方・データ</a></footer>
    </div>
    <nav className="bottom-nav" aria-label="モバイルメニュー">{navigation.map(({path,label,icon:Icon})=><a key={path} href={`#${path}`} className={section===path?'selected':''} aria-current={section===path?'page':undefined}><Icon size={21}/><span>{label}</span></a>)}</nav>
    {data.active&&route!=='/session'&&!route.startsWith('/finish')&&<a className="resume-pill" href="#/session"><span className="pulse-dot"/>練習の続きへ<ChevronRight size={17}/></a>}
  </div>;
}
export default function App(){return <DataProvider><a href="#main-content" className="skip-link" onClick={e=>{e.preventDefault();document.getElementById('main-content')?.focus();}}>本文へ移動</a><Shell/></DataProvider>;}
