import { useNavigate } from "react-router-dom";

const IDLE_PAGE_HEADER = {
  line1: "Order Coffee",
  line2: "Tap to Begin",
};

export const IdlePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen">
      <img
        className="absolute left-0 top-0 size-full object-cover"
        src="/media/coffee-placeholder.gif"
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center text-white"
        onClick={() => navigate("/item")}
      >
        <div className="rounded-lg bg-transparent p-12 opacity-95">
          <h1 className="text-8xl font-extrabold">{IDLE_PAGE_HEADER.line1}</h1>
          <p className="mt-4 text-3xl font-bold">{IDLE_PAGE_HEADER.line2}</p>
        </div>
      </div>

      {/* <div className="absolute bottom-24 flex w-full justify-center">
        <button className="flex flex-row items-center justify-center rounded-full border-2 border-white bg-slate-600/15 px-20 py-4 text-2xl font-bold text-white">
          <img className="mr-3 h-6" src="/media/globe-icon.png" />
          Language options
        </button>
      </div> */}
    </div>
  );
};
