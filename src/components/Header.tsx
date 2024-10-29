export const Header = ({ title }: { title: string }) => {
  const Title = ({ label }: { label: string }) => {
    return (
      <div className="m-auto rounded-3xl px-4 py-2 text-5xl font-extrabold">
        <div className="m-auto">{label}</div>
      </div>
    );
  };

  return (
    <div className="mt-6 flex flex-col">
      <Title label={title} />
    </div>
  );
};
