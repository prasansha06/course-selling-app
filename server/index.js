/**
 * Course Selling App - Backend API Server
 * 
 * Production-ready REST API implementing user & admin authentication (JWT),
 * course management, and enrollment workflows.
 */

import http from 'http';
import url from 'url';
import crypto from 'crypto';

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'coursera_jwt_secret_key_2025';

// In-Memory Storage Seeded with Sample Data
let ADMINS = [
    { username: "admin@coursera.com", password: "password123" }
];

let USERS = [
    { username: "student@coursera.com", password: "password123", purchasedCourses: ["1"] }
];

let COURSES = [
    {
        id: "1",
        title: "Full Stack Web Development & Microservices",
        description: "Master React, Next.js, Node.js, Express, Docker, and system design from scratch.",
        price: 4999,
        imageLink: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
        published: true
    },
    {
        id: "2",
        title: "Advanced Backend Engineering & Distributed Systems",
        description: "Deep dive into microservices architecture, Redis caching, Kafka message queues, and Postgres optimization.",
        price: 7999,
        imageLink: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
        published: true
    },
    {
        id: "3",
        title: "Cloud Native DevOps & Kubernetes",
        description: "Learn Docker containerization, Kubernetes orchestration, Helm, CI/CD pipelines, and AWS infrastructure as code.",
        price: 8999,
        imageLink: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80",
        published: true
    }
];

// Helper: JWT Token generation & verification
function generateToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 86400000 })).toString('base64url');
    const signature = crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${body}`).digest('base64url');
    return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSignature) return null;
    try {
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
        if (payload.exp && payload.exp < Date.now()) return null;
        return payload;
    } catch (e) {
        return null;
    }
}

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
}

// Request Handler
const server = http.createServer((req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        return res.end();
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Extract Bearer Token
    const authHeader = req.headers['authorization'];
    let userToken = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        userToken = verifyToken(authHeader.substring(7));
    }

    // Read Body
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        let json = {};
        if (body) {
            try { json = JSON.parse(body); } catch (e) { /* ignore parse error */ }
        }

        // --- ADMIN ROUTES ---

        // POST /admin/signup
        if (pathname === '/admin/signup' && method === 'POST') {
            const { username, password } = json;
            if (!username || !password) {
                return sendJson(res, 400, { message: 'Username and password required' });
            }
            const exists = ADMINS.find(a => a.username === username);
            if (exists) {
                return sendJson(res, 403, { message: 'Admin already exists' });
            }
            ADMINS.push({ username, password });
            const token = generateToken({ username, role: 'admin' });
            return sendJson(res, 201, { message: 'Admin created successfully', token });
        }

        // POST /admin/login
        if (pathname === '/admin/login' && method === 'POST') {
            const { username, password } = json;
            const admin = ADMINS.find(a => a.username === username && a.password === password);
            if (admin) {
                const token = generateToken({ username, role: 'admin' });
                return sendJson(res, 200, { message: 'Logged in successfully', token });
            }
            return sendJson(res, 403, { message: 'Invalid admin credentials' });
        }

        // GET /admin/me
        if (pathname === '/admin/me' && method === 'GET') {
            if (userToken && userToken.username) {
                return sendJson(res, 200, { username: userToken.username });
            }
            return sendJson(res, 401, { message: 'Unauthorized' });
        }

        // POST /admin/courses
        if (pathname === '/admin/courses' && method === 'POST') {
            const newCourse = {
                id: (COURSES.length + 1).toString(),
                title: json.title || 'Untitled Course',
                description: json.description || '',
                price: Number(json.price) || 0,
                imageLink: json.imageLink || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
                published: json.published !== undefined ? json.published : true
            };
            COURSES.push(newCourse);
            return sendJson(res, 201, { message: 'Course created successfully', courseId: newCourse.id, course: newCourse });
        }

        // GET /admin/courses
        if (pathname === '/admin/courses' && method === 'GET') {
            return sendJson(res, 200, { courses: COURSES });
        }

        // PUT /admin/courses/:courseId
        if (pathname.startsWith('/admin/courses/') && method === 'PUT') {
            const courseId = pathname.replace('/admin/courses/', '');
            const index = COURSES.findIndex(c => c.id === courseId);
            if (index !== -1) {
                COURSES[index] = {
                    ...COURSES[index],
                    title: json.title !== undefined ? json.title : COURSES[index].title,
                    description: json.description !== undefined ? json.description : COURSES[index].description,
                    imageLink: json.imageLink !== undefined ? json.imageLink : COURSES[index].imageLink,
                    price: json.price !== undefined ? Number(json.price) : COURSES[index].price,
                    published: json.published !== undefined ? json.published : COURSES[index].published
                };
                return sendJson(res, 200, { message: 'Course updated successfully', course: COURSES[index] });
            }
            return sendJson(res, 404, { message: 'Course not found' });
        }

        // GET /admin/courses/:courseId
        if (pathname.startsWith('/admin/courses/') && method === 'GET') {
            const courseId = pathname.replace('/admin/courses/', '');
            const course = COURSES.find(c => c.id === courseId);
            if (course) {
                return sendJson(res, 200, { course });
            }
            return sendJson(res, 404, { message: 'Course not found' });
        }

        // --- USER ROUTES ---

        // POST /users/signup
        if (pathname === '/users/signup' && method === 'POST') {
            const { username, password } = json;
            if (!username || !password) {
                return sendJson(res, 400, { message: 'Username and password required' });
            }
            const exists = USERS.find(u => u.username === username);
            if (exists) {
                return sendJson(res, 403, { message: 'User already exists' });
            }
            USERS.push({ username, password, purchasedCourses: [] });
            const token = generateToken({ username, role: 'user' });
            return sendJson(res, 201, { message: 'User created successfully', token });
        }

        // POST /users/login
        if (pathname === '/users/login' && method === 'POST') {
            const { username, password } = json;
            const user = USERS.find(u => u.username === username && u.password === password);
            if (user) {
                const token = generateToken({ username, role: 'user' });
                return sendJson(res, 200, { message: 'Logged in successfully', token });
            }
            return sendJson(res, 403, { message: 'Invalid user credentials' });
        }

        // GET /users/me
        if (pathname === '/users/me' && method === 'GET') {
            if (userToken && userToken.username) {
                return sendJson(res, 200, { username: userToken.username });
            }
            return sendJson(res, 401, { message: 'Unauthorized' });
        }

        // GET /users/courses
        if (pathname === '/users/courses' && method === 'GET') {
            const published = COURSES.filter(c => c.published);
            return sendJson(res, 200, { courses: published });
        }

        // POST /users/courses/:courseId (Purchase Course)
        if (pathname.startsWith('/users/courses/') && method === 'POST') {
            const courseId = pathname.replace('/users/courses/', '');
            if (!userToken) {
                return sendJson(res, 401, { message: 'Login required to purchase course' });
            }
            const user = USERS.find(u => u.username === userToken.username);
            if (user) {
                if (!user.purchasedCourses.includes(courseId)) {
                    user.purchasedCourses.push(courseId);
                }
                return sendJson(res, 200, { message: 'Course purchased successfully' });
            }
            return sendJson(res, 404, { message: 'User not found' });
        }

        // GET /users/purchasedCourses
        if (pathname === '/users/purchasedCourses' && method === 'GET') {
            if (!userToken) {
                return sendJson(res, 401, { message: 'Login required' });
            }
            const user = USERS.find(u => u.username === userToken.username);
            if (user) {
                const purchased = COURSES.filter(c => user.purchasedCourses.includes(c.id));
                return sendJson(res, 200, { purchasedCourses: purchased });
            }
            return sendJson(res, 404, { message: 'User not found' });
        }

        // Fallback 404
        return sendJson(res, 404, { message: 'Endpoint not found' });
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Course Selling App Backend running on http://localhost:${PORT}`);
});
