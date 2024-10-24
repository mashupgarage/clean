export const ImgButton = ({
  onClick,
  imageSrc,
  containerTWClass,
  imageTWClass,
}: {
  onClick: () => void;
  imageSrc: string;
  containerTWClass?: string;
  imageTWClass?: string;
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative m-10 flex h-4/5 w-1/3 justify-center rounded-3xl bg-white ${containerTWClass || ""}`}
    >
      <img
        className={`size-full object-contain ${imageTWClass || ""}`}
        src={imageSrc}
      />
    </div>
  );
};
