import React, { useEffect, useState } from "react";
import Base from "../../Base";
import Apis, { endpoints } from "../../../configs/Apis";
import {
  PencilSquare,
  EyeFill,
  ChevronLeft,
  ChevronRight,
  Funnel,
  Search,
  ArrowClockwise,
} from "react-bootstrap-icons";
import {
  Modal,
  Button,
  Form,
  Col,
  Row,
  Spinner,
  Pagination,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function StaffThesis() {
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thesisDetail, setThesisDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [councils, setCouncils] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewDetail = async (thesisId) => {
    setViewLoading(true);
    const response = await Apis.get(endpoints.thesisDetail(thesisId));
    setThesisDetail(response.data);
    fetchCouncils(response.data.facultyId);
    fetchLecturers(response.data.facultyId);
    setShowDetail(true);
    setViewLoading(false);
  };

  const fetchCouncils = async (facultyId) => {
    const response = await Apis.get(
      endpoints.councils + "?facultyId=" + facultyId + "&status=true"
    );
    setCouncils(response.data);
  };

  const fetchLecturers = async (facultyId) => {
    const response = await Apis.get(endpoints.lecturers(facultyId));
    setLecturers(response.data);
  };

  const handleChangeCouncil = (councilId) => {
    setThesisDetail({ ...thesisDetail, councilId });
  };

  const handleChangeInstructor = (instructorId, index) => {
    setThesisDetail({
      ...thesisDetail,
      listInstructor: [
        ...thesisDetail.listInstructor.map((instructor, i) =>
          i === index ? { ...instructor, id: instructorId } : instructor
        ),
      ],
    });
  };

  const validateForm = async () => {
    const newErrors = {};

    if (!thesisDetail?.councilId) {
      newErrors.councilId = "Vui lòng chọn hội đồng";
    }

    if (
      thesisDetail?.listInstructor[0]?.id ===
      thesisDetail?.listInstructor[1]?.id
    ) {
      newErrors.listInstructor = "Không được chọn trùng giảng viên";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApprove = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        const response = await Apis.put(endpoints.updateThesis, {
          ...thesisDetail,
          status: "ACCEPTED",
          lecturer1Id: thesisDetail?.listInstructor[0]?.id,
          lecturer2Id: thesisDetail?.listInstructor[1]?.id,
          createdAt: new Date(),
        });
        if (response.data) {
          alert("Phê duyệt thành công");
          navigate(0);
          setShowDetail(false);
        }
      } catch (error) {
        alert(error.response?.data?.message || "Đã xảy ra lỗi!");
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    let timer = setTimeout(() => {
      if (currentPage > 0) fetchTheses();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchTheses = async () => {
    setLoading(true);
    try {
      const response = await Apis.get(
        endpoints.theses + "?page=" + currentPage + "&kw=" + search
      );
      if (response.data.length == 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        return;
      } else {
        if (currentPage <= 1) setTheses(response.data);
        else setTheses([...theses, ...response.data]);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Đã xảy ra lỗi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheses();
  }, []);

  return (
    <>
      <div className="d-flex flex-column justify-content-center">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">Danh sách khóa luận</h3>
        </div>
        <div className="bg-white p-4 rounded-3 shadow-sm">
          <Modal
            show={showDetail}
            onHide={() => setShowDetail(false)}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Chi tiết khóa luận</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col md={2}>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Mã khóa luận</Form.Label>
                      <Form.Control
                        type="text"
                        value={thesisDetail?.id}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md={10}>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Tên khóa luận</Form.Label>
                      <Form.Control
                        type="text"
                        value={thesisDetail?.name}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Sinh viên</Form.Label>
                      <Form.Control
                        type="text"
                        value={thesisDetail?.studentName}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Khoa</Form.Label>
                      <Form.Control
                        type="text"
                        value={thesisDetail?.facultyName}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      thesisDetail?.status === "WAITING"
                        ? "Chờ duyệt"
                        : thesisDetail?.status === "ACCEPTED"
                        ? "Đã duyệt"
                        : "Hoàn thành"
                    }
                    className={
                      thesisDetail?.status === "WAITING"
                        ? "text-success"
                        : thesisDetail?.status === "ACCEPTED"
                        ? "text-warning"
                        : "text-danger"
                    }
                    readOnly
                  />
                </Form.Group>
                {thesisDetail?.status === "WAITING" ? (
                  <>
                    {thesisDetail?.listInstructor.map((instructor, index) => (
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Giảng viên hướng dẫn {index + 1}
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={instructor.id}
                          readOnly={thesisDetail?.status !== "WAITING"}
                          onChange={(e) =>
                            handleChangeInstructor(e.target.value, index)
                          }
                        >
                          {lecturers.map((lecturer) => (
                            <option
                              key={"lecturer" + lecturer.id}
                              value={lecturer.id}
                            >
                              {lecturer.fullName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    ))}
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Hội đồng</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        value={thesisDetail?.councilId}
                        readOnly={thesisDetail?.status !== "WAITING"}
                        onChange={(e) => handleChangeCouncil(e.target.value)}
                        isInvalid={!!errors.councilId}
                      >
                        <option value="">Chọn hội đồng</option>
                        {councils.map((council) => (
                          <option
                            key={"council" + council.id}
                            value={council.id}
                          >
                            {council.name}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.councilId && (
                        <Form.Control.Feedback type="invalid">
                          {errors.councilId}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </>
                ) : (
                  <>
                    {thesisDetail?.listInstructor.map((instructor, index) => (
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Giảng viên hướng dẫn {index + 1}
                        </Form.Label>
                        <Form.Control
                          aria-label="Default select example"
                          value={instructor.name}
                          readOnly
                          type="text"
                        />
                      </Form.Group>
                    ))}
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Hội đồng chấm</Form.Label>
                      <Form.Control
                        aria-label="Default select example"
                        value={thesisDetail?.councilName || "Đang chờ duyệt"}
                        readOnly
                        type="text"
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Điểm trung bình</Form.Label>
                      <Form.Control
                        aria-label="Default select example"
                        value={thesisDetail?.avgScore || "Chưa chấm"}
                        readOnly
                        type="text"
                      />
                    </Form.Group>
                  </>
                )}
                {errors.listInstructor && (
                  <div className="alert alert-danger" role="alert">
                    {errors.listInstructor}
                  </div>
                )}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="btn btn-secondary me-2"
                onClick={() => setShowDetail(false)}
              >
                Đóng
              </Button>
              {thesisDetail?.status === "WAITING" && (
                <Button
                  className="btn btn-primary"
                  onClick={() => handleApprove()}
                >
                  Phê duyệt
                </Button>
              )}
            </Modal.Footer>
          </Modal>
          <div className="d-flex justify-content-end align-items-center mb-3">
            <InputGroup className="w-25">
              <InputGroup.Text>
                <Search />
              </InputGroup.Text>
              <Form.Control
                placeholder="Tìm kiếm khóa luận ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={() => setSearch("")}>
                <ArrowClockwise />
              </Button>
            </InputGroup>
          </div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên khóa luận</th>
                <th>Sinh viên</th>
                <th>Khoa</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center pt-3">
                    <Spinner
                      animation="border"
                      role="status"
                      className="text-primary"
                    />
                  </td>
                </tr>
              ) : (
                theses.map((thesis) => (
                  <tr key={thesis.id} className="align-middle">
                    <td>{thesis.id}</td>
                    <td>{thesis.name}</td>
                    <td>{thesis.studentName}</td>
                    <td>{thesis.facultyName}</td>
                    <td>
                      <span
                        className={`fw-bold ${
                          thesis.status === "WAITING"
                            ? "text-success"
                            : thesis.status === "ACCEPTED"
                            ? "text-warning"
                            : "text-danger"
                        }`}
                      >
                        {" "}
                        {thesis.status === "WAITING"
                          ? "Chờ duyệt"
                          : thesis.status === "ACCEPTED"
                          ? "Đã duyệt"
                          : "Hoàn thành"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className={`btn btn-primary me-2 p-2 d-flex align-items-center justify-content-center ${
                            thesis.status !== "WAITING"
                              ? "btn-primary"
                              : "btn-success"
                          }`}
                          onClick={() => handleViewDetail(thesis.id)}
                          disabled={viewLoading}
                        >
                          {thesis.status === "WAITING" ? (
                            <PencilSquare />
                          ) : (
                            <EyeFill />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {theses.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center pt-3">
                    <p className="text-muted fw-bold">Không có dữ liệu</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-end align-items-center mt-3">
          <div className="d-flex align-items-center gap-3">
            <Pagination className="mb-0">
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft />
              </Pagination.Prev>
              <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)}>
                <ChevronRight />
              </Pagination.Next>
            </Pagination>
          </div>
        </div>
      </div>
    </>
  );
}

export default StaffThesis;
