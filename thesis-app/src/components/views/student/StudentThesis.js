import React, { useContext, useEffect, useState } from "react";
import Base from "../../../components/Base";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import { UserContext } from "../../../configs/Contexts";
import { useNavigate } from "react-router-dom";

function StudentThesis() {
  const [user] = useContext(UserContext);
  const [thesis, setThesis] = useState({
    name: "",
    facultyId: "",
    lecturer1Id: "",
    lecturer2Id: "",
  });
  const [faculties, setFaculties] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [activeLecturer, setActiveLecturer] = useState(true);
  const [errors, setErrors] = useState({});
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchLecturers = async (facultyId) => {
    setLoading(true);
    if (facultyId !== "") {
      const response = await Apis.get(endpoints.lecturers(facultyId));
      setLecturers(response.data);
    } else {
      setLecturers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!registered && thesis.facultyId !== "") {
      fetchLecturers(thesis.facultyId);
      setThesis((prev) => ({
        ...prev,
        lecturer1Id: "",
        lecturer2Id: "",
      }));
    }
  }, [thesis.facultyId]);

  useEffect(() => {
    setLoading(true);
    const fetchFaculties = async () => {
      const response = await Apis.get(endpoints.faculties);
      setFaculties(response.data);
    };
    fetchFaculties();
    const fetchThesis = async () => {
      const response = await Apis.get(endpoints.studentThesis(user.id));
      if (response.data) {
        setThesis(response.data);
        console.log(response.data);
        setRegistered(true);
      }
    };
    if (user.id) {
      fetchThesis();
    }
    setLoading(false);
  }, []);

  const handleLecturerChange = (field, value) => {
    setThesis((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "lecturer1Id" && value !== "") {
      setActiveLecturer(false);
    } else if (field === "lecturer1Id" && value === "") {
      setActiveLecturer(true);
    }

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!thesis.name.trim()) {
      newErrors.name = "Tên đề tài là bắt buộc";
    }

    if (!thesis.facultyId) {
      newErrors.facultyId = "Vui lòng chọn khoa";
    }

    if (!thesis.lecturer1Id && !thesis.lecturer2Id) {
      newErrors.lecturer1Id = "Bạn phải chọn ít nhất một giảng viên hướng dẫn";
    }

    if (
      thesis.lecturer1Id &&
      thesis.lecturer2Id &&
      thesis.lecturer1Id === thesis.lecturer2Id
    ) {
      newErrors.lecturer2Id = "Không được chọn trùng giảng viên";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await authApis().post(endpoints.registerThesis, {
          ...thesis,
          studentId: user.id,
        });
        if (response.data) {
          alert("Đăng ký đề tài thành công");
          navigate(0);
        }
      } catch (err) {
        alert(err.response?.data?.message || "Đã xảy ra lỗi!");
      }
      setLoading(false);
    }
  };

  return (
    <Base>
      <div className="container d-flex flex-column justify-content-center">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="fw-bold">Khóa luận của tôi</h3>
          <span className="fs-5 fw-bold text-success">
            Trạng thái:{" "}
            {registered
              ? thesis.status === "WAITING"
                ? "Chờ duyệt"
                : thesis.status === "ACCEPTED"
                ? "Đã duyệt"
                : "Hoàn thành"
              : "Chưa đăng ký"}
          </span>
        </div>
        <div className="mt-4">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Tên đề tài *
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              name="name"
              placeholder="Nhập tên đề tài"
              value={thesis.name}
              onChange={(e) => {
                setThesis({ ...thesis, name: e.target.value });
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              disabled={registered}
              readOnly={registered}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          {!registered && (
            <>
              <div className="mb-3">
                <label htmlFor="facultyId" className="form-label">
                  Khoa *
                </label>
                <select
                  className={`form-select ${
                    errors.facultyId ? "is-invalid" : ""
                  }`}
                  aria-label="Default select example"
                  name="facultyId"
                  value={thesis.facultyId}
                  onChange={(e) => {
                    setThesis({ ...thesis, facultyId: e.target.value });
                    if (errors.facultyId) {
                      setErrors((prev) => ({ ...prev, facultyId: "" }));
                    }
                  }}
                >
                  <option value="">Chọn khoa</option>
                  {faculties.map((faculty) => (
                    <option value={faculty.id} key={"faculty-" + faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
                {errors.facultyId && (
                  <div className="invalid-feedback">{errors.facultyId}</div>
                )}
              </div>
              <div className="row">
                <div className="col">
                  <label htmlFor="lecturer1Id" className="form-label">
                    Giảng viên hướng dẫn 1 *
                  </label>
                  <select
                    className={`form-select ${
                      errors.lecturer1Id ? "is-invalid" : ""
                    }`}
                    aria-label="Default select example"
                    name="lecturer1Id"
                    value={thesis.lecturer1Id}
                    onChange={(e) =>
                      handleLecturerChange("lecturer1Id", e.target.value)
                    }
                  >
                    <option value="">Chọn giảng viên</option>
                    {lecturers?.map((lecturer) => (
                      <option
                        value={lecturer.id}
                        key={"lecturer1-" + lecturer.id}
                      >
                        {lecturer.fullName}
                      </option>
                    ))}
                  </select>
                  {errors.lecturer1Id && (
                    <div className="invalid-feedback">{errors.lecturer1Id}</div>
                  )}
                </div>
                <div className="col">
                  <label htmlFor="lecturer2Id" className="form-label">
                    Giảng viên hướng dẫn 2
                  </label>
                  <select
                    className={`form-select ${
                      errors.lecturer2Id ? "is-invalid" : ""
                    }`}
                    aria-label="Default select example"
                    name="lecturer2Id"
                    value={thesis.lecturer2Id}
                    onChange={(e) =>
                      handleLecturerChange("lecturer2Id", e.target.value)
                    }
                    disabled={activeLecturer}
                  >
                    <option value="">Chọn giảng viên</option>
                    {lecturers
                      .filter((lecturer) => lecturer.id !== thesis.lecturer1Id)
                      .map((lecturer) => (
                        <option
                          value={lecturer.id}
                          key={"lecturer2-" + lecturer.id}
                        >
                          {lecturer.fullName}
                        </option>
                      ))}
                  </select>
                  {errors.lecturer2Id && (
                    <div className="invalid-feedback">{errors.lecturer2Id}</div>
                  )}
                </div>
              </div>
              <div className="mt-4 d-flex justify-content-center">
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Đăng ký
                </button>
              </div>
            </>
          )}
          {registered && (
            <>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Khoa *
                </label>
                <input
                  type="text"
                  className={`form-control`}
                  value={thesis.facultyName}
                  disabled={true}
                  readOnly={true}
                />
              </div>
              <div className="row">
                {thesis.listInstructor.map((lecturer, index) => (
                  <div className="col" key={"lecturer-" + lecturer.id}>
                    <label htmlFor="name" className="form-label">
                      Giảng viên hướng dẫn {index + 1}
                    </label>
                    <input
                      type="text"
                      className={`form-control`}
                      value={lecturer.name}
                      disabled={true}
                      readOnly={true}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Base>
  );
}

export default StudentThesis;
