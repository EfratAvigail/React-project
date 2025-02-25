import './App.css'
import Home from './components/Home'
import AddRecipe from './components/AddRecipe'
import UserContext from './components/userContext'
import ShowRecipies from './components/ShowRecipes'
import ShowRecipie from './components/ShowRecipie'
import EditRecipie from './components/EditRecipie'

function App() {

  return (
   
   <UserContext>
    <>
    <Home/>
    </>
  </UserContext>
  )
}

export default App
