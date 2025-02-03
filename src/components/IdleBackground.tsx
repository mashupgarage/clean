export const IdleBackground = ({
  idle_background_color,
  idle_background_image,
  idle_video,
  idle_video_toggle
}: {
  idle_background_color: string;
  idle_background_image: string;
  idle_video: string;
  idle_video_toggle: boolean;
}) => {
  const background = idle_video && idle_video_toggle ? idle_video : idle_background_image

  if (background) {
    return (
      <img
        className="absolute left-0 top-0 size-full object-cover"
        src={background}
      />
    );
  } else {
    return (
      <div
        className="absolute left-0 top-0 size-full"
        style={{ backgroundColor: idle_background_color }}
      />
    );
  }
};
