import { useContext } from "react";
import { user } from "../Types"; // ייבוא סוג המשתמש
import axios from "axios"; // ייבוא axios עבור בקשות HTTP
import { userContext } from "./userContext"; // ייבוא הקשר של המשתמש
import { Link, useNavigate } from "react-router-dom"; // ייבוא רכיבי נווט
import { useForm } from "react-hook-form"; // ייבוא react-hook-form לניהול טפסים
import { yupResolver } from "@hookform/resolvers/yup"; // ייבוא Yup לאימות
import * as yup from "yup"; // ייבוא Yup עבור אימות סכמות
import "../styles/signin.css"; // ייבוא סגנונות CSS

// הגדרת סכמת האימות באמצעות Yup
const schema = yup.object().shape({
  UserName: yup.string().required("יש להזין שם משתמש").transform(value => value.toLowerCase()), // המרת השם משתמש לאותיות קטנות
  Password: yup.string()
    .min(8, "סיסמה חייבת להכיל לפחות 8 תווים")
    .required("יש להזין סיסמה"),
});

const Login = () => {
  const { setMyUser } = useContext(userContext); // גישה לקונטקסט כדי לקבוע את המשתמש
  const nav = useNavigate(); // הוק עבור ניווט
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    resolver: yupResolver(schema), // שימוש ב-Yup לאימות
    mode: "onChange", // מצב אימות על שינוי
  });

  // פונקציה לטיפול בהגשת הטופס
  const onSend = async (data: any) => {
    try {
      const res = await axios.post<user>("http://localhost:8080/api/user/login", data); // שליחת בקשת התחברות לשרת
      setMyUser(res.data); 
      nav("/ShowRecipes"); 
    } catch (error: any) {
      if (error.response?.data) {
        setError("UserName", { message: error.response.data }); 
      } else {
        setError("UserName", { message: "Login failed, please try again." }); 
      }
    }
  };

  return (
    <div className="signin">
      <form className="signin-form" onSubmit={handleSubmit(onSend)}>
        <h2>התחברות</h2>
        <input {...register("UserName")} placeholder="שם משתמש" />
        <p>{errors.UserName?.message}</p>
        <input type="password" {...register("Password")} placeholder="סיסמה" />
        <p>{errors.Password?.message}</p>
        <button type="submit" disabled={!isValid}>
          התחבר
        </button>
        {errors.UserName?.message === "user not found!" && (
          <Link to="/SighIn">להרשמה הקליקו כאן👇</Link>
        )}
      </form>
    </div>
  );
};

export default Login; 
