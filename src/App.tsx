import { useState } from "react";
import { bits, byte, calculate, signed, type Operation } from "./bit";
const modules = ["ビット演算","CPU・メモリ","アルゴリズム","データ構造","ネットワーク","SQL","セキュリティ","OS","プロジェクト管理","経営・財務"];
const operations: Operation[] = ["NOT","AND","OR","XOR","SHL","SHR"];
export default function App() {
  const [selected, setSelected] = useState(0);
  const [a, setA] = useState(42);
  const [b, setB] = useState(15);
  const [op, setOp] = useState<Operation>("XOR");
  const [answer, setAnswer] = useState<string | null>(null);
  const result = calculate(a,b,op);
  return <div className="shell">
    <header><span className="eyebrow">FUNDAMENTAL INFORMATION TECHNOLOGY ENGINEER</span><h1>FE Learning Lab</h1><p>作って、試して、理解する。基本情報技術者試験のための実験室。</p></header>
    <div className="layout"><nav aria-label="学習分野"><h2>学習モジュール</h2>{modules.map((m,i)=><button key={m} className={selected===i?"module active":"module"} onClick={()=>setSelected(i)}><span>{String(i+1).padStart(2,"0")}</span>{m}{i>0&&<small>準備中</small>}</button>)}</nav>
    <main>{selected===0?<><div className="heading"><span className="eyebrow">LAB 01 · TECHNOLOGY</span><h2>ビット演算ラボ</h2><p>各ビットをクリックして、演算結果がどう変わるか観察しよう。</p></div>
      <section className="panel"><h3>入力 A</h3><div className="stats"><strong>{a} <small>10進数</small></strong><span>0x{a.toString(16).toUpperCase().padStart(2,"0")} · 符号付き {signed(a)}</span></div><input aria-label="入力A" type="range" min="0" max="255" value={a} onChange={e=>setA(Number(e.target.value))}/><div className="bits">{bits(a).split("").map((v,i)=><button key={i} className={v==="1"?"bit on":"bit"} onClick={()=>setA(byte(a^(1<<(7-i))))}>{v}<small>{7-i}</small></button>)}</div></section>
      <section className="panel"><h3>演算</h3><div className="operations">{operations.map(v=><button key={v} className={op===v?"chosen":""} onClick={()=>setOp(v)}>{v}</button>)}</div>{["AND","OR","XOR"].includes(op)&&<><label htmlFor="mask">入力 B：{b}（{bits(b)}）</label><input id="mask" type="range" min="0" max="255" value={b} onChange={e=>setB(Number(e.target.value))}/></>}</section>
      <section className="panel result"><h3>結果</h3><div className="bits">{bits(result).split("").map((v,i)=><div key={i} className={v==="1"?"bit on":"bit"}>{v}<small>{7-i}</small></div>)}</div><div className="stats"><strong>{result} <small>10進数</small></strong><span>0x{result.toString(16).toUpperCase().padStart(2,"0")} · 符号付き {signed(result)}</span></div></section>
      <section className="panel"><h3>理解度チェック</h3><p>8ビットの2の補数で -5 を表すと？</p><div className="operations">{["00000101","11111011","11111010"].map(v=><button key={v} onClick={()=>setAnswer(v)}>{v}</button>)}</div>{answer&&<p role="status" className={answer==="11111011"?"correct":"incorrect"}>{answer==="11111011"?"正解！ 5 (00000101) を反転して1を加えると 11111011。":"もう一度。正の5をビット反転して1を足してみよう。"}</p>}</section>
    </>:<section className="panel"><span className="eyebrow">LAB {String(selected+1).padStart(2,"0")}</span><h2>{modules[selected]}</h2><p>このモジュールは今後追加します。まずはビット演算ラボで実験しよう。</p></section>}</main></div>
    <footer>FE Learning Lab · 学習用シミュレーター（8ビット演算）</footer>
  </div>;
}
