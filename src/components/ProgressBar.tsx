import "../index.css";

export const ProgressBar = ({ duration }: { duration: number }) => {
  return (
    <div className="mx-5 h-6 w-[650px] overflow-hidden rounded-xl bg-slate-200 shadow-inner">
      <div
        className="size-full rounded-xl bg-emerald-600"
        style={{
          animation: `progressBarAnimation ${duration}s linear forwards`,
        }}
      />
    </div>
  );
};
