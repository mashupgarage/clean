export const Header = ({ title }: { title: string }) => {
  const Title = ({ label }: { label: string }) => {
    return <div className="rounded-3xl text-6xl font-extrabold">{label}</div>;
  };

  return (
    <div className="mx-auto mt-16 flex flex-col">
      <Title label={title} />
    </div>
  );
};
