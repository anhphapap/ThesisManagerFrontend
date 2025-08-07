import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { EyeFill, StarFill } from "react-bootstrap-icons";
import cookie from "react-cookies";
import Base from "../../Base";
import { authApis, endpoints } from "../../../configs/Apis";
import { UserContext } from "../../../configs/Contexts";

const LecturerThesisReviewer = () => {
  const [user] = useContext(UserContext);
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [thesisDetail, setThesisDetail] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [showMarkingModal, setShowMarkingModal] = useState(false);
  const [markingData, setMarkingData] = useState({
    thesisId: null,
    score: {
      format: "",
      content: "",
      research: "",
      presentation: "",
    },
  });
  const [markingLoading, setMarkingLoading] = useState(false);
  const [loadingExistingMark, setLoadingExistingMark] = useState(false);

  const loadTheses = async () => {
    try {
      setLoading(true);
      const response = await authApis().get(endpoints.lecturerThesisReviewer);
      if (response.data && Array.isArray(response.data)) {
        setTheses(response.data);
      } else {
        setTheses([]);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("401");
      }
      setTheses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (thesisId) => {
    try {
      setViewLoading(true);
      const response = await authApis().get(endpoints.thesisDetail(thesisId));
      if (response.data) {
        setThesisDetail(response.data);
        setShowDetail(true);
      } else {
        console.warn("Không có dữ liệu");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi load chi tiết khóa luận!");
    } finally {
      setViewLoading(false);
    }
  };

  const handleOpenMarking = async (thesisId) => {
    setLoadingExistingMark(true);

    setMarkingData({
      thesisId: thesisId,
      score: {
        format: "",
        content: "",
        research: "",
        presentation: "",
      },
    });

    setShowMarkingModal(true);

    try {
      const response = await authApis().get(endpoints.getThesisMark(thesisId));
      if (response.data) {
        setMarkingData({
          thesisId: thesisId,
          score: {
            format:
              response.data.format === -1 ? 0 : response.data.format || "",
            content:
              response.data.content === -1 ? 0 : response.data.content || "",
            research:
              response.data.research === -1 ? 0 : response.data.research || "",
            presentation:
              response.data.presentation === -1
                ? 0
                : response.data.presentation || "",
          },
        });
      }
    } catch (error) {
      console.log("Chưa có điểm đã chấm hoặc lỗi khi load:", error);
    } finally {
      setLoadingExistingMark(false);
    }
  };

  const handleScoreChange = (criteriaKey, value) => {
    if (value === "") {
      setMarkingData((prev) => ({
        ...prev,
        score: {
          ...prev.score,
          [criteriaKey]: "",
        },
      }));
    } else {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 10) {
        setMarkingData((prev) => ({
          ...prev,
          score: {
            ...prev.score,
            [criteriaKey]: numericValue,
          },
        }));
      }
    }
  };

  const handleSubmitMarking = async () => {
    const { format, content, research, presentation } = markingData.score;

    if (!format || !content || !research || !presentation) {
      alert("Vui lòng nhập đầy đủ điểm cho tất cả các tiêu chí!");
      return;
    }

    const scores = [format, content, research, presentation];
    const hasInvalidScore = scores.some((score) => {
      const num = parseFloat(score);
      return isNaN(num) || num < 0 || num > 10;
    });

    if (hasInvalidScore) {
      alert("Điểm phải là số từ 0 đến 10!");
      return;
    }

    try {
      setMarkingLoading(true);
      console.log("Submitting marking data:", markingData);

      const response = await authApis().put(endpoints.thesisMark, markingData);
      console.log("Marking response:", response.data);

      alert("Lưu điểm thành công!");
      setShowMarkingModal(false);

      await loadTheses();
    } catch (error) {
      console.error("Error submitting marking:", error);
      alert("Có lỗi xảy ra khi chấm điểm!");
    } finally {
      setMarkingLoading(false);
    }
  };

  useEffect(() => {
    loadTheses();
  }, []);

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status" className="text-primary" />
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">Danh sách khóa luận đang phản biện</h3>
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
                          value={thesisDetail?.id || ""}
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
                          value={thesisDetail?.name || ""}
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
                          value={
                            thesisDetail?.studentName ||
                            thesisDetail?.student?.fullName ||
                            "N/A"
                          }
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
                          value={
                            thesisDetail?.facultyName ||
                            thesisDetail?.faculty?.name ||
                            "N/A"
                          }
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
                          : thesisDetail?.status === "COMPLETED"
                          ? "Hoàn thành"
                          : thesisDetail?.status
                      }
                      className={
                        thesisDetail?.status === "WAITING"
                          ? "text-warning"
                          : thesisDetail?.status === "ACCEPTED"
                          ? "text-success"
                          : thesisDetail?.status === "COMPLETED"
                          ? "text-primary"
                          : "text-secondary"
                      }
                      readOnly
                    />
                  </Form.Group>
                  {thesisDetail?.listInstructor?.map((instructor, index) => (
                    <Form.Group
                      key={index}
                      className="mb-3"
                      controlId={`instructor-${index}`}
                    >
                      <Form.Label>Giảng viên hướng dẫn {index + 1}</Form.Label>
                      <Form.Control
                        aria-label="Default select example"
                        value={instructor.name || instructor.fullName || "N/A"}
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
            <Modal
              show={showMarkingModal}
              onHide={() => setShowMarkingModal(false)}
              size="lg"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  Chấm điểm khóa luận (ID: {markingData.thesisId})
                  {loadingExistingMark && (
                    <Spinner animation="border" size="sm" className="ms-2" />
                  )}
                  {!loadingExistingMark &&
                    markingData.score.format !== "" &&
                    markingData.score.format !== -1 && (
                      <span className="badge bg-info ms-2">Đã có điểm</span>
                    )}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {loadingExistingMark && (
                  <div className="text-center mb-3">
                    <Spinner animation="border" className="me-2" />
                    <span>Đang tải điểm đã chấm...</span>
                  </div>
                )}
                {!loadingExistingMark &&
                  markingData.score.format !== "" &&
                  markingData.score.format !== -1 && (
                    <div className="alert alert-info mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Khóa luận này đã được chấm điểm. Bạn có thể chỉnh sửa các
                      điểm dưới đây.
                    </div>
                  )}
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Định dạng (Format){" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={markingData.score.format}
                          onChange={(e) =>
                            handleScoreChange("format", e.target.value)
                          }
                          placeholder="Nhập điểm"
                          isInvalid={
                            markingData.score.format !== "" &&
                            (isNaN(parseFloat(markingData.score.format)) ||
                              parseFloat(markingData.score.format) < 0 ||
                              parseFloat(markingData.score.format) > 10)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Điểm phải là số từ 0 đến 10
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Nội dung (Content){" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={markingData.score.content}
                          onChange={(e) =>
                            handleScoreChange("content", e.target.value)
                          }
                          placeholder="Nhập điểm"
                          isInvalid={
                            markingData.score.content !== "" &&
                            (isNaN(parseFloat(markingData.score.content)) ||
                              parseFloat(markingData.score.content) < 0 ||
                              parseFloat(markingData.score.content) > 10)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Điểm phải là số từ 0 đến 10
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Nghiên cứu (Research){" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={markingData.score.research}
                          onChange={(e) =>
                            handleScoreChange("research", e.target.value)
                          }
                          placeholder="Nhập điểm"
                          isInvalid={
                            markingData.score.research !== "" &&
                            (isNaN(parseFloat(markingData.score.research)) ||
                              parseFloat(markingData.score.research) < 0 ||
                              parseFloat(markingData.score.research) > 10)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Điểm phải là số từ 0 đến 10
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Thuyết trình (Presentation){" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={markingData.score.presentation}
                          onChange={(e) =>
                            handleScoreChange("presentation", e.target.value)
                          }
                          placeholder="Nhập điểm"
                          isInvalid={
                            markingData.score.presentation !== "" &&
                            (isNaN(
                              parseFloat(markingData.score.presentation)
                            ) ||
                              parseFloat(markingData.score.presentation) < 0 ||
                              parseFloat(markingData.score.presentation) > 10)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Điểm phải là số từ 0 đến 10
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Tổng điểm trung bình</Form.Label>
                        <Form.Control
                          type="text"
                          value={(() => {
                            const scores = [
                              markingData.score.format,
                              markingData.score.content,
                              markingData.score.research,
                              markingData.score.presentation,
                            ];

                            const validScores = scores.filter(
                              (score) =>
                                score !== "" && !isNaN(parseFloat(score))
                            );

                            if (validScores.length === 0) {
                              return "";
                            } else if (validScores.length === 4) {
                              const sum = validScores.reduce(
                                (acc, score) => acc + parseFloat(score),
                                0
                              );
                              return (sum / 4).toFixed(2);
                            } else {
                              return "Nhập đầy đủ điểm";
                            }
                          })()}
                          readOnly
                          className="fw-bold text-primary"
                          placeholder="Điểm trung bình"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowMarkingModal(false)}
                  disabled={markingLoading}
                >
                  Hủy bỏ
                </Button>
                <Button
                  variant="success"
                  onClick={handleSubmitMarking}
                  disabled={markingLoading}
                >
                  {markingLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu điểm"
                  )}
                </Button>
              </Modal.Footer>
            </Modal>

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
                {theses.length > 0 ? (
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
                              ? "text-warning"
                              : thesis.status === "ACCEPTED"
                              ? "text-success"
                              : thesis.status === "COMPLETED"
                              ? "text-primary"
                              : "text-secondary"
                          }`}
                        >
                          {thesis.status === "WAITING"
                            ? "Chờ duyệt"
                            : thesis.status === "ACCEPTED"
                            ? "Đã duyệt"
                            : thesis.status === "COMPLETED"
                            ? "Hoàn thành"
                            : thesis.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className={`btn btn-primary me-2 p-2 d-flex align-items-center justify-content-center`}
                            onClick={() => handleViewDetail(thesis.id)}
                            disabled={viewLoading}
                            style={{ minWidth: "40px", minHeight: "40px" }}
                            title="Xem chi tiết"
                          >
                            {viewLoading ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <EyeFill />
                            )}
                          </button>
                          <button
                            type="button"
                            className={`btn btn-warning p-2 d-flex align-items-center justify-content-center`}
                            onClick={() => handleOpenMarking(thesis.id)}
                            style={{ minWidth: "40px", minHeight: "40px" }}
                            title="Chấm điểm"
                          >
                            <StarFill />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Không có khóa luận nào để phản biện
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default LecturerThesisReviewer;
