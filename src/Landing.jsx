import { Box, Button, Typography, Container, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Landing() {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", backgroundColor: "#f8fafc", py: 8 }}>
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{ fontWeight: 800, color: "#0f172a", mb: 2, fontSize: { xs: "2.5rem", md: "3.5rem" } }}
                        >
                            Coursera Learning & Instructor Platform
                        </Typography>
                        <Typography variant="h6" sx={{ color: "#475569", mb: 4, fontWeight: 400, lineHeight: 1.6 }}>
                            A modern full-stack course selling platform. Instructors can curate, publish, and manage engineering courses, while students can browse and enroll in top programs.
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ py: 1.5, px: 4, fontSize: "1rem", textTransform: "none", borderRadius: 2 }}
                                onClick={() => navigate("/courses")}
                            >
                                Explore Courses
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{ py: 1.5, px: 3, fontSize: "1rem", textTransform: "none", borderRadius: 2 }}
                                onClick={() => navigate("/addcourse")}
                            >
                                Teach on Coursera
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}>
                            <img
                                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
                                alt="Online Learning Platform"
                                style={{ width: "100%", height: 260, objectFit: "cover" }}
                            />
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    Full Stack Web Development & System Design
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Master modern React, Node.js, distributed microservices, caching, database indexing, and Docker deployments.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Landing;
