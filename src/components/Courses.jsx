import React from "react";
import CourseCard from "./CourseCard";

import reactImg from "../assets/images/react.jpg";
import javaImg from "../assets/images/java.jpg";
import uiuxImg from "../assets/images/uiux.jpg";

const courseList = [
  {
    image: reactImg,
    title: "React Development",
    instructor: "John Smith",
    duration: "8 Weeks",
    students: "2,300+",
  },
  {
    image: javaImg,
    title: "Java Full Stack",
    instructor: "David Wilson",
    duration: "12 Weeks",
    students: "1,850+",
  },
  {
    image: uiuxImg,
    title: "UI/UX Design",
    instructor: "Emily Johnson",
    duration: "6 Weeks",
    students: "1,200+",
  },
];

const Courses = () => {
  return (
    <section className="container py-5" id="courses">
      <h2 className="text-center mb-5">
        Popular Courses
      </h2>

      <div className="row">
        {courseList.map((course, index) => (
          <CourseCard
            key={index}
            image={course.image}
            title={course.title}
            instructor={course.instructor}
            duration={course.duration}
            students={course.students}
          />
        ))}
      </div>
    </section>
  );
};

export default Courses;