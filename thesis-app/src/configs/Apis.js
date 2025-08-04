import axios from "axios";

import cookie from "react-cookies";

const BASE_URL = "http://localhost:8080/ThesisManagement/api";

export const endpoints = {
  login: "/login",
  profile: "/secure/profile",
  faculties: "/faculties",
  lecturers: (facultyId) => `/faculty/${facultyId}/lecturer`,
  studentThesis: (studentId) => `/students/${studentId}/thesis`,
  registerThesis: "/secure/thesis/add",
  registerInstructor: "/secure/instructor/add",
  getInstructor: (thesisId) => `/secure/thesis/${thesisId}/instructors`,
};

export const authApis = () =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${cookie.load("token")}`,
    },
  });

export default axios.create({
  baseURL: BASE_URL,
});
