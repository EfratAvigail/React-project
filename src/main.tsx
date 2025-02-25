import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './components/Login.tsx'
import SighIn from './components/SignIn.tsx'
import ShowRecipes from './components/ShowRecipes.tsx'
import ShowRecipe from './components/ShowRecipie.tsx'
import AddRecipe from './components/AddRecipe.tsx'
import EditRecipie from './components/EditRecipie.tsx'
import Home from './components/Home.tsx'
const routes = createBrowserRouter([
  {
    path: "*", element: <App />, children: [
      // {path:"add-recipe",element:<AddRecipe/>},
      {
        path: "Login",
        element: <Login />
      },{path: "SighIn",
        element: <SighIn />},
        {path:"ShowRecipes",element:<ShowRecipes/>,children:[{path:"ShowRecipe/:name",element:<ShowRecipe/>}
          ,{path:"edit-recipe/:name",element:<EditRecipie/>}
        ]},
      
      {path:"add-recipe",element:<AddRecipe/>}]
     
  }
 
])
createRoot(document.getElementById('root')!).render(
  <RouterProvider router={routes} />,
  //add-recipe
)
