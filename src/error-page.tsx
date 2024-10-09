import { useRouteError } from "react-router-dom";
export const ErrorPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = useRouteError();
  console.error(error);

  return (
    <div
      id="error-page"
      className="min-h-screen bg-red-100 flex items-center justify-center"
    >
      <div className="text-center p-10 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Sorry, an unexpected error has occurred
        </h1>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <a href="/" className="mt-6 inline-block text-blue-500 hover:underline">
          Go back to homepage
        </a>
      </div>
    </div>
  );
};
