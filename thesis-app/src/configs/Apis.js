import axios from "axios";

import cookie from "react-cookies";

const BASE_URL = "http://localhost:8080/ThesisManagement/api";

export const endpoints = {
  login: "/login",
  profile: "/secure/profile",
  faculties: "/faculties",
  lecturerOption:(facultyId) => `/faculties/${facultyId}/lecturers-active`,
  councils: "/councils",
  councilDetail: (councilId) => `/councils/${councilId}`,
  lecturers: (facultyId) => `/faculties/${facultyId}/lecturers`,
  studentThesis: `/secure/students/theses`,
  lecturerThesis: `/secure/lecturers/instructor/theses`,
  lecturerThesisReviewer: `/secure/lecturers/council/theses`,
  registerThesis: "/theses/add",
  updateThesis: "/theses/update",
  thesisUpload: (thesisId) => `/theses/${thesisId}/upload`,
  getInstructor: (thesisId) => `/theses/${thesisId}/instructors`,
  theses: "/theses",
  thesisDetail: (thesisId) => `/theses/${thesisId}`,
  thesisMark: `/secure/lecturers/council/theses/marking`,
  getThesisMark: (thesisId) => `/secure/lecturers/council/theses/marking?thesisId=${thesisId}`,
  sendEmailStudents: (councilId) => `/send-email/student/${councilId}`,
  closeCouncil: (councilId) => `/councils/${councilId}/close_council`,
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
