import { getFirebaseAdmin } from "@/backend/config/firebase-admin";
import { DEPARTMENTS } from "@/shared/departments";

export interface Subject {
  code: string;
  name: string;
  typicalSemester?: number;
  note?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  subjects: Subject[];
}

const COLLECTION = "departments";

function normalizeId(id: string) {
  return id.toString().toLowerCase();
}

function mergeDepartments(remote: Department[], local: Department[]) {
  const merged = new Map<string, Department>();

  local.forEach((dept) => merged.set(normalizeId(dept.id), dept));
  remote.forEach((dept) => merged.set(normalizeId(dept.id), dept));

  return Array.from(merged.values());
}

// Get all departments
export async function getDepartments(): Promise<Department[]> {
  const db = getFirebaseAdmin();
  const snapshot = await db.collection(COLLECTION).get();
  const remoteDepartments = snapshot.docs.map((doc) => ({
    ...(doc.data() as Department),
    id: doc.id,
  }));

  return mergeDepartments(remoteDepartments, DEPARTMENTS);
}

// Get one department
export async function getDepartment(id: string): Promise<Department | null> {
  const db = getFirebaseAdmin();
  const documentId = normalizeId(id);
  const doc = await db.collection(COLLECTION).doc(documentId).get();

  if (doc.exists) {
    return { ...(doc.data() as Department), id: doc.id };
  }

  return (
    DEPARTMENTS.find((department) =>
      normalizeId(department.id) === documentId
    ) || null
  );
}

// Add department
export async function addDepartment(department: Department) {
  const db = getFirebaseAdmin();
  const documentId = normalizeId(department.id);
  await db.collection(COLLECTION).doc(documentId).set({
    ...department,
    id: documentId,
  });
}

// Update department
export async function updateDepartment(
  id: string,
  data: Partial<Department>
) {
  const db = getFirebaseAdmin();
  const documentId = normalizeId(id);
  const docRef = db.collection(COLLECTION).doc(documentId);
  await docRef.set(data, { merge: true });
}

// Delete department
export async function deleteDepartment(id: string) {
  const db = getFirebaseAdmin();
  const documentId = normalizeId(id);
  await db.collection(COLLECTION).doc(documentId).delete();
}

// Add subject to department
export async function addSubject(
  departmentId: string,
  subject: Subject
) {
  const db = getFirebaseAdmin();
  const documentId = normalizeId(departmentId);
  const docRef = db.collection(COLLECTION).doc(documentId);
  const doc = await docRef.get();
  let department: Department | null = null;

  if (doc.exists) {
    department = { ...(doc.data() as Department), id: doc.id };
  } else {
    department = DEPARTMENTS.find(
      (dept) => normalizeId(dept.id) === documentId
    ) || null;
  }

  if (!department) {
    throw new Error("Department not found");
  }

  const subjects = department.subjects ?? [];
  const normalizedSubjectCode = normalizeId(subject.code);

  if (
    subjects.some(
      (existing) => normalizeId(existing.code) === normalizedSubjectCode
    )
  ) {
    throw new Error("Subject already exists.");
  }

  const nextSubjects = [...subjects, subject];
  await docRef.set(
    {
      ...department,
      subjects: nextSubjects,
      id: documentId,
    },
    { merge: true }
  );

  return subject;
}

// Update subject inside department
export async function updateSubject(
  departmentId: string,
  subjectCode: string,
  data: Partial<Subject>
) {
  const db = getFirebaseAdmin();
  const documentId = normalizeId(departmentId);
  const docRef = db.collection(COLLECTION).doc(documentId);
  const doc = await docRef.get();
  let department: Department | null = null;

  if (doc.exists) {
    department = { ...(doc.data() as Department), id: doc.id };
  } else {
    department = DEPARTMENTS.find(
      (dept) => normalizeId(dept.id) === documentId
    ) || null;
  }

  if (!department) {
    throw new Error("Department not found");
  }

  const subjects = department.subjects ?? [];
  const normalizedSubjectCode = normalizeId(subjectCode);
  const index = subjects.findIndex(
    (subject) => normalizeId(subject.code) === normalizedSubjectCode
  );

  if (index === -1) {
    throw new Error("Subject not found.");
  }

  const updatedSubject = {
    ...subjects[index],
    ...data,
    code: subjects[index].code,
  };
  const nextSubjects = [...subjects];
  nextSubjects[index] = updatedSubject;

  await docRef.set(
    {
      ...department,
      subjects: nextSubjects,
      id: documentId,
    },
    { merge: true }
  );

  return updatedSubject;
}

// Delete subject from department
export async function deleteSubject(
  departmentId: string,
  subjectCode: string
) {
  const db = getFirebaseAdmin();
  const documentId = normalizeId(departmentId);
  const docRef = db.collection(COLLECTION).doc(documentId);
  const doc = await docRef.get();
  let department: Department | null = null;

  if (doc.exists) {
    department = { ...(doc.data() as Department), id: doc.id };
  } else {
    department = DEPARTMENTS.find(
      (dept) => normalizeId(dept.id) === documentId
    ) || null;
  }

  if (!department) {
    throw new Error("Department not found");
  }

  const normalizedSubjectCode = normalizeId(subjectCode);
  const nextSubjects = (department.subjects ?? []).filter(
    (subject) => normalizeId(subject.code) !== normalizedSubjectCode
  );

  if (nextSubjects.length === (department.subjects ?? []).length) {
    throw new Error("Subject not found.");
  }

  await docRef.set(
    {
      ...department,
      subjects: nextSubjects,
      id: documentId,
    },
    { merge: true }
  );
}
