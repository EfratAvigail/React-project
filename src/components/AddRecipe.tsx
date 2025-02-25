import React, { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Card, CardContent, Typography, TextField, MenuItem, Box, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { userContext } from "./userContext";
import { useNavigate } from "react-router-dom";

// הגדרת הוולידציות
const validationSchema = yup.object({
  Name: yup.string().required("שם חובה"),
  Difficulty: yup.string().required("דרגת קושי חובה"),
  Duration: yup.string().required("משך זמן חובה"),
  Description: yup.string().required("תיאור חובה"),
  CategoryId: yup.number().required("קטגוריה חובה"),
  Img: yup.string().notRequired(),
  Instructions: yup.array().of(
    yup.object({
      Name: yup.string().required("הוראה חובה"),
    })
  ),
  Ingridents: yup.array().of(
    yup.object({
      Name: yup.string().required("שם רכיב חובה"),
      Count: yup.string().required("כמות רכיב חובה"),
      Type: yup.string().required("סוג רכיב חובה"),
    })
  ),
});

const AddRecipe = () => {
  const { Myuser } = useContext(userContext); 
  const nav = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      Name: "",
      Difficulty: "",
      Duration: "",
      Description: "",
      CategoryId:0,
      Img: "",
      Instructions: [{ Name: "" }],
      Ingridents: [{ Name: "", Count: "", Type: "" }],
    },
  });

  const onSubmit = async (data: any) => {
    const updatedData = { ...data, UserId: Myuser?.Id }; // הוספת ה-ID לנתונים
    console.log("Form submitted:", updatedData);
    try {
      const res = await axios.post(`http://localhost:8080/api/recipe`, updatedData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(res.data);
      nav("./ShowRecipie");
    } catch (error) {
      console.error("שגיאה בהוספת מתכון", error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
      <Card sx={{ width: 450, padding: 1, borderRadius: 1, boxShadow: 1 }}>
        <CardContent>
          <Typography variant="body1" gutterBottom sx={{ textAlign: "center" }}>
            הוסף מתכון
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* שם */}
            <Controller
              name="Name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="שם"
                  fullWidth
                  size="small"
                  error={!!errors.Name}
                  helperText={errors.Name?.message}
                  sx={{ mb: 1 }}
                />
              )}
            />

            {/* דרגת קושי */}
            <Controller
              name="Difficulty"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="דרגת קושי"
                  fullWidth
                  select
                  size="small"
                  error={!!errors.Difficulty}
                  helperText={errors.Difficulty?.message}
                  sx={{ mb: 1 }}
                >
                  <MenuItem value="Easy">קל</MenuItem>
                  <MenuItem value="Medium">בינוני</MenuItem>
                  <MenuItem value="Hard">קשה</MenuItem>
                </TextField>
              )}
            />

            {/* זמן */}
            <Controller
              name="Duration"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="משך זמן"
                  fullWidth
                  size="small"
                  error={!!errors.Duration}
                  helperText={errors.Duration?.message}
                  sx={{ mb: 1 }}
                />
              )}
            />

            {/* תיאור */}
            <Controller
              name="Description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="תיאור"
                  fullWidth
                  size="small"
                  error={!!errors.Description}
                  helperText={errors.Description?.message}
                  sx={{ mb: 1 }}
                />
              )}
            />

            {/* קטגוריה */}
            <Controller
              name="CategoryId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="קטגוריה"
                  fullWidth
                  select
                  size="small"
                  error={!!errors.CategoryId}
                  helperText={errors.CategoryId?.message}
                  sx={{ mb: 1 }}
                >
                  <MenuItem value={1}>ארועים</MenuItem>
                  <MenuItem value={2}>ביתי</MenuItem>
                  <MenuItem value={3}>דיאטטי</MenuItem>
                  <MenuItem value={4}>זול</MenuItem>
                  <MenuItem value={5}>בר</MenuItem>
                  <MenuItem value={6}>מבושל</MenuItem>
                </TextField>
              )}
            />

            {/* URL תמונה */}
            <Controller
              name="Img"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="URL תמונה"
                  fullWidth
                  size="small"
                  error={!!errors.Img}
                  helperText={errors.Img?.message}
                  sx={{ mb: 1 }}
                />
              )}
            />

            {/* הוראות */}
            <Typography variant="h6" gutterBottom>
              הוראות
            </Typography>
            <Controller
              name="Instructions"
              control={control}
              render={({ field }) => (
                <div>
                  {(field.value || []).map((instruction, index) => (
                    <Box key={`${instruction.Name}-${index}`} display="flex" alignItems="center" gap={2} mb={1}>
                      <TextField
                        label={`הוראה ${index + 1}`}
                        value={instruction.Name}
                        onChange={(e) => {
                          const newInstructions = [...(field.value || [])];
                          newInstructions[index] = { ...newInstructions[index], Name: e.target.value };
                          field.onChange(newInstructions);
                        }}
                        fullWidth
                      />
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          const newInstructions = (field.value || []).filter((_, i) => i !== index);
                          field.onChange(newInstructions);
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <IconButton color="primary" onClick={() => field.onChange([...(field.value || []), { Name: "" }])}>
                    <AddCircleIcon />
                  </IconButton>
                </div>
              )}
            />

            {/* רכיבים */}
            <Typography variant="h6" gutterBottom>
              רכיבים
            </Typography>
            <Controller
              name="Ingridents"
              control={control}
              render={({ field }) => (
                <div>
                  {(field.value || []).map((ingredient, index) => (
                    <Box key={`${ingredient.Name}-${index}`} display="flex" alignItems="center" gap={2} mb={1}>
                      <TextField
                        label="שם רכיב"
                        value={ingredient.Name}
                        onChange={(e) => {
                          const newIngridents = [...(field.value || [])];
                          newIngridents[index] = { ...newIngridents[index], Name: e.target.value };
                          field.onChange(newIngridents);
                        }}
                        fullWidth
                      />
                      <TextField
                        label="כמות"
                        value={ingredient.Count}
                        onChange={(e) => {
                          const newIngridents = [...(field.value || [])];
                          newIngridents[index] = { ...newIngridents[index], Count: e.target.value };
                          field.onChange(newIngridents);
                        }}
                        fullWidth
                      />
                      <TextField
                        label="סוג"
                        value={ingredient.Type}
                        onChange={(e) => {
                          const newIngridents = [...(field.value || [])];
                          newIngridents[index] = { ...newIngridents[index], Type: e.target.value };
                          field.onChange(newIngridents);
                        }}
                        fullWidth
                      />
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          const newIngridents = (field.value || []).filter((_, i) => i !== index);
                          field.onChange(newIngridents);
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <IconButton color="primary" onClick={() => field.onChange([...(field.value || []), { Name: "", Count: "", Type: "" }])}>
                    <AddCircleIcon />
                  </IconButton>
                </div>
              )}
            />

            <Button type="submit" variant="contained" size="small" fullWidth>
              שלח
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddRecipe;
