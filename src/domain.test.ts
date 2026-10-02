import { describe, it, expect } from 'vitest';
import { adaptMenu, canDo, defaults, menus, type Preferences } from './content';
import { emptyData, mergeBackup, parseBackup, exportBackup, startPractice, elapsed } from './storage';

describe('equipment-aware practice',()=>{
  it('never recommends hitting or swinging a club in a tool-free home',()=>{
    expect(menus.filter(m=>m.place==='home').every(m=>adaptMenu(m,defaults)?.steps.every(s=>!s.drillId||['D01','D02','D03'].includes(s.drillId)))).toBe(true);
    expect(canDo('D11',defaults)).toBe(false);
  });
  it('requires a tee for a driver-only range and keeps substitution durations',()=>{
    const p:Preferences={...defaults,place:'range',minutes:30,equipment:['driver','ball']};
    const menu=menus.find(m=>m.id==='range-30')!;
    expect(adaptMenu(menu,p)).toBeNull();
    const adapted=adaptMenu(menu,{...p,equipment:[...p.equipment,'tee']})!;
    expect(adapted.steps.filter(s=>s.drillId).map(s=>s.drillId)).toEqual(['D08','D11','D12']);
    expect(adapted.steps.reduce((n,s)=>n+s.minutes,0)).toBe(30);
  });
  it('uses short putts when a gate or multiple distances are unavailable',()=>{
    const p:Preferences={...defaults,place:'putt',equipment:['putter','ball'],cup:true};
    const adapted=adaptMenu(menus.find(m=>m.id==='putt-15')!,p)!;
    expect(adapted.steps.filter(s=>s.drillId).map(s=>s.drillId)).toEqual(['D05','D05','D05']);
    expect(adapted.steps.reduce((n,s)=>n+s.minutes,0)).toBe(15);
  });
});
describe('portable, consistent records',()=>{
  it('retains null measurements, deduplicates by ID, and preserves existing values',()=>{
    const current=emptyData(),menu=menus[0];
    const record={id:'test-record',menu,startedAt:new Date().toISOString(),localDate:'2026-10-02',timeZone:'Asia/Tokyo',contentVersion:'1',elapsedMs:0,results:[{drillId:'D02' as const,title:'構え確認',attempts:5,success:null,condition:'鏡なし'}],rating:null,memo:'現在のメモ',status:'complete' as const};
    current.records=[record];const backup=parseBackup(exportBackup(current));
    backup.records[0].memo='古いメモ';
    const merged=mergeBackup(current,backup);
    expect(merged.records).toHaveLength(1);expect(merged.records[0].memo).toBe('現在のメモ');expect(merged.records[0].results[0].success).toBeNull();
    const restored=mergeBackup(emptyData(),backup);expect(restored.records).toHaveLength(1);
  });
  it('rejects invalid success counts and unknown schema versions before writing',()=>{
    const current=emptyData();const backup=JSON.parse(exportBackup(current));
    backup.schemaVersion=999;expect(()=>parseBackup(JSON.stringify(backup))).toThrow();
    expect(()=>parseBackup('{not JSON}')).toThrow();
    const bad={id:'bad',menu:menus[0],startedAt:new Date().toISOString(),localDate:'2026-10-02',timeZone:'Asia/Tokyo',contentVersion:'1',elapsedMs:0,results:[{drillId:'D02',title:'構え確認',attempts:5,success:6,condition:''}],rating:null,memo:'',status:'complete'};
    backup.schemaVersion=1;backup.records=[bad];expect(()=>parseBackup(JSON.stringify(backup))).toThrow();
    expect(current.records).toHaveLength(0);
  });
  it('does not merge data during a practice session and compensates elapsed time',()=>{
    const current=emptyData();current.active=startPractice(menus[0],defaults);
    expect(()=>mergeBackup(current,parseBackup(exportBackup(current)))).toThrow('練習');
    const a={...current.active,elapsedMs:3000,runningSince:1000};
    expect(elapsed(a,66000)).toBe(68000);expect(elapsed({...a,runningSince:null},90000)).toBe(3000);
  });
});
