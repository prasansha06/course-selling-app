import { useState } from "react";
import { Card, Typography, TextField, Button, Box, Alert, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignin = async () => {
        setError(null);
        if (!email || !password) {
            setError("Please fill in both email and password.");
            return;
        }

        setLoading(true);
        const endpoint = role === "admin" 
            ? "http://localhost:3000/admin/login" 
            : "http://localhost:3000/users/login";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userEmail", email);
                localStorage.setItem("userRole", role);
                navigate("/courses");
            } else {
                setError(data.message || "Failed to sign in. Please verify your credentials.");
            }
        } catch (err) {
            setError("Unable to connect to backend server on localhost:3000. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column", alignItems: "center", pt: 10, px: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "#1e293b" }}>
                Welcome back
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
                Sign in to manage or access your enrolled courses
            </Typography>

            <Card sx={{ width: "100%", maxWidth: 420, p: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2.5 }}>
                        {error}
                    </Alert>
                )}

                <RadioGroup
                    row
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    sx={{ mb: 2, justifyContent: "center" }}
                >
                    <FormControlLabel value="admin" control={<Radio />} label="Admin / Instructor" />
                    <FormControlLabel value="user" control={<Radio />} label="Student" />
                </RadioGroup>

                <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2.5 }}
                />

                <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 3 }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSignin();
                    }}
                />

                <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    disabled={loading}
                    onClick={handleSignin}
                    sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, textTransform: "none" }}
                >
                    {loading ? "Signing in..." : `Sign in as ${role === "admin" ? "Admin" : "Student"}`}
                </Button>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        Don't have an account?{" "}
                        <span
                            style={{ color: "#1976d2", cursor: "pointer", fontWeight: 600 }}
                            onClick={() => navigate("/signup")}
                        >
                            Sign up
                        </span>
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}

export default Signin;
