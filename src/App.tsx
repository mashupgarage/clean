import { Outlet } from "react-router-dom";

function App() {
  // Base layout
  return (
    <div
      className="max-h-screen min-h-screen bg-cover"
      // style={{ backgroundImage: "url('')" }} // Set background image
    >
      <Outlet />
    </div>
  );
}

export default App;
