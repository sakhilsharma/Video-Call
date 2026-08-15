import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import CircularProgress from "@mui/material/CircularProgress";
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';
import { Snackbar } from '@mui/material';
import "../App.css"


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Auth() {



    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();
    const [name, setName] = React.useState();
    const [error, setError] = React.useState();
    const [message, setMessage] = React.useState();


    const [formState, setFormState] = React.useState(0);
    //snack bar implementation
    const [open, setOpen] = React.useState(false)

    //functions from authContext 
    const { handleRegister, handleLogin, isLoading } = React.useContext(AuthContext);
    console.log("Auth component:", isLoading);
    let handleAuth = async () => {
        try {
            if (formState === 0) {

                let result = await handleLogin(username, password)


            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                alert(result);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {

            console.log(err.response.data.message);
            let message = (err.response.data.message);
            setError(message);
        }
    }


    return (
        <ThemeProvider theme={defaultTheme}>

            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(/connect.png)`, // ✅ Use leading slash
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="auth-layout">
                    <div className="auth-left">
                        <Grid item xs={12} sm={8} md={5} elevation={6} square>
                            <Box
                                sx={{
                                    my: 8,
                                    mx: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                    <LockOutlinedIcon />
                                </Avatar>

                                {/*sign element*/ /*0== login and 1 == formState */}
                                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                    <Button variant={formState === 0 ? "contained" : ""} onClick={() => { setFormState(0) }}>
                                        Sign In
                                    </Button>
                                    <Button variant={formState === 1 ? "contained" : ""} onClick={() => { setFormState(1) }}>
                                        Sign Up
                                    </Button>

                                    {formState === 0 && (
                                        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                                            New here?{" "}
                                            <span
                                                style={{ color: "#1976d2", cursor: "pointer", textDecoration: "underline" }}
                                                onClick={() => setFormState(1)}
                                            >
                                                Register a new account
                                            </span>
                                        </p>
                                    )}
                                </div>


                                <Box component="form" noValidate sx={{ mt: 1 }}>
                                    {formState === 1 ? <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Full Name"
                                        name="username"
                                        value={name}
                                        autoFocus
                                        onChange={(e) => setName(e.target.value)}
                                    /> : <></>}

                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        value={username}
                                        autoFocus
                                        onChange={(e) => setUsername(e.target.value)}

                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        value={password}
                                        type="password"
                                        onChange={(e) => setPassword(e.target.value)}

                                        id="password"
                                    />

                                    <p style={{ color: "red" }}>{error}</p>

                                    <Button
                                        type="button"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={handleAuth}
                                        disabled={(!username || !password)}
                                    >
                                        {isLoading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            formState === 0 ? "Login" : "Register"
                                        )}
                                    </Button>

                                </Box>
                            </Box>
                        </Grid>
                    </div>

                    <div className="auth-right">

                    </div>
                </div>
            </Grid>

            <Snackbar

                open={open}
                autoHideDuration={4000}
                message={message}
            />

        </ThemeProvider>
    );
}