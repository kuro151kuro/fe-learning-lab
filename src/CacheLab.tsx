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
      <h3>図で理解：セット × ウェイ × ラインサイズ</h3>
      <p>キャッシュを「行と列に並んだ箱」として考えます。<strong>横1行＝セット、縦1列＝ウェイ、交差する1枠＝キャッシュライン</strong>です。</p>
      <div className="cache-structure">
        <div className="cache-structure-title"><strong>キャッシュメモリ</strong><span>4セット × 2ウェイ</span></div>
        <div className="cache-structure-grid">
          <div className="cache-axis-label">セット番号 ↓</div>
          <div className="cache-way-heading">ウェイ0 ↓</div>
          <div className="cache-way-heading">ウェイ1 ↓</div>
          {[0,1,2,3].map(set=><div className="cache-set-row" key={set}>
            <div className="cache-set-label">セット{set}</div>
            {[0,1].map(way=><div className="cache-structure-line" key={way}>
              <span>キャッシュライン</span><strong>16バイト</strong>
            </div>)}
          </div>)}
        </div>
        <p className="cache-structure-note">各セットにキャッシュラインが2本。全部で <strong>4 × 2 = 8本</strong> のラインがあります。</p>
      </div>
      <div className="cache-glossary">
        <div><strong>セット＝行</strong><p>キャッシュラインをまとめたグループ。例では4行。</p></div>
        <div><strong>ウェイ＝列</strong><p>セット内の格納位置。例では各セットに2本のライン。</p></div>
        <div><strong>キャッシュライン＝1枠</strong><p>RAMのメモリブロックを入れる箱。1本のサイズは16バイト。</p></div>
      </div>
      <div className="cache-capacity">
        <span>キャッシュのデータ容量</span>
        <strong>4 セット × 2 ウェイ × 16 バイト = 128 バイト</strong>
        <small>※タグなどの管理情報を除いたデータ部分の容量</small>
      </div>
      <h4>メモリアドレス・ブロックとの関係</h4>
      <div className="cache-address-flow">
        <div><small>CPUが指定</small><strong>メモリアドレス 100</strong><span>1バイトの位置</span></div>
        <span aria-hidden="true">↓</span>
        <div><small>16バイト単位で区切る</small><strong>メモリブロック 6</strong><span>アドレス96〜111の16バイト</span></div>
        <span aria-hidden="true">↓</span>
        <div><small>4セットから選ぶ</small><strong>セット 2</strong><span>ブロック番号6 ÷ 4 の余り＝2</span></div>
      </div>
      <p className="cache-hint">メモリアドレス幅は「住所を表すビット数」。ラインサイズは「1枠に入るバイト数」。セット数・ウェイ数は「枠の並べ方」です。メモリブロックはRAM側のデータのまとまりで、キャッシュラインに格納されます。</p>
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
