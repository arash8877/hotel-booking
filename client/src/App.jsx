import { useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  return (
    <div>
      {!isOwnerPath && <Navbar />}
    </div>
  )
}

export default App