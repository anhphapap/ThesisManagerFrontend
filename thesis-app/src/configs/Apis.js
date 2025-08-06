import axios from "axios";

import cookie from "react-cookies";

const BASE_URL = "http://localhost:8080/ThesisManagement/api";

export const endpoints = {
  login: "/login",
  profile: "/secure/profile",
  faculties: "/faculties",
  lecturers: (facultyId) => `/faculties/${facultyId}/lecturers`,
  councils: `/councils`,
  studentThesis: `/secure/students/theses`,
  lecturerThesis: `/secure/lecturers/instructor/theses`,
  registerThesis: "/theses/add",
  updateThesis: "/theses/update",
  thesisUpload: (thesisId) => `/theses/${thesisId}/upload`,
  getInstructor: (thesisId) => `/theses/${thesisId}/instructors`,
  theses: "/theses",
  thesisDetail: (thesisId) => `/theses/${thesisId}`,
  updateUser: "/user/update",
  changePassword: "/user/change-password",
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
