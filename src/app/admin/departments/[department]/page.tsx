"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { DEPARTMENTS, Department, Subject } from "@/shared/departments";

interface Props {
  params: {
    department: string;
  };
}

interface SubjectFormState {
  code: string;
  name: string;
  typicalSemester: string;
  note: string;
}

export default function DepartmentSubjectsPage({ params }: Props) {
  const departmentId = params.department.toLowerCase();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubjectCode, setEditingSubjectCode] = useState<string | null>(null);
  const [subjectForm, setSubjectForm] = useState<SubjectFormState>({
    code: "",
    name: "",
    typicalSemester: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadDepartment() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/admin/departments/${departmentId}`
        );
        const result = await response.json();

        if (result.success && result.data) {
          setDepartment(result.data);
        } else {
          const fallback = DEPARTMENTS.find(
            (dept) => dept.id.toLowerCase() === departmentId
          );
          setDepartment(fallback ?? null);
        }
      } catch (error) {
        console.error(error);
        const fallback = DEPARTMENTS.find(
          (dept) => dept.id.toLowerCase() === departmentId
        );
        setDepartment(fallback ?? null);
      } finally {
        setLoading(false);
      }
    }

    loadDepartment();
  }, [departmentId]);

  function openAddSubject() {
    setEditingSubjectCode(null);
    setSubjectForm({
      code: "",
      name: "",
      typicalSemester: "",
      note: "",
    });
    setShowForm(true);
  }

  function openEditSubject(subject: Subject) {
    setEditingSubjectCode(subject.code);
    setSubjectForm({
      code: subject.code,
      name: subject.name,
      typicalSemester:
        subject.typicalSemester !== undefined &&
        subject.typicalSemester !== null
          ? String(subject.typicalSemester)
          : "",
      note: subject.note ?? "",
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingSubjectCode(null);
    setSubjectForm({
      code: "",
      name: "",
      typicalSemester: "",
      note: "",
    });
  }

  async function saveSubject() {
    if (!department) return;

    if (!subjectForm.code.trim() || !subjectForm.name.trim()) {
      alert("Subject Code and Subject Name are required.");
      return;
    }

    setSaving(true);

    try {
      const isEditing = !!editingSubjectCode;
      const url = isEditing
        ? `/api/admin/departments/${department.id}/subjects/${editingSubjectCode}`
        : `/api/admin/departments/${department.id}/subjects`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: subjectForm.code,
          name: subjectForm.name,
          typicalSemester: subjectForm.typicalSemester
            ? Number(subjectForm.typicalSemester)
            : undefined,
          note: subjectForm.note,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message || "Unable to save subject.");
        return;
      }

      const nextSubjects = isEditing
        ? (department.subjects ?? []).map((subject) =>
            subject.code === editingSubjectCode
              ? {
                  ...subject,
                  name: subjectForm.name,
                  typicalSemester: subjectForm.typicalSemester
                    ? Number(subjectForm.typicalSemester)
                    : undefined,
                  note: subjectForm.note,
                }
              : subject
          )
        : [
            ...(department.subjects ?? []),
            {
              code: subjectForm.code,
              name: subjectForm.name,
              typicalSemester: subjectForm.typicalSemester
                ? Number(subjectForm.typicalSemester)
                : undefined,
              note: subjectForm.note,
            },
          ];

      setDepartment({
        ...department,
        subjects: nextSubjects,
      });

      alert(
        isEditing
          ? "Subject updated successfully."
          : "Subject added successfully."
      );

      closeForm();
    } catch (error) {
      console.error(error);
      alert("Failed to save subject. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSubject(subject: Subject) {
    if (!department) return;

    const confirmed = window.confirm(
      `Delete ${subject.code} - ${subject.name}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/departments/${department.id}/subjects/${subject.code}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!result.success) {
        alert(result.message || "Unable to delete subject.");
        return;
      }

      setDepartment({
        ...department,
        subjects: (department.subjects ?? []).filter(
          (item) => item.code !== subject.code
        ),
      });

      alert("Subject deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete subject. Please try again.");
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>Loading department...</p>
      </div>
    );
  }

  if (!department) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>Department not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <Link
            href="/admin/departments"
            style={{
              textDecoration: "none",
              color: "var(--text-muted)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 10,
            }}
          >
            <ArrowLeft size={16} />
            Back to Departments
          </Link>

          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {department.name}
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
            }}
          >
            {department.description}
          </p>
        </div>

        <button className="btn" onClick={openAddSubject}>
          <Plus size={16} />
          &nbsp; Add Subject
        </button>
      </div>

      <div
        className="grid-3"
        style={{
          marginBottom: 30,
        }}
      >
        <div className="glass-card stat-card">
          <BookOpen
            size={22}
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
            {department.subjects.length}
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
            }}
          >
            Total Subjects
          </p>
        </div>
      </div>

      <div
        className="glass-card"
        style={{
          overflow: "hidden",
        }}
      >
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
                style={{
                  padding: 16,
                }}
              >
                Subject Code
              </th>

              <th
                align="left"
                style={{
                  padding: 16,
                }}
              >
                Subject Name
              </th>

              <th
                align="center"
                style={{
                  padding: 16,
                }}
              >
                Semester
              </th>

              <th
                align="center"
                style={{
                  padding: 16,
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {department.subjects.map((subject) => (
              <tr
                key={subject.code}
                style={{
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <td
                  style={{
                    padding: 16,
                    fontWeight: 600,
                  }}
                >
                  {subject.code}
                </td>

                <td
                  style={{
                    padding: 16,
                  }}
                >
                  {subject.name}
                </td>

                <td
                  align="center"
                  style={{
                    padding: 16,
                  }}
                >
                  {subject.typicalSemester ?? "-"}
                </td>

                <td
                  align="center"
                  style={{
                    padding: 16,
                  }}
                >
                  <button
                    className="btn"
                    style={{
                      marginRight: 10,
                    }}
                    onClick={() => openEditSubject(subject)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="btn"
                    style={{
                      color: "#ef4444",
                    }}
                    onClick={() => deleteSubject(subject)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {department.subjects.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 60,
            }}
          >
            No subjects found.
          </div>
        )}
      </div>

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            className="glass-card"
            style={{
              width: 500,
              padding: 25,
            }}
          >
            <h2>
              {editingSubjectCode ? "Edit Subject" : "Add Subject"}
            </h2>

            <input
              placeholder="Subject Code"
              value={subjectForm.code}
              disabled={!!editingSubjectCode}
              onChange={(e) =>
                setSubjectForm({
                  ...subjectForm,
                  code: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Subject Name"
              value={subjectForm.name}
              onChange={(e) =>
                setSubjectForm({
                  ...subjectForm,
                  name: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Semester"
              value={subjectForm.typicalSemester}
              onChange={(e) =>
                setSubjectForm({
                  ...subjectForm,
                  typicalSemester: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Note"
              value={subjectForm.note}
              onChange={(e) =>
                setSubjectForm({
                  ...subjectForm,
                  note: e.target.value,
                })
              }
              style={inputStyle}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 20,
              }}
            >
              <button
                className="btn"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="btn"
                onClick={saveSubject}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  marginTop: 16,
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  outline: "none",
  fontSize: "0.9rem",
};
