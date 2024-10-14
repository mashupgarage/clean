export const Header = ({ line1, line2 }: { line1: string; line2?: string }) => {
  const Title = ({ label }: { label: string }) => {
    return (
      <div className="m-auto rounded-3xl bg-black px-4 py-2 text-5xl font-bold">
        <div className="m-auto uppercase text-white">{label}</div>
      </div>
    );
  };

  return (
    <div className="mt-6 flex flex-col">
      <Title label={line1} />
      {line2 && <Title label={line2} />}
    </div>
  );
};
