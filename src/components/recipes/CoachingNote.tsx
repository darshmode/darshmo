export default function CoachingNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-[#E8862B] pl-5 py-1">
      <div className="font-heading text-xs tracking-widest text-[#E8862B] uppercase mb-1.5">Coaching note</div>
      <p className="font-body text-fg leading-relaxed">{children}</p>
    </div>
  );
}
