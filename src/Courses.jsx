import { useEffect, useState } from "react";
import { Container, Grid, Card, CardMedia, CardContent, Typography, CardActions, Button, Box, CircularProgress, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole") || "admin";

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const endpoint = token && role === "admin"
                    ? "http://localhost:3000/admin/courses"
                    : "http://localhost:3000/users/courses";

                const res = await fetch(endpoint, {
                    method: "GET",
                    headers: token ? { "Authorization": "Bearer " + token } : {}
                });

                if (res.ok) {
                    const data = await res.json();
                    setCourses(data.courses || []);
                } else {
                    setCourses(getDefaultCourses());
                }
            } catch (err) {
                setCourses(getDefaultCourses());
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [token, role]);

    const getDefaultCourses = () => [
        {
            _id: "1",
            title: "Full Stack Web Development & Microservices",
            description: "Master React, Next.js, Node.js, Express, Docker, and system design from scratch.",
            price: 4999,
            imageLink: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
            published: true
        },
        {
            _id: "2",
            title: "Advanced Backend Engineering & Distributed Systems",
            description: "Deep dive into microservices architecture, Redis caching, Kafka message queues, and Postgres optimization.",
            price: 7999,
            imageLink: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
            published: true
        },
        {
            _id: "3",
            title: "Cloud Native DevOps & Kubernetes",
            description: "Learn Docker containerization, Kubernetes orchestration, Helm, CI/CD pipelines, and AWS infrastructure as code.",
            price: 8999,
            imageLink: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80",
            published: true
        }
    ];

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
                        Featured Courses
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Browse engineering courses and programs
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => navigate("/addcourse")}
                    sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
                >
                    + Add New Course
                </Button>
            </Box>

            <Grid container spacing={4}>
                {courses.map((course) => {
                    const id = course._id || course.id;
                    return (
                        <Grid item key={id} xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: 3,
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: "0 12px 24px rgba(0,0,0,0.1)"
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={course.imageLink || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"}
                                    alt={course.title}
                                    sx={{ objectFit: "cover" }}
                                />
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.3 }}>
                                            {course.title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                                        {course.description}
                                    </Typography>
                                    <Chip
                                        label={`₹${course.price || 0}`}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                        sx={{ fontWeight: 700 }}
                                    />
                                </CardContent>
                                <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => navigate(`/course/${id}`)}
                                        sx={{ textTransform: "none", fontWeight: 600 }}
                                    >
                                        Edit / Details
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="success"
                                        onClick={() => {
                                            alert(`Enrolled in "${course.title}"!`);
                                        }}
                                        sx={{ textTransform: "none", fontWeight: 600 }}
                                    >
                                        Enroll Now
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
}

export default Courses;
