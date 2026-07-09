
// src/frontend/utils/departments.ts
// Amrita Vishwa Vidyapeetham, Chennai Campus — 2023 Curriculum

export type SubjectCategory =
  | 'Core'
  | 'Mathematics'
  | 'Hardware & Electronics'
  | 'Labs & Practicals'
  | 'Electives'
  | 'Humanities'
  | 'Project';

export const CATEGORY_ORDER: SubjectCategory[] = [
  'Core',
  'Mathematics',
  'Hardware & Electronics',
  'Labs & Practicals',
  'Electives',
  'Humanities',
  'Project',
];

export const CATEGORY_META: Record<SubjectCategory, { icon: string; color: string }> = {
  'Core':                  { icon: 'BookOpen',    color: '#12cd00' },
  'Mathematics':           { icon: 'Calculator',  color: '#60a5fa' },
  'Hardware & Electronics':{ icon: 'Cpu',         color: '#f59e0b' },
  'Labs & Practicals':     { icon: 'FlaskConical',color: '#a78bfa' },
  'Electives':             { icon: 'Sparkles',    color: '#f472b6' },
  'Humanities':            { icon: 'Globe',       color: '#34d399' },
  'Project':               { icon: 'FolderGit2',  color: '#fb923c' },
};

export interface Subject {
  code: string;
  name: string;
  category: SubjectCategory;
  typicalSemester?: number; // kept for reference only, NOT used for grouping
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  subjects: Subject[];
}

// Shared humanities subjects that appear across all B.Tech departments
const COMMON_HUMANITIES: Subject[] = [
  { code: '23ENG101', name: 'Technical Communication',        category: 'Humanities', typicalSemester: 1 },
  { code: '22ADM101', name: 'Foundations of Indian Heritage', category: 'Humanities', typicalSemester: 1 },
  { code: '22AVP103', name: 'Mastery Over Mind',              category: 'Humanities', typicalSemester: 1 },
  { code: '22ADM111', name: 'Glimpses of Glorious India',     category: 'Humanities', typicalSemester: 2 },
  { code: '23LSE201', name: 'Life Skills for Engineers I',    category: 'Humanities', typicalSemester: 3 },
  { code: '23LSE211', name: 'Life Skills for Engineers II',   category: 'Humanities', typicalSemester: 4 },
  { code: '23LSE301', name: 'Life Skills for Engineers III',  category: 'Humanities', typicalSemester: 5 },
  { code: '23LSE311', name: 'Life Skills for Engineers IV',   category: 'Humanities', typicalSemester: 6 },
  { code: '23ENV300', name: 'Environmental Science',          category: 'Humanities', typicalSemester: 5 },
  { code: '23LAW300', name: 'Indian Constitution',            category: 'Humanities', typicalSemester: 7 },
];

export const DEPARTMENTS: Department[] = [

  // CSE
  {
    id: 'cse',
    name: 'Computer Science and Engineering',
    description: 'Core computer science, software systems, algorithms, databases, and networks.',
    icon: 'Cpu',
    subjects: [
      { code: '23CSE101', name: 'Computational Problem Solving',          category: 'Core' },
      { code: '23CSE111', name: 'Object Oriented Programming',            category: 'Core' },
      { code: '23CSE113', name: 'User Interface Design',                  category: 'Core' },
      { code: '23CSE201', name: 'Procedural Programming using C',         category: 'Core' },
      { code: '23CSE202', name: 'Database Management Systems',            category: 'Core' },
      { code: '23CSE203', name: 'Data Structures and Algorithms',         category: 'Core' },
      { code: '23CSE211', name: 'Design and Analysis of Algorithms',      category: 'Core' },
      { code: '23CSE212', name: 'Principles of Functional Languages',     category: 'Core' },
      { code: '23CSE214', name: 'Operating Systems',                      category: 'Core' },
      { code: '23CSE301', name: 'Computer Networks',                      category: 'Core' },
      { code: '23CSE302', name: 'Software Engineering',                   category: 'Core' },
      { code: '23CSE303', name: 'Theory of Computation',                  category: 'Core' },
      { code: '23CSE311', name: 'Compiler Design',                        category: 'Core' },
      { code: '23CSE312', name: 'Distributed Systems',                    category: 'Core' },
      { code: '23MAT107', name: 'Calculus and Its Applications',          category: 'Mathematics' },
      { code: '23MAT116', name: 'Discrete Mathematics',                   category: 'Mathematics' },
      { code: '23MAT117', name: 'Linear Algebra',                         category: 'Mathematics' },
      { code: '23MAT206', name: 'Optimization Techniques',                category: 'Mathematics' },
      { code: '23MAT216', name: 'Probability and Random Processes',       category: 'Mathematics' },
      { code: '23PHY115', name: 'Modern Physics',                         category: 'Mathematics' },
      { code: '23CSE102', name: 'Computer Hardware Essentials',           category: 'Hardware & Electronics' },
      { code: '23EEE104', name: 'Introduction to Electrical and Electronics Engineering', category: 'Hardware & Electronics' },
      { code: '23CSE213', name: 'Computer Organization and Architecture', category: 'Hardware & Electronics' },
      { code: '23CSE304', name: 'Embedded Systems',                       category: 'Hardware & Electronics' },
      { code: '23ECE205', name: 'Digital Electronics',                    category: 'Hardware & Electronics' },
      { code: '23EEE184', name: 'Basic EEE Practice',                     category: 'Labs & Practicals' },
      { code: '23MEE115', name: 'Manufacturing Practice',                 category: 'Labs & Practicals' },
      { code: '23ECE285', name: 'Digital Electronics Laboratory',         category: 'Labs & Practicals' },
      { code: '23CSE313', name: 'Cloud Computing',                        category: 'Electives' },
      { code: '23CSE401', name: 'Cryptography and Network Security',      category: 'Electives' },
      { code: '23CSE451', name: 'Machine Learning',                       category: 'Electives' },
      { code: '23CSE452', name: 'Fundamentals of Artificial Intelligence',category: 'Electives' },
      ...COMMON_HUMANITIES,
      { code: '23LIV390', name: 'Live-in-Labs I',                         category: 'Project' },
      { code: '23LIV490', name: 'Live-in-Labs II',                        category: 'Project' },
      { code: '23CSE399', name: 'Project Phase I',                        category: 'Project' },
      { code: '23CSE498', name: 'Project Phase II',                       category: 'Project' },
      { code: '23CSE499', name: 'Project Phase III',                      category: 'Project' },
    ],
  },

  // CSE (Cyber Security)
  {
    id: 'cys',
    name: 'Computer Science and Engineering (Cyber Security)',
    description: 'Cryptography, network security, ethical hacking, digital forensics, and secure software development.',
    icon: 'ShieldAlert',
    subjects: [
      { code: '23CSE101', name: 'Computational Problem Solving',          category: 'Core' },
      { code: '23CSE111', name: 'Object Oriented Programming',            category: 'Core' },
      { code: '23CSE203', name: 'Data Structures and Algorithms',         category: 'Core' },
      { code: '23CSE202', name: 'Database Management Systems',            category: 'Core' },
      { code: '23CSE214', name: 'Operating Systems',                      category: 'Core' },
      { code: '23CSE301', name: 'Computer Networks',                      category: 'Core' },
      { code: '23CYS201', name: 'Foundations of Cyber Security',          category: 'Core' },
      { code: '23CYS202', name: 'Secure Coding Practices',                category: 'Core' },
      { code: '23CYS211', name: 'Network Security',                       category: 'Core' },
      { code: '23CYS212', name: 'Operating System Security',              category: 'Core' },
      { code: '23CYS301', name: 'Applied Cryptography',                   category: 'Core' },
      { code: '23CYS302', name: 'Ethical Hacking and Penetration Testing',category: 'Core' },
      { code: '23CYS311', name: 'Digital Forensics',                      category: 'Core' },
      { code: '23CYS312', name: 'Malware Analysis',                       category: 'Core' },
      { code: '23MAT107', name: 'Calculus and Its Applications',          category: 'Mathematics' },
      { code: '23MAT116', name: 'Discrete Mathematics',                   category: 'Mathematics' },
      { code: '23MAT216', name: 'Probability and Random Processes',       category: 'Mathematics' },
      { code: '23CSE213', name: 'Computer Organization and Architecture', category: 'Hardware & Electronics' },
      { code: '23ECE205', name: 'Digital Electronics',                    category: 'Hardware & Electronics' },
      { code: '23CYS401', name: 'Cloud Security',                         category: 'Electives' },
      ...COMMON_HUMANITIES,
      { code: '23CYS399', name: 'Project Phase I',                        category: 'Project' },
      { code: '23CYS499', name: 'Project Phase II / III',                 category: 'Project' },
    ],
  },

  // CSE (AI)
  {
    id: 'cse-ai',
    name: 'Computer Science and Engineering (Artificial Intelligence)',
    description: 'Neural networks, machine learning, deep learning, NLP, and cognitive AI systems.',
    icon: 'Blocks',
    subjects: [
      { code: '23CSE101', name: 'Computational Problem Solving',          category: 'Core' },
      { code: '23CSE111', name: 'Object Oriented Programming',            category: 'Core' },
      { code: '23CSE203', name: 'Data Structures and Algorithms',         category: 'Core' },
      { code: '23CSE214', name: 'Operating Systems',                      category: 'Core' },
      { code: '23AIE201', name: 'Foundations of Data Science',            category: 'Core' },
      { code: '23AIE202', name: 'Introduction to AI',                     category: 'Core' },
      { code: '23AIE211', name: 'Machine Learning Foundations',           category: 'Core' },
      { code: '23AIE212', name: 'Big Data Analytics',                     category: 'Core' },
      { code: '23AIE301', name: 'Deep Learning',                          category: 'Core' },
      { code: '23AIE302', name: 'Natural Language Processing',            category: 'Core' },
      { code: '23AIE303', name: 'Computer Vision',                        category: 'Core' },
      { code: '23MAT107', name: 'Calculus and Its Applications',          category: 'Mathematics' },
      { code: '23MAT116', name: 'Discrete Mathematics',                   category: 'Mathematics' },
      { code: '23MAT117', name: 'Linear Algebra',                         category: 'Mathematics' },
      { code: '23MAT206', name: 'Optimization Techniques',                category: 'Mathematics' },
      { code: '23MAT216', name: 'Probability and Random Processes',       category: 'Mathematics' },
      { code: '23CSE213', name: 'Computer Organization and Architecture', category: 'Hardware & Electronics' },
      { code: '23ECE205', name: 'Digital Electronics',                    category: 'Hardware & Electronics' },
      { code: '23AIE311', name: 'Reinforcement Learning',                 category: 'Electives' },
      { code: '23AIE312', name: 'AI in Healthcare',                       category: 'Electives' },
      { code: '23AIE401', name: 'Robotics and Automation',                category: 'Electives' },
      ...COMMON_HUMANITIES,
      { code: '23AIE399', name: 'Project Phase I',                        category: 'Project' },
      { code: '23AIE499', name: 'Project Phase II / III',                 category: 'Project' },
    ],
  },

  // AI & Data Science
  {
    id: 'aids',
    name: 'Artificial Intelligence and Data Science',
    description: 'Data analytics, ML pipelines, AI-driven decision making, and statistical modelling.',
    icon: 'Brain',
    subjects: [
      { code: '23CSE101', name: 'Computational Problem Solving',          category: 'Core' },
      { code: '23CSE111', name: 'Object Oriented Programming',            category: 'Core' },
      { code: '23CSE203', name: 'Data Structures and Algorithms',         category: 'Core' },
      { code: '23CSE202', name: 'Database Management Systems',            category: 'Core' },
      { code: '23AIE201', name: 'Foundations of Data Science',            category: 'Core' },
      { code: '23AIE202', name: 'Introduction to AI',                     category: 'Core' },
      { code: '23AIE211', name: 'Machine Learning Foundations',           category: 'Core' },
      { code: '23AIE212', name: 'Big Data Analytics',                     category: 'Core' },
      { code: '23AIE301', name: 'Deep Learning',                          category: 'Core' },
      { code: '23AIE302', name: 'Natural Language Processing',            category: 'Core' },
      { code: '23AIE303', name: 'Computer Vision',                        category: 'Core' },
      { code: '23MAT107', name: 'Calculus and Its Applications',          category: 'Mathematics' },
      { code: '23MAT116', name: 'Discrete Mathematics',                   category: 'Mathematics' },
      { code: '23MAT206', name: 'Optimization Techniques',                category: 'Mathematics' },
      { code: '23MAT216', name: 'Probability and Random Processes',       category: 'Mathematics' },
      { code: '23AIE311', name: 'Reinforcement Learning',                 category: 'Electives' },
      { code: '23AIE312', name: 'AI in Healthcare',                       category: 'Electives' },
      { code: '23AIE401', name: 'Robotics and Automation',                category: 'Electives' },
      ...COMMON_HUMANITIES,
      { code: '23ADS399', name: 'Project Phase I',                        category: 'Project' },
      { code: '23ADS499', name: 'Project Phase II / III',                 category: 'Project' },
    ],
  },

  // CCE
  {
    id: 'cce',
    name: 'Computer and Communication Engineering',
    description: 'Computer engineering meets telecommunications — network architectures, signal processing, wireless networks.',
    icon: 'Network',
    subjects: [
      { code: '23CSE101', name: 'Computational Problem Solving',          category: 'Core' },
      { code: '23CSE111', name: 'Object Oriented Programming',            category: 'Core' },
      { code: '23CSE203', name: 'Data Structures and Algorithms',         category: 'Core' },
      { code: '23CSE202', name: 'Database Management Systems',            category: 'Core' },
      { code: '23CSE214', name: 'Operating Systems',                      category: 'Core' },
      { code: '23CSE301', name: 'Computer Networks',                      category: 'Core' },
      { code: '23MAT107', name: 'Calculus and Its Applications',          category: 'Mathematics' },
      { code: '23MAT116', name: 'Discrete Mathematics',                   category: 'Mathematics' },
      { code: '23MAT216', name: 'Probability and Random Processes',       category: 'Mathematics' },
      { code: '23ECE201', name: 'Signals and Systems',                    category: 'Hardware & Electronics' },
      { code: '23ECE205', name: 'Digital Electronics',                    category: 'Hardware & Electronics' },
      { code: '23ECE212', name: 'Digital Signal Processing',              category: 'Hardware & Electronics' },
      { code: '23CSE213', name: 'Computer Organization and Architecture', category: 'Hardware & Electronics' },
      { code: '23ECE312', name: 'Embedded Systems',                       category: 'Hardware & Electronics' },
      { code: '23ECE401', name: 'Wireless Communication',                 category: 'Hardware & Electronics' },
      { code: '23ECE285', name: 'Digital Electronics Laboratory',         category: 'Labs & Practicals' },
      { code: '23CSE313', name: 'Cloud Computing',                        category: 'Electives' },
      ...COMMON_HUMANITIES,
      { code: '23CCE399', name: 'Project Phase I',                        category: 'Project' },
      { code: '23CCE499', name: 'Project Phase II / III',                 category: 'Project' },
    ],
  },

  // ECE
  {
    id: 'ece',
    name: 'Electronics and Communication Engineering',
    description: 'Microelectronics, VLSI design, digital signal processing, wireless networks, and embedded systems.',
    icon: 'Radio',
    subjects: [
      { code: '23ECE201', name: 'Signals and Systems',                    category: 'Core' },
      { code: '23ECE202', name: 'Analog Electronics',                     category: 'Core' },
      { code: '23ECE205', name: 'Digital Electronics',                    category: 'Core' },
      { code: '23ECE211', name: 'Microprocessors and Microcontrollers',   category: 'Core' },
      { code: '23ECE212', name: 'Digital Signal Processing',              category: 'Core' },
      { code: '23ECE301', name: 'VLSI Design',                            category: 'Core' },
      { code: '23ECE302', name: 'Analog Communication',                   category: 'Core' },
      { code: '23ECE303', name: 'Electromagnetic Waves',                  category: 'Core' },
      { code: '23ECE311', name: 'Digital Communication',                  category: 'Core' },
      { code: '23ECE312', name: 'Embedded Systems',                       category: 'Core' },
      { code: '23ECE401', name: 'Wireless Communication',                 category: 'Core' },
      { code: '23MAT107', name: 'Calculus and Its Applications',          category: 'Mathematics' },
      { code: '23MAT117', name: 'Linear Algebra',                         category: 'Mathematics' },
      { code: '23MAT216', name: 'Probability and Random Processes',       category: 'Mathematics' },
      { code: '23EEE184', name: 'Basic EEE Practice',                     category: 'Labs & Practicals' },
      { code: '23ECE285', name: 'Digital Electronics Laboratory',         category: 'Labs & Practicals' },
      { code: '23ECE451', name: 'RF and Microwave Engineering',           category: 'Electives' },
      { code: '23ECE452', name: 'Internet of Things',                     category: 'Electives' },
      ...COMMON_HUMANITIES,
      { code: '23ECE399', name: 'Project Phase I',                        category: 'Project' },
      { code: '23ECE499', name: 'Project Phase II / III',                 category: 'Project' },
    ],
  },

  // Mechanical
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    description: 'Thermodynamics, fluid mechanics, CAD/CAM, machine design, and manufacturing processes.',
    icon: 'Wrench',
    subjects: [
      { code: '23MEE201', name: 'Engineering Thermodynamics',             category: 'Core' },
      { code: '23MEE202', name: 'Mechanics of Solids',                    category: 'Core' },
      { code: '23MEE203', name: 'Material Science and Metallurgy',        category: 'Core' },
      { code: '23MEE211', name: 'Fluid Mechanics and Machinery',          category: 'Core' },
      { code: '23MEE212', name: 'Kinematics of Machinery',                category: 'Core' },
      { code: '23MEE213', name: 'Manufacturing Processes',                category: 'Core' },
      { code: '23MEE301', name: 'Heat and Mass Transfer',                 category: 'Core' },
      { code: '23MEE302', name: 'Dynamics of Machinery',                  category: 'Core' },
      { code: '23MEE311', name: 'Design of Machine Elements',             category: 'Core' },
      { code: '23MEE312', name: 'CAD/CAM',                                category: 'Core' },
      { code: '23MAT107', name: 'Calculus and Its Applications',          category: 'Mathematics' },
      { code: '23MAT117', name: 'Linear Algebra',                         category: 'Mathematics' },
      { code: '23MAT206', name: 'Optimization Techniques',                category: 'Mathematics' },
      { code: '23MAT216', name: 'Probability and Random Processes',       category: 'Mathematics' },
      { code: '23EEE104', name: 'Introduction to Electrical and Electronics Engineering', category: 'Hardware & Electronics' },
      { code: '23MEE115', name: 'Manufacturing Practice',                 category: 'Labs & Practicals' },
      { code: '23EEE184', name: 'Basic EEE Practice',                     category: 'Labs & Practicals' },
      { code: '23MEE401', name: 'Operations Research',                    category: 'Electives' },
      { code: '23MEE402', name: 'Robotics',                               category: 'Electives' },
      { code: '23MEE403', name: 'Finite Element Analysis',                category: 'Electives' },
      ...COMMON_HUMANITIES,
      { code: '23MEE399', name: 'Project Phase I',                        category: 'Project' },
      { code: '23MEE499', name: 'Project Phase II / III',                 category: 'Project' },
    ],
  },

  // Robotics & AI
  {
    id: 'rai',
    name: 'Robotics and Artificial Intelligence',
    description: 'Robot kinematics, embedded controllers, sensor integration, autonomous navigation, and human-robot collaboration.',
    icon: 'Bot',
    subjects: [
      { code: '23CSE101', name: 'Computational Problem Solving',          category: 'Core' },
      { code: '23CSE111', name: 'Object Oriented Programming',            category: 'Core' },
      { code: '23AIE202', name: 'Introduction to AI',                     category: 'Core' },
      { code: '23AIE301', name: 'Deep Learning',                          category: 'Core' },
      { code: '23AIE303', name: 'Computer Vision',                        category: 'Core' },
      { code: '23AIE401', name: 'Robotics and Automation',                category: 'Core' },
      { code: '23MEE212', name: 'Kinematics of Machinery',                category: 'Core' },
      { code: '23MAT107', name: 'Calculus and Its Applications',          category: 'Mathematics' },
      { code: '23MAT117', name: 'Linear Algebra',                         category: 'Mathematics' },
      { code: '23MAT216', name: 'Probability and Random Processes',       category: 'Mathematics' },
      { code: '23ECE205', name: 'Digital Electronics',                    category: 'Hardware & Electronics' },
      { code: '23ECE312', name: 'Embedded Systems',                       category: 'Hardware & Electronics' },
      { code: '23CSE213', name: 'Computer Organization and Architecture', category: 'Hardware & Electronics' },
      { code: '23ECE285', name: 'Digital Electronics Laboratory',         category: 'Labs & Practicals' },
      { code: '23AIE311', name: 'Reinforcement Learning',                 category: 'Electives' },
      ...COMMON_HUMANITIES,
      { code: '23RAI399', name: 'Project Phase I',                        category: 'Project' },
      { code: '23RAI499', name: 'Project Phase II / III',                 category: 'Project' },
    ],
  },

  // M.Tech VLSI
  {
    id: 'mtech-vlsi',
    name: 'M.Tech in VLSI Design',
    description: 'Advanced postgraduate program in chip design, FPGA, and embedded hardware systems.',
    icon: 'Microchip',
    subjects: [
      { code: '23ECE301', name: 'VLSI Design',                            category: 'Core' },
      { code: '23ECE205', name: 'Digital Electronics',                    category: 'Core' },
      { code: '23ECE211', name: 'Microprocessors and Microcontrollers',   category: 'Core' },
      { code: '23ECE212', name: 'Digital Signal Processing',              category: 'Core' },
      { code: '23ECE312', name: 'Embedded Systems',                       category: 'Core' },
      { code: '23ECE285', name: 'Digital Electronics Laboratory',         category: 'Labs & Practicals' },
      { code: '23PGE499', name: 'Dissertation / Research Project',        category: 'Project' },
    ],
  },

  // M.Tech CSE
  {
    id: 'mtech-cse',
    name: 'M.Tech in Computer Science and Engineering',
    description: 'Advanced postgraduate program covering distributed systems, ML, and research-oriented computing.',
    icon: 'GraduationCap',
    subjects: [
      { code: '23CSE312', name: 'Distributed Systems',                    category: 'Core' },
      { code: '23CSE451', name: 'Machine Learning',                       category: 'Core' },
      { code: '23CSE313', name: 'Cloud Computing',                        category: 'Core' },
      { code: '23CSE401', name: 'Cryptography and Network Security',      category: 'Core' },
      { code: '23AIE301', name: 'Deep Learning',                          category: 'Electives' },
      { code: '23PGC499', name: 'Dissertation / Research Project',        category: 'Project' },
    ],
  },
];

// Curriculum registry — add 2027 here when it arrives
const CURRICULUM_REGISTRY: Record<number, Department[]> = {
  2023: DEPARTMENTS,
};

export function getDepartmentsForBatch(joinYear: number): Department[] {
  const cutoffs = Object.keys(CURRICULUM_REGISTRY).map(Number).sort((a, b) => b - a);
  for (const cutoff of cutoffs) {
    if (joinYear >= cutoff) return CURRICULUM_REGISTRY[cutoff];
  }
  return DEPARTMENTS;
}

