import { useEffect, useState } from "react";

type Status = "done" | "learning" | "todo";
type Topic = { id: string; name: string; initial?: Status };
type Domain = { group: string; name: string; topics: Topic[] };
const t = (id:string,name:string,initial?:Status):Topic=>({id,name,initial});
const domains:Domain[] = [
{group:"テクノロジ",name:"基礎理論",topics:[t("binary","2進数・基数変換","done"),t("twos","2の補数・負数","done"),t("flags","CF / OF","done"),t("bitwise","ビット演算・マスク","done"),t("shift","シフト・2進数の乗除算","done"),t("logic","論理・集合・確率・統計"),t("theory","情報理論・通信理論")]},
{group:"テクノロジ",name:"アルゴリズムとプログラミング",topics:[t("pseudo","擬似言語・トレース"),t("search","探索・整列"),t("complexity","計算量"),t("structures","配列・リスト・木・スタック・キュー"),t("programming","プログラミング・言語")]},
{group:"テクノロジ",name:"コンピュータ構成要素",topics:[t("cpu","CPU・命令サイクル","done"),t("register","レジスタとRAM","done"),t("hierarchy","メモリ階層・キャッシュ","done"),t("mesi","MESI・書き込み方式","done"),t("mapping","キャッシュ配置・LRU","done"),t("address","タグ・インデックス・オフセット","learning"),t("io","バス・入出力装置")]},
{group:"テクノロジ",name:"システム構成要素",topics:[t("architecture","システム構成・クライアントサーバ"),t("performance","性能・稼働率・信頼性")]},
{group:"テクノロジ",name:"ソフトウェア",topics:[t("os","OS・プロセス・スレッド"),t("virtual","仮想記憶・ページング"),t("files","ファイル・ミドルウェア")]},
{group:"テクノロジ",name:"ハードウェア",topics:[t("circuits","論理回路・ハードウェア")]},
{group:"テクノロジ",name:"情報デザイン・情報メディア",topics:[t("ui","UI・UX・情報デザイン"),t("media","画像・音声・動画")]},
{group:"テクノロジ",name:"データベース",topics:[t("dbmodel","関係モデル・正規化"),t("sql","SQL"),t("transaction","トランザクション・排他制御")]},
{group:"テクノロジ",name:"ネットワーク",topics:[t("tcp","TCP/IP・OSI"),t("routing","IP・サブネット・ルーティング"),t("protocols","DNS・HTTP・メール")]},
{group:"テクノロジ",name:"セキュリティ",topics:[t("crypto","暗号・認証"),t("attack","脅威・攻撃・対策"),t("securitymgmt","リスク管理・セキュリティ管理")]},
{group:"テクノロジ",name:"システム開発技術",topics:[t("requirements","要件定義・設計"),t("test","テスト・品質管理")]},
{group:"テクノロジ",name:"ソフトウェア開発管理技術",topics:[t("agile","アジャイル・開発プロセス"),t("devops","構成管理・DevOps")]},
{group:"マネジメント",name:"プロジェクトマネジメント",topics:[t("pm","計画・進捗・コスト・リスク")]},
{group:"マネジメント",name:"サービスマネジメント",topics:[t("service","ITサービス運用・SLA・改善")]},
{group:"マネジメント",name:"システム監査",topics:[t("audit","監査・内部統制")]},
{group:"ストラテジ",name:"システム戦略",topics:[t("strategy","情報システム戦略・業務改善")]},
{group:"ストラテジ",name:"システム企画",topics:[t("planning","システム化計画・調達")]},
{group:"ストラテジ",name:"経営戦略マネジメント",topics:[t("business","経営戦略・マーケティング")]},
{group:"ストラテジ",name:"技術戦略マネジメント",topics:[t("techstrategy","技術開発戦略")]},
{group:"ストラテジ",name:"ビジネスインダストリ",topics:[t("industry","ビジネスシステム・eビジネス")]},
{group:"ストラテジ",name:"企業活動",topics:[t("accounting","会計・財務"),t("organization","経営・組織・業務分析")]},
{group:"ストラテジ",name:"法務",topics:[t("law","知的財産・労働・取引関連法規"),t("standards","標準化・技術者倫理")]},
{group:"科目B",name:"アルゴリズム・プログラミング",topics:[t("btrace","擬似言語の読解"),t("barray","配列・再帰・探索の実践")]},
{group:"科目B",name:"情報セキュリティ",topics:[t("bsecurity","セキュリティ事例問題")]}
];
const all = domains.flatMap(d=>d.topics);
const initial = Object.fromEntries(all.map(x=>[x.id,x.initial??"todo"])) as Record<string,Status>;
const labels:Record<Status,string>={done:"学習済み",learning:"学習中",todo:"未着手"};
const next:Record<Status,Status>={todo:"learning",learning:"done",done:"todo"};
export default function LearningMap(){
 const [statuses,setStatuses]=useState<Record<string,Status>>(()=>{
  try {const stored=JSON.parse(localStorage.getItem("fe-learning-map-v1")||"{}");return {...initial,...stored}}catch{return initial}
 });
 const [filter,setFilter]=useState("すべて");
 const [expanded,setExpanded]=useState<string[]>(domains.map(d=>d.name));
 useEffect(()=>{localStorage.setItem("fe-learning-map-v1",JSON.stringify(statuses))},[statuses]);
 const count=(s:Status)=>all.filter(t=>statuses[t.id]===s).length;
 const toggle=(name:string)=>setExpanded(x=>x.includes(name)?x.filter(v=>v!==name):[...x,name]);
 return <div className="learning-map">
 <div className="heading"><span className="eyebrow">SYLLABUS ROADMAP · 2026</span><h2>試験範囲マップ</h2><p>科目A・科目Bを俯瞰して、学習した場所と次に進む場所を確認できます。項目をタップすると「未着手 → 学習中 → 学習済み」に切り替わります。</p></div>
 <div className="map-summary"><div><strong>{count("done")} / {all.length}</strong><span>学習済み項目</span></div><div><strong>{count("learning")}</strong><span>学習中</span></div><div><strong>{count("todo")}</strong><span>未着手</span></div></div>
 <div className="map-progress"><div style={{width:`${count("done")/all.length*100}%`}} /></div>
 <p className="map-note">※項目数ベースの進捗です。試験の得点率や合格可能性を表すものではありません。初期状態はこれまでの会話で学習した内容から設定しました（理解度の保証ではありません）。変更内容はこのブラウザに保存されます。</p>
 <div className="map-filters">{["すべて","テクノロジ","マネジメント","ストラテジ","科目B"].map(g=><button key={g} className={filter===g?"selected":""} onClick={()=>setFilter(g)}>{g}</button>)}</div>
 {["テクノロジ","マネジメント","ストラテジ","科目B"].filter(g=>filter==="すべて"||filter===g).map(group=><section key={group} className="map-group"><h3>{group}{group==="科目B"?"（実践問題）":"系"}</h3><div className="map-domains">{domains.filter(d=>d.group===group).map(d=><article key={d.name} className="map-domain"><button className="map-domain-heading" onClick={()=>toggle(d.name)} aria-expanded={expanded.includes(d.name)}><strong>{d.name}</strong><span>{d.topics.filter(t=>statuses[t.id]==="done").length}/{d.topics.length} 学習済み {expanded.includes(d.name)?"−":"＋"}</span></button>{expanded.includes(d.name)&&<div className="map-topics">{d.topics.map(t=><button key={t.id} className={`map-topic ${statuses[t.id]}`} onClick={()=>setStatuses(s=>({...s,[t.id]:next[s[t.id]]}))} title="タップして学習状態を変更"><span className="map-status-dot"/><span>{t.name}</span><small>{labels[statuses[t.id]]}</small></button>)}</div>}</article>)}</div></section>)}
 <div className="map-next"><strong>次の学習：タグ・インデックス・オフセット</strong><p>キャッシュのアドレスをビット列に分割して、どのセットに配置されるかを計算します。</p></div>
 <p className="map-note">出題範囲の分類はIPA「基本情報技術者試験 シラバス Ver.9.2」を基に学習用に簡略化しています。2027年度からの新体系案は未反映です。<a href="https://www.ipa.go.jp/shiken/syllabus/gaiyou.html" target="_blank" rel="noreferrer">IPA公式シラバス ↗</a></p>
 </div>
}
