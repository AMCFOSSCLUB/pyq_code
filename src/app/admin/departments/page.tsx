"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { DEPARTMENTS } from "@/shared/departments";
import Link from "next/link";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  GraduationCap,
  Upload,
  BookOpen,
} from "lucide-react";

interface Subject {
  code: string;
  name: string;
  typicalSemester?: number;
  note?: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  subjects: Subject[];
}

interface DepartmentFormProps {
  department: Department | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<Department | null>(null);

  async function loadDepartments() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/departments");
      const result = await response.json();

      if (result.success && result.data) {
        setDepartments(result.data);
      } else {
        setDepartments(DEPARTMENTS);
      }
    } catch (error) {
      console.error(error);
      setDepartments(DEPARTMENTS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      return (
        dept.name.toLowerCase().includes(search.toLowerCase()) ||
        dept.id.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [departments, search]);

  return (
    <div>

      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.7rem",
              fontWeight: 700,
              marginBottom: 5,
            }}
          >
            Departments
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
            }}
          >
            Manage departments and their subjects.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button
            className="btn"
            onClick={() =>
              alert("Curriculum Upload will be added next.")
            }
          >
            Coming Soon
          </button>

          <button
            className="btn"
            onClick={() => {
              setEditingDepartment(null);
              setShowForm(true);
            }}
          >
            <Plus size={16} />
            &nbsp; Add Department
          </button>
        </div>
      </div>

      {/* Statistics */}

      <div
        className="grid-3"
        style={{
          marginBottom: 30,
        }}
      >
        <div className="glass-card stat-card">
          <BookOpen
            size={20}
            style={{
              color: "var(--violet-light)",
            }}
          />

          <h2
            style={{
              marginTop: 15,
              fontSize: "2rem",
            }}
          >
            {departments.length}
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
            }}
          >
            Total Departments
          </p>
        </div>

        <div className="glass-card stat-card">
          <GraduationCap
            size={20}
            style={{
              color: "var(--cyan-light)",
            }}
          />

          <h2
            style={{
              marginTop: 15,
              fontSize: "2rem",
            }}
          >
            {departments.reduce(
              (sum, dept) => sum + (dept.subjects?.length ?? 0),
              0
            )}
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
            }}
          >
            Total Subjects
          </p>
        </div>

        <div className="glass-card stat-card">
          <Search
            size={20}
            style={{
              color: "#10b981",
            }}
          />

          <h2
            style={{
              marginTop: 15,
              fontSize: "2rem",
            }}
          >
            {filteredDepartments.length}
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
            }}
          >
            Search Results
          </p>
        </div>
      </div>
            {/* Search */}

      <div
        className="glass-card"
        style={{
          padding: 20,
          marginBottom: 25,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Search
            size={18}
            color="var(--text-muted)"
          />

          <input
            type="text"
            placeholder="Search department by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              outline: "none",
              fontSize: "0.9rem",
            }}
          />
        </div>
      </div>

      {/* Departments Table */}

      <div
        className="glass-card"
        style={{
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: 60,
              textAlign: "center",
            }}
          >
            <p>Loading departments...</p>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "70px 20px",
            }}
          >
            <GraduationCap
              size={70}
              style={{
                opacity: 0.35,
                marginBottom: 15,
              }}
            />

            <h2>No Departments Found</h2>

            <p
              style={{
                color: "var(--text-muted)",
                marginTop: 10,
              }}
            >
              Click "Add Department" to create your first department.
            </p>
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--bg-secondary)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <th
                  align="left"
                  style={{ padding: "16px" }}
                >
                  Department
                </th>

                <th
                  align="left"
                  style={{ padding: "16px" }}
                >
                  Code
                </th>

                <th
                  align="center"
                  style={{ padding: "16px" }}
                >
                  Subjects
                </th>

                <th
                  align="center"
                  style={{ padding: "16px" }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredDepartments.map((department) => (
                <tr
                  key={department.id}
                  style={{
                    borderBottom:
                      "1px solid var(--border)",
                  }}
                >
                  <td
                    style={{
                      padding: "16px",
                      fontWeight: 600,
                    }}
                  >
                    <Link
                      href={`/admin/departments/${department.id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      {department.name}
                    </Link>
                  </td>

                  <td
                    style={{
                      padding: "16px",
                    }}
                  >
                    {department.id.toUpperCase()}
                  </td>

                  <td
                    align="center"
                    style={{
                      padding: "16px",
                    }}
                  >
                    {department.subjects?.length ?? 0}
                  </td>

                  <td
                    align="center"
                    style={{
                      padding: "16px",
                    }}
                  >
                    <button
                      className="btn"
                      style={{
                        marginRight: 8,
                      }}
                      onClick={() => {
                        setEditingDepartment(
                          department
                        );
                        setShowForm(true);
                      }}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="btn"
                      style={{
                        color: "#ef4444",
                      }}
                      onClick={() =>
                        deleteDepartment(
                          department.id,
                          loadDepartments
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
            {/* Department Form */}

      {showForm && (
        <DepartmentForm
          department={editingDepartment}
          onClose={() => {
            setShowForm(false);
            setEditingDepartment(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditingDepartment(null);
            loadDepartments();
          }}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Department Form                                  */
/* -------------------------------------------------------------------------- */

function DepartmentForm({
  department,
  onClose,
  onSaved,
}: DepartmentFormProps) {
  const [name, setName] = useState(department?.name ?? "");
  const [id, setId] = useState(department?.id ?? "");
  const [description, setDescription] = useState(
    department?.description ?? ""
  );
  const [icon, setIcon] = useState(
    department?.icon ?? "BookOpen"
  );

  const [saving, setSaving] = useState(false);

  async function saveDepartment() {
    if (!name.trim() || !id.trim()) {
      alert("Department Name and Code are required.");
      return;
    }

    setSaving(true);

    const payload = {
      id: id.toLowerCase(),
      name,
      description,
      icon,
      subjects: department?.subjects ?? [],
    };

    try {
      const url = department
        ? `/api/admin/departments/${department.id}`
        : "/api/admin/departments";

      const method = department ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message || "Unable to save.");
        return;
      }

      onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to save department.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        className="glass-card"
        style={{
          width: 600,
          maxWidth: "95%",
          padding: 30,
        }}
      >
        <h2
          style={{
            marginBottom: 20,
          }}
        >
          {department
            ? "Edit Department"
            : "Add Department"}
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div>
            <label>Department Name</label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label>Department Code</label>

            <input
              value={id}
              onChange={(e) =>
                setId(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label>Description</label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label>Icon</label>

            <input
              value={icon}
              onChange={(e) =>
                setIcon(e.target.value)
              }
              style={inputStyle}
            />
          </div>
                    <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 10,
            }}
          >
            <button
              className="btn"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="btn"
              onClick={saveDepartment}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Department"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          Delete Department                                 */
/* -------------------------------------------------------------------------- */

async function deleteDepartment(
  id: string,
  reload: () => void
) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this department?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `/api/admin/departments/${id}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Department deleted successfully.");
      reload();
    } else {
      alert(
        result.message ??
          "Unable to delete department."
      );
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
}

/* -------------------------------------------------------------------------- */
/*                              Input Style                                   */
/* -------------------------------------------------------------------------- */

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  marginTop: 6,
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  outline: "none",
  fontSize: "0.9rem",
};
/* -------------------------------------------------------------------------- */
/*                        Upload Curriculum PDF                               */
/* -------------------------------------------------------------------------- */

async function uploadCurriculum(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      "/api/admin/departments/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (result.success) {
      alert(
        "Curriculum uploaded successfully. Departments have been updated."
      );

      window.location.reload();
    } else {
      alert(
        result.message ||
          "Unable to process curriculum."
      );
    }
  } catch (error) {
    console.error(error);
    alert("Upload failed.");
  }
}