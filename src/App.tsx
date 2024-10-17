import { Outlet } from "react-router-dom";
import { useState, useEffect } from 'react'
import { fetchVendingMachineAppearance } from "./api/dispenser";

import styles from './styles.module.scss'
import classNames from "classnames";

function App() {
  const [bgColor, setBgColor] = useState('#cffafe')
  const [bgImage, setBgImage] = useState('')
  const [fontFamily, setFontFamily] = useState('')

  useEffect(() => {
    fetchVendingMachineAppearanceData()
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', fontFamily)
  }, [fontFamily])

  const fetchVendingMachineAppearanceData = async () => {
    const { background_color, background_image, font_name } = await fetchVendingMachineAppearance()
    setBgColor(background_color)
    setBgImage(background_image)
    setFontFamily(font_name)
  }

  // Base layout
  return (
    <div
      className={classNames(styles.wrapperClass)}
      style={{ backgroundImage: `url(${bgImage})`, backgroundColor: bgColor }}
    >
      <div className="h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
