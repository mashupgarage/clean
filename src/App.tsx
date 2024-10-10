import { Outlet } from "react-router-dom";

function App() {
  // Base layout
  return (
    <div
      className="max-h-s max-h-screen min-h-screen bg-cyan-100 bg-cover"
      // style={{ backgroundImage: "url('')" }} // Set background image
    >
      <div className="h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
