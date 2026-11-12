import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from "./Signin.jsx";
import Signup from "./Signup.jsx";
import Appbar from "./Appbar.jsx";
import AddCourse from "./AddCourse.jsx";
import Courses from "./Courses.jsx";
import Course from "./Course.jsx";
import Landing from "./Landing.jsx";

function App() {
    return (
        <div style={{
            width: "100%",
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
            display: "flex",
            flexDirection: "column"
        }}>
            <Router>
                <Appbar />
                <Routes>
                    <Route path={"/"} element={<Landing />} />
                    <Route path={"/courses"} element={<Courses />} />
                    <Route path={"/course/:courseId"} element={<Course />} />
                    <Route path={"/addcourse"} element={<AddCourse />} />
                    <Route path={"/signin"} element={<Signin />} />
                    <Route path={"/signup"} element={<Signup />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
