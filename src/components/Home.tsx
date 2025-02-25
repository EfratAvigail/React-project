import { Outlet, useNavigate } from "react-router-dom";
import "../styles/home.css";
import { userContext } from "./userContext";
import { useContext, useState } from "react";
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { pink } from '@mui/material/colors';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

function HomeIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}



const Home = () => {
  const nav = useNavigate();
  const { Myuser } = useContext(userContext);
  const [navigate, setNavigate] = useState(0);

  return (
    <>
      <div className="home-container">
        <div className="home-button">
          {Myuser !== undefined && <button onClick={() => nav("/addrecipe")}> הוספת מתכון</button>}

          <button onClick={() => { setNavigate(1); nav("/Login") }}>אני כבר מחובר</button>
          <button onClick={() => { setNavigate(1); nav("/SighIn") }}>גם אני מצטרף</button>
          <button onClick={() => { setNavigate(0); nav("/home"); }}>  עמוד הבית
          <HomeIcon id="icon-container" style={{ color: 'black' }} /></button>
        </div>

        {navigate === 0 && <button className="center-button" onClick={() => { setNavigate(1); nav("/ShowRecipes") }}>
          מתכוני יוקרה בצ'יק צ'ק
        </button>}

        <Outlet />
      </div>
     
    
    </>
  );
};

export default Home;
