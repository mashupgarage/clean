import { useNavigate } from "react-router-dom";

const IDLE_PAGE_HEADER = {
  line1: "Order Coffee",
  line2: "Tap to Begin",
};

export const IdlePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen">
      <video
        className="absolute left-0 top-0 size-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="http://localhost:5173/media/coffee-placeholder.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center text-white"
        onClick={() => navigate("/item")}
      >
        <div className="rounded-lg bg-transparent p-12 opacity-95">
          <h1 className="text-8xl font-extrabold">{IDLE_PAGE_HEADER.line1}</h1>
          <p className="mt-4 text-3xl font-bold">{IDLE_PAGE_HEADER.line2}</p>
        </div>
      </div>

      <div className="absolute bottom-10 flex w-full justify-center">
        <button className="rounded-full border-2 border-white bg-transparent px-20 py-4 text-2xl font-bold text-white">
          Language options
        </button>
      </div>
    </div>
  );
};
