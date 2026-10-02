import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, Flag, Home, MapPin, Maximize2, X } from 'lucide-react';
import { figures, type Hand, type Place } from './content';
import { Illustration } from './Illustration';
import { emptyData, loadData, saveData, type AppData } from './storage';

interface Store { data:AppData; update:(change:AppData|((data:AppData)=>AppData))=>Promise<boolean>; saving:boolean }
const StoreContext=createContext<Store|null>(null);
export const useApp=()=>{const store=useContext(StoreContext);if(!store)throw new Error('Missing store');return store;};
export function DataProvider({children}:{children:ReactNode}) {
  const [data,setData]=useState<AppData|null>(null),[loadingError,setLoadingError]=useState(''),[saveError,setSaveError]=useState(''),[saving,setSaving]=useState(false);
  const latest=useRef(emptyData()),serial=useRef(0);
  async function load(){setLoadingError('');try{const result=await loadData();latest.current=result;setData(result);}catch(e){setLoadingError(e instanceof Error?e.message:'記録を開けませんでした。');}}
  useEffect(()=>{void load();},[]);
  async function update(change:AppData|((data:AppData)=>AppData)) {
    const next=typeof change==='function'?change(latest.current):change;
    latest.current=next;setSaving(true);
    const id=++serial.current;
    try{await saveData(next);if(id===serial.current){setData(next);setSaving(false);setSaveError('');}return true;}
    catch{if(id===serial.current){setSaving(false);setSaveError('保存できませんでした。入力を残しています。再試行してください。');}return false;}
  }
  if(!data)return <main className="loading"><Flag size={38}/><h1>はじめてゴルフ</h1>{loadingError?<><p role="alert">{loadingError}</p><button className="primary" onClick={()=>void load()}>再試行</button></>:<p>練習帳を開いています…</p>}</main>;
  return <StoreContext.Provider value={{data,update,saving}}>{children}{saveError&&<div className="save-error" role="alert"><span>{saveError}</span><button onClick={()=>void update(latest.current)}>再試行</button></div>}</StoreContext.Provider>;
}
export function navigate(path:string){window.location.hash=path;}
export function useRoute(){const [route,setRoute]=useState(location.hash.slice(1)||'/');useEffect(()=>{const change=()=>{setRoute(location.hash.slice(1)||'/');window.scrollTo(0,0);};addEventListener('hashchange',change);return()=>removeEventListener('hashchange',change);},[]);return route;}
export function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const dialog=ref.current!;dialog.showModal();return()=>dialog.close();},[]);
  return <dialog ref={ref} className="modal" aria-label={title} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current)onClose();}}><div className="modal-head"><h2>{title}</h2><button className="icon-button" aria-label="閉じる" onClick={onClose}><X size={22}/></button></div>{children}</dialog>;
}
export function FigureCard({id,hand,compact=false}:{id:string;hand:Hand;compact?:boolean}) {
  const [expanded,setExpanded]=useState(false);const f=figures[id];
  return <figure className={`figure-card ${compact?'compact':''}`}>
    <button className="figure-image" aria-label={`${f.title}の図を拡大`} onClick={()=>setExpanded(true)}><Illustration id={id} hand={hand}/><span className="view-tag">{f.view}</span><Maximize2 size={17} className="expand-icon"/></button>
    {!compact&&<figcaption><h3>{f.title}</h3><p>{f.caption}</p></figcaption>}
    {expanded&&<Modal title={f.title} onClose={()=>setExpanded(false)}><div className="expanded-art"><Illustration id={id} hand={hand}/></div><span className="eyebrow">{f.view} · {hand==='left'?'左打ち':'右打ち'}</span><p>{f.caption}</p></Modal>}
  </figure>;
}
export function PageHeading({eyebrow,title,description,back}:{eyebrow:string;title:string;description?:string;back?:string}){return <header className="page-heading">{back&&<a className="back-link" href={`#${back}`}><ArrowLeft size={16}/>戻る</a>}<span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description&&<p>{description}</p>}</header>;}
export function SectionHeading({title,sub,href,link='すべて見る'}:{title:string;sub?:string;href?:string;link?:string}){return <div className="section-heading"><div><h2>{title}</h2>{sub&&<p>{sub}</p>}</div>{href&&<a href={`#${href}`} className="text-link">{link}<ChevronRight size={16}/></a>}</div>;}
export function Meta({minutes,place}:{minutes:number;place?:Place}){return <span className="meta"><span><Clock3 size={14}/>{minutes}分</span>{place&&<span><MapPin size={14}/>{{home:'自宅',putt:'パット',range:'練習場'}[place]}</span>}</span>;}
export function PlaceIcon({place,size=20}:{place:Place;size?:number}){return place==='home'?<Home size={size}/>:place==='putt'?<Flag size={size}/>:<MapPin size={size}/>;}
export function Empty({title,description,href,label='練習を選ぶ'}:{title:string;description:string;href?:string;label?:string}){return <div className="empty"><div className="empty-icon"><Flag size={30}/></div><h2>{title}</h2><p>{description}</p>{href&&<a className="primary" href={`#${href}`}>{label}<ArrowRight size={18}/></a>}</div>;}
export function HandToggle(){const {data,update}=useApp();return <div className="segmented small" aria-label="打つ側">{(['right','left'] as Hand[]).map(hand=><button key={hand} aria-pressed={data.preferences.hand===hand} className={data.preferences.hand===hand?'active':''} onClick={()=>void update(s=>({...s,preferences:{...s.preferences,hand}}))}>{hand==='right'?'右打ち':'左打ち'}</button>)}</div>;}
export function CheckList({items,values,onChange}:{items:string[];values:boolean[];onChange:(values:boolean[])=>void}){return <div className="checklist">{items.map((item,i)=><label key={item}><input type="checkbox" checked={!!values[i]} onChange={e=>onChange(items.map((_,index)=>index===i?e.target.checked:!!values[index]))}/><span className="check-box" aria-hidden="true">{values[i]&&<Check size={15}/>}</span>{item}</label>)}</div>;}
