import { Outlet } from "react-router-dom";
import { useState, useEffect } from 'react'
import { fetchVendingMachineAppearance } from "./api/dispenser";

import styles from './styles.module.scss'
import classNames from "classnames";

function App() {
  const [bgColor, setBgColor] = useState('#cffafe')

  useEffect(() => {
    fetchVendingMachineAppearanceData()
  }, [])

  const fetchVendingMachineAppearanceData = async () => {
    const { background_color } = await fetchVendingMachineAppearance()

    setBgColor(background_color)
  }

  // Base layout
  return (
    <div
      className={classNames(styles.wrapperClass)}
      style={{ backgroundColor: bgColor }}
      // style={{ backgroundImage: "url('')" }} // Set background image
    >
      <div className="h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
