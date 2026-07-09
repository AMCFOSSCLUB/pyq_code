import { Subject } from '@/frontend/utils/departments';
import { Curriculum } from './curriculum-2023';

export const curriculum2027: Curriculum = {
  year: 2027,
  departments: {
    cse: {
      semesters: [1, 2, 3],
      subjects: [
        { code: '27CSE101', name: 'Next-Gen Programming in C', typicalSemester: 1 },
        { code: '27CSE201', name: 'Advanced Data Structures', typicalSemester: 3 },
        { code: '27CSE202', name: 'Object Oriented Design patterns', typicalSemester: 3 }
      ]
    },
    cys: {
      semesters: [1],
      subjects: [
        { code: '27CYS101', name: 'AI-Driven Cyber Security', typicalSemester: 1 }
      ]
    },
    'cse-ai': {
      semesters: [1],
      subjects: [
        { code: '27AIE101', name: 'Quantum AI and Robotics', typicalSemester: 1 }
      ]
    },
    aids: {
      semesters: [1],
      subjects: [
        { code: '27ADS101', name: 'Foundations of Big Data Science', typicalSemester: 1 }
      ]
    },
    cce: {
      semesters: [1],
      subjects: [
        { code: '27CCE101', name: 'Quantum Networking Systems', typicalSemester: 1 }
      ]
    },
    ece: {
      semesters: [1],
      subjects: [
        { code: '27ECE101', name: 'Nano-Electronics & VLSI', typicalSemester: 1 }
      ]
    },
    mech: {
      semesters: [1],
      subjects: [
        { code: '27MEE102', name: 'Computational Fluid Dynamics', typicalSemester: 1 }
      ]
    },
    rai: {
      semesters: [1],
      subjects: [
        { code: '27RAI101', name: 'Autonomous Robotics', typicalSemester: 1 }
      ]
    },
    are: {
      semesters: [1],
      subjects: [
        { code: '27ARE101', name: 'Smart Factory Automation', typicalSemester: 1 }
      ]
    },
    'mtech-cse': {
      semesters: [1],
      subjects: [
        { code: '27CS601', name: 'Distributed Systems & Blockchain', typicalSemester: 1 }
      ]
    },
    'mtech-vlsi': {
      semesters: [1],
      subjects: [
        { code: '27VL601', name: 'Neuromorphic Hardware Design', typicalSemester: 1 }
      ]
    }
  }
};
