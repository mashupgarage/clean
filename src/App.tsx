import { Outlet } from "react-router-dom";

function App() {
  // Base layout
  document.addEventListener("contextmenu", (event) => event.preventDefault());

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
