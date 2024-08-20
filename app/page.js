"use client";
import Link from "next/link";
import Image from "next/image";
import getStripe from "./utils/get-stripe";
import 'ldrs/ring'
import { helix } from "ldrs";
import { Analytics } from '@vercel/analytics/react';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Container,
  Grid,
  Toolbar,
  Typography,
  Box,
  Button,
  Paper,
} from "@mui/material";
import Head from "next/head";

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch("./api/checkout_session", {
      method: "POST",
      headers: {
        origin: "https://localhost:3000",
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
  };

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta
          name="description"
          content="create flashcards from your text"
        ></meta>
      </Head>
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
      <Paper elevation={9} sx={{ textAlign: "center", my: 4, p: 2 }}>
        <Typography variant="h2" sx={{ color: "#03045E" }}>
          Welcome to አጤረራ
        </Typography>
        <Typography variant="h5" gutterBottom>
          The easiest way to make flashcards from your text
        </Typography>
        <Link href="/generate" passHref>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, bgcolor: "#00B4D8", mr: 2 }}
          >
            Get Started
          </Button>
        </Link>
        <Link href="/flashcards" passHref>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, bgcolor: "#00B4D8" }}
          >
            Flashcards
          </Button>
        </Link>
      </Paper>
      <Box sx={{ my: 6 }}>
        <Typography
          variant="h3"
          component="h3"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center", color: "#03045E" }}
        >
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                Easy Text Input
              </Typography>
              <Typography>
                Simply input your text and let our app do the rest. Creating
                flashcards has never been easier.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                Smart Flashcards
              </Typography>
              <Typography>
                Our software breaks down your text into concise flashcards,
                perfect for studying.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={5} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                Accessible Anywhere
              </Typography>
              <Typography>
                Access your flashcards from any device, at any time. Study on
                the go with ease.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#03045E" }}>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Basic
              </Typography>
              <Typography variant="h6" gutterBottom>
                $5 / month
              </Typography>

              <Typography>
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Choose Basic
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Pro
              </Typography>
              <Typography variant="h6" gutterBottom>
                $10 / month
              </Typography>
              <Typography>
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleSubmit}
                aria-label="Choose Pro Plan"
              >
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
