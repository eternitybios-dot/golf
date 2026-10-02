export const CONTENT_VERSION = '2026-10-02.1';
export type Place = 'home' | 'putt' | 'range';
export type Hand = 'right' | 'left';
export type DrillId = 'D01' | 'D02' | 'D03' | 'D04' | 'D05' | 'D06' | 'D07' | 'D08' | 'D09' | 'D10' | 'D11' | 'D12';
export type Equipment = 'mirror' | 'putter' | 'mat' | 'ball' | 'iron' | 'wedge' | 'driver' | 'tee' | 'marker';
export interface Preferences {
  hand: Hand; place: Place; minutes: 5 | 15 | 30; equipment: Equipment[];
  cup: boolean; approach: boolean; maxPutt: number; multipleDistances: boolean;
}
export const defaults: Preferences = { hand: 'right', place: 'home', minutes: 5, equipment: [], cup: false, approach: false, maxPutt: 1, multipleDistances: false };
export const placeNames: Record<Place, string> = { home: '自宅', putt: 'パット', range: '練習場' };
export const equipmentNames: Record<Equipment, string> = { mirror: '鏡', putter: 'パター', mat: 'パットマット', ball: 'ボール', iron: 'アイアン', wedge: 'ウェッジ', driver: 'ドライバー', tee: 'ティー', marker: '目印・コイン' };
export interface Figure { id: string; title: string; view: string; caption: string; alt: string }
const fig = (id: string, title: string, view: string, caption: string): Figure => ({ id, title, view, caption, alt: `${view}の図。${caption}` });
export const figures: Record<string, Figure> = Object.fromEntries([
  fig('grip-fingers', '指に沿わせて握る', '手元の拡大', 'グリップを指の付け根に沿わせます。手のひら全体で押しつぶすように握らず、親指はシャフトに沿わせましょう。'),
  fig('grip-pair', '両手をひとつに', '手元の拡大', '目標側の手を先に握り、後ろ側の手を添えます。両手の間に大きな隙間をつくらず、同じ方向へ動かせる組合せにします。'),
  fig('grip-pressure', '力みをほどく', '手元の比較', '基本例は指で支えた握り。よくある崩れは拳を固めて強く握りすぎること。クラブを支えられる範囲で肩と腕の力を抜きます。'),
  fig('address-front', '足幅と腕の位置', '正面', '足を肩幅程度に開く基本例。腕は肩から自然に下ろし、手元と体の間に動ける余裕をつくります。'),
  fig('address-side', '股関節から前傾', '側面', '背中だけを丸めるのではなく、股関節から軽く前傾します。膝は軽くゆるめ、お尻を少し後ろへ。'),
  fig('address-balance', '足裏全体で立つ', '側面の比較', '基本例は足裏全体で支える構え。つま先だけに乗った構えでは、前へ倒れやすくなります。無理なく立てる位置を探します。'),
  fig('aim-lines', '線路のように平行に', '上面', 'ボールと目標を結ぶ線にクラブフェースを合わせ、足のラインをその線と平行にします。足のライン自体を目標へ向けないようにします。'),
  fig('ball-iron', 'アイアンのボール位置', '正面・足元', '短いアイアンは両足の中央付近を基本例に、クラブの長さや当たりに合わせて調整します。ボールを遠くへ置きすぎないように。'),
  fig('ball-driver', 'ドライバーのボール位置', '正面・足元', 'ドライバーは目標側のかかと内側付近が基本例。アイアンとの違いを確認し、スタンスの幅とティーも合わせて調整します。'),
  fig('half-address', '小さく振る準備', '正面', '無理のない前傾と足幅で構えます。最初から大きく振らず、短いアイアンなどで小さい振り幅を試します。'),
  fig('half-arc', '腰から腰の振り幅', '正面', '手元が腰の高さになるくらいの小さな往復。腕だけを急に振らず、胸の向きの変化と一緒に動かします。'),
  fig('half-finish', '打った後も安定', '正面', '小さく打った後、目標側を向いてバランスよく立てるか確認します。飛ばすよりも、同じ動きを繰り返すことを優先。'),
  fig('swing-address', '01 アドレス', '正面', '目標を決め、クラブフェースと足の向きを確認します。腕と肩に余計な力を入れず、動き始められる構えに。'),
  fig('swing-takeaway', '02 始動', '正面', '手元・腕・胸の動きをつなげ、ゆっくりクラブを動かし始めます。いきなり手首だけで持ち上げないようにします。'),
  fig('swing-top', '03 トップ', '正面', '胸の向きを変え、無理のない範囲まで振り上げます。クラブを遠くへ上げるために姿勢を崩さないように。'),
  fig('swing-transition', '04 切返し', '正面', '上げる動きから下ろす動きへ、急がずに切り替えます。最大の力で打とうとせず、体の回転と腕の動きをつなげます。'),
  fig('swing-impact', '05 インパクト', '正面', 'クラブがボールを通る場面。手元を無理に止めず、体の向きが変わる流れの中で当てます。'),
  fig('swing-finish', '06 フィニッシュ', '正面', '目標側を向き、無理なく立てる振り幅を選びます。打った後3秒、ふらつかずに立てるかを確認します。'),
  fig('putt-address', 'パットの構え', '側面', '腕を自然に下ろし、ボールとの距離を調整します。目線がボールの近くを通る基本例を、自分の姿勢に合わせましょう。'),
  fig('putt-line', 'まっすぐ打ち出す', '上面', 'パターフェースを目標線に合わせます。目印2つのゲートを通すと、打ち出した方向を確認しやすくなります。'),
  fig('putt-distance', '振り幅と転がる距離', '上面', '小さい振り幅から試し、どのくらい転がったか観察します。距離の異なる目標を使い、同じテンポで振り幅を調整します。'),
  fig('chip-small', '小さい動きで寄せる', '正面', '大きく振り上げず、小さい振り幅から始めます。手だけでボールをすくおうとせず、胸と腕を一緒に動かします。'),
  fig('chip-landing', '落としどころを見る', '側面・弾道', 'ボールが最初に落ちる場所と、その後に転がる距離を分けて考えます。施設で使える目標を選び、同じクラブで観察します。'),
  fig('chip-compare', 'すくい上げない', '側面の比較', '基本例は小さな動きでクラブを通すこと。よくある崩れは上体を後ろへ倒し、ボールを手ですくい上げること。'),
  fig('tee-height', 'ティーの高さ', 'ヘッドの側面', 'ドライバーのヘッド上端から、ボールの上半分が見える程度が基本例。ヘッド形状や当たりに合わせて調整します。'),
  fig('tee-finish', '力よりバランス', '正面', '振り切ったあと、目標側を向いて立てることを優先します。無理に速く振らず、安定する振り幅を探します。'),
  fig('routine', '狙う → 構える → 打つ', '上面・手順', 'ボールの後ろから狙いを確認し、フェースを合わせ、構えて打ちます。毎回同じ順番を繰り返します。'),
].map(f => [f.id, f]));

export interface Lesson { id: string; title: string; subtitle: string; category: string; minutes: number; color: string; figures: string[]; tips: string[]; mistake: string; checks: string[]; drills: string[] }
export const lessons: Lesson[] = [
  { id: 'L01', title: 'グリップの基本', subtitle: 'クラブと仲良くなる、最初の一歩。', category: '構えの基本', minutes: 3, color: 'sand', figures: ['grip-fingers','grip-pair','grip-pressure'], tips: ['目標側の手を先に、指の付け根に沿わせて握る。','後ろ側の手を添え、両手を一緒に動かせる形にする。','支えられる範囲で握り、肩と腕の力を抜く。'], mistake: '強く握りすぎると腕も固まりがちです。握り直してから、肩を一度ゆるめてみましょう。', checks: ['握る順番が分かった','指の位置を確認できた','肩の力を抜けた'], drills: ['D01'] },
  { id: 'L02', title: 'アドレスをつくろう', subtitle: 'いい動きは、気持ちのいい構えから。', category: '構えの基本', minutes: 4, color: 'sage', figures: ['address-front','address-side','address-balance'], tips: ['足幅は肩幅程度から、クラブに合わせて調整する。','股関節から軽く前傾し、膝を少しゆるめる。','腕を自然に下ろし、足裏全体でバランスをとる。'], mistake: 'ボールをのぞき込んで背中を丸めたり、つま先だけに体重を乗せたりしないように。', checks: ['股関節から前傾できた','腕を自然に下ろせた','足裏全体で立てた'], drills: ['D02','D03'] },
  { id: 'L03', title: '狙い方とボール位置', subtitle: '打つ前のひと工夫で、迷わない。', category: '構えの基本', minutes: 4, color: 'sky', figures: ['aim-lines','ball-iron','ball-driver'], tips: ['最初にクラブフェースを目標へ合わせる。','足のラインは目標線と平行にする。','アイアンとドライバーのボール位置の違いを知る。'], mistake: '体の向きだけで狙うと、フェースの向きとずれることがあります。フェースから順に確認しましょう。', checks: ['2つの平行な線が分かった','フェースを先に合わせられた','クラブによる位置の違いが分かった'], drills: ['D10','D12'] },
  { id: 'L04', title: '小さなスイングから', subtitle: '飛ばす前に、気持ちよく当てる。', category: 'スイング', minutes: 4, color: 'peach', figures: ['half-address','half-arc','half-finish'], tips: ['短いアイアンなどで、腰から腰くらいの振り幅を試す。','胸の向きの変化と腕の動きをつなげる。','打った後も安定して立てる速さで振る。'], mistake: '大きく振ることを急ぐと、当たりやバランスを観察しにくくなります。まずは小さい動きを繰り返します。', checks: ['小さい振り幅を理解した','当たりを観察できた','打った後に安定して立てた'], drills: ['D07','D08'] },
  { id: 'L05', title: 'スイングの流れ', subtitle: '6つの場面を、ひとつの動きに。', category: 'スイング', minutes: 5, color: 'sage', figures: ['swing-address','swing-takeaway','swing-top','swing-transition','swing-impact','swing-finish'], tips: ['構えからフィニッシュまで、流れとして覚える。','振り上げる大きさより、姿勢とテンポを優先する。','力を出し切るより、打った後に安定して立つ。'], mistake: '図は流れをつかむ基本例です。トップの高さや細かい角度を、無理に全員同じ形に合わせる必要はありません。', checks: ['6つの順番が分かった','無理のない振り幅を選べた','3秒フィニッシュを保てた'], drills: ['D07','D08'] },
  { id: 'L06', title: 'パッティング入門', subtitle: 'まっすぐ、ちょうどよく転がす。', category: 'ショートゲーム', minutes: 4, color: 'sky', figures: ['putt-address','putt-line','putt-distance'], tips: ['腕を自然に下ろせる位置に構える。','フェースを目標線へ合わせ、短い距離から試す。','同じテンポで振り幅を変え、転がる距離を観察する。'], mistake: '手首だけで急に打つと距離感をつかみにくくなります。小さな振り幅で、ゆっくり往復しましょう。', checks: ['狙う線を決められた','ゲートを通るか確認した','止まる場所を観察した'], drills: ['D04','D05','D06'] },
  { id: 'L07', title: 'アプローチのコツ', subtitle: '落として、転がして、近づける。', category: 'ショートゲーム', minutes: 4, color: 'sand', figures: ['chip-small','chip-landing','chip-compare'], tips: ['小さい振り幅から、無理なくクラブを通す。','最初に落とす場所と、転がる距離を分けて考える。','同じクラブで繰り返して、弾み方と転がりを知る。'], mistake: 'ボールを上げようとして上体を後ろへ倒すと、当たりが変わりやすくなります。小さい動きに戻して観察しましょう。', checks: ['落としどころを決めた','転がる距離を観察した','小さい動きで試せた'], drills: ['D09'] },
  { id: 'L08', title: 'はじめてのティーショット', subtitle: 'いつもの手順で、落ち着いて打つ。', category: 'ティーショット', minutes: 4, color: 'peach', figures: ['tee-height','tee-finish','routine'], tips: ['ティーの高さとボール位置を確認する。','狙う→フェースを合わせる→構える、を毎回繰り返す。','飛距離より、無理なく立てるフィニッシュを優先する。'], mistake: '飛ばそうとして急に速く振らず、いつもの準備手順とテンポに戻りましょう。', checks: ['ティーの基本高さが分かった','同じ準備手順を実行できた','打った後に安定して立てた'], drills: ['D11','D12'] },
];
export interface Drill { id: DrillId; title: string; place: Place; minutes: number; reps: number; lesson: string; figure: string; focus: string; steps: string[]; condition: string; success: string; measurement: string }
export const drills: Drill[] = [
  { id:'D01',title:'グリップを作り直す',place:'home',minutes:3,reps:5,lesson:'L01',figure:'grip-pair',focus:'指の位置をゆっくり確認する',steps:['目標側の手の指を確認します。クラブがなければ手の形だけを試します。','後ろ側の手を添え、肩の力を抜きます。','一度ほどき、同じ順番で5回作り直します。'],condition:'手の形を確認できる場所。クラブは任意。振らずに行います。',success:'両手の位置を確認して作り直せた回数。クラブなしは手の形の確認です。',measurement:'手の形・握る順番' },
  { id:'D02',title:'構えをゆっくり確認',place:'home',minutes:3,reps:5,lesson:'L02',figure:'address-side',focus:'股関節から軽く前傾する',steps:['肩幅程度に立ち、膝を軽くゆるめます。','股関節から前傾し、腕を自然に下ろします。鏡があれば横から確認。','一度立ち上がり、同じ構えを5回試します。'],condition:'構えられる空間。鏡とクラブは任意。',success:'前傾・腕・足裏のバランスを確認できた回数。',measurement:'前傾・腕・足裏' },
  { id:'D03',title:'バランスを見つける',place:'home',minutes:3,reps:5,lesson:'L02',figure:'address-balance',focus:'無理なく3秒立つ',steps:['クラブを持たずに、ゆったり立ちます。','胸の向きを小さく変え、目標側を向きます。大きく腕を振りません。','足裏で支え、3秒安定して立てるか確認します。'],condition:'道具不要。小さく動ける空間。',success:'動いた後に3秒安定して立てた回数。',measurement:'3秒安定' },
  { id:'D04',title:'ゲートを通そう',place:'putt',minutes:5,reps:10,lesson:'L06',figure:'putt-line',focus:'まっすぐ打ち出す',steps:['ボールから30cm先に目印2つを置き、ボール幅+2cmのゲートを作ります。','フェースをゲートへ合わせ、短く転がします。','10球まとめて、通過した数を振り返ります。'],condition:'パター・ボール・目印2つ・平らに転がせる場所。',success:'ゲートに触れずに通過した球数。',measurement:'ゲート幅6.3cm・距離30cm（変更可）' },
  { id:'D05',title:'1mを繰り返す',place:'putt',minutes:5,reps:10,lesson:'L06',figure:'putt-distance',focus:'同じテンポで転がす',steps:['使える距離でカップまたは停止エリアを決めます。基本は1m。','同じテンポで短いパットを繰り返します。','10球ごとに成功数を記録します。'],condition:'パター・ボール・カップまたは目印。',success:'カップに入った球数、または決めた停止エリアに止まった球数。',measurement:'距離1m・カップまたは停止エリア30cm四方（変更可）' },
  { id:'D06',title:'距離感の階段',place:'putt',minutes:10,reps:15,lesson:'L06',figure:'putt-distance',focus:'振り幅と転がる距離を観察',steps:['使える場所に、距離の違う停止エリアを2〜3つ決めます。','同じテンポで、振り幅を変えて各5球試します。','狙った範囲で止まった球数を記録します。'],condition:'パター・ボール・目印・複数距離を確保できる場所。',success:'決めた停止エリアに止まった球数。',measurement:'距離1・2・3m、停止エリア30cm四方（変更可）' },
  { id:'D07',title:'小さく振って、当てる',place:'range',minutes:10,reps:20,lesson:'L04',figure:'half-arc',focus:'腰から腰の小さい振り幅',steps:['短いアイアンまたはウェッジを選び、構えます。','腰の高さくらいの小さな往復で打ちます。','10球ごとに休み、当たりの感触を観察します。'],condition:'アイアンかウェッジ・ボール・打球できる練習場。',success:'トップ・ダフリが少なく当たったと本人が感じた球数。',measurement:'使用クラブ・当たりの自己観察' },
  { id:'D08',title:'3秒フィニッシュ',place:'range',minutes:5,reps:10,lesson:'L05',figure:'swing-finish',focus:'打った後のバランス',steps:['無理なく振れるクラブと振り幅を選びます。','ゆっくり打ち、目標側を向きます。','3秒立てたかを、10球まとめて確認します。'],condition:'クラブ・ボール・練習場。ドライバーならティーも必要。',success:'打った後に3秒安定して立てた球数。',measurement:'使用クラブ・3秒安定' },
  { id:'D09',title:'落としどころを狙う',place:'range',minutes:10,reps:20,lesson:'L07',figure:'chip-landing',focus:'最初に落ちる場所を見る',steps:['アプローチ可能な施設で、既存の距離表示や目標を選びます。','ウェッジで小さい振り幅から試します。','最初に落ちた場所を観察し、10球ごとに記録します。'],condition:'ウェッジ・ボール・アプローチ可能な施設。',success:'決めた目標エリアに最初に落ちた球数。',measurement:'距離・落としどころの範囲・クラブ' },
  { id:'D10',title:'アイアンの方向を揃える',place:'range',minutes:10,reps:20,lesson:'L03',figure:'aim-lines',focus:'フェースから向きを合わせる',steps:['施設の目標をひとつ選び、狙う範囲を決めます。','フェース、足の順に向きを確認して打ちます。','10球ごとに、目標エリアへ進んだ数を記録します。'],condition:'アイアン・ボール・練習場の目標。',success:'決めた目標エリアに進んだと観察できた球数。精密な計測ではありません。',measurement:'使用クラブ・目標方向と範囲' },
  { id:'D11',title:'落ち着いたティーショット',place:'range',minutes:10,reps:20,lesson:'L08',figure:'tee-height',focus:'力よりもバランス',steps:['ティーの高さとボール位置を確認します。','飛ばすより、無理なく振ることを意識します。','打った後3秒安定して立てた球数を記録します。'],condition:'ドライバー・ボール・ティー・練習場。',success:'打った後に3秒安定して立てた球数。',measurement:'ティー高さ・当たりの感触・3秒安定' },
  { id:'D12',title:'いつもの準備手順',place:'range',minutes:5,reps:10,lesson:'L08',figure:'routine',focus:'狙う → 構える → 打つ',steps:['ボールの後ろで狙いを決めます。','フェースを合わせてから構えます。','打ったら一度ほどき、同じ順番を10回繰り返します。'],condition:'クラブ・ボール・練習場。ドライバーならティーも必要。',success:'決めた準備手順を守れた回数。',measurement:'使用クラブ・準備手順' },
];
export const getDrill = (id: string) => drills.find(d => d.id === id)!;
export const getLesson = (id: string) => lessons.find(l => l.id === id)!;

export interface MenuStep { title: string; minutes: number; drillId?: DrillId; description?: string }
export interface Menu { id: string; title: string; place: Place; minutes: number; steps: MenuStep[] }
const prep = (minutes: number): MenuStep => ({title:'周囲の確認・軽い準備',minutes,description:'周囲の空間と道具を確認。肩や腕をゆっくり動かし、無理のない範囲で始めましょう。'});
const rest = (minutes: number): MenuStep => ({title:'ひと息つこう',minutes,description:'道具を置いて休憩。水分をとり、体が落ち着いてから再開します。'});
const recap = (minutes: number): MenuStep => ({title:'今日の振り返り',minutes,description:'できたことをひとつ思い出しましょう。回数や感想は、この後の記録画面でまとめて残せます。'});
const ds = (drillId: string, minutes: number): MenuStep => ({title:getDrill(drillId).title,minutes,drillId:getDrill(drillId).id});
export const menus: Menu[] = [
  {id:'home-5',title:'5分で、構えを整える',place:'home',minutes:5,steps:[prep(1),ds('D02',2),ds('D01',1),recap(1)]},
  {id:'home-15',title:'おうちで基本をゆっくり',place:'home',minutes:15,steps:[prep(1),ds('D01',5),ds('D02',5),ds('D03',3),recap(1)]},
  {id:'home-30',title:'じっくり、基本の3つ',place:'home',minutes:30,steps:[prep(2),ds('D01',7),ds('D02',7),rest(3),ds('D03',9),recap(2)]},
  {id:'putt-5',title:'5分で、打ち出しを確認',place:'putt',minutes:5,steps:[prep(1),ds('D04',3),recap(1)]},
  {id:'putt-15',title:'方向と距離感を磨く',place:'putt',minutes:15,steps:[prep(2),ds('D04',4),ds('D05',4),ds('D06',3),recap(2)]},
  {id:'putt-30',title:'パットの基礎をじっくり',place:'putt',minutes:30,steps:[prep(3),ds('D04',8),ds('D05',8),rest(2),ds('D06',7),recap(2)]},
  {id:'range-5',title:'5分で、フィニッシュ確認',place:'range',minutes:5,steps:[prep(1),ds('D08',2),ds('D12',1),recap(1)]},
  {id:'range-15',title:'小さく振って、気持ちよく',place:'range',minutes:15,steps:[prep(2),ds('D02',2),ds('D07',9),recap(2)]},
  {id:'range-30',title:'当たりと方向をひとつずつ',place:'range',minutes:30,steps:[prep(3),ds('D07',10),rest(2),ds('D10',10),ds('D12',3),recap(2)]},
];
export function canDo(id: string, p: Preferences): boolean {
  const has = (e: Equipment) => p.equipment.includes(e);
  if (['D01','D02','D03'].includes(id)) return true;
  if (['D04','D05','D06'].includes(id)) {
    if (p.place !== 'putt' || !has('putter') || !has('ball') || p.maxPutt < .3) return false;
    if (id === 'D04') return has('marker');
    if (id === 'D05') return p.cup || has('marker');
    return has('marker') && p.multipleDistances;
  }
  if (p.place !== 'range' || !has('ball')) return false;
  if (id === 'D07') return has('iron') || has('wedge');
  if (id === 'D09') return has('wedge') && p.approach;
  if (id === 'D10') return has('iron');
  if (id === 'D11') return has('driver') && has('tee');
  return has('iron') || has('wedge') || (has('driver') && has('tee'));
}
export function adaptMenu(menu: Menu, p: Preferences): Menu | null {
  if (menu.place !== p.place) return null;
  const steps: MenuStep[] = [];
  for (const step of menu.steps) {
    let id = step.drillId;
    if (id && !canDo(id,p)) {
      const candidates: Record<string,string[]> = {D04:['D05'],D06:['D05'],D07:['D08'],D10:['D09','D07','D11']};
      id = candidates[id]?.map(alt=>getDrill(alt).id).find(alt => canDo(alt,p));
      if (!id) return null;
    }
    steps.push(id ? ds(id,step.minutes) : {...step});
  }
  return {...menu,steps};
}
export const issues: {title:string; lessons:string[]}[] = [
  {title:'当たらない',lessons:['L02','L04']},{title:'ダフる',lessons:['L02','L04']},
  {title:'トップする',lessons:['L02','L04']},{title:'右へ曲がる',lessons:['L01','L03']},
  {title:'左へ曲がる',lessons:['L01','L03']},{title:'距離が合わない',lessons:['L06','L07']},
];
export const glossary: Record<string,string> = {グリップ:'クラブを握る部分、または握り方。',アドレス:'打つ前の構え。',フェース:'クラブヘッドの、ボールに当たる面。',トップ:'ボールの上側に当たるミス。または振り上げた最上部。',ダフリ:'ボールより手前の地面にクラブが当たること。',フィニッシュ:'打ち終わったときの姿勢。',アプローチ:'グリーンの近くから、短い距離を寄せるショット。',ティー:'ティーショットでボールを乗せる小さな台。'};
