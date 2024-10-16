import styles from './styles.module.scss'
import { useState, useEffect } from 'react'
import { Outlet } from "react-router-dom"
import { fetchVendingMachineAppearance } from './api/dispenser'
import classNames from 'classnames'

function App() {
  const [backgroundColor, setBackgroundColor] = useState('')

  useEffect(() => {
    fetchVendingMachineAppearanceData()
  }, [])

  const bgStyle = classNames('#FFFFFF',
    `bg-[${backgroundColor}]` !== ''
  )

  const fetchVendingMachineAppearanceData = async () => {
    const { background_color } = await fetchVendingMachineAppearance()

    setBackgroundColor(background_color)
  }

  // Base layout
  return (
    <div
      className={classNames(styles.wrapperClass, bgStyle)} // Set background image
    >
      <div className="h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
