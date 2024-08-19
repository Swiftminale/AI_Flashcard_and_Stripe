"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

import {
  collection,
  doc,
  getDoc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  // useEffect(() => {
  //   async function getFlashcards() {
  //     if (!user) return;
  //     const docRef = doc(collection(db, "users"), user.id);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       const collections = docSnap.data().flashcards || [];
  //       setFlashcards(collections);
  //     } else {
  //       await setDoc(docRef, { flashcards: [] });
  //     }
  //   }
  //   getFlashcards();
  // }, [user]);

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
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
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
