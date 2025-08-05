import axios from "axios";

import cookie from "react-cookies";

const BASE_URL = "http://localhost:8080/ThesisManagement/api";

export const endpoints = {
  login: "/login",
  profile: "/secure/profile",
  faculties: "/faculties",
  lecturers: (facultyId) => `/faculties/${facultyId}/lecturers`,
  studentThesis: (studentId) => `/students/${studentId}/theses`,
  registerThesis: "/secure/theses/add",
  registerInstructor: "/secure/instructors/add",
  getInstructor: (thesisId) => `/secure/theses/${thesisId}/instructors`,
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
