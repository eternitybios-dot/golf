import { z } from 'zod';
import { defaults, CONTENT_VERSION, type Menu, type Preferences } from './content';

const equipment = z.enum(['mirror','putter','mat','ball','iron','wedge','driver','tee','marker']);
const drillId = z.enum(['D01','D02','D03','D04','D05','D06','D07','D08','D09','D10','D11','D12']);
const lessonId = z.enum(['L01','L02','L03','L04','L05','L06','L07','L08']);
const iso = z.string().datetime();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value=>{
  const parsed=new Date(`${value}T12:00:00Z`);
  return Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===value;
},'日付が不正です。');
export const preferenceSchema = z.object({
  hand:z.enum(['right','left']),place:z.enum(['home','putt','range']),
  minutes:z.union([z.literal(5),z.literal(15),z.literal(30)]),equipment:z.array(equipment).max(9).refine(values=>new Set(values).size===values.length),
  cup:z.boolean(),approach:z.boolean(),maxPutt:z.number().finite().min(.3).max(20),multipleDistances:z.boolean(),
});
const stepSchema = z.object({title:z.string().min(1).max(150),minutes:z.number().finite().positive().max(180),drillId:drillId.optional(),description:z.string().max(1000).optional()});
const menuSchema = z.object({id:z.string().min(1).max(100),title:z.string().min(1).max(150),place:z.enum(['home','putt','range']),minutes:z.number().finite().positive().max(180),steps:z.array(stepSchema).min(1).max(30)})
  .refine(menu=>Math.abs(menu.steps.reduce((total,step)=>total+step.minutes,0)-menu.minutes)<.001,'メニューの時間合計が不正です。');
export const resultSchema = z.object({
  drillId,title:z.string().min(1).max(150),attempts:z.number().int().min(0).max(10000),
  success:z.number().int().min(0).max(10000).nullable(),condition:z.string().max(500),
}).refine(r => r.success === null || r.success <= r.attempts, '成功数は実施数以下にしてください。');
export const recordSchema = z.object({
  id:z.string().min(1).max(100),startedAt:iso,localDate:date,timeZone:z.string().max(100),
  menu:menuSchema,contentVersion:z.string().max(100),elapsedMs:z.number().finite().min(0).max(31536000000),
  results:z.array(resultSchema).max(30),rating:z.enum(['hard','some','good']).nullable(),memo:z.string().max(1000),status:z.enum(['complete','partial']),
});
const activeSchema = z.object({
  id:z.string().min(1).max(100),menu:menuSchema,contentVersion:z.string().max(100),startedAt:iso,
  localDate:date,timeZone:z.string().max(100),
  step:z.number().int().min(0),elapsedMs:z.number().finite().min(0).max(31536000000),runningSince:z.number().finite().positive().nullable(),
  results:z.array(resultSchema).max(30),preferences:preferenceSchema,
  rating:z.enum(['hard','some','good']).nullable().default(null),memo:z.string().max(1000).default(''),
}).refine(a => a.step < a.menu.steps.length,'練習の手順が不正です。');
export const backupSchema = z.object({
  app:z.literal('hajimete-golf'),schemaVersion:z.literal(1),exportedAt:iso.optional(),
  preferences:preferenceSchema,onboarded:z.boolean(),
  read:z.array(z.object({id:lessonId,at:iso,checks:z.array(z.boolean()).max(3)})).max(8),
  records:z.array(recordSchema).max(10000),
});
const stateSchema = backupSchema.extend({active:activeSchema.nullable()});
export type DrillResult = z.infer<typeof resultSchema>;
export type PracticeRecord = z.infer<typeof recordSchema>;
export type Active = z.infer<typeof activeSchema>;
export type AppData = z.infer<typeof stateSchema>;
export type Backup = z.infer<typeof backupSchema>;
export const emptyData = (): AppData => ({app:'hajimete-golf',schemaVersion:1,preferences:{...defaults,equipment:[]},onboarded:false,read:[],records:[],active:null});

let database: Promise<IDBDatabase> | undefined;
function db() {
  if (!database) database = new Promise<IDBDatabase>((resolve,reject) => {
    const request = indexedDB.open('hajimete-golf',1);
    request.onupgradeneeded = () => request.result.createObjectStore('data');
    request.onsuccess = () => {request.result.onversionchange=()=>{request.result.close();database=undefined;};resolve(request.result);};
    request.onerror = () => {database=undefined;reject(new Error('端末の保存領域を開けませんでした。'));};
    request.onblocked = () => {database=undefined;reject(new Error('ほかのタブを閉じて再試行してください。'));};
  });
  return database;
}
export async function loadData(): Promise<AppData> {
  const database = await db();
  const raw = await new Promise<unknown>((resolve,reject)=>{
    const request=database.transaction('data','readonly').objectStore('data').get('state');
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
  });
  if (raw === undefined) return emptyData();
  const parsed=stateSchema.safeParse(raw);
  if (!parsed.success) throw new Error('保存データの形式を確認できません。データは削除していません。');
  return parsed.data;
}
let writeQueue: Promise<void> = Promise.resolve();
export function saveData(state: AppData): Promise<void> {
  const parsed=stateSchema.parse(state);
  const write=writeQueue.catch(()=>{}).then(async()=>{
    const database=await db();
    return new Promise<void>((resolve,reject)=>{
      const transaction=database.transaction('data','readwrite');
      transaction.objectStore('data').put(parsed,'state');
      transaction.oncomplete=()=>resolve();
      transaction.onerror=()=>reject(new Error('保存できませんでした。入力を残しているので再試行できます。'));
      transaction.onabort=()=>reject(new Error('保存が中断されました。再試行してください。'));
    });
  });
  writeQueue=write;
  return write;
}
export function parseBackup(text: string): Backup {
  if (text.length > 10_000_000) throw new Error('ファイルが大きすぎます（上限10MB）。');
  let raw: unknown;
  try {raw=JSON.parse(text);} catch {throw new Error('JSONファイルを読み取れませんでした。');}
  const parsed=backupSchema.safeParse(raw);
  if (!parsed.success) throw new Error('未対応の版または不正なデータです。既存の記録は変更していません。');
  const ids=parsed.data.records.map(r=>r.id);
  if(new Set(ids).size!==ids.length) throw new Error('ファイル内に重複した記録IDがあります。');
  if(new Set(parsed.data.read.map(r=>r.id)).size!==parsed.data.read.length) throw new Error('読了データが重複しています。');
  return parsed.data;
}
export function mergeBackup(current: AppData, backup: Backup, replace=false): AppData {
  if (current.active) throw new Error('練習を終了または途中保存してから取り込んでください。');
  if (replace) return {...backup,active:null};
  const existing=new Set(current.records.map(r=>r.id));
  const readIds=new Set(current.read.map(r=>r.id));
  return {...current,preferences:current.onboarded?current.preferences:backup.preferences,onboarded:current.onboarded||backup.onboarded,
    read:[...current.read,...backup.read.filter(r=>!readIds.has(r.id))],
    records:[...current.records,...backup.records.filter(r=>!existing.has(r.id))]};
}
export function exportBackup(state: AppData): string {
  const {active:_active,...backup}=state;
  return JSON.stringify({...backup,exportedAt:new Date().toISOString()},null,2);
}
export function localDate(date=new Date()) {return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function startPractice(menu: Menu,p:Preferences): Active {
  return {id:crypto.randomUUID(),menu,contentVersion:CONTENT_VERSION,startedAt:new Date().toISOString(),localDate:localDate(),
    timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,step:0,elapsedMs:0,runningSince:Date.now(),preferences:{...p,equipment:[...p.equipment]},rating:null,memo:'',
    results:menu.steps.filter(s=>s.drillId).map(s=>({drillId:s.drillId as DrillResult['drillId'],title:s.title,attempts:0,success:null,condition:''}))};
}
export function elapsed(active: Active, now=Date.now()): number {return active.elapsedMs+(active.runningSince===null?0:Math.max(0,now-active.runningSince));}
