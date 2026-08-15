import React, { useContext, useState } from 'react';
import withAuth from '../../utils/withauth';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { Button, IconButton, TextField, Typography, Paper, Avatar, Box, Stack } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { AuthContext } from '../context/AuthContext';

function Home() {
    const navigate = useNavigate();
    const { addToUserHistory, userData ,setUserData} = useContext(AuthContext);
    const [meetingCode, setMeetingCode] = useState("");
    const [copied, setCopied] = useState(false);
    console.log(userData.name);
    // 🔐 Random code generator
    const generateMeetingCode = (length = 8) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleJoinVideoCall = async () => {
        if (!meetingCode) return;
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    };

    const handleGenerateClick = async () => {
        const code = generateMeetingCode();
        setMeetingCode(code);
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="navbar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h3>Video Call</h3>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={() => navigate("/history")}>
                        <HistoryIcon />
                        <p>History</p>
                    </IconButton>
                    {localStorage.getItem("token") ? (
                        <Button onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/auth")
                        }}>
                            Log-Out
                        </Button>
                    ) : (
                        <Button onClick={() => navigate("/auth")}>Log-In</Button>
                    )}
                </div>
            </div>

            <div className="meetContianer">
                <div className="leftPanel">
                    {userData.name != undefined ? (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                width: "100%",
                                maxWidth: "300px",
                                height: "48px",
                                px: 1.2,
                                borderRadius: 2,
                                background: "#f5f3ff",
                                border: "1px solid #ede9fe",
                                boxSizing: "border-box",
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 30,
                                    height: 30,
                                    bgcolor: "#5e42c6",
                                    fontSize: "0.8rem",
                                    flexShrink: 0,
                                }}
                            >
                                {userData.name?.charAt(0).toUpperCase()}
                            </Avatar>

                            <Typography
                                sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    color: "#1e1b4b",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {userData.username}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography
                            sx={{
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                color: "#5e42c6",
                                mb: 2,
                            }}
                        >
                            Login First
                        </Typography>
                    )}
                    <h2 className="Heading">Providing Video Call To Call Your Loved Ones.</h2>

                    <h3>Enter Meeting Code or Generate:</h3>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <TextField
                            value={meetingCode}
                            onChange={e => setMeetingCode(e.target.value)}
                            placeholder="Enter code"
                            id="outlined"
                        />
                        <Button onClick={handleJoinVideoCall} variant="contained">JOIN</Button>
                    </div>

                    <div style={{ marginTop: "6px" }}>
                        <Typography
                            variant="caption"
                            style={{ color: "#5e42c6", cursor: "pointer", fontSize: "1rem" }}
                            onClick={handleGenerateClick}
                        >
                            Generate Meeting code
                        </Typography>
                        {copied && (
                            <Typography variant="caption" style={{ marginLeft: "10px", color: "green" }}>
                                Copied!
                            </Typography>
                        )}
                    </div>
                </div>

                <div className='rightPanel'>
                    <img srcSet='./logo3.png' alt='logo' />
                </div>
            </div>
        </>
    );
}

export default withAuth(Home);
