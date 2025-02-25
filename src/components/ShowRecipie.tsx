import { observer } from "mobx-react-lite";
import { Card, CardContent, CardMedia, Typography, List, ListItem, ListItemText, Box, CircularProgress, Divider, Stack, Chip, MenuItem, TextField } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MobxRec from "./mobxRec";
import { Outlet } from "react-router-dom";
import mobxRec from "./mobxRec";

const ShowRecipe = observer(() => {
  // קבלת המתכון מ-MobxRec
  let recipe = MobxRec.currRecipie;


  if (!recipe) {
  
    return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
  }

  return (
     <>       
      <Outlet />
  
    <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
      <Card sx={{ width: 600, boxShadow: 4, borderRadius: 3 }}>
        <CardMedia
          component="img"
          height="300"
          image={mobxRec.currImage[recipe.Img] || recipe.Img} // נשתמש ב-MobX כדי לקבל את התמונה המעודכנת
          alt={recipe.Name}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            {recipe.Name}
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
            {recipe.Description}
          </Typography>

          {/* מידע על זמן והכנה */}
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
            <Chip icon={<SignalCellularAltIcon />} label={`דרגת קושי: ${recipe.Difficulty}`} color="primary" />
            <Chip icon={<AccessTimeIcon />} label={`זמן הכנה: ${recipe.Duration}`} color="secondary" />
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* רשימת רכיבים */}
          <Typography variant="h6" color="primary">
            <RestaurantIcon sx={{ verticalAlign: "middle", mr: 1 }} /> מוצרים:
          </Typography>
          <List dense>
            {recipe.Ingridents.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${item.Name} ${item.Count} ${item.Type}`} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* הוראות הכנה */}
          <Typography variant="h6" color="primary">
            <MenuBookIcon sx={{ verticalAlign: "middle", mr: 1 }} /> הוראות:
          </Typography>
          <List dense>
            {recipe.Instructions.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${index + 1}. ${item.Name}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
    </>
  );
});

export default ShowRecipe;
