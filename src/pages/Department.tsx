import React, { useState } from "react";
import {
  Building2,
  Users,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  UserCog,
  Search,
  X,
  AlertCircle,
  Check,
} from "lucide-react";

export default function OrganizationManagement() {
  const [expandedDepts, setExpandedDepts] = useState({});
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showEditDeptModal, setShowEditDeptModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Sample hierarchical organization data
  const [organization, setOrganization] = useState({
    id: "root",
    name: "Faculty of Information Technology",
    type: "Faculty",
    level: 0,
    children: [
      {
        id: "dept-1",
        name: "Department of Software Engineering",
        type: "Academic",
        level: 1,
        head: {
          id: 1,
          name: "Dr. Nguyen Van A",
          email: "nguyenvana@itec.hcmus.edu.vn",
        },
        memberCount: 25,
        children: [
          {
            id: "subdept-1-1",
            name: "Software Development Lab",
            type: "Lab",
            level: 2,
            head: {
              id: 2,
              name: "Dr. Tran Thi B",
              email: "tranthib@itec.hcmus.edu.vn",
            },
            memberCount: 12,
            children: [],
          },
          {
            id: "subdept-1-2",
            name: "Quality Assurance Team",
            type: "Team",
            level: 2,
            head: {
              id: 3,
              name: "Le Van C",
              email: "levanc@itec.hcmus.edu.vn",
            },
            memberCount: 8,
            children: [],
          },
        ],
      },
      {
        id: "dept-2",
        name: "Department of Data Science",
        type: "Academic",
        level: 1,
        head: {
          id: 4,
          name: "Dr. Pham Thi D",
          email: "phamthid@itec.hcmus.edu.vn",
        },
        memberCount: 20,
        children: [
          {
            id: "subdept-2-1",
            name: "AI Research Lab",
            type: "Lab",
            level: 2,
            head: {
              id: 5,
              name: "Dr. Hoang Van E",
              email: "hoangvane@itec.hcmus.edu.vn",
            },
            memberCount: 15,
            children: [],
          },
        ],
      },
      {
        id: "dept-3",
        name: "Faculty Office",
        type: "Administrative",
        level: 1,
        head: { id: 6, name: "Vo Thi F", email: "vothif@itec.hcmus.edu.vn" },
        memberCount: 10,
        children: [
          {
            id: "subdept-3-1",
            name: "Academic Affairs",
            type: "Office",
            level: 2,
            head: {
              id: 7,
              name: "Nguyen Van G",
              email: "nguyenvang@itec.hcmus.edu.vn",
            },
            memberCount: 5,
            children: [],
          },
          {
            id: "subdept-3-2",
            name: "Student Services",
            type: "Office",
            level: 2,
            head: {
              id: 8,
              name: "Tran Thi H",
              email: "tranthih@itec.hcmus.edu.vn",
            },
            memberCount: 5,
            children: [],
          },
        ],
      },
      {
        id: "dept-4",
        name: "Technical Support Team",
        type: "Support",
        level: 1,
        head: { id: 9, name: "Le Van I", email: "levani@itec.hcmus.edu.vn" },
        memberCount: 8,
        children: [],
      },
    ],
  });

  // Sample staff members for departments
  const departmentMembers = {
    "dept-1": [
      {
        id: 1,
        name: "Dr. Nguyen Van A",
        role: "Head of Department",
        email: "nguyenvana@itec.hcmus.edu.vn",
      },
      {
        id: 10,
        name: "Dr. Tran Van J",
        role: "Senior Lecturer",
        email: "tranvanj@itec.hcmus.edu.vn",
      },
      {
        id: 11,
        name: "Dr. Le Thi K",
        role: "Lecturer",
        email: "lethik@itec.hcmus.edu.vn",
      },
      {
        id: 12,
        name: "Pham Van L",
        role: "Teaching Assistant",
        email: "phamvanl@itec.hcmus.edu.vn",
      },
    ],
  };

  const toggleDepartment = (deptId) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  const handleAddDepartment = (parentDept) => {
    setSelectedParent(parentDept);
    setShowAddDeptModal(true);
    setError("");
  };

  const handleEditDepartment = (dept) => {
    setSelectedDept(dept);
    setShowEditDeptModal(true);
    setError("");
  };

  const handleViewMembers = (dept) => {
    setSelectedDept(dept);
    setShowMembersModal(true);
  };

  // Check for duplicate department names at the same level
  const checkDuplicateName = (name, parentId, excludeId = null) => {
    // Implementation for duplicate checking
    return false; // Placeholder
  };

  const DepartmentNode = ({ dept, level = 0 }) => {
    const isExpanded = expandedDepts[dept.id];
    const hasChildren = dept.children && dept.children.length > 0;
    const indent = level * 40;

    return (
      <div>
        <div
          style={{
            marginLeft: `${indent}px`,
            padding: "16px",
            backgroundColor: "white",
            borderRadius: "8px",
            marginBottom: "8px",
            border: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: 1,
            }}
          >
            {hasChildren && (
              <button
                onClick={() => toggleDepartment(dept.id)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isExpanded ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>
            )}
            {!hasChildren && <div style={{ width: "28px" }} />}

            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor:
                  level === 0 ? "#1976d2" : level === 1 ? "#e3f2fd" : "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building2 size={20} color={level === 0 ? "white" : "#1976d2"} />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "4px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1a1a1a",
                  }}
                >
                  {dept.name}
                </h3>
                <span
                  style={{
                    padding: "2px 8px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  {dept.type}
                </span>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#666",
                  display: "flex",
                  gap: "16px",
                }}
              >
                {dept.head && <span>Head: {dept.head.name}</span>}
                <span>Members: {dept.memberCount}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handleViewMembers(dept)}
              style={{
                padding: "8px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                backgroundColor: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "#666",
              }}
              title="View Members"
            >
              <Users size={16} />
              View
            </button>
            <button
              onClick={() => handleAddDepartment(dept)}
              style={{
                padding: "8px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                backgroundColor: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "#1976d2",
              }}
              title="Add Sub-department"
            >
              <Plus size={16} />
              Add
            </button>
            <button
              onClick={() => handleEditDepartment(dept)}
              style={{
                padding: "8px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                backgroundColor: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              title="Edit Department"
            >
              <Edit size={16} color="#1976d2" />
            </button>
            {level > 0 && (
              <button
                style={{
                  padding: "8px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Delete Department"
              >
                <Trash2 size={16} color="#d32f2f" />
              </button>
            )}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {dept.children.map((child) => (
              <DepartmentNode key={child.id} dept={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const AddDepartmentModal = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
            Add {selectedParent ? "Sub-" : ""}Department
          </h2>
          <button
            onClick={() => setShowAddDeptModal(false)}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {selectedParent && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
                color: "#666",
              }}
            >
              <strong>Parent Department:</strong> {selectedParent.name}
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#ffebee",
                border: "1px solid #ffcdd2",
                borderRadius: "8px",
                marginBottom: "16px",
                display: "flex",
                gap: "8px",
                alignItems: "center",
                color: "#d32f2f",
                fontSize: "14px",
              }}
            >
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Department Name *
              </label>
              <input
                type="text"
                placeholder="Enter department name"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
              <p
                style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#666" }}
              >
                System will check for duplicate names at this level
              </p>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Department Type *
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                <option>Select type</option>
                <option>Academic</option>
                <option>Administrative</option>
                <option>Support</option>
                <option>Lab</option>
                <option>Office</option>
                <option>Team</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Department Head
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                <option>Select department head</option>
                <option>Dr. Nguyen Van A</option>
                <option>Dr. Tran Thi B</option>
                <option>Le Van C</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Description
              </label>
              <textarea
                placeholder="Enter department description (optional)"
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => setShowAddDeptModal(false)}
              style={{
                padding: "10px 20px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Cancel
            </button>
            <button
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#1976d2",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Check size={16} />
              Create Department
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ViewMembersModal = () => {
    if (!selectedDept) return null;
    const members = departmentMembers[selectedDept.id] || [];

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "700px",
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              padding: "24px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                {selectedDept.name} - Members
              </h2>
              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                {members.length} member{members.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setShowMembersModal(false)}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ padding: "24px" }}>
            <div style={{ marginBottom: "16px" }}>
              <button
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <UserCog size={16} />
                Assign Members
              </button>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              {members.map((member) => (
                <div
                  key={member.id}
                  style={{
                    padding: "16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#e3f2fd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        color: "#1976d2",
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: "500",
                          fontSize: "14px",
                          color: "#1a1a1a",
                        }}
                      >
                        {member.name}
                      </div>
                      <div style={{ fontSize: "13px", color: "#666" }}>
                        {member.role}
                      </div>
                      <div style={{ fontSize: "12px", color: "#999" }}>
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <button
                    style={{
                      padding: "6px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "6px",
                      backgroundColor: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Trash2 size={16} color="#d32f2f" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            margin: "0 0 8px 0",
            fontSize: "28px",
            fontWeight: "600",
            color: "#1a1a1a",
          }}
        >
          Organization Management
        </h1>
        <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
          Manage hierarchical organizational structure and departments
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          gap: "16px",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
          <Search
            size={20}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#666",
            }}
          />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 40px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </div>

        <button
          onClick={() => handleAddDepartment(null)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          <Plus size={18} />
          Add Top-Level Department
        </button>
      </div>

      {/* Organization Tree */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}
        >
          Organizational Hierarchy
        </h2>
        <DepartmentNode dept={organization} level={0} />
      </div>

      {/* Modals */}
      {showAddDeptModal && <AddDepartmentModal />}
      {showMembersModal && <ViewMembersModal />}
    </div>
  );
}
