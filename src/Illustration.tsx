import { useId } from 'react';
import { figures, type Hand } from './content';

const ink='#245340',skin='#e6b58f',shirt='#3a8063',cream='#f1eee3';
type XY=[number,number];
function limb(a:XY,b:XY,c:XY,width=13,color=skin){return <polyline points={`${a} ${b} ${c}`} stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none"/>;}
function Arrow({d,color=shirt}:{d:string;color?:string}){return <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round"/>;}
function Ball({x=223,y=229,r=5}:{x?:number;y?:number;r?:number}){return <g><circle cx={x} cy={y} r={r} fill="white" stroke={ink} strokeWidth="1.3"/><circle cx={x-r*.3} cy={y-r*.2} r={r*.12} fill="#adc4b5"/></g>;}
function Feet({ball=180}:{ball?:number}){return <g><path d="M108 175h40v11h-40zM218 175h40v11h-40z" fill={ink}/><path d="M123 151l-7 24h28l-8-24M231 151l-7 24h28l-8-24" fill={cream} stroke={ink} strokeWidth="2"/><path d="M82 210H278" stroke="#739682" strokeWidth="2" strokeDasharray="5 5"/><Ball x={ball} y={112}/><path d={`M${ball} 126v22m0-2h18`} stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round"/><path d="M285 92H75l8-6m-8 6 8 6" fill="none" stroke={ink} strokeWidth="2"/><path d={`M${ball} 112H75`} stroke="#729a81" strokeDasharray="4 5"/><ellipse cx={ball} cy={112} rx={18} ry={18} fill="none" stroke="#d99962" strokeWidth="2"/></g>;}

export function Golfer({pose='address',scale=1}:{pose?:string;scale?:number}) {
  const phases:Record<string,{hands:XY;elbow:XY;club:XY}>={
    address:{hands:[184,158],elbow:[168,134],club:[218,227]},
    takeaway:{hands:[225,137],elbow:[200,118],club:[304,98]},
    top:{hands:[232,65],elbow:[199,82],club:[123,23]},
    transition:{hands:[211,95],elbow:[194,104],club:[281,29]},
    impact:{hands:[173,163],elbow:[159,131],club:[219,228]},
    finish:{hands:[117,95],elbow:[142,87],club:[86,24]},
    half:{hands:[235,150],elbow:[208,127],club:[301,127]},
    halfFinish:{hands:[112,136],elbow:[131,115],club:[52,94]},
  };
  const p=phases[pose]||phases.address;
  const finish=pose==='finish'||pose==='halfFinish';
  return <g transform={`scale(${scale})`}>
    <ellipse cx="176" cy="237" rx="65" ry="9" fill="#abc7ad" opacity=".28"/>
    {limb([162,151],[152,189],[138,229],20,cream)}
    {limb([184,151],finish?[177,193]:[190,192],finish?[186,227]:[204,230],20,cream)}
    <path d="M126 226q15-7 24 2l-2 8h-26z" fill={ink}/>
    <path d={finish?'M178 223q9-7 18 0l6 10h-20z':'M196 226q17-4 24 7v4h-29z'} fill={ink}/>
    <path d={finish?'M141 91q22-13 43 0l9 65q-20 12-40 2z':'M145 94q23-10 45 8l8 53q-28 12-48-2z'} fill={shirt} stroke={ink} strokeWidth="1.5"/>
    <path d="M163 84v12l12 7 10-9-8-13" fill={skin}/>
    <ellipse cx="169" cy="69" rx="17" ry="21" transform="rotate(12 169 69)" fill={skin}/>
    <path d="M154 65q-2-20 16-22 17 2 19 22z" fill={cream} stroke={ink} strokeWidth="1.5"/>
    <path d="M152 63q24 5 40 0" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round"/>
    <path d="M182 73l4 5-5 1" fill="none" stroke="#bb8163" strokeWidth="1.2"/>
    <path d="M172 95l4 12-7 5" fill="none" stroke="#d4e5d6" strokeWidth="2"/>
    {limb([153,104],p.elbow,p.hands,12)}
    {limb([184,108],[p.elbow[0]+15,p.elbow[1]+7],[p.hands[0]+5,p.hands[1]+2],12)}
    <path d={`M${p.hands[0]+2} ${p.hands[1]} L${p.club[0]} ${p.club[1]}`} stroke={ink} strokeWidth="3.5" strokeLinecap="round"/>
    <path d={`M${p.club[0]} ${p.club[1]}l10-2 3 5-12 2z`} fill={ink}/>
    <circle cx={p.hands[0]+2} cy={p.hands[1]} r="7" fill={cream} stroke="#aaa99a" strokeWidth="1"/>
    <Ball/>
  </g>;
}
function Side({lean=false,putt=false,bad=false}:{lean?:boolean;putt?:boolean;bad?:boolean}) {
  return <g>
    <ellipse cx="181" cy="233" rx="65" ry="8" fill="#abc7ad" opacity=".3"/>
    <path d={bad?'M164 153l31 36 7 35h-22l-9-29-31-40z':'M156 153l11 41-11 32h21l13-36-7-39z'} fill={cream} stroke={ink} strokeWidth="1.5"/>
    <path d={bad?'M178 227h32l7 8h-43z':'M148 227h33l7 8h-43z'} fill={ink}/>
    <path d={bad?'M140 105q27-7 43 22l4 35-41-3z':'M149 97l50 21-18 44-38-10z'} fill={shirt} stroke={ink} strokeWidth="1.5"/>
    <path d="M189 113l9-16 11 7-3 17" fill={skin}/>
    <ellipse cx={bad?218:212} cy={bad?113:89} rx="16" ry="20" transform={bad?'rotate(30 218 113)':'rotate(32 212 89)'} fill={skin}/>
    <path d={bad?'M204 109q-1-22 22-13l9 17-32-2z':'M199 85q1-21 22-11l10 17-35-4z'} fill={cream} stroke={ink} strokeWidth="1.5"/>
    <path d={bad?'M204 110l35 8':'M197 85l38 9'} stroke={ink} strokeWidth="4" strokeLinecap="round"/>
    {limb([193,120],putt?[203,148]:[209,149],putt?[220,178]:[227,168],12)}
    <path d={putt?'M220 178l32 49h15':'M227 168l35 60h12'} stroke={ink} strokeWidth="3" fill="none"/>
    <Ball x={putt?251:264} y={232}/>
    {lean&&<><Arrow d="M134 155Q122 104 165 91"/><path d="M153 229v-68" stroke="#d99962" strokeDasharray="4 4"/></>}
    {putt&&<path d="M212 110l39 117" stroke="#739682" strokeWidth="2" strokeDasharray="5 5"/>}
  </g>;
}
function Palm({x=128,y=44,rotate=0,clenched=false}:{x?:number;y?:number;rotate?:number;clenched?:boolean}) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <path d="M8 151l-5-53q-11-19-3-37L13 24q5-10 14-6l9-5q10-5 17 1 15-4 20 8 13 1 14 16l-2 43q4 15-6 29l-6 41" fill={skin} stroke={ink} strokeWidth="2"/>
    <path d="M19 30l-4 39q2 9 12 8l8-2M37 25l-3 42q4 9 14 6M55 27l-3 35q5 9 16 3M73 37l-2 22" fill="none" stroke="#a9785d" strokeWidth="2" strokeLinecap="round"/>
    <path d={clenched?'M4 91q34-24 69-15l5 17q-41 15-52 24':'M8 86q20-23 38-14l31 24q7 9-4 15L40 97 28 119'} fill={skin} stroke={ink} strokeWidth="2"/>
    <path d="M9 152h63l4 14H8z" fill={cream} stroke={ink} strokeWidth="2"/>
  </g>;
}
function Grip({pair=false,pressure=false}:{pair?:boolean;pressure?:boolean}) {
  if(pressure)return <g><g transform="translate(-15 0) scale(.8)"><rect x="161" y="31" width="17" height="240" rx="8" fill={ink}/><Palm x={133}/><circle cx="158" cy="236" r="15" fill={ink}/><path d="M150 236l6 6 10-13" fill="none" stroke="white" strokeWidth="3"/></g><g transform="translate(175 0) scale(.8)"><rect x="155" y="31" width="17" height="240" rx="8" fill={ink}/><Palm x={127} clenched/><circle cx="158" cy="236" r="15" fill="#a75743"/><path d="M152 230l12 12m0-12-12 12" stroke="white" strokeWidth="3"/><Arrow d="M85 50l17 17m-23 14h21m-12 33 16-15" color="#a75743"/></g></g>;
  return <g><path d="M176 24v225" stroke={ink} strokeWidth="18" strokeLinecap="round"/><path d="M172 28v120" stroke="#67967b" strokeWidth="2" strokeDasharray="4 5"/><Palm x={135} y={pair?7:33}/>{pair?<g transform="translate(18 60) rotate(-12 176 100)"><Palm x={134} y={12}/></g>:<><ellipse cx="176" cy="101" rx="54" ry="20" fill="none" stroke="#d99962" strokeWidth="2"/><Arrow d="M92 62q-12 24 17 36"/></>}</g>;
}
function Putt({distance=false}:{distance?:boolean}) {
  return <g>
    <rect x="58" y="47" width="244" height="162" rx="50" fill="#cfe0cb"/>
    <rect x="77" y="95" width="202" height="62" rx="28" fill="#e5eddb"/>
    {distance?<><rect x="151" y="91" width="32" height="70" rx="7" fill="none" stroke={ink} strokeDasharray="4 4"/><rect x="236" y="91" width="32" height="70" rx="7" fill="none" stroke={ink} strokeDasharray="4 4"/><Arrow d="M103 121h57"/><Arrow d="M105 133h139"/><Ball x={169} y={122}/><Ball x={252} y={134}/></>:<><circle cx="186" cy="96" r="9" fill="#d39b69" stroke={ink}/><circle cx="186" cy="155" r="9" fill="#d39b69" stroke={ink}/><Arrow d="M99 126h158"/><path d="M277 126l-10-6m10 6-10 6" stroke={ink} fill="none"/><path d="M75 102v48" stroke={ink} strokeWidth="8" strokeLinecap="round"/></>}
    <Ball x={102} y={126}/>
  </g>;
}
function Tee(){return <g><path d="M64 220H303" stroke="#82a387" strokeWidth="3"/><path d="M140 181v37m-9-37h18" stroke="#d99962" strokeWidth="5" strokeLinecap="round"/><Ball x={140} y={149} r={32}/><path d="M185 149q65-13 82 38l-7 30h-82z" fill={ink}/><path d="M186 147l-28-77" stroke={ink} strokeWidth="5"/><path d="M57 149h219" stroke="#90a68b" strokeWidth="2" strokeDasharray="5 5"/><path d="M142 102v-20m0 0-6 7m6-7 6 7" stroke="#d99962" strokeWidth="3" fill="none"/></g>;}
function Landing(){return <g><path d="M46 214h270" stroke="#82a387" strokeWidth="3"/><path d="M64 207Q142 71 205 203" fill="none" stroke={ink} strokeWidth="3" strokeDasharray="6 6"/><path d="M205 203q22-28 41 4 17-14 31 0" fill="none" stroke={ink} strokeWidth="3" strokeDasharray="4 4"/><ellipse cx="205" cy="209" rx="27" ry="10" fill="#d8bb78" opacity=".6"/><Ball x={133} y={126}/><path d="M293 213V116l-32 11 32 9" fill="#d39b69" stroke={ink} strokeWidth="2"/><circle cx="277" cy="209" r="5" fill="white" stroke={ink}/><Arrow d="M181 76l20 104"/></g>;}
function Routine(){return <g><path d="M63 131h225" stroke="#87a98c" strokeWidth="2" strokeDasharray="5 5"/><path d="M296 130l-10-6m10 6-10 6" stroke={ink} fill="none"/><Ball x={183} y={130}/><circle cx="80" cy="129" r="16" fill={cream} stroke={ink} strokeWidth="2"/><ellipse cx="181" cy="190" rx="23" ry="15" fill={shirt}/><path d="M162 208v15m35-15v15" stroke={ink} strokeWidth="10" strokeLinecap="round"/><path d="M87 165q22 58 65 32" fill="none" stroke="#d99962" strokeWidth="3" strokeDasharray="6 5"/><path d="M270 130V68l-30 10 30 10" fill="#d39b69" stroke={ink} strokeWidth="2"/><circle cx="80" cy="66" r="15" fill={ink}/><circle cx="181" cy="66" r="15" fill={ink}/><circle cx="280" cy="40" r="15" fill={ink}/></g>;}

function Drawing({id}:{id:string}) {
  if(id.startsWith('grip-'))return <Grip pair={id==='grip-pair'} pressure={id==='grip-pressure'}/>;
  if(id==='address-side')return <Side lean/>;
  if(id==='address-balance')return <g><g transform="translate(-22 15) scale(.67)"><Side/><circle cx="171" cy="267" r="15" fill={ink}/><path d="M163 267l6 6 11-13" fill="none" stroke="white" strokeWidth="3"/></g><g transform="translate(160 15) scale(.67)"><Side bad/><circle cx="178" cy="267" r="15" fill="#a75743"/><path d="M172 261l12 12m0-12-12 12" stroke="white" strokeWidth="3"/></g></g>;
  if(id==='aim-lines')return <g><Feet/><path d="M82 190H278" stroke={ink} strokeWidth="2"/><path d="M82 112H278" stroke={ink} strokeWidth="2"/><path d="M75 184v12m-5-6h10M276 107v10m-5-5h10" stroke="#d99962" strokeWidth="2"/></g>;
  if(id==='ball-iron'||id==='ball-driver')return <Feet ball={id==='ball-driver'?127:180}/>;
  if(id==='putt-address')return <Side putt/>;
  if(id==='putt-line'||id==='putt-distance')return <Putt distance={id==='putt-distance'}/>;
  if(id==='chip-landing')return <Landing/>;
  if(id==='tee-height')return <Tee/>;
  if(id==='routine')return <Routine/>;
  if(id==='chip-compare')return <g><g transform="translate(2 26) scale(.65)"><Golfer pose="impact"/><circle cx="175" cy="270" r="15" fill={ink}/><path d="M167 270l6 6 11-13" fill="none" stroke="white" strokeWidth="3"/></g><g transform="translate(167 26) scale(.65) rotate(-15 170 210)"><Golfer pose="half"/><path d="M147 280l18 18m0-18-18 18" stroke="#a75743" strokeWidth="5"/></g></g>;
  const map:Record<string,string>={'swing-address':'address','swing-takeaway':'takeaway','swing-top':'top','swing-transition':'transition','swing-impact':'impact','swing-finish':'finish','half-address':'address','half-arc':'half','half-finish':'halfFinish','chip-small':'halfFinish','tee-finish':'finish','address-front':'address'};
  return <g><Golfer pose={map[id]||'address'}/>{id==='half-arc'&&<Arrow d="M76 134Q187 55 294 134"/>}{id==='address-front'&&<><path d="M127 247h84m-84-4v8m84-8v8" stroke="#d99962" strokeWidth="2"/><Arrow d="M101 99q-20 40 18 62"/></>}{id==='half-address'&&<ellipse cx="184" cy="160" rx="25" ry="20" fill="none" stroke="#d99962" strokeWidth="2"/>}{id==='half-finish'&&<circle cx="174" cy="234" r="48" fill="none" stroke="#d99962" strokeWidth="2"/>}{id==='swing-transition'&&<Arrow d="M269 60Q279 103 243 130"/>}{id==='swing-impact'&&<ellipse cx="219" cy="229" rx="26" ry="15" fill="none" stroke="#d99962" strokeWidth="2"/>}{id==='chip-small'&&<Arrow d="M107 177q45 38 92-2"/>}{id==='tee-finish'&&<Arrow d="M86 203q-29-32-4-65"/>}</g>;
}
export function Illustration({id,hand='right',className=''}:{id:string;hand?:Hand;className?:string}) {
  const titleId=useId();
  const info=figures[id];
  return <svg className={`illustration ${className}`} viewBox="0 0 360 270" role="img" aria-labelledby={titleId}>
    <title id={titleId}>{info?.alt||'緑のウェアを着たゴルファーのフォーム図解'}</title>
    <circle cx="189" cy="138" r="108" fill="#e0e9d4" opacity=".55"/>
    <path d="M28 238H330" stroke="#bbcdb4" strokeWidth="1.5"/>
    <g transform={hand==='left'?'translate(360 0) scale(-1 1)':undefined}><Drawing id={id}/></g>
  </svg>;
}
export function HeroArt() {
  return <svg viewBox="0 0 440 330" className="hero-art" role="img" aria-label="緑の丘で、無理のないフィニッシュを保つゴルファー">
    <defs><pattern id="grass-dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".7" fill="#aac391" opacity=".2"/></pattern></defs>
    <path d="M108 278V112a118 118 0 0 1 236 0v166z" fill="#427658"/>
    <circle cx="287" cy="62" r="26" fill="#e0bc75"/>
    <path d="M30 287q102-121 239-38t166-21v102H30z" fill="#639568"/>
    <path d="M2 320q95-69 241-8t197-17v35H0" fill="#8bac74"/>
    <rect x="30" y="0" width="405" height="330" fill="url(#grass-dots)"/>
    <g transform="translate(74 31) scale(1.12)"><Golfer pose="finish"/></g>
    <path d="M346 272V192l-36 11 36 10" fill="#e6bc77" stroke="#d6be8f" strokeWidth="2"/>
    <ellipse cx="349" cy="278" rx="16" ry="4" fill="#214c35"/>
    <path d="M45 138l8-3m-4-4 1 9M368 100l9-3m-5-3 1 9" stroke="#cfdbb8" strokeWidth="2"/>
  </svg>;
}
