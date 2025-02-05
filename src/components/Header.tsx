export const Header = ({ title, fontStyle }: { title: string, fontStyle: string }) => {
  const Title = ({ label, fontStyle }: { label: string, fontStyle: string }) => {
    return <div className="rounded-3xl text-6xl font-extrabold" style={{ fontFamily: fontStyle }}>{label}</div>;
  };

  return (
    <div className="mx-auto mt-16 flex flex-col">
      <Title {...{fontStyle}} label={title} />
    </div>
  );
};
