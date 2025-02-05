import { useNavigate } from "react-router-dom";
import { VendingMachineAppearance } from "../types/vendingMachineAppearance";
import { Background } from "../components/Background";

export const IdlePage = ({
  appearanceData,
}: {
  appearanceData: VendingMachineAppearance;
}) => {
  const navigate = useNavigate();

  const {
    idle_background_color,
    idle_background_image,
    idle_video,
    idle_video_toggle,
    idle_title,
    idle_subtitle,
    idle_font_style,
    idle_text_color,
  } = appearanceData;

  const backgroundMedia =
    idle_video && idle_video_toggle ? idle_video : idle_background_image;

  return (
    <div className="h-screen w-screen">
      <Background
        {...{ backgroundMedia, backgroundColor: idle_background_color }}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center text-white"
        onClick={() => navigate("/item")}
      >
        <div className="rounded-lg bg-transparent p-12 opacity-95">
          <h1
            className="text-8xl font-extrabold"
            style={{ fontFamily: idle_font_style, color: idle_text_color }}
          >
            {idle_title}
          </h1>
          <p
            className="mt-4 text-3xl font-bold"
            style={{ fontFamily: idle_font_style, color: idle_text_color }}
          >
            {idle_subtitle}
          </p>
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
