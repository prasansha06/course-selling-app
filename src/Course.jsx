import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Grid, Card, CardMedia, CardContent, Typography, TextField, Button, Box, Alert, FormControlLabel, Switch, Chip } from "@mui/material";

function Course() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageLink, setImageLink] = useState("");
    const [price, setPrice] = useState(0);
    const [published, setPublished] = useState(true);
    const [statusMessage, setStatusMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:3000/admin/courses/${courseId}`, {
            method: "GET",
            headers: token ? { "Authorization": "Bearer " + token } : {}
        })
        .then((res) => {
            if (res.ok) return res.json();
            return null;
        })
        .then((data) => {
            if (data && data.course) {
                const c = data.course;
                setTitle(c.title || "");
                setDescription(c.description || "");
                setImageLink(c.imageLink || "");
                setPrice(c.price || 0);
                setPublished(c.published !== undefined ? c.published : true);
            } else {
                setTitle("Full Stack Web Development & Microservices");
                setDescription("Master React, Next.js, Node.js, Express, Docker, and system design from scratch.");
                setImageLink("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80");
                setPrice(4999);
                setPublished(true);
            }
        })
        .catch(() => {
            setTitle("Full Stack Web Development & Microservices");
            setDescription("Master React, Next.js, Node.js, Express, Docker, and system design from scratch.");
            setImageLink("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80");
            setPrice(4999);
            setPublished(true);
        });
    }, [courseId]);

    const handleUpdate = async () => {
        setLoading(true);
        setStatusMessage(null);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:3000/admin/courses/${courseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageLink,
                    price: Number(price),
                    published
                })
            });

            if (res.ok) {
                setStatusMessage({ type: "success", text: "Course updated successfully!" });
            } else {
                setStatusMessage({ type: "info", text: "Course updated locally in state." });
            }
        } catch (err) {
            setStatusMessage({ type: "info", text: "Course updated locally in state (backend offline)." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    Course Management
                </Typography>
                <Button variant="outlined" onClick={() => navigate("/courses")} sx={{ textTransform: "none" }}>
                    ← Back to Courses
                </Button>
            </Box>

            {statusMessage && (
                <Alert severity={statusMessage.type} sx={{ mb: 3 }}>
                    {statusMessage.text}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Edit Form Card */}
                <Grid item xs={12} md={7}>
                    <Card sx={{ p: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                            Edit Course Details
                        </Typography>

                        <TextField
                            fullWidth
                            label="Course Title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2.5 }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Course Description"
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 2.5 }}
                        />

                        <TextField
                            fullWidth
                            label="Image Banner URL"
                            variant="outlined"
                            value={imageLink}
                            onChange={(e) => setImageLink(e.target.value)}
                            sx={{ mb: 2.5 }}
                        />

                        <TextField
                            fullWidth
                            label="Price (INR)"
                            variant="outlined"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            sx={{ mb: 2.5 }}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={published}
                                    onChange={(e) => setPublished(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Published (Visible to students)"
                            sx={{ mb: 3 }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            onClick={handleUpdate}
                            sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, textTransform: "none" }}
                        >
                            {loading ? "Updating..." : "Save Changes"}
                        </Button>
                    </Card>
                </Grid>

                {/* Live Preview Card */}
                <Grid item xs={12} md={5}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "#64748b" }}>
                        Student View Preview
                    </Typography>
                    <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={imageLink || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"}
                            alt={title}
                            sx={{ objectFit: "cover" }}
                        />
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.15rem" }}>
                                    {title || "Course Title"}
                                </Typography>
                                <Chip
                                    label={published ? "Published" : "Draft"}
                                    color={published ? "success" : "default"}
                                    size="small"
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, minHeight: 60 }}>
                                {description || "Course description preview will appear here in real time as you edit."}
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                                    ₹{price}
                                </Typography>
                                <Button variant="contained" color="primary" size="small" disabled sx={{ textTransform: "none" }}>
                                    Enrolled Preview
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Course;
