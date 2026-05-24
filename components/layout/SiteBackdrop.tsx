export default function SiteBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fffef9_0%,#f6f3ea_42%,#edf4ef_100%)]" />
      <div className="absolute left-[-10%] top-[-10%] h-[44rem] w-[44rem] animate-[drift_24s_ease-in-out_infinite_alternate] rounded-full bg-emerald-400/24 blur-3xl" />
      <div className="absolute right-[-12%] top-[8%] h-[38rem] w-[38rem] animate-[drift_28s_ease-in-out_infinite_alternate] rounded-full bg-cyan-400/16 blur-3xl" />
      <div className="absolute bottom-[-16%] left-[16%] h-[38rem] w-[38rem] animate-[drift_32s_ease-in-out_infinite_alternate] rounded-full bg-amber-300/18 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.05),transparent_30%),radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_62%)]" />
      <div className="absolute inset-0 animate-[grid-pan_30s_linear_infinite] bg-[linear-gradient(to_right,rgba(15,23,42,0.065)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.065)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_72%_62%_at_50%_20%,#000_72%,transparent_100%)] opacity-55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.1)_52%,rgba(255,255,255,0.35)_100%)]" />
    </div>
  );
}
