import { Typography, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Appbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:3000/admin/me", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                return null;
            })
            .then((data) => {
                if (data && data.username) {
                    setUserEmail(data.username);
                } else {
                    setUserEmail(null);
                }
            })
            .catch(() => {
                // If backend is not running or invalid token, still allow manual logout if needed
                const savedEmail = localStorage.getItem("userEmail");
                if (savedEmail) setUserEmail(savedEmail);
            });
        } else {
            setUserEmail(null);
        }
    }, [location]);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 24px",
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                position: "sticky",
                top: 0,
                zIndex: 1000
            }}
        >
            <Box
                sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                onClick={() => navigate("/")}
            >
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2", letterSpacing: 0.5 }}>
                    Coursera
                </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Button color="inherit" onClick={() => navigate("/courses")}>
                    Courses
                </Button>

                {userEmail ? (
                    <>
                        <Button color="primary" variant="outlined" onClick={() => navigate("/addcourse")}>
                            + Add Course
                        </Button>
                        <Typography variant="body2" sx={{ color: "#555", fontWeight: 500, px: 1 }}>
                            {userEmail}
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("userEmail");
                                setUserEmail(null);
                                navigate("/");
                            }}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/signup")}
                        >
                            Signup
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/signin")}
                        >
                            Signin
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
}

export default Appbar;
