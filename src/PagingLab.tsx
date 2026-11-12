import { useState } from "react";

/** One 4096-byte page, with the same offset before and after translation. */
export default function PagingLab() {
  const [virtualAddress, setVirtualAddress] = useState(5000);
  const [frame, setFrame] = useState(3);
  const size = 4096;
  const page = Math.floor(virtualAddress / size);
  const offset = virtualAddress % size;
  const physical = frame * size + offset;
  const top = 116, bottom = 436, height = bottom - top;
  const y = bottom - (offset / size) * height;
  return <div className="paging-lab">
    <div className="heading"><span className="eyebrow">LAB 03 · VIRTUAL MEMORY</span><h2>ページングとアドレス変換</h2><p>1ブロック＝4096バイト。縦軸の0を省略して、ページ内の位置が変わらないことを確認します。</p></div>
    <section className="panel">
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        <label style={{flex:"1 1 170px"}}>仮想アドレス <input type="number" min="0" max="65535" value={virtualAddress} onChange={e=>setVirtualAddress(Math.max(0,Math.min(65535,Number(e.target.value)||0)))} style={{display:"block",width:"100%",padding:9,background:"#1b2a40",color:"white",border:"1px solid #40516b",borderRadius:8}}/></label>
        <label style={{flex:"1 1 170px"}}>対応する物理フレーム番号 <select value={frame} onChange={e=>setFrame(Number(e.target.value))} style={{display:"block",width:"100%",padding:9,background:"#1b2a40",color:"white",border:"1px solid #40516b",borderRadius:8}}>{Array.from({length:8},(_,i)=><option key={i} value={i}>{i}</option>)}</select></label>
      </div>
      <svg viewBox="0 0 800 540" role="img" aria-label={`仮想ページ${page}のアドレス${virtualAddress}が物理フレーム${frame}のアドレス${physical}に変換される図。オフセットは${offset}バイトで変わらない。`} style={{width:"100%",height:"auto",marginTop:14}}>
        <defs><marker id="pagingArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#f3c967"/></marker></defs>
        <text x="170" y="30" fill="#bcd6fb" fontSize="21" textAnchor="middle">仮想アドレス</text>
        <text x="620" y="30" fill="#b8e8cf" fontSize="21" textAnchor="middle">物理アドレス</text>
        <path d="M65 476 V64 M58 76 L65 64 L72 76 M735 476 V64 M728 76 L735 64 L742 76" fill="none" stroke="#dce7f6" strokeWidth="2.5"/>
        <path d="M58 453 q7 -10 14 0 q7 10 14 0 M728 453 q7 -10 14 0 q7 10 14 0" fill="none" stroke="#dce7f6" strokeWidth="2.5"/>
        <rect x="110" y={top} width="210" height={height} rx="3" fill="#254b77" stroke="#78b3fc" strokeWidth="3"/>
        <rect x="480" y={top} width="210" height={height} rx="3" fill="#215441" stroke="#75d6a7" strokeWidth="3"/>
        <text x="215" y="170" fill="white" fontSize="23" textAnchor="middle">仮想ページ {page}</text>
        <text x="585" y="170" fill="white" fontSize="23" textAnchor="middle">物理フレーム {frame}</text>
        <text x="215" y="196" fill="#c9d9ef" fontSize="17" textAnchor="middle">4096バイト</text>
        <text x="585" y="196" fill="#c7e8d7" fontSize="17" textAnchor="middle">4096バイト</text>
        <path d={`M65 ${y} H320 M480 ${y} H735`} stroke="#f3c967" strokeWidth="2.5" strokeDasharray="7 5"/>
        <circle cx="215" cy={y} r="7" fill="#f3c967"/><circle cx="585" cy={y} r="7" fill="#f3c967"/>
        <text x="58" y={y-10} fill="#f3c967" textAnchor="end" fontSize="20">{virtualAddress}</text>
        <text x="742" y={y-10} fill="#f3c967" fontSize="20">{physical}</text>
        <path d={`M260 ${bottom} V${y+8} M630 ${bottom} V${y+8}`} stroke="#e5effa" strokeWidth="2" strokeDasharray="4 4"/>
        <text x="215" y="402" fill="#e5effa" fontSize="17" textAnchor="middle">オフセット {offset}</text>
        <text x="585" y="402" fill="#e5effa" fontSize="17" textAnchor="middle">オフセット {offset}</text>
        <path d="M320 265 H475" stroke="#f3c967" strokeWidth="3" markerEnd="url(#pagingArrow)"/>
        <rect x="335" y="211" width="130" height="42" rx="8" fill="#172b42" stroke="#7799bf"/>
        <text x="400" y="228" fill="white" fontSize="15" textAnchor="middle">ページテーブル</text>
        <text x="400" y="246" fill="#f3c967" fontSize="15" textAnchor="middle">{page} → {frame}</text>
        <text x="58" y="116" fill="#dce7f6" textAnchor="end" fontSize="17">{(page+1)*size}</text>
        <text x="58" y="442" fill="#dce7f6" textAnchor="end" fontSize="17">{page*size}</text>
        <text x="742" y="116" fill="#dce7f6" fontSize="17">{(frame+1)*size}</text>
        <text x="742" y="442" fill="#dce7f6" fontSize="17">{frame*size}</text>
        <text x="65" y="515" fill="#a6b5cc" textAnchor="middle" fontSize="17">0（省略）</text>
        <text x="735" y="515" fill="#a6b5cc" textAnchor="middle" fontSize="17">0（省略）</text>
      </svg>
      <div className="cache-capacity"><span>変換結果</span><strong>{virtualAddress} = {page} × 4096 + {offset}</strong><strong>物理アドレス = {frame} × 4096 + {offset} = {physical}</strong><small>ページ番号だけをフレーム番号に置き換え、ページ内オフセットは維持します。</small></div>
    </section>
  </div>;
}
