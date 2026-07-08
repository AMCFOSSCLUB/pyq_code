export interface Subject {
  code: string;
  name: string;
  typicalSemester?: number;
  note?: string;
}

export interface Department {
  id: string; // e.g. 'cse', 'cys', 'cse-ai', 'aids', 'cce', 'ece', 'mech', 'rai', 'are'
  name: string;
  description: string;
  icon: string; // Lucide icon name, e.g. 'Cpu', 'Brain', 'Radio', 'Blocks', 'Bot', etc.
  subjects: Subject[];
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'cse',
    name: 'Computer Science and Engineering',
    description: 'Explore core computer science, software systems, algorithms, databases, and networks.',
    icon: 'Cpu',
    subjects: [
      { code: '22CSE101', name: 'Programming in C', typicalSemester: 1, note: 'Semester may vary by batch.' },
      { code: '22CSE201', name: 'Data Structures', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22CSE202', name: 'Object Oriented Programming', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22CSE211', name: 'Database Management Systems', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22CSE212', name: 'Operating Systems', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22CSE214', name: 'Computer Networks', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22CSE301', name: 'Design and Analysis of Algorithms', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22CSE302', name: 'Theory of Computation', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22CSE303', name: 'Software Engineering', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22CSE311', name: 'Compiler Design', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22CSE312', name: 'Artificial Intelligence', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22CSE314', name: 'Web Technologies', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22CSE401', name: 'Information Security', typicalSemester: 7, note: 'Semester may vary by batch.' },
      { code: '22CSE402', name: 'Cloud Computing', typicalSemester: 7, note: 'Semester may vary by batch.' },
      { code: '22CSE403', name: 'Machine Learning', typicalSemester: 7, note: 'Semester may vary by batch.' }
    ]
  },
  {
    id: 'cys',
    name: 'Computer Science and Engineering (Cyber Security)',
    description: 'Focus on cryptography, network security, ethical hacking, digital forensics, and secure software development.',
    icon: 'ShieldAlert',
    subjects: [
      { code: '22CYS101', name: 'Introduction to Cyber Security', typicalSemester: 1, note: 'Semester may vary by batch.' },
      { code: '22CYS201', name: 'Data Structures and Algorithms', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22CYS202', name: 'Object Oriented Programming', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22CYS211', name: 'Operating Systems and Security', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22CYS212', name: 'Database Systems and Security', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22CYS301', name: 'Cryptography', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22CYS302', name: 'Network Security', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22CYS311', name: 'Ethical Hacking', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22CYS312', name: 'Secure Software Development', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22CYS401', name: 'Digital Forensics', typicalSemester: 7, note: 'Semester may vary by batch.' },
      { code: '22CYS402', name: 'Malware Analysis', typicalSemester: 7, note: 'Semester may vary by batch.' },
      { code: '22CYS403', name: 'Penetration Testing', typicalSemester: 7, note: 'Semester may vary by batch.' }
    ]
  },
  {
    id: 'cse-ai',
    name: 'Computer Science and Engineering (Artificial Intelligence)',
    description: 'Learn mathematics for intelligent systems, neural networks, machine learning, deep learning, NLP, and cognitive robotics.',
    icon: 'Blocks',
    subjects: [
      { code: '22AIE101', name: 'Introduction to AI and Robotics', typicalSemester: 1, note: 'Semester may vary by batch.' },
      { code: '22MAT103', name: 'Mathematics for Intelligent Systems 1', typicalSemester: 1, note: 'Semester may vary by batch.' },
      { code: '22AIE111', name: 'Data Structures and Algorithms', typicalSemester: 2, note: 'Semester may vary by batch.' },
      { code: '22MAT113', name: 'Mathematics for Intelligent Systems 2', typicalSemester: 2, note: 'Semester may vary by batch.' },
      { code: '22AIE201', name: 'Object Oriented Programming for AI', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22MAT203', name: 'Mathematics for Intelligent Systems 3', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22AIE211', name: 'Database Management and AI Applications', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22AIE212', name: 'Operating Systems', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22AIE301', name: 'Machine Learning', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22AIE302', name: 'Deep Learning', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22AIE311', name: 'Natural Language Processing', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22AIE312', name: 'Computer Vision', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22AIE313', name: 'Reinforcement Learning', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22AIE401', name: 'Generative AI and Large Language Models', typicalSemester: 7, note: 'Semester may vary by batch.' }
    ]
  },
  {
    id: 'aids',
    name: 'Artificial Intelligence and Data Science',
    description: 'Learn computational models, data analytics, machine learning algorithms, deep learning, and statistical analysis.',
    icon: 'Brain',
    subjects: [
      { code: '22ADS101', name: 'Introduction to Data Science', typicalSemester: 1, note: 'Semester may vary by batch.' },
      { code: '22ADS111', name: 'Python for Data Science', typicalSemester: 2, note: 'Semester may vary by batch.' },
      { code: '22ADS201', name: 'Data Structures for Data Science', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22MAT205', name: 'Probability and Statistics', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22ADS211', name: 'Database Systems for Analytics', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22ADS212', name: 'Data Visualization and Pipelines', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22ADS301', name: 'Machine Learning', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22ADS302', name: 'Deep Learning', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22ADS303', name: 'Data Mining', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22ADS311', name: 'Big Data Analytics', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22ADS312', name: 'Computer Vision', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22ADS313', name: 'Natural Language Processing', typicalSemester: 6, note: 'Semester may vary by batch.' }
    ]
  },
  {
    id: 'cce',
    name: 'Computer and Communication Engineering',
    description: 'Explore the intersection of computer engineering and telecommunications, network architectures, systems programming, and wireless networks.',
    icon: 'Network',
    subjects: [
      { code: '22CCE101', name: 'Introduction to Computer and Communication Engineering', typicalSemester: 1, note: 'Semester may vary by batch.' },
      { code: '22CCE201', name: 'Data Structures and Algorithms', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22CCE211', name: 'Operating Systems', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22CCE212', name: 'Database Management Systems', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22CCE213', name: 'Analog and Digital Communications', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22CCE301', name: 'Computer Networks', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22CCE302', name: 'Digital Signal Processing', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22CCE303', name: 'Microprocessors and Microcontrollers', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22CCE311', name: 'Information Theory and Coding', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22CCE312', name: 'Embedded Systems', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22CCE401', name: 'Wireless Communications and Networks', typicalSemester: 7, note: 'Semester may vary by batch.' },
      { code: '22CCE403', name: 'Internet of Things (IoT)', typicalSemester: 7, note: 'Semester may vary by batch.' }
    ]
  },
  {
    id: 'ece',
    name: 'Electronics and Communication Engineering',
    description: 'Study microelectronics, VLSI design, digital signal processing, wireless networks, and embedded systems.',
    icon: 'Radio',
    subjects: [
      { code: '22ECE101', name: 'Introduction to Electronics', typicalSemester: 1, note: 'Semester may vary by batch.' },
      { code: '22ECE201', name: 'Network Analysis and Synthesis', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22ECE202', name: 'Analog Electronics', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22ECE203', name: 'Digital Electronics', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22ECE212', name: 'Signals and Systems', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22ECE214', name: 'Microprocessors', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22ECE301', name: 'Communication Systems', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22ECE302', name: 'DSP', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22ECE311', name: 'VLSI', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22ECE312', name: 'Embedded Systems', typicalSemester: 6, note: 'Semester may vary by batch.' }
    ]
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    description: 'Study thermodynamics, fluid mechanics, CAD/CAM, machine design, aerodynamics, and robotics.',
    icon: 'Wrench',
    subjects: [
      { code: '22MEE102', name: 'Basic Mechanical Engineering', typicalSemester: 1, note: 'Semester may vary by batch.' },
      { code: '22MEE202', name: 'Thermodynamics', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22MEE211', name: 'Strength of Materials', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22MEE212', name: 'Fluid Mechanics and Hydraulic Machinery', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22MEE213', name: 'Manufacturing Processes', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22MEE302', name: 'Heat and Mass Transfer', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22MEE303', name: 'Machine Design', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22MEE311', name: 'CAD/CAM', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22MEE314', name: 'Aerodynamics', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22MEE402', name: 'Robotics', typicalSemester: 7, note: 'Semester may vary by batch.' }
    ]
  },
  {
    id: 'rai',
    name: 'Robotics and Artificial Intelligence',
    description: 'Learn robot kinematics, embedded controller designs, sensor integrations, human-robot collaborative architectures, and autonomous navigation.',
    icon: 'Bot',
    subjects: [
      { code: '22RAI101', name: 'Introduction to Robotics and Autonomous Systems', typicalSemester: 1, note: 'Semester may vary by batch.' },
      { code: '22RAI201', name: 'Robot Kinematics and Dynamics', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22RAI203', name: 'Sensor Integrations and Signal Conditioning', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22RAI211', name: 'Microcontrollers and Embedded Controller Designs', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22RAI212', name: 'Control Systems for Robotics', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22RAI302', name: 'Deep Learning and Computer Vision', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22RAI303', name: 'Robot Programming and Simulation (ROS)', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22RAI311', name: 'Autonomous Navigation and SLAM', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22RAI312', name: 'Human-Robot Collaborative Architectures', typicalSemester: 6, note: 'Semester may vary by batch.' }
    ]
  },
  {
    id: 'are',
    name: 'Automation and Robotics Engineering',
    description: 'Focus on industrial automation, control systems, programmable logic controllers, actuators, and robotic integration.',
    icon: 'Cpu',
    subjects: [
      { code: '22ARE101', name: 'Introduction to Automation and Control', typicalSemester: 1, note: 'Semester may vary by batch.' },
      { code: '22ARE201', name: 'Sensors and Transducers', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22ARE202', name: 'Actuators and Drives', typicalSemester: 3, note: 'Semester may vary by batch.' },
      { code: '22ARE211', name: 'Microcontrollers and PLC Programming', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22ARE212', name: 'Fluid Power Systems (Pneumatics & Hydraulics)', typicalSemester: 4, note: 'Semester may vary by batch.' },
      { code: '22ARE301', name: 'Industrial Robotics', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22ARE302', name: 'Process Control and SCADA', typicalSemester: 5, note: 'Semester may vary by batch.' },
      { code: '22ARE311', name: 'Robotic Integration and Safety', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22ARE312', name: 'Embedded Systems for Automation', typicalSemester: 6, note: 'Semester may vary by batch.' },
      { code: '22ARE401', name: 'Smart Manufacturing and Industry 4.0', typicalSemester: 7, note: 'Semester may vary by batch.' }
    ]
  }
];
