import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Form, InputGroup, Dropdown,Pagination,Row,Col,Card,Modal,Spinner} from "react-bootstrap";
import { Plus, Search, ArrowClockwise, Funnel,ChevronLeft,ChevronRight,Eye,Lock,Trash} from "react-bootstrap-icons";
import Base from "../../Base";
import Apis, { endpoints } from "../../../configs/Apis";
import userEvent from "@testing-library/user-event";

const Council = () => {
    const [faculties, setFaculties] = useState([]);
    const [facultyId, setFacultyId] = useState();
    const [lecturerOption, setLecturerOption] = useState([]);
    const [members, setMembers] = useState([{ role: "chair", lecturerId: "" }]);
    const [showModal, setShowModal] = useState(false);
    const [councilName, setCouncilName] = useState("");
    const [councils, setCouncils] = useState([]);
    
    // States cho xem chi tiết council
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [councilDetail, setCouncilDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const addMember = () => {
      setMembers(prev => [...prev, { role: "",lecturerId: "" }]);
    };
      const removeMember = (index) => {
    setMembers(prev => prev.filter((_, i) => i !== index));
  };
    const updateMember = (index, field, value) => {
      setMembers(prev =>
        prev.map((member, i) =>
          i === index ? { ...member, [field]: value } : member
        )
      );
    };

  const loadFaculties = async () => {
      let res = await Apis.get(endpoints.faculties);
      console.log(res.data);
    setFaculties(res.data);
     
  };
  const loadLecturerOption = async (facultyId) => {
    try {
      let res = await Apis.get(endpoints.lecturerOption(facultyId)); 
      console.log("Lecturer options:", res.data);
      const validLecturers = Array.isArray(res.data) ? res.data.filter(l => l && l.id) : [];
      setLecturerOption(validLecturers);
    } catch (error) {
      console.error("Error loading lecturer options:", error);
      setLecturerOption([]);
    }
  }
  const loadCouncils = async () => {
    try {
      let res = await Apis.get(endpoints.councils); 
      console.log("Councils data:", res.data);
      if (res.data && Array.isArray(res.data)) {
        setCouncils(res.data);
      } else {
        console.warn("Councils data is not an array:", res.data);
        setCouncils([]);
      }
    } catch (error) {
      console.error("Error loading councils:", error);
      setCouncils([]);
    }
  }
  
  // Xem chi tiết council
  const handleViewDetail = async (councilId) => {
    try {
      setDetailLoading(true);
      console.log("Loading council detail for ID:", councilId);
      
      // Thay vì dùng endpoints.councilDetail(councilId), dùng string trực tiếp
      const endpointUrl = `/councils/${councilId}`;
      console.log("Endpoint URL:", endpointUrl);
      
      const response = await Apis.get(endpointUrl);
      console.log("Council detail data:", response.data);
      
      if (response.data) {
        setCouncilDetail(response.data);
        setShowDetailModal(true);
      } else {
        console.warn("No council detail data received");
      }
    } catch (error) {
      console.error("Error loading council detail:", error);
      alert("Có lỗi xảy ra khi tải chi tiết hội đồng!");
    } finally {
      setDetailLoading(false);
    }
  };

  // Khóa hội đồng
  const handleCloseCouncil = async (councilId) => {
    if (window.confirm("Bạn có chắc chắn muốn khóa hội đồng này? Hành động này sẽ hoàn thành tất cả khóa luận, gửi email thông báo đến sinh viên và không thể hoàn tác.")) {
      try {
        console.log("Closing council with ID:", councilId);
        
        // Bước 1: Khóa hội đồng trước
        console.log("Closing council...");
        await Apis.put(endpoints.closeCouncil(councilId));
        
        // Bước 2: Nếu khóa hội đồng thành công, gửi email thông báo đến sinh viên
        console.log("Sending email to students...");
        await Apis.get(endpoints.sendEmailStudents(councilId));
        
        alert("Khóa hội đồng thành công! Email thông báo đã được gửi đến sinh viên.");
        
        // Reload danh sách
        await loadCouncils();
      } catch (error) {
        console.error("Error closing council:", error);
        if (error.response?.data?.message) {
          alert(`Có lỗi xảy ra: ${error.response.data.message}`);
        } else {
          alert("Có lỗi xảy ra khi khóa hội đồng!");
        }
      }
    }
  };

  useEffect(() => {
    loadFaculties();
    loadCouncils();
  }, [])

  // Hàm gửi API POST
  const save = async () => {
    try {
      console.log(members)
      const membersData = members
        .filter(member => member.role && member.lecturerId)
        .map(member => ({
          role: member.role,
          lecturerId: Number(member.lecturerId)
        }));
      
      console.log(membersData);
      
      // Request data theo cấu trúc database
      const requestData = {
        name: councilName,           // council.name (String)
        facultyId: Number(facultyId), // Convert String thành Number
        status: true,                   // council.status (boolean) - mặc định true khi tạo mới
        members: membersData         // Backend mong đợi "members"
      };




      // Gửi API POST
      const response = await Apis.post(endpoints.councils, requestData);
      console.log("Response:", response.data);

      // Đóng modal và reset form
      setShowModal(false);
      setCouncilName("");
      setFacultyId("");
      setMembers([{ role: "", lecturerId: "" }]);
      setLecturerOption([]);

      // Reload lại danh sách councils
      await loadCouncils();

      alert("Thêm hội đồng thành công!");

    } catch (error) {
      console.error("Lỗi khi gửi API:", error);
      alert("Có lỗi xảy ra khi thêm hội đồng!");
    }
  };


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
                  <th className="border-0">Khoa</th>
                  <th className="border-0">Trạng thái</th>
                  <th className="border-0">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {councils.length > 0 ? (
                  councils.map((council, index) => (
                    <tr key={council.id || index} style={{ backgroundColor: "white" }} className="my-3">
                      <td>{council.id}</td>
                      <td>{council.name}</td>
                      <td>{council.faculty?.name || council.facultyName || 'N/A'}</td>
                      <td>
                        <span className={`badge ${council.status ? 'bg-success' : 'bg-secondary'}`}>
                          {council.status ? 'Đang mở' : 'Đã đóng'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => handleViewDetail(council.id)}
                            disabled={detailLoading}
                            title="Xem chi tiết"
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px', padding: '0' }}
                          >
                            {detailLoading ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <Eye size={14} />
                            )}
                          </Button>
                          
                          {council.status && (
                            <Button 
                              variant="warning" 
                              size="sm"
                              onClick={() => handleCloseCouncil(council.id)}
                              title="Khóa hội đồng"
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '32px', height: '32px', padding: '0' }}
                            >
                              <Lock size={14} />
                            </Button>
                          )}
                          
                          <Button 
                            variant="danger" 
                            size="sm" 
                            title="Xóa hội đồng"
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px', padding: '0' }}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Không có dữ liệu hội đồng
                    </td>
                  </tr>
                )}
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

      {/* Modal Chi tiết Hội đồng */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Hội đồng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {councilDetail && (
            <Form>
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Mã hội đồng</Form.Label>
                    <Form.Control
                      type="text"
                      value={councilDetail.id || ''}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={9}>
                  <Form.Group>
                    <Form.Label>Tên hội đồng</Form.Label>
                    <Form.Control
                      type="text"
                      value={councilDetail.name || ''}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Khoa</Form.Label>
                    <Form.Control
                      type="text"
                      value={councilDetail.facultyName || 'N/A'}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Control
                      type="text"
                      value={councilDetail.status ? 'Đang mở' : 'Đã đóng'}
                      className={councilDetail.status ? 'text-success' : 'text-secondary'}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3">Thành viên hội đồng</h6>
              <Table bordered>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Chức vụ</th>
                    <th>Họ và tên</th>
                  </tr>
                </thead>
                <tbody>
                  {(councilDetail.lecturers || councilDetail.members) && (councilDetail.lecturers || councilDetail.members).length > 0 ? (
                    (councilDetail.lecturers || councilDetail.members).map((member, index) => (
                      <tr key={member.id || index}>
                        <td>{index + 1}</td>
                        <td>
                          <span className={`badge ${
                            member.role === 'chair' ? 'bg-primary' :
                            member.role === 'secretary' ? 'bg-info' :
                            member.role === 'reviewer' ? 'bg-warning' : 'bg-secondary'
                          }`}>
                            {member.role === 'chair' ? 'Chủ tịch' :
                             member.role === 'secretary' ? 'Thư ký' :
                             member.role === 'reviewer' ? 'Phản biện' : 'Thành viên'}
                          </span>
                        </td>
                        <td>{member.fullName || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-3">
                        Chưa có thành viên nào trong hội đồng
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

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
                    value={councilName}
                    onChange={(e) => setCouncilName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Khoa</Form.Label>
                  <Form.Select onChange={(e)=>{
                    loadLecturerOption(e.target.value);
                    setFacultyId(e.target.value);
                  }}>
                    <option value = "">Chọn khoa</option>
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
                  {members.map((member, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Select
                          value={member.role}
                          onChange={(e) => updateMember(index, 'role', e.target.value)}>
                          <option value="chair">Chủ tịch</option>
                          <option value="secretary">Thư ký</option>
                          <option value="reviewer">Phản biện</option>
                          <option value="member">Thành viên</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Group>
                          <Form.Select
                            value={member.lecturerId || ""}
                            onChange={(e) => updateMember(index, 'lecturerId', e.target.value)}>
                            <option value="">Chọn giảng viên</option>
                            {Array.isArray(lecturerOption) && lecturerOption
                              .filter(l => l && l.id)
                              .map(l => 
                                <option key={l.id} value={l.id}>{l.fullName}</option>
                              )}
                          </Form.Select>
                        </Form.Group>
                      </td>
                      <td>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 text-danger"
                          onClick={() => removeMember(index)}>
                          <Trash size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="success" size="sm" onClick={addMember}>
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
          <Button variant="success" onClick={save}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </Base>
  );
};

export default Council;