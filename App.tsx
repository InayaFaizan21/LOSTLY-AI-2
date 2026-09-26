import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDownRight, ArrowRight, Bell, Bookmark, Box, Check, ChevronDown, CircleHelp, Clock3,
  CloudUpload, Compass, Eye, Flame, HeartHandshake, ImagePlus, Info, KeyRound, Landmark,
  Layers3, LockKeyhole, MapPin, Menu, MessageCircle, Navigation, PackageSearch, Plus, Radar,
  Search, ShieldCheck, Sparkles, Upload, X,
} from 'lucide-react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();

type Item = { id: string; title: string; kind: 'Lost' | 'Found'; category: string; location: string; date: string; distance: string; status: string; color: string };

const items: Item[] = [
  { id: 'camera', title: 'Fujifilm X100V camera', kind: 'Lost', category: 'Electronics', location: 'Mission Dolores', date: 'Today, 9:14 AM', distance: '0.7 mi', status: 'Searching', color: '#d99d72' },
  { id: 'keys', title: 'Brass house keys', kind: 'Lost', category: 'Keys', location: 'Hayes Valley', date: 'Yesterday', distance: '1.2 mi', status: 'Searching', color: '#8ba49e' },
  { id: 'wallet', title: 'Canvas card wallet', kind: 'Found', category: 'Wallets', location: 'Dogpatch', date: 'Mar 18', distance: '2.4 mi', status: 'Returned', color: '#bca786' },
  { id: 'tote', title: 'Navy canvas tote', kind: 'Found', category: 'Bags', location: 'Noe Valley', date: 'Mar 17', distance: '1.8 mi', status: 'Open', color: '#75879a' },
];

const categories = ['All', 'Electronics', 'Keys', 'Wallets', 'Bags'];
const demoSteps = [
  { label: 'Analyzing your image', detail: 'Looking for the visual fingerprint…', icon: ImagePlus },
  { label: 'Extracting visual features', detail: 'Shape, material, color, and the little things.', icon: Sparkles },
  { label: 'Comparing nearby reports', detail: 'Cross-referencing 1,842 community reports.', icon: Layers3 },
  { label: 'Checking neighborhood finds', detail: 'Searching within your safe radius.', icon: MapPin },
];

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <a href="#top" data-testid="link-logo" className="flex items-center gap-3 group">
      <span className={`relative grid h-9 w-9 place-items-center rounded-xl ${inverse ? 'bg-primary' : 'bg-[#12344a]'} text-[#f8f4e9] shadow-sm`}>
        <Radar size={19} strokeWidth={2.1} />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#ffab5e] ring-2 ring-background" />
      </span>
      <span className={`display text-[1.22rem] font-bold tracking-[-.06em] ${inverse ? 'text-[#f8f4e9]' : 'text-[#12344a]'}`}>LOSTLY<span className="text-[#dc9559]">.</span>AI</span>
    </a>
  );
}

function Pill({ children, tone = 'mint' }: { children: ReactNode; tone?: 'mint' | 'amber' | 'navy' }) {
  const styles = { mint: 'bg-[#d9eee8] text-[#0c695d]', amber: 'bg-[#ffe2bc] text-[#81491e]', navy: 'bg-[#dce5ea] text-[#234257]' };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 eyebrow font-medium ${styles[tone]}`}>{children}</span>;
}

function Button({ children, onClick, variant = 'primary', className = '', type = 'button', testId }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'soft' | 'ghost' | 'dark'; className?: string; type?: 'button' | 'submit'; testId?: string }) {
  const styles = {
    primary: 'bg-[#0e796b] text-[#fbf7ea] shadow-[0_10px_26px_rgba(14,121,107,.18)] hover:bg-[#096457]',
    soft: 'bg-[#f4e4cf] text-[#273c4d] hover:bg-[#f0d9bd]',
    ghost: 'border border-[#bfd0d0] text-[#234257] hover:bg-[#e5f0ec]',
    dark: 'bg-[#17394c] text-[#fbf7ea] hover:bg-[#0e2d3f]',
  };
  return <button type={type} onClick={onClick} data-testid={testId} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${styles[variant]} ${className}`}>{children}</button>;
}

function Header({ onReport }: { onReport: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="absolute left-0 right-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" data-testid="link-how-it-works" className="text-sm font-semibold text-[#456072] transition-colors hover:text-[#0e796b]">How it works</a>
          <a href="#live-demo" data-testid="link-live-demo" className="text-sm font-semibold text-[#456072] transition-colors hover:text-[#0e796b]">Live demo</a>
          <a href="#community" data-testid="link-community" className="text-sm font-semibold text-[#456072] transition-colors hover:text-[#0e796b]">Community map</a>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href="#my-items" data-testid="link-sign-in" className="px-4 text-sm font-bold text-[#234257] hover:text-[#0e796b]">My items</a>
          <Button onClick={onReport} variant="dark" testId="button-report-header">Report an item <ArrowRight size={16} /></Button>
        </div>
        <button className="rounded-xl p-2 text-[#17394c] md:hidden" onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu" aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
      </div>
      {menuOpen && <div className="mx-5 rounded-2xl border border-[#cfdfdc] bg-[#f8f4e9]/95 p-4 shadow-xl backdrop-blur md:hidden">
        <div className="grid gap-3 text-sm font-bold text-[#234257]">
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} data-testid="mobile-link-how-it-works">How it works</a>
          <a href="#live-demo" onClick={() => setMenuOpen(false)} data-testid="mobile-link-live-demo">Live demo</a>
          <a href="#community" onClick={() => setMenuOpen(false)} data-testid="mobile-link-community">Community map</a>
          <Button onClick={() => { setMenuOpen(false); onReport(); }} testId="button-mobile-report">Report an item</Button>
        </div>
      </div>}
    </header>
  );
}

function Hero({ onReport, onDemo }: { onReport: () => void; onDemo: () => void }) {
  return <section id="top" className="relative overflow-hidden bg-[#f8f4e9]">
    <div className="absolute -right-24 top-[-150px] h-[570px] w-[570px] rounded-full bg-[#cde8e1] opacity-60 blur-3xl" />
    <div className="absolute -left-24 bottom-[-210px] h-[450px] w-[450px] rounded-full bg-[#f6d7ab] opacity-40 blur-3xl" />
    <Header onReport={onReport} />
    <div className="relative mx-auto grid min-h-[750px] max-w-[1240px] items-center gap-12 px-5 pb-20 pt-32 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:pb-24 lg:pt-36">
      <div className="animate-reveal max-w-2xl">
        <div className="mb-7 flex items-center gap-3"><Pill>Hyper-local recovery network</Pill><span className="eyebrow text-[#728995]">SF / live prototype</span></div>
        <h1 className="display max-w-3xl text-[clamp(3.5rem,7vw,6.9rem)] font-semibold leading-[.92] text-[#17394c]">Lost it.<br /><span className="text-[#0e796b]">Show it.</span><br />Find it.</h1>
        <p className="mt-8 max-w-lg text-lg leading-8 text-[#4f6974]">LOSTLY AI turns a quick photo into a trusted path home — connecting visual clues, neighborhood signals, and real human kindness.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onDemo} testId="button-try-live-demo">Try the live demo <ArrowRight size={17} /></Button>
          <Button onClick={onReport} variant="soft" testId="button-report-hero">Report something lost <Upload size={17} /></Button>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-[#71858b]">
          <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#0e796b]" /> Ownership-first by design</span>
          <span className="flex items-center gap-2"><MapPin size={16} className="text-[#0e796b]" /> Built for your neighborhood</span>
        </div>
      </div>
      <HeroVisual onDemo={onDemo} />
    </div>
    <div className="relative border-t border-[#dbe5df] bg-[#f3eee2]/70">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-5 px-5 py-5 lg:px-8">
        <span className="eyebrow text-[#829294]">A better way home</span>
         <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-[#4d6872]"><span><strong className="text-[#17394c]">Faster</strong> search time</span><span><strong className="text-[#17394c]">Fewer</strong> fragmented reports</span><span><strong className="text-[#17394c]">Safer</strong> handoffs</span></div>
      </div>
    </div>
  </section>;
}

function HeroVisual({ onDemo }: { onDemo: () => void }) {
  return <div className="relative mx-auto w-full max-w-[590px] animate-drift">
    <div className="absolute -left-8 top-14 z-10 hidden rounded-2xl border border-[#cfdfdc] bg-[#fbf8ef]/90 p-4 shadow-lg backdrop-blur sm:block">
      <div className="flex items-center gap-2 text-xs font-bold text-[#0e796b]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#0e796b]" /> 3 nearby signals found</div><p className="mt-1 text-xs text-[#6f8185]">Updated moments ago</p>
    </div>
    <div className="relative aspect-[.9] overflow-hidden rounded-[2.2rem] border border-[#bad5d0] bg-[#123d4e] p-5 shadow-[0_30px_80px_rgba(20,57,72,.2)] sm:aspect-[1.05] sm:p-7">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 70% 18%, #2a766b 0, transparent 34%), radial-gradient(circle at 12% 95%, #d58f5f 0, transparent 35%)' }} />
      <div className="relative flex items-center justify-between text-[#cde8e1]"><span className="eyebrow">Recovery signal / 001</span><span className="flex items-center gap-2 text-xs"><span className="h-2 w-2 rounded-full bg-[#ffab5e]" /> live</span></div>
      <div className="relative mt-7 grid h-[calc(100%-54px)] place-items-center overflow-hidden rounded-[1.4rem] border border-[#8cbab3]/30 bg-[#133648]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#cde8e1 1px,transparent 1px),linear-gradient(90deg,#cde8e1 1px,transparent 1px)', backgroundSize: '42px 42px' }} />
        <div className="relative grid h-52 w-52 place-items-center rounded-full border border-[#70c5b1]/35"><div className="absolute h-36 w-36 rounded-full border border-[#70c5b1]/40" /><div className="absolute h-20 w-20 rounded-full border border-[#70c5b1]/50" /><div className="h-4 w-4 animate-pulse-soft rounded-full bg-[#ffab5e]" /><div className="absolute left-5 top-10 h-3 w-3 rounded-full bg-[#70c5b1]" /><div className="absolute right-6 top-20 h-3 w-3 rounded-full bg-[#f2c27e]" /><div className="absolute bottom-12 left-16 h-3 w-3 rounded-full bg-[#70c5b1]" /></div>
        <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-[#cde8e1]/20 bg-[#103042]/80 p-3 backdrop-blur"><div className="flex justify-between text-xs text-[#b7d9d1]"><span>Visual fingerprint</span><strong className="text-[#f6d7ab]">94% potential match</strong></div><div className="mt-2 h-1.5 rounded-full bg-[#365863]"><div className="h-full w-[94%] rounded-full bg-[#ffab5e]" /></div></div>
      </div>
      <button onClick={onDemo} data-testid="button-hero-visual-demo" className="absolute bottom-10 right-10 flex items-center gap-2 rounded-full bg-[#f8f4e9] px-4 py-2 text-xs font-extrabold text-[#17394c] shadow-xl transition-transform hover:scale-105"><Sparkles size={14} className="text-[#0e796b]" /> See it think</button>
    </div>
  </div>;
}

function Demo({ stage, setStage, onReport }: { stage: number; setStage: (stage: number) => void; onReport: () => void }) {
  const active = stage > 0 && stage < 7;
  const reset = () => setStage(0);
  const start = () => setStage(1);
  useEffect(() => {
    if (stage >= 1 && stage <= 4) {
      const timer = window.setTimeout(() => setStage(stage + 1), 950);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [stage, setStage]);
  return <section id="live-demo" className="relative overflow-hidden bg-[#17394c] py-24 text-[#f8f4e9]">
    <div className="absolute right-0 top-0 h-full w-1/2 opacity-20" style={{ background: 'radial-gradient(circle at 70% 25%, #70c5b1 0, transparent 35%), radial-gradient(circle at 30% 85%, #e69e65 0, transparent 25%)' }} />
    <div className="relative mx-auto max-w-[1240px] px-5 lg:px-8">
      <div className="mb-12 grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
        <div><Pill tone="amber">The moment it clicks</Pill><h2 className="display mt-5 text-4xl font-semibold leading-[.98] sm:text-6xl">Watch a clue<br /><span className="text-[#70c5b1]">become a lead.</span></h2></div>
        <div className="max-w-md lg:justify-self-end"><p className="leading-7 text-[#b7d0cc]">A one-click walkthrough with local sample data. No account, no upload, no waiting — just the product thinking out loud.</p><button onClick={stage === 0 || stage === 7 ? (stage === 7 ? reset : start) : undefined} disabled={active} data-testid="button-run-demo" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#ffbd7e] disabled:cursor-wait disabled:opacity-60">{stage === 0 ? 'Run live demo' : stage === 7 ? 'Run it again' : 'Analyzing your clue…'} <ArrowRight size={16} /></button></div>
      </div>
      <div className="grid overflow-hidden rounded-[2rem] border border-[#416271] bg-[#102f40] shadow-2xl lg:grid-cols-[.8fr_1.2fr]">
        <div className="relative min-h-[420px] border-b border-[#416271] p-6 sm:p-9 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between"><span className="eyebrow text-[#8fbab2]">Live inference</span><span className="flex items-center gap-2 text-xs text-[#8fbab2]"><span className={`h-2 w-2 rounded-full ${stage > 0 && stage < 7 ? 'animate-pulse bg-[#ffab5e]' : 'bg-[#55717b]'}`} /> {stage > 0 && stage < 7 ? 'processing' : 'ready'}</span></div>
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#4b7180] bg-[#214859]">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(135deg, transparent 48%, #cde8e1 49%, transparent 50%)', backgroundSize: '24px 24px' }} />
            <div className="relative grid min-h-[230px] place-items-center">
              <div className="relative h-36 w-36 rotate-[-7deg] rounded-[2rem] bg-[#d49870] shadow-[16px_18px_0_#925e49]"><div className="absolute inset-3 rounded-[1.4rem] border-2 border-[#f2c89d]/60" /><div className="absolute bottom-6 left-7 h-4 w-12 rounded bg-[#925e49]/60" /><div className="absolute right-6 top-6 h-7 w-7 rounded-full border-2 border-[#f2c89d]" /></div>
              {stage > 0 && stage < 5 && <div className="animate-scan absolute left-0 right-0 h-1 bg-[#ffab5e] shadow-[0_0_18px_#ffab5e]" />}
              <span className="absolute bottom-3 left-3 rounded-full bg-[#123646]/80 px-2 py-1 text-[10px] text-[#b7d9d1]">sample / camera</span>
            </div>
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#17394c] p-3 text-xs text-[#b7d0cc]"><Info size={15} className="mt-0.5 shrink-0 text-[#ffbd7e]" /><span>Images are processed for visual features, then discarded. Your private details stay yours.</span></div>
        </div>
        <div className="p-6 sm:p-9">
          <div className="mb-7 flex items-center justify-between"><span className="eyebrow text-[#8fbab2]">Signal path</span><span className="font-mono text-xs text-[#8fbab2]">{stage === 0 ? '00' : stage === 7 ? '04' : `0${Math.min(stage, 4)}`} / 04</span></div>
          <div className="space-y-4">
            {demoSteps.map((step, index) => { const Icon = step.icon; const complete = stage > index + 1 || stage === 7; const current = stage === index + 1; return <div key={step.label} className={`flex gap-4 rounded-2xl border p-4 transition-all duration-500 ${current ? 'border-[#ffab5e]/70 bg-[#244e5b]' : complete ? 'border-[#4b8178] bg-[#1b4350]' : 'border-[#2c5362] bg-transparent'}`}><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${complete ? 'bg-[#0e796b] text-[#e1f4ee]' : current ? 'bg-[#ffab5e] text-[#17394c]' : 'bg-[#234959] text-[#8fbab2]'}`}>{complete ? <Check size={18} /> : <Icon size={18} className={current ? 'animate-pulse' : ''} />}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><strong className="text-sm">{step.label}</strong>{complete && <span className="eyebrow text-[#70c5b1]">done</span>}{current && <span className="eyebrow text-[#ffbd7e]">now</span>}</div><p className="mt-1 text-xs leading-5 text-[#91b4b0]">{step.detail}</p></div></div>; })}
          </div>
          {stage === 0 && <div className="mt-7 rounded-2xl border border-dashed border-[#557783] p-4 text-center text-sm text-[#a5c1bc]">Press “Run live demo” to see a potential match surface.</div>}
          {stage >= 5 && stage < 7 && <VerificationCard onVerify={() => setStage(7)} />}
          {stage === 7 && <VerifiedCard onReport={onReport} />}
        </div>
      </div>
    </div>
  </section>;
}

function VerificationCard({ onVerify }: { onVerify: () => void }) {
  const [feedback, setFeedback] = useState('');
  const incorrect = () => setFeedback('That detail does not line up. Look closely at the strap.');
  return <div className="animate-reveal mt-7 rounded-2xl border border-[#ffbd7e]/55 bg-[#3a4d4d] p-5"><div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#ffbd7e] text-[#17394c]"><KeyRound size={17} /></div><div><div className="text-sm font-extrabold">One ownership check</div><p className="mt-1 text-xs leading-5 text-[#c6d8d1]">What detail is visible on the camera strap?</p></div></div><div className="mt-4 grid gap-2 sm:grid-cols-3"><button onClick={onVerify} data-testid="button-answer-verification" className="rounded-xl border border-[#6a8a8a] bg-[#17394c] px-3 py-2 text-left text-xs font-semibold text-[#eaf4ed] hover:border-[#ffbd7e]">Woven red thread</button><button onClick={incorrect} data-testid="button-answer-wrong" className="rounded-xl border border-[#6a8a8a] bg-[#17394c] px-3 py-2 text-left text-xs font-semibold text-[#eaf4ed] hover:border-[#ffbd7e]">Silver buckle</button><button onClick={incorrect} data-testid="button-answer-wrong-alt" className="rounded-xl border border-[#6a8a8a] bg-[#17394c] px-3 py-2 text-left text-xs font-semibold text-[#eaf4ed] hover:border-[#ffbd7e]">Blue stitching</button></div>{feedback && <p role="status" data-testid="status-verification-feedback" className="mt-3 text-xs font-semibold text-[#ffbd7e]">{feedback}</p>}</div>;
}

function VerifiedCard({ onReport }: { onReport: () => void }) {
  return <div className="animate-reveal mt-7 rounded-2xl border border-[#70c5b1]/50 bg-[#1e554f] p-5"><div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#70c5b1] text-[#17394c]"><ShieldCheck size={18} /></div><div><div className="text-sm font-extrabold text-[#e6faf2]">Verified potential match</div><p className="mt-1 text-xs leading-5 text-[#bde0d5]">The finder’s detail matches. A safe connection is ready — neither person sees a private address.</p></div></div><div className="mt-4 flex flex-col gap-2 sm:flex-row"><button onClick={onReport} data-testid="button-connect-safely" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ffbd7e] px-4 py-2.5 text-xs font-extrabold text-[#17394c] hover:bg-[#ffd09e]"><MessageCircle size={15} /> Connect safely</button><span className="inline-flex items-center justify-center gap-2 px-2 text-xs text-[#bde0d5]"><LockKeyhole size={14} /> masked chat + public handoff points</span></div></div>;
}

function HowItWorks() {
  const features = [
    { number: '01', icon: ScanIcon, title: 'Show us the clue', copy: 'A photo or a few honest words are enough. LOSTLY notices the details you might forget to mention.' },
    { number: '02', icon: Radar, title: 'Let the neighborhood talk', copy: 'Visual similarity meets time, place, material, and distinctive features across nearby reports.' },
    { number: '03', icon: ShieldCheck, title: 'Verify before you connect', copy: 'Ownership questions protect both sides. Connect through masked chat and choose a safe handoff.' },
  ];
  return <section id="how-it-works" className="bg-[#f8f4e9] py-24">
    <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
      <div className="grid gap-9 lg:grid-cols-[.78fr_1.22fr]"><div><Pill>Designed for the anxious five minutes</Pill><h2 className="display mt-5 max-w-lg text-4xl font-semibold leading-[1] text-[#17394c] sm:text-6xl">Not a board.<br /><span className="text-[#0e796b]">A recovery signal.</span></h2></div><p className="max-w-md self-end text-base leading-7 text-[#5a717a]">Lostly combines the context a static listing misses. The result feels less like searching the internet and more like asking the right neighbors, at the right moment.</p></div>
      <div className="mt-16 grid gap-4 md:grid-cols-3">{features.map((feature, index) => { const Icon = feature.icon; return <div key={feature.number} className={`group relative overflow-hidden rounded-[1.6rem] border border-[#d2e0db] bg-[#fdfbf4] p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-lg ${index === 1 ? 'md:translate-y-8' : ''}`}><span className="eyebrow text-[#9ba8a4]">{feature.number}</span><div className="mt-12 grid h-12 w-12 place-items-center rounded-2xl bg-[#d9eee8] text-[#0e796b] transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"><Icon size={22} /></div><h3 className="mt-7 text-xl font-extrabold text-[#17394c]">{feature.title}</h3><p className="mt-3 text-sm leading-6 text-[#657a80]">{feature.copy}</p><ArrowDownRight size={20} className="absolute bottom-7 right-7 text-[#a5b8b2] transition-transform group-hover:translate-x-1 group-hover:translate-y-1" /></div>; })}</div>
    </div>
  </section>;
}

function ScanIcon({ size = 24 }: { size?: number }) {
  return <span className="relative block" style={{ width: size, height: size }}><span className="absolute inset-0 rounded-md border-2 border-current" /><span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current opacity-30" /><span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current opacity-30" /></span>;
}

function Community({ saved, setSaved, onReport }: { saved: string[]; setSaved: (saved: string[]) => void; onReport: () => void }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const filtered = items.filter(item => (category === 'All' || item.category === category) && item.title.toLowerCase().includes(query.toLowerCase()) && (!nearbyOnly || parseFloat(item.distance) < 1.5));
  return <section id="community" className="bg-[#e8f1ed] py-24">
    <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><Pill tone="navy">The neighborhood layer</Pill><h2 className="display mt-5 text-4xl font-semibold leading-none text-[#17394c] sm:text-6xl">Signals near<br /><span className="text-[#0e796b]">you.</span></h2></div><div className="max-w-sm text-sm leading-6 text-[#587078]">Browse the anonymized community pulse. Exact locations stay private until both people choose to connect.</div></div>
      <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="relative min-h-[500px] overflow-hidden rounded-[2rem] border border-[#c8dbd5] bg-[#cfe3da] shadow-sm">
          <div className="map-grid absolute inset-0 opacity-60" /><div className="absolute inset-0 opacity-50" style={{ background: 'linear-gradient(120deg, transparent 35%, #f5eedf 35.3% 37%, transparent 37.3%), linear-gradient(25deg, transparent 56%, #f5eedf 56.3% 60%, transparent 60.3%), linear-gradient(165deg, transparent 21%, #b4d4c9 21.3% 23%, transparent 23.3%)' }} />
          <div className="absolute left-[23%] top-[25%] animate-marker"><div className="relative grid h-10 w-10 place-items-center rounded-full rounded-bl-sm bg-[#0e796b] text-[#f8f4e9] shadow-lg"><PackageSearch size={18} /><span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#0e796b]" /></div></div>
          <div className="absolute left-[60%] top-[38%] animate-marker [animation-delay:.6s]"><div className="relative grid h-10 w-10 place-items-center rounded-full rounded-bl-sm bg-[#d88953] text-[#f8f4e9] shadow-lg"><Box size={18} /><span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#d88953]" /></div></div>
          <div className="absolute left-[42%] top-[66%] animate-marker [animation-delay:1.2s]"><div className="relative grid h-10 w-10 place-items-center rounded-full rounded-bl-sm bg-[#315d70] text-[#f8f4e9] shadow-lg"><KeyRound size={18} /><span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#315d70]" /></div></div>
          <div className="absolute bottom-5 left-5 rounded-2xl border border-[#c3d8d0] bg-[#f8f4e9]/90 p-4 shadow-lg backdrop-blur"><div className="flex items-center gap-2 text-xs font-extrabold text-[#17394c]"><span className="h-2 w-2 rounded-full bg-[#0e796b]" /> Mission District pulse</div><p className="mt-1 text-xs text-[#718386]">Last 24 hours · 18 signals</p></div>
          <div className="absolute right-5 top-5 rounded-xl border border-[#c3d8d0] bg-[#f8f4e9]/90 p-2 backdrop-blur"><button onClick={() => setNearbyOnly(!nearbyOnly)} data-testid="button-nearby-filter" className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${nearbyOnly ? 'bg-[#d9eee8] text-[#0e796b]' : 'text-[#4e6971]'}`}><Navigation size={14} /> {nearbyOnly ? 'Nearby only' : 'All signals'}</button></div>
        </div>
        <div className="rounded-[2rem] border border-[#c8dbd5] bg-[#f8f4e9] p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between"><div><span className="eyebrow text-[#839794]">Community reports</span><h3 className="mt-2 text-2xl font-extrabold text-[#17394c]">Find a signal</h3></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d9eee8] text-[#0e796b]"><Compass size={19} /></span></div>
          <div className="relative mt-6"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ca09d]" size={16} /><input value={query} onChange={e => setQuery(e.target.value)} data-testid="input-search-community" placeholder="Search an item or material" className="h-11 w-full rounded-xl border border-[#ccddd7] bg-[#fffdf6] pl-10 pr-3 text-sm outline-none transition focus:border-[#0e796b] focus:ring-2 focus:ring-[#0e796b]/15" /></div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{categories.map(value => <button key={value} onClick={() => setCategory(value)} data-testid={`button-category-${value.toLowerCase()}`} className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold transition ${category === value ? 'bg-[#17394c] text-[#f8f4e9]' : 'bg-[#e8f1ed] text-[#4c6a71] hover:bg-[#d9eee8]'}`}>{value}</button>)}</div>
          <div className="mt-5 space-y-3">{filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[#c6d9d3] p-8 text-center"><CircleHelp className="mx-auto text-[#8ba29e]" size={26} /><p className="mt-3 text-sm font-bold text-[#45636b]">No signals yet</p><p className="mt-1 text-xs text-[#7b8c8f]">Try another filter or report your item.</p><button onClick={onReport} data-testid="button-empty-community-report" className="mt-4 text-xs font-extrabold text-[#0e796b]">Create a report <ArrowRight size={13} className="inline" /></button></div> : filtered.map(item => <ReportRow key={item.id} item={item} saved={saved.includes(item.id)} onSave={() => setSaved(saved.includes(item.id) ? saved.filter(id => id !== item.id) : [...saved, item.id])} />)}</div>
          <div className="mt-5 flex items-center gap-2 border-t border-[#d9e5df] pt-5 text-xs text-[#708487]"><Eye size={14} /> Exact addresses never appear on the map.</div>
        </div>
      </div>
    </div>
  </section>;
}

function ReportRow({ item, saved, onSave }: { item: Item; saved: boolean; onSave: () => void }) {
  return <div data-testid={`card-community-${item.id}`} className="group flex items-center gap-3 rounded-2xl border border-[#d8e5df] bg-[#fffdf6] p-3 transition hover:border-[#9fc9be]"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-[#17394c]" style={{ backgroundColor: item.color }}><Box size={19} /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${item.kind === 'Lost' ? 'bg-[#dc795c]' : 'bg-[#0e796b]'}`} /><span className="eyebrow text-[#718486]">{item.kind} · {item.category}</span></div><h4 className="mt-1 truncate text-sm font-extrabold text-[#294856]">{item.title}</h4><p className="mt-1 flex items-center gap-1 text-xs text-[#859497]"><MapPin size={12} /> {item.location} · {item.distance}</p></div><button onClick={onSave} data-testid={`button-save-${item.id}`} aria-label={`Save ${item.title}`} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${saved ? 'bg-[#ffe2bc] text-[#81491e]' : 'text-[#8aa09c] hover:bg-[#e8f1ed] hover:text-[#0e796b]'}`}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /></button></div>;
}

function MyItems({ onReport, saved }: { onReport: () => void; saved: string[] }) {
  const [alertsOn, setAlertsOn] = useState(true);
  return <section id="my-items" className="bg-[#f8f4e9] py-24"><div className="mx-auto max-w-[1240px] px-5 lg:px-8"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><Pill tone="amber">Your recovery desk</Pill><h2 className="display mt-5 text-4xl font-semibold leading-none text-[#17394c] sm:text-6xl">Keep hope<br /><span className="text-[#d88953]">in view.</span></h2></div><Button onClick={onReport} variant="ghost" testId="button-report-dashboard"><Plus size={17} /> New report</Button></div>
    <div className="mt-12 grid gap-4 md:grid-cols-3"><div className="rounded-[1.5rem] bg-[#17394c] p-6 text-[#f8f4e9] shadow-lg"><div className="flex items-center justify-between"><span className="eyebrow text-[#9bc6bb]">Active searches</span><Radar size={19} className="text-[#70c5b1]" /></div><div className="mt-8 text-5xl font-bold">2</div><p className="mt-2 text-sm text-[#a9c4be]">A camera and keys are still looking for you.</p></div><div className="rounded-[1.5rem] border border-[#d7e3dd] bg-[#fffdf6] p-6"><div className="flex items-center justify-between"><span className="eyebrow text-[#839794]">Potential matches</span><Flame size={19} className="text-[#d88953]" /></div><div className="mt-8 text-5xl font-bold text-[#17394c]">1</div><p className="mt-2 text-sm text-[#718386]">A 94% match is ready for verification.</p></div><div className="rounded-[1.5rem] border border-[#d7e3dd] bg-[#fffdf6] p-6"><div className="flex items-center justify-between"><span className="eyebrow text-[#839794]">Saved signals</span><Bookmark size={19} className="text-[#0e796b]" /></div><div className="mt-8 text-5xl font-bold text-[#17394c]">{saved.length}</div><p className="mt-2 text-sm text-[#718386]">Neighbors you want to keep an eye on.</p></div></div>
    <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[#d7e3dd] bg-[#fffdf6]"><div className="flex items-center justify-between border-b border-[#d7e3dd] p-5 sm:p-6"><div><h3 className="text-lg font-extrabold text-[#17394c]">My reports</h3><p className="mt-1 text-xs text-[#718386]">Private to you · updated just now</p></div><button onClick={() => setAlertsOn(!alertsOn)} data-testid="button-notification-settings" className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${alertsOn ? 'bg-[#e8f1ed] text-[#0e796b]' : 'bg-[#f1e8dc] text-[#8a6549]'}`}><Bell size={14} /> Alerts {alertsOn ? 'on' : 'off'}</button></div><div className="divide-y divide-[#e4ebe5]">{items.slice(0, 3).map(item => <div key={item.id} data-testid={`row-my-item-${item.id}`} className="flex flex-wrap items-center gap-3 p-5 sm:px-6"><div className="grid h-11 w-11 place-items-center rounded-xl text-[#17394c]" style={{ backgroundColor: item.color }}><PackageSearch size={18} /></div><div className="min-w-[160px] flex-1"><div className="text-sm font-extrabold text-[#294856]">{item.title}</div><div className="mt-1 flex items-center gap-2 text-xs text-[#879697]"><Clock3 size={12} /> {item.date} · {item.location}</div></div><Pill tone={item.status === 'Returned' ? 'mint' : 'amber'}>{item.status}</Pill><span className="text-xs font-bold text-[#718486]">{item.distance}</span><ChevronDown size={16} className="rotate-[-90deg] text-[#a0afaa]" /></div>)}</div></div>
  </div></section>;
}

function Trust() {
  return <section className="bg-[#17394c] py-24 text-[#f8f4e9]"><div className="mx-auto max-w-[1240px] px-5 lg:px-8"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><Pill tone="amber">Human safety, always</Pill><h2 className="display mt-5 text-4xl font-semibold leading-[.98] sm:text-6xl">A connection<br /><span className="text-[#70c5b1]">you can trust.</span></h2><p className="mt-7 max-w-sm leading-7 text-[#b8d0ca]">AI can spot the possibility. People decide what happens next. LOSTLY keeps that next step small, private, and safe.</p></div><div className="grid gap-3 sm:grid-cols-2"><TrustItem icon={LockKeyhole} title="Private by default" copy="Precise locations and personal details stay masked until both sides consent." /><TrustItem icon={ShieldCheck} title="Ownership verification" copy="Distinctive details create a shared proof point before a conversation opens." /><TrustItem icon={Landmark} title="Safe handoff points" copy="Choose public, well-lit partner locations for the moment your item comes home." /><TrustItem icon={HeartHandshake} title="Human in the loop" copy="Every match is a possibility, never a verdict. You stay in control." /></div></div><div className="mt-16 flex flex-col justify-between gap-5 border-t border-[#3c5d69] pt-6 text-xs text-[#9ab8b1] sm:flex-row"><span className="flex items-center gap-2"><Sparkles size={14} className="text-[#ffbd7e]" /> Built with care for the technology competition</span><span className="font-mono">LOSTLY / TRUST PROTOCOL 01</span></div></div></section>;
}

function TrustItem({ icon: Icon, title, copy }: { icon: typeof LockKeyhole; title: string; copy: string }) {
  return <div className="rounded-2xl border border-[#3c5d69] bg-[#1d4353] p-5 transition hover:-translate-y-1 hover:border-[#70c5b1]"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#315c66] text-[#70c5b1]"><Icon size={18} /></div><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#a6c3bd]">{copy}</p></div>;
}

function ReportModal({ onClose, onSubmitted }: { onClose: () => void; onSubmitted: () => void }) {
  const [kind, setKind] = useState<'Lost' | 'Found'>('Lost');
  const [submitted, setSubmitted] = useState(false);
  const [photoAdded, setPhotoAdded] = useState(false);
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); window.setTimeout(onSubmitted, 1200); };
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#112d3b]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div role="dialog" aria-modal="true" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] bg-[#f8f4e9] p-6 shadow-2xl sm:rounded-[2rem] sm:p-8"><div className="flex items-start justify-between"><div><Pill>{submitted ? 'Report received' : 'Start a recovery path'}</Pill><h2 className="display mt-4 text-3xl font-semibold text-[#17394c]">{submitted ? 'Your neighborhood is on it.' : 'Tell us what happened.'}</h2><p className="mt-2 text-sm leading-6 text-[#6e8284]">{submitted ? 'We’ll watch for signals and keep you posted. You can close this window anytime.' : 'The more specific the clue, the more useful the match.'}</p></div><button onClick={onClose} data-testid="button-close-report" aria-label="Close report form" className="rounded-full p-2 text-[#718486] hover:bg-[#e8f1ed]"><X size={19} /></button></div>{submitted ? <div className="my-12 grid place-items-center text-center"><div className="grid h-16 w-16 place-items-center rounded-full bg-[#d9eee8] text-[#0e796b]"><Check size={30} /></div><p className="mt-5 max-w-xs text-sm leading-6 text-[#587078]">Your report is private, searchable, and ready for safe matching.</p><Button onClick={onClose} className="mt-6" testId="button-close-success">Back to LOSTLY</Button></div> : <form onSubmit={submit} className="mt-7 space-y-5"><div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#e5eee9] p-1"><button type="button" onClick={() => setKind('Lost')} data-testid="button-report-lost" className={`rounded-xl py-3 text-sm font-extrabold transition ${kind === 'Lost' ? 'bg-[#17394c] text-[#f8f4e9] shadow' : 'text-[#637a7c]'}`}>I lost something</button><button type="button" onClick={() => setKind('Found')} data-testid="button-report-found" className={`rounded-xl py-3 text-sm font-extrabold transition ${kind === 'Found' ? 'bg-[#17394c] text-[#f8f4e9] shadow' : 'text-[#637a7c]'}`}>I found something</button></div><label className="block"><span className="mb-2 block text-xs font-bold text-[#45636b]">What is it?</span><input required data-testid="input-report-item" placeholder="e.g. silver camera with a woven red strap" className="h-12 w-full rounded-xl border border-[#cbdcd5] bg-[#fffdf6] px-4 text-sm outline-none focus:border-[#0e796b] focus:ring-2 focus:ring-[#0e796b]/15" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-xs font-bold text-[#45636b]">Where {kind.toLowerCase()}?</span><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea19f]" size={16} /><input required data-testid="input-report-location" placeholder="Neighborhood or landmark" className="h-12 w-full rounded-xl border border-[#cbdcd5] bg-[#fffdf6] pl-10 pr-3 text-sm outline-none focus:border-[#0e796b]" /></div></label><label className="block"><span className="mb-2 block text-xs font-bold text-[#45636b]">When?</span><div className="relative"><Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea19f]" size={16} /><input required type="date" data-testid="input-report-date" className="h-12 w-full rounded-xl border border-[#cbdcd5] bg-[#fffdf6] pl-10 pr-3 text-sm text-[#45636b] outline-none focus:border-[#0e796b]" /></div></label></div><div className="rounded-2xl border border-dashed border-[#b9d1ca] bg-[#eef5f0] p-4"><div className="flex gap-3"><CloudUpload size={19} className="text-[#0e796b]" /><div><div className="text-sm font-bold text-[#31545e]">{photoAdded ? 'Photo ready for visual matching' : 'Add a photo (recommended)'}</div><p className="mt-1 text-xs leading-5 text-[#718486]">{photoAdded ? 'Sample visual fingerprint attached. LOSTLY will use shape, color, and material.' : 'Drop a photo here or choose one from your device. This prototype uses a sample visual fingerprint.'}</p><button type="button" onClick={() => setPhotoAdded(!photoAdded)} data-testid="button-upload-photo" className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-[#0e796b]"><ImagePlus size={14} /> {photoAdded ? 'Replace photo' : 'Choose a photo'}</button></div></div></div><div className="flex items-center gap-2 text-xs text-[#75888a]"><LockKeyhole size={14} className="text-[#0e796b]" /> Your exact location stays private.</div><Button type="submit" className="w-full" testId="button-submit-report">Create {kind.toLowerCase()} report <ArrowRight size={17} /></Button></form>}</div></div>;
}

function Footer({ onReport }: { onReport: () => void }) {
  return <footer className="bg-[#f8f4e9] px-5 pb-10 pt-16 lg:px-8"><div className="mx-auto max-w-[1240px]"><div className="flex flex-col justify-between gap-8 border-b border-[#d6e1dc] pb-10 md:flex-row"><div><Logo /><p className="mt-4 max-w-xs text-sm leading-6 text-[#718486]">A smarter, kinder way to bring everyday things back home.</p></div><div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-bold text-[#4f6972]"><a href="#how-it-works" data-testid="footer-link-how">How it works</a><a href="#community" data-testid="footer-link-map">Community map</a><button onClick={onReport} data-testid="footer-button-report">Report an item</button><a href="#top" data-testid="footer-link-top">Back to top</a></div></div><div className="flex flex-col justify-between gap-3 pt-6 text-xs text-[#8b9a99] sm:flex-row"><span>© 2025 LOSTLY AI · Made for the moments that matter.</span><span className="flex items-center gap-2"><LockKeyhole size={12} /> Privacy-first recovery</span></div></div></footer>;
}

function Home() {
  const [stage, setStage] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>(['wallet']);
  const [toast, setToast] = useState('');
  const openReport = () => setReportOpen(true);
  const openDemo = () => { setStage(1); window.setTimeout(() => document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' }), 30); };
  const submitted = () => { setToast('Report created — your recovery path is live.'); window.setTimeout(() => setReportOpen(false), 900); };
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 3500); return () => window.clearTimeout(timer); }, [toast]);
  return <div className="noise min-h-dvh overflow-x-hidden bg-[#f8f4e9]">
    <Hero onReport={openReport} onDemo={openDemo} />
    <HowItWorks />
    <Demo stage={stage} setStage={setStage} onReport={openReport} />
    <Community saved={saved} setSaved={setSaved} onReport={openReport} />
    <MyItems onReport={openReport} saved={saved} />
    <Trust />
    <Footer onReport={openReport} />
    {reportOpen && <ReportModal onClose={() => setReportOpen(false)} onSubmitted={submitted} />}
    {toast && <div role="status" data-testid="status-toast" className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#17394c] px-5 py-3 text-sm font-bold text-[#f8f4e9] shadow-2xl animate-reveal"><Check size={16} className="text-[#70c5b1]" /> {toast}</div>}
  </div>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><Router /></RoutedErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;