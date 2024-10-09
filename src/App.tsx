import { Outlet } from "react-router-dom";

function App() {
  // Base layout
  return (
    <div
      className="min-h-screen max-h-screenbg-cover bg-cyan-100"
      // style={{ backgroundImage: "url('')" }} // Set background image
    >
      <div className="h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
