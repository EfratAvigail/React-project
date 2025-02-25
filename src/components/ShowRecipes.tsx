import { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Recipise } from "../Types";
import mobxRec from "./mobxRec"; // ייבוא החנות שלך
import { observer } from 'mobx-react-lite';
import axios from "axios";
import {
  IconButton, ImageList, ImageListItem, ImageListItemBar,
  ListSubheader, Box, Tooltip, Typography, ButtonBase,
  TextField, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import { userContext } from "./userContext";

const ShowRecipes = observer(() => {
  const [recipises, setRecipises] = useState<Recipise[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(0); // כפתור האם להראות את המתכונים או לא
  const { Myuser } = useContext(userContext);
  const nav = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState(0);
  const [durationFilter, setDurationFilter] = useState(0);
  const [UserFilter, setUser] = useState(0);
  const [DiffFilter, setDiff] = useState("");

  const getRecipises = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/recipe");
      setRecipises(res.data);
    } catch (e) {
      setError("נכשל בקבלת הנתונים");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecipises();
  }, []);

  const handleImageError = (src: string) => {
    console.error(`שגיאה בטעינת התמונה: ${src}`);
    mobxRec.setCurrImage({
      ...mobxRec.currImage,
      [src]: "/images/default.jpg",
    });
  };

  const handleEditRecipe = (userId: number) => {
    if (Myuser) {
      if (Myuser.Id === userId)
        nav(`edit-recipe/${mobxRec.currRecipie?.Name}`);
      else
        setMsg(" אינך מורשה לערוך את המתכון מכיוון שאינך יצרת אותו");
    } else {
      setMsg(" אינך מורשה לערוך את המתכון מכיוון שאינך מחובר");
    }
    setShow(1);
  };

  const handleDeleteRecipe = async (id: number, userId: number) => {
    try {
      if (Myuser?.Id === userId) {
        await axios.post(`http://localhost:8080/api/recipe/delete/${id}`, { Id: id });
        setRecipises(recipises?.filter(recipe => recipe.Id !== id) || []);
      } else {
        setMsg(Myuser ? " אינך מורשה למחוק את המתכון מכיוון שאינך יצרת אותו" : " אינך רשאי למחוק את המתכון כי אינך מחובר");
        setShow(1);
      }
    } catch (error) {
      console.error("שגיאה במחיקת המתכון", error);
    }
  };

  return (
    <>
      <Outlet />
      {msg && <div style={{ color: "red", fontSize: "18px", padding: "10px" }}>{msg}</div>}
      {show === 0 && (
        <>
          {/* הוספת שדות הסינון */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            {/* קטגוריה */}
            <TextField
              style={{ borderBottom: "2px solid yellow" }}
              label="קטגוריה"
              fullWidth
              select
              size="small"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(Number(e.target.value))}
              sx={{ mb: 1 }}
            >
              <MenuItem value={0}>תבשילים</MenuItem>
              <MenuItem value={1}>קנוחים</MenuItem>
              <MenuItem value={2}>מרקים</MenuItem>
              <MenuItem value={3}>שונות</MenuItem>
           
            </TextField>
            {/* קושי */}
            <TextField
              style={{ borderBottom: "4px solid yellow" }}
              label="קושי"
              fullWidth
              select
              size="small"
              value={DiffFilter}
              onChange={(e) => setDiff((e.target.value))}
              sx={{ mb: 1 }}
            >
              <MenuItem value="Easy">קל</MenuItem>
              <MenuItem value="Medium">בינוני</MenuItem>
              <MenuItem value="Hard">קשה</MenuItem>
            </TextField>
            {/* זמן */}
            <TextField
              style={{ borderBottom: "2px solid yellow" }}
              label="זמן (דקות)"
              type="number"
              fullWidth
              size="small"
              value={durationFilter}
              onChange={(e) => setDurationFilter(Number(e.target.value))}
              sx={{ mb: 1, ml: 2 }}
            />
            {/* מזהה משתמש */}
            <TextField
              style={{ borderBottom: "5px solid yellow" }}
              label="מזהה משתמש"
              fullWidth
              size="small"
              value={UserFilter}
              onChange={(e) => setUser(Number(e.target.value))}
              sx={{ mb: 1, ml: 2 }}
            />
          </Box>

          {/* הצגת המתכונים */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            {loading && <p>טוען נתונים...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <ImageList sx={{ width: 800, height: 600 }} cols={3} gap={20}>
              <ImageListItem key="Subheader" cols={3}>
                <ListSubheader component="div">📖 מתכונים</ListSubheader>
              </ImageListItem>

              {recipises &&
                recipises.filter((item) => {
                  return (
                    (DiffFilter === "" || DiffFilter === item.Difficulty) &&
                    (categoryFilter === 0 || categoryFilter === item.CategoryId) &&
                    (durationFilter === 0 || item.Duration === durationFilter) &&
                    (UserFilter === 0 || item.UserId === UserFilter)
                  );
                }).map((item) => {
                  const currentImageSrc = mobxRec.currImage[item.Img] || item.Img;
                  return (
                    <ImageListItem
                      key={item.Img}
                      sx={{
                        cursor: "pointer",
                        transition: "0.3s",
                        borderRadius: "10px",
                        overflow: "hidden",
                        position: "relative",
                        "&:hover": { filter: "brightness(70%)", transform: "scale(1.05)" },
                      }}
                    >
                      <ButtonBase
                        sx={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "10px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                        onClick={() => {
                          setShow(1);
                          if (Myuser) {
                            nav(`ShowRecipe/${item.Name}`);
                            mobxRec.setCurrRecipie(item);
                          } else {
                            setMsg("  להרשמה לחץ כאן👇 משתמש לא מחובר לא רשאי לצפות במתכון");
                            nav("../Login");
                          }
                        }}
                      >
                        <img
                          onError={() => handleImageError(item.Img)}
                          src={currentImageSrc}
                          alt={item.Name}
                          loading="lazy"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </ButtonBase>
                      <ImageListItemBar
                        title={<Typography sx={{ color: "#FFDB58", fontWeight: "bold" }}>{item.Name}</Typography>}
                        actionIcon={
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="ערוך">
                              <IconButton sx={{ color: "#FFDB58" }} onClick={() => { mobxRec.setCurrRecipie(item); handleEditRecipe(item.UserId); }}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="לייק">
                              <IconButton sx={{ color: "#FFDB58" }}>
                                <FavoriteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="מחק">
                              <IconButton sx={{ color: "#FFDB58" }} onClick={() => { handleDeleteRecipe(item.Id, item.UserId); }}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                      />
                    </ImageListItem>
                  );
                })}
            </ImageList>
          </Box>
        </>
      )}
    </>
  );
});

export default ShowRecipes;
