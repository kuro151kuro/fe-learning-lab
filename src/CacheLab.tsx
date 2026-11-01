import { useState } from "react";

type Mode = 1 | 2 | 4;
const patterns: Record<string, number[]> = {
  conflict: [0, 4, 0, 4, 0, 4, 0, 4],
  sequential: [0, 1, 2, 3, 0, 1, 2, 3],
  mixed: [0, 4, 1, 5, 0, 4, 1, 5],
};
export default function CacheLab() {
  const [ways, setWays] = useState<Mode>(2);
  const [pattern, setPattern] = useState("conflict");
  const [step, setStep] = useState(0);
  const sequence = patterns[pattern];
  const setCount = 4 / ways;
  const cache: number[][] = Array.from({ length: setCount }, () => []);
  let hits = 0;
  const history = sequence.map(block => {
    const set = block % setCount;
    const hit = cache[set].includes(block);
    if (hit) { hits++; cache[set].splice(cache[set].indexOf(block), 1); }
    else if (cache[set].length === ways) cache[set].shift();
    cache[set].push(block);
    return { block, set, hit, hits, cache: cache.map(row => [...row]) };
  });
  const current = step ? history[step - 1].cache : Array.from({ length: setCount }, () => [] as number[]);
  const hitCount = step ? history[step - 1].hits : 0;
  const changeWays = (n: Mode) => { setWays(n); setStep(0); };
  return <div className="cache-lab">
    <div className="heading"><span className="eyebrow">LAB 02 · CPU / MEMORY</span><h2>キャッシュメモリの構造と配置方式</h2><p>セット・キャッシュライン・ウェイの関係を図で確認し、アクセスを実行してみよう。</p></div>
    <section className="panel">
      <h3>まずは3つの用語を図で理解</h3>
      <p>例：4セット × 2ウェイ。各セットには2本のキャッシュラインがあり、合計8本のラインを持ちます。</p>
      <div className="cache-concepts">
        <div className="cache-ram"><strong>メインメモリ（RAM）</strong><small>ブロック：データのまとまり</small>{[0,1,2,3,4,5].map(n=><div key={n} className="cache-block">ブロック {n}<small>アドレス {n*16}〜{n*16+15}</small></div>)}</div>
        <div className="cache-diagram"><strong>キャッシュメモリ</strong><div className="cache-grid-head"><span>セット</span><span>ウェイ0</span><span>ウェイ1</span></div>{[0,1,2,3].map(n=><div key={n} className="cache-diagram-row"><span>セット{n}</span><div className="cache-line">{n===0?"ブロック0":n===1?"ブロック1":"空き"}</div><div className="cache-line">{n===0?"ブロック4":"空き"}</div></div>)}<small>紫の横1行＝セット／青い1枠＝キャッシュライン／縦の列＝ウェイ</small></div>
      </div>
      <div className="cache-glossary"><div><strong>セット</strong><p>キャッシュラインをまとめた横1行。アドレスから検索先のセットを決める。</p></div><div><strong>キャッシュライン</strong><p>メモリブロックを格納する1つの枠。図では1枠16バイト。</p></div><div><strong>ウェイ</strong><p>セット内の格納位置。2ウェイなら1セットに2本のラインがある。</p></div></div>
      <p className="cache-hint">ポイント：ブロックはRAM側のデータ単位。セット・ライン・ウェイはキャッシュ側の構造を表します。</p>
    </section>
    <section className="panel">
      <h3>第14回：配置方式を切り替えて実験</h3>
      <p>キャッシュ全体の容量は4ラインで固定します。下の数字は<strong>データの値やバイトアドレスではなく、メモリブロック番号</strong>です。</p>
      <div className="cache-controls"><label>配置方式<select value={ways} onChange={e=>changeWays(Number(e.target.value) as Mode)}><option value={1}>ダイレクトマップ（4セット × 1ウェイ）</option><option value={2}>2ウェイ・セットアソシアティブ（2セット × 2ウェイ）</option><option value={4}>フルアソシアティブ（1セット × 4ウェイ）</option></select></label><label>アクセスするブロック番号の順序<select value={pattern} onChange={e=>{setPattern(e.target.value);setStep(0);}}><option value="conflict">0 → 4 → 0 → 4 …（競合）</option><option value="sequential">0 → 1 → 2 → 3 …（再利用）</option><option value="mixed">0 → 4 → 1 → 5 …（混合）</option></select></label></div>
      <h4>アクセス履歴（メモリブロック番号）</h4>
      <div className="cache-history">{history.map((item,i)=><div key={i} className={i>=step?"cache-pending":item.hit?"cache-hit":"cache-miss"}><strong>{item.block}</strong><small>{i>=step?"未実行":item.hit?"HIT":"MISS"}</small></div>)}</div>
      <div className="cache-simulator"><h4>現在のキャッシュ：{setCount}セット × {ways}ウェイ</h4><div className="cache-grid-head" style={{gridTemplateColumns:`80px repeat(${ways},minmax(0,1fr))`}}><span>セット</span>{Array.from({length:ways},(_,i)=><span key={i}>ウェイ{i}</span>)}</div>{current.map((row,i)=><div className="cache-diagram-row" style={{gridTemplateColumns:`80px repeat(${ways},minmax(0,1fr))`}} key={i}><span>セット{i}</span>{Array.from({length:ways},(_,j)=><div key={j} className="cache-line">{row[j]===undefined?"空き":`ブロック${row[j]}`}</div>)}</div>)}</div>
      <p className="cache-hint">セット番号 ＝ ブロック番号 ÷ セット数の余り。満杯のセットでは、最も長く使われていないブロック（LRU）を追い出します。</p>
      <div className="cache-actions"><button disabled={step===0} onClick={()=>setStep(s=>s-1)}>1つ戻る</button><span>{step} / 8 アクセス · ヒット {hitCount}回 · ヒット率 {step?Math.round(hitCount/step*100):0}%</span><button disabled={step===8} onClick={()=>setStep(s=>s+1)}>次のアクセス</button><button onClick={()=>setStep(8)}>最後まで実行</button><button onClick={()=>setStep(0)}>リセット</button></div>
    </section>
  </div>;
}
