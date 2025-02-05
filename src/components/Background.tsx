export const Background = ({
  backgroundMedia,
  backgroundColor
}: {
  backgroundMedia: string
  backgroundColor: string
}) => {
  if (backgroundMedia) {
    return (
      <img
        className="absolute left-0 top-0 size-full object-cover"
        src={backgroundMedia}
      />
    );
  } else {
    return (
      <div
        className="absolute left-0 top-0 size-full"
        style={{ backgroundColor: backgroundColor }}
      />
    );
  }
};
