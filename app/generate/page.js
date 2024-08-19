"use client";

import {
  collection,
  getDoc,
  setDoc,
  writeBatch,
  doc,
} from "firebase/firestore";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../firebase";
import { useUser } from "@clerk/nextjs";

import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  CardActionArea,
  CardContent,
  DialogContentText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
} from "@mui/material";

export default function GenerateKey() {
  // const { isloaded, isSignedIn, user } = useState();
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    try {
      if (!user) {
        alert("User not authenticated.");
        return;
      }

      const userDocRef = doc(db, "users", user.id); // Ensure the document reference is correct
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [...(userData.flashcardSets || []), { name }];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), name);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleCloseDialog();
      setName(""); // Reset the name state
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  return (
    <Container maxWidth="100vw">
      <AppBar position="static" sx={{ bgcolor: "#0077B6" }}>
        <Toolbar sx={{ minHeight: 200 }}>
          <Typography variant="h3" style={{ flexGrow: 1 }}>
            አጤረራ
          </Typography>
          <SignedOut>
            <Link href="/sign-in" passHref>
              <Button color="inherit">Login</Button>
            </Link>
            <Link href="/sign-up" passHref>
              <Button color="inherit">Sign Up</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ color: "#03045E" }}>
          Generate Flashcards
        </Typography>
        <Paper sx={{ p: 4, width: "100%" }} elevation={12}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter Text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: "#00B4D8" }}
            fullWidth
            disabled={loading}
          >
            {loading ? "Generating..." : "Submit"}
            
          </Button>
        </Paper>
      </Box>
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h4"
            sx={{ display: "flex", justifyContent: "center", mb: 2 }}
          >
            Flashcards Preview
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CardActionArea onClick={() => handleCardClick(index)}>
                  <CardContent>
                    <Box
                      sx={{
                        perspective: "1000px",
                        "& > div": {
                          transition: "transform 0.6s",
                          bgcolor: "#90E0EF",
                          transformStyle: "preserve-3d",
                          position: "relative",
                          width: "100%",
                          height: "200px",
                          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.8)",
                          transform: flipped[index]
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        },
                        "& > div > div": {
                          position: "absolute",
                          bgcolor: "#90E0EF",
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 2,
                          boxSizing: "border-box",
                        },
                        "& > div > div:nth-of-type(2)": {
                          transform: "rotateY(180deg)",
                          bgcolor: "#00B4D8",
                        },
                      }}
                    >
                      <div>
                        <div>
                          <Typography
                            variant="h5"
                            component="div"
                            sx={{
                              fontSize: "calc(1rem + 0.5vw)", // Dynamically scale the font size based on viewport width
                              overflowWrap: "break-word", // Handle long words by breaking them to the next line
                              textAlign: "center", // Center the text
                              width: "fit-content", // Fit the text within the available space
                              maxWidth: "100%", // Ensure it doesn’t exceed the container width
                              whiteSpace: "normal", // Allow wrapping
                            }}
                          >
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            variant="h4"
                            component="div"
                            sx={{
                              fontSize: "calc(0.75rem + 0.25vw)", // Dynamically scale the font size based on viewport width
                              overflowWrap: "break-word", // Handle long words by breaking them to the next line
                              textAlign: "center", // Center the text
                              width: "fit-content", // Fit the text within the available space
                              maxWidth: "100%", // Ensure it doesn’t exceed the container width
                              whiteSpace: "normal", // Allow wrapping
                              p: 2,
                            }}
                          >
                            {flashcard.back}
                          </Typography>
                        </div>
                      </div>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{ bgcolor: "#00B4D8" }}
              onClick={handleOpenDialog}
            >
              Save Flashcards
            </Button>
          </Box>
        </Box>
      )}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcards collection.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name" // Corrected label
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={saveFlashcards}
            fullWidth
          >
            Save
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
