import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Form, InputGroup, Dropdown,Pagination,Row,Col,Card,Modal} from "react-bootstrap";
import { Plus, Search, ArrowClockwise, Funnel,ChevronLeft,ChevronRight,Pencil,ThreeDots,Trash} from "react-bootstrap-icons";
import Base from "../../Base";
import Apis, { endpoints } from "../../../configs/Apis";

const Council = () => {
 const councils = [
    {
      id: "HĐ0001",
      name: "Hội đồng A",
      academicYear: "2023-2024",
      semester: "2",
      faculty: "Công nghệ thông tin"
    },
    {
      id: "HĐ0002", 
      name: "Hội đồng B",
      academicYear: "2023-2024",
      semester: "2",
      faculty: "Điện tử - Viễn thông"
    }
  ];
    const [faculties, setFaculties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [members, setMembers] = useState([{ role: "", name: "" }
  ]);
  const loadFaculties = async () => {
      let res = await Apis.get(endpoints.faculties);
      console.log(res.data);
    setFaculties(res.data);
     
  };

  useEffect(() => {
    loadFaculties();
  }, [])


  return (
    <Base >
      <div className="council-list">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Danh sách Hội đồng</h2>
          <div className="d-flex align-items-center">
            <Button variant="success" className="d-flex align-items-center" onClick={()=>setShowModal(true)}>
              <Plus className="me-2" />
              Thêm
            
            </Button>
          </div>
        </div>

        {/* Filter and Search Section */}
        <Card className="mb-4 m-2">
          <Card.Body className="">
            <Row className="align-items-center">
              <Col md={3}>
                <Button variant="outline-secondary" className="d-flex align-items-center">
                  <Funnel className="me-2" />
                  Lọc
                </Button>
              </Col>
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Tìm kiếm"
                  />
                  <Button variant="outline-secondary">
                    <ArrowClockwise />
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Table Section */}
        <Card className="mb-4 p-3">
          <Card.Body className="p-0">
            <Table responsive>
              <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                  <th className="border-0">Mã hội đồng</th>
                  <th className="border-0">Tên hội đồng</th>
                  <th className="border-0">Năm học</th>
                  <th className="border-0">Học kỳ</th>
                  <th className="border-0">Khoa</th>
                </tr>
              </thead>
              <tbody>
                {councils.map((council, index) => (
                  <tr key={council.id} style={{ backgroundColor: "white" }} className="my-3">
                    <td>{council.id}</td>
                    <td>{council.name}</td>
                    <td>{council.academicYear}</td>
                    <td>{council.semester}</td>
                    <td>
                      <div className="d-flex align-items-center justify-content-between">
                        <span>{council.faculty}</span>
                        <div className="d-flex gap-2">
                          <Button variant="link" size="sm" className="p-0">
                            <Pencil size={16} />
                          </Button>
                          <Button variant="link" size="sm" className="p-0">
                            <ThreeDots size={16} />
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Pagination Section */}
        <div className="d-flex justify-content-end align-items-center mt-3">
          <div className="d-flex align-items-center gap-3">
            <Pagination className="mb-0">
              <Pagination.Prev>
                <ChevronLeft />
              </Pagination.Prev>
              <Pagination.Next>
                <ChevronRight />
              </Pagination.Next>
            </Pagination>
          </div>
        </div>
      </div>

      {/* Modal Thêm mới Hội đồng */}
      <Modal show={showModal} onHide={()=>setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới Hội đồng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Tên hội đồng *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên hội đồng"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Khoa</Form.Label>
                  <Form.Select>
                    {Array.isArray(faculties) && faculties.map(f => 
                      <option key={f.id} value={f.id}>{f.name}</option>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <h6 className="mb-3">Thành viên hội đồng</h6>
            <div className="mb-3">
              <Table bordered>
                <thead>
                  <tr>
                    <th>Chức vụ</th>
                    <th>Họ và tên</th>
                    <th width="50px"></th>
                  </tr>
                </thead>
                <tbody>
                 
                </tbody>
              </Table>
              <Button variant="success" size="sm">
                <Plus className="me-1" />
                Thêm
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowModal(false)}>
             Hủy bỏ
          </Button>
          <Button variant="success">
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </Base>
  );
};

export default Council;