import React, { useEffect, useState } from "react";
import Base from "../../Base";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import {
  PencilSquare,
  EyeFill,
  ChevronLeft,
  ChevronRight,
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
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LecturerThesis = () => {
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thesisDetail, setThesisDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewDetail = async (thesisId) => {
    setViewLoading(true);
    const response = await Apis.get(endpoints.thesisDetail(thesisId));
    setThesisDetail(response.data);
    setShowDetail(true);
    setViewLoading(false);
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
      const response = await authApis().get(
        endpoints.lecturerThesis + "?page=" + currentPage + "&kw=" + search
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
          <h3 className="fw-bold">Danh sách khóa luận đang hướng dẫn</h3>
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
                {thesisDetail?.listInstructor.map((instructor, index) => (
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Giảng viên hướng dẫn {index + 1}</Form.Label>
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
                  <Form.Label>File báo cáo</Form.Label>
                  <Form.Control
                    aria-label="Default select example"
                    value={thesisDetail?.submissionFile || "Chưa nộp"}
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
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="btn btn-secondary me-2"
                onClick={() => setShowDetail(false)}
              >
                Đóng
              </Button>
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
                          className={`btn btn-primary me-2 p-2 d-flex align-items-center justify-content-center`}
                          onClick={() => handleViewDetail(thesis.id)}
                          readOnly={viewLoading}
                        >
                          <EyeFill />
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
};

export default LecturerThesis;
