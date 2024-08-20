import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs"; // Ensure this import is correct

export default function SignUpPage() {
  return (
    <Container maxWidth="100vw">
      <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            አጤረራ
          </Typography>
          <Button sx={{ bgcolor: "white", mr: 2 }} variant="outline">
            <Link href="/sign-in" passHref>
              Login
            </Link>
          </Button>
          <Button sx={{ bgcolor: "white" }} variant="outline">
            <Link href="/sign-up" passHref>
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 4 }}
      >
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <SignUp /> {/* Ensure this component is available from Clerk */}
      </Box>
    </Container>
  );
}
