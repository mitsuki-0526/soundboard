'use client';

import { useRef, useState } from 'react';
import { ImagePlus, MonitorUp, Plus, Square, Volume2, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const pads = [
  { id: '1', name: '拍手', key: '1', color: 'cyan' },
  { id: '2', name: 'ドラムロール', key: '2', color: 'amber' },
  { id: '3', name: 'ジャーン！', key: '3', color: 'violet' },
  { id: '4', name: '不正解', key: '4', color: 'rose' },
  { id: '5', name: 'ひらめき', key: '5', color: 'lime' },
  { id: '6', name: '転換BGM', key: '6', color: 'blue' },
];

export default function Home() {
  const [volume, setVolume] = useState(84);
  const [playing, setPlaying] = useState<string | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  function playDemo(name: string, index: number) {
    const Context = window.AudioContext || window.webkitAudioContext;
    const ctx = audioContext.current ?? new Context();
    audioContext.current = ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = index % 2 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(220 + index * 72, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(520 + index * 40, ctx.currentTime + 0.22);
    gain.gain.setValueAtTime((volume / 100) * 0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    setPlaying(name);
    window.setTimeout(() => setPlaying(null), 520);
  }

  function stopAll() {
    audioContext.current?.close();
    audioContext.current = null;
    setPlaying(null);
  }

  return (
    <main className="min-h-screen bg-[#080b12] text-white">
      <header className="border-b border-white/10 bg-[#0c101a]/95 px-5 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-400 text-slate-950 shadow-[0_0_28px_rgba(34,211,238,.28)]">
              <Waves className="size-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">舞台キュー</h1>
              <p className="text-xs text-slate-400">文化祭公演・音響／映像コントローラー</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-sm text-emerald-300 sm:flex">
              <i className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> 準備完了
            </span>
            <Button onClick={stopAll} className="h-11 bg-rose-500 px-5 font-bold text-white hover:bg-rose-400">
              <Square className="size-4 fill-current" /> 全停止
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 p-5 md:p-8 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[.2em] text-cyan-300">SOUND CUES</p>
              <h2 className="mt-1 text-2xl font-bold">効果音パッド</h2>
            </div>
            <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
              <Plus className="size-4" /> 効果音を追加
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {pads.map((pad, index) => (
              <button
                key={pad.id}
                onClick={() => playDemo(pad.name, index)}
                className={`sound-pad group relative min-h-36 overflow-hidden rounded-2xl border p-5 text-left transition active:scale-[.97] pad-${pad.color} ${playing === pad.name ? 'is-playing' : ''}`}
              >
                <span className="absolute right-4 top-4 rounded-lg border border-white/15 bg-black/20 px-2 py-1 font-mono text-xs text-white/60">{pad.key}</span>
                <span className="mb-7 grid size-11 place-items-center rounded-full bg-white/10"><Volume2 className="size-5" /></span>
                <strong className="block text-lg">{pad.name}</strong>
                <span className="mt-1 block text-xs text-white/50">クリックで再生</span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <Volume2 className="size-5 text-cyan-300" />
            <span className="w-20 text-sm font-medium">音量 {volume}</span>
            <Slider value={[volume]} onValueChange={(value) => setVolume(value[0])} max={100} step={1} aria-label="マスター音量" className="max-w-md" />
          </div>
        </section>

        <aside>
          <div className="mb-4">
            <p className="text-xs font-semibold tracking-[.2em] text-violet-300">PROJECTOR</p>
            <h2 className="mt-1 text-2xl font-bold">背景</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111724]">
            <div className="projector-preview relative aspect-video bg-[radial-gradient(circle_at_30%_25%,#17536b,transparent_38%),linear-gradient(135deg,#101d32,#190e2a)]">
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <span className="mx-auto mb-2 grid size-10 place-items-center rounded-full border border-white/10 bg-white/5"><ImagePlus className="size-5 text-white/55" /></span>
                  <p className="text-sm font-semibold">背景未選択</p>
                  <p className="mt-1 text-xs text-white/45">画像を追加して投影できます</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><ImagePlus className="size-4" /> 画像を追加</Button>
              <Button className="bg-violet-500 text-white hover:bg-violet-400"><MonitorUp className="size-4" /> 投影画面を開く</Button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[.035] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">再生状況</span>
              <span className={`text-xs ${playing ? 'text-cyan-300' : 'text-slate-500'}`}>{playing ? '再生中' : '待機中'}</span>
            </div>
            <p className="mt-3 truncate text-lg font-bold">{playing ?? '—'}</p>
            <div className="mt-4 flex h-6 items-end gap-1" aria-hidden="true">
              {[8, 15, 11, 22, 16, 9, 18, 13, 20, 7, 14, 10, 17, 8, 12].map((h, i) => (
                <span key={i} className={`w-full rounded-sm ${playing ? 'bg-cyan-400' : 'bg-white/10'}`} style={{ height: playing ? h : 5 }} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

declare global {
  interface Window { webkitAudioContext: typeof AudioContext }
}
