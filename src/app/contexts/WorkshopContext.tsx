import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MCQItem {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface ContentResource {
  id: string;
  title: string;
  url: string;
}

export interface LearningContent {
  mcqTests: MCQItem[];
  pdfResources: ContentResource[];
  videoResources: ContentResource[];
}

export interface Workshop {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  category: string;
  description: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  image: string;
  skills: string[];
  tutorials: string[];
  learningContent: LearningContent;
}

export interface Booking {
  id: string;
  userId: string;
  workshopId: string;
  bookingDate: string;
  paymentId: string;
  status: 'confirmed' | 'cancelled';
  amount: number;
}

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
}

interface WorkshopContextType {
  workshops: Workshop[];
  bookings: Booking[];
  addBooking: (booking: Booking) => Promise<boolean>;
  cancelBooking: (bookingId: string) => void;
  getBookingsByUser: (userId: string) => Booking[];
  getWorkshopById: (id: string) => Workshop | undefined;
  updateSeatAvailability: (workshopId: string, seatsToDeduct: number) => void;
  getRegisteredUsersByWorkshop: (workshopId: string) => RegisteredUser[];
}

const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

const WORKSHOP_IMAGE_MAP: Record<string, string> = {
  'Advanced React Patterns & Best Practices': '/workshop-images/REACT_WORKSHOP.jpeg',
  'UI/UX Design Fundamentals': '/workshop-images/UI_UX_WORKSHOP.jpeg',
  'Python for Data Science': '/workshop-images/PYTHON_WORKSHOP.jpeg',
  'Digital Marketing Strategy 2026': '/workshop-images/MARKETING_WORKSHOP.jpeg',
  'Cloud Architecture with AWS': '/workshop-images/AWS_WORKSHOP.jpeg',
  'Mobile App Development with React Native': '/workshop-images/REACT_NATIVE.jpeg',
  'Cybersecurity Essentials': '/workshop-images/CYBER_SECURITY_WORKSHOP.jpeg',
  'Blockchain & Smart Contracts': '/workshop-images/BLOCK_CHAIN_WORKSHOP.jpeg',
  'AI / MLOps Fundamentals': '/workshop-images/AI_ML_OPS_WORKSHOP.jpeg',
  'UI Testing with Playwright': '/workshop-images/UI_TESTING_WORKSHOP.jpeg',
  'Full-stack TypeScript Development': '/workshop-images/TYPESCRIPT_WORKSHOP.jpeg',
  'Data Engineering with Docker & Kafka': '/workshop-images/DATA_ENGINEERING_WORKSHOP.jpeg',
};

const normalizeAndSaveWorkshops = (workshops: Workshop[]) => {
  const normalized = workshops.map(workshop => ({
    ...workshop,
    image: WORKSHOP_IMAGE_MAP[workshop.title] || workshop.image,
    tutorials: workshop.tutorials ?? [],
    learningContent: workshop.learningContent ?? {
      mcqTests: [],
      pdfResources: [],
      videoResources: [],
    },
  }));
  localStorage.setItem('workshops', JSON.stringify(normalized));
  return normalized;
};

const INITIAL_WORKSHOPS: Workshop[] = [
  {
    id: '1',
    title: 'Advanced React Patterns & Best Practices',
    instructor: 'Sarah Johnson',
    date: '2026-04-15',
    time: '10:00 AM',
    duration: '3 hours',
    category: 'Web Development',
    description: 'Deep dive into advanced React patterns including Compound Components, Render Props, Custom Hooks, and State Management strategies. Perfect for developers looking to level up their React skills.',
    price: 89.99,
    totalSeats: 50,
    availableSeats: 50,
    image: '/workshop-images/REACT_WORKSHOP.jpeg',
    skills: ['React', 'JavaScript', 'State Management', 'Hooks'],
    tutorials: [
      'Module 1: Hooks & Custom Hooks',
      'Module 2: Context, Reducers & State Management',
      'Module 3: Performance Optimization Techniques',
      'Module 4: Architecture & Testing',
    ],
    learningContent: {
      videoResources: [
        {
          id: 'r1',
          title: 'Design Patterns in React - YouTube',
          url: 'https://youtu.be/MdvzlDIdQ0o?si=t9zq88dn8LqnOjxC',
        },
        {
          id: 'r2',
          title: 'Refactoring a react component - design pattern - YouTube',
          url: 'https://youtu.be/PisA-OPisUY?si=aP2OW1TkZ24pSdqZ',
        },
        {
          id: 'r3',
          title: 'Single Responsibility Principle in React (Design Patterns) - YouTube',
          url: 'https://youtu.be/tLPi3SPqUSE?si=vswYcXE-N_XLK6_7',
        },
        {
          id: 'r4',
          title: 'Custom Hooks in React (Design Patterns) - YouTube',
          url: 'https://youtu.be/I2Bgi0Qcdvc?si=KUtpSYVjaG6iAAhy',
        },
      ],
      mcqTests: [],
      pdfResources: []
    },
  },
  {
    id: '2',
    title: 'UI/UX Design Fundamentals',
    instructor: 'Michael Chen',
    date: '2026-04-18',
    time: '2:00 PM',
    duration: '4 hours',
    category: 'Design',
    description: 'Learn the core principles of user interface and user experience design. Covers design thinking, prototyping, user research, and creating accessible interfaces.',
    price: 79.99,
    totalSeats: 40,
    availableSeats: 35,
    image: '/workshop-images/UI_UX_WORKSHOP.jpeg',
    skills: ['Figma', 'User Research', 'Prototyping', 'Accessibility'],
    tutorials: [
      'Lesson 1: Design Thinking & User Research',
      'Lesson 2: Wireframing & Mockups in Figma',
      'Lesson 3: Accessibility & Usability Testing',
    ],
    learningContent: {
      mcqTests: [],
      pdfResources: [],
      videoResources: [],
    },
  },
  {
    id: '3',
    title: 'Python for Data Science',
    instructor: 'Dr. Emily Rodriguez',
    date: '2026-04-22',
    time: '9:00 AM',
    duration: '5 hours',
    category: 'Data Science',
    description: 'Comprehensive introduction to Python for data analysis. Covers NumPy, Pandas, data visualization with Matplotlib, and basic machine learning concepts.',
    price: 99.99,
    totalSeats: 60,
    availableSeats: 42,
    image: '/workshop-images/PYTHON_WORKSHOP.jpeg',
    skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning'],
    tutorials: [
      'Part 1: Data Wrangling with Pandas',
      'Part 2: Visualization with Matplotlib/Seaborn',
      'Part 3: Intro to Scikit-learn models',
    ],
    learningContent: {
      mcqTests: [],
      pdfResources: [],
      videoResources: [],
    },
  },
  {
    id: '4',
    title: 'Digital Marketing Strategy 2026',
    instructor: 'James Williams',
    date: '2026-04-25',
    time: '1:00 PM',
    duration: '3 hours',
    category: 'Marketing',
    description: 'Master modern digital marketing strategies including SEO, content marketing, social media advertising, and analytics. Learn to create effective campaigns.',
    price: 69.99,
    totalSeats: 45,
    availableSeats: 28,
    image: '/workshop-images/MARKETING_WORKSHOP.jpeg',
    skills: ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
    tutorials: [
      'Unit 1: Audience research & content strategy',
      'Unit 2: Running high-impact campaigns',
      'Unit 3: Tracking growth with analytics',
    ],
    learningContent: {
      mcqTests: [],
      pdfResources: [],
      videoResources: [],
    },
  },
  {
    id: '5',
    title: 'Cloud Architecture with AWS',
    instructor: 'Robert Kumar',
    date: '2026-04-28',
    time: '11:00 AM',
    duration: '4 hours',
    category: 'Cloud Computing',
    description: 'Learn to design and implement scalable cloud solutions using AWS. Covers EC2, S3, Lambda, and best practices for cloud architecture.',
    price: 119.99,
    totalSeats: 35,
    availableSeats: 20,
    image: '/workshop-images/AWS_WORKSHOP.jpeg',
    skills: ['AWS', 'Cloud Architecture', 'DevOps', 'Scalability'],
    tutorials: [
      'Session 1: AWS core services (EC2/S3/VPC)',
      'Session 2: Serverless and microservices design',
      'Session 3: High availability and cost optimization',
    ],
    learningContent: {
      mcqTests: [],
      pdfResources: [],
      videoResources: [],
    },
  },
  {
    id: '6',
    title: 'Mobile App Development with React Native',
    instructor: 'Lisa Zhang',
    date: '2026-05-02',
    time: '10:00 AM',
    duration: '5 hours',
    category: 'Mobile Development',
    description: 'Build cross-platform mobile applications using React Native. Learn navigation, state management, native modules, and deployment to App Store and Play Store.',
    price: 94.99,
    totalSeats: 40,
    availableSeats: 38,
    image: '/workshop-images/REACT_NATIVE.jpeg',
    skills: ['React Native', 'Mobile Dev', 'iOS', 'Android'],
    tutorials: [
      'Step 1: React Native project setup and navigation',
      'Step 2: Native features and state management',
      'Step 3: App deployment on iOS/Android stores',
    ],
    learningContent: {
      mcqTests: [],
      pdfResources: [],
      videoResources: [],
    },
  },
  {
    id: '7',
    title: 'Cybersecurity Essentials',
    instructor: 'David Thompson',
    date: '2026-05-05',
    time: '3:00 PM',
    duration: '3 hours',
    category: 'Security',
    description: 'Essential cybersecurity concepts for developers and IT professionals. Covers encryption, authentication, common vulnerabilities, and security best practices.',
    price: 84.99,
    totalSeats: 50,
    availableSeats: 45,
    image: '/workshop-images/CYBER_SECURITY_WORKSHOP.jpeg',
    skills: ['Security', 'Encryption', 'Authentication', 'OWASP'],
    tutorials: [
      'Chapter 1: Fundamentals of cybersecurity',
      'Chapter 2: Protecting user data and auth flows',
      'Chapter 3: Threat models and penetration testing',
    ],
    learningContent: {
      mcqTests: [],
      pdfResources: [],
      videoResources: [],
    },
  },
  {
    id: '8',
    title: 'Blockchain & Smart Contracts',
    instructor: 'Alexandra Petrov',
    date: '2026-05-08',
    time: '12:00 PM',
    duration: '4 hours',
    category: 'Blockchain',
    description: 'Introduction to blockchain technology and smart contract development using Solidity. Learn about DeFi, NFTs, and decentralized applications.',
    price: 109.99,
    totalSeats: 30,
    availableSeats: 12,
    image: '/workshop-images/BLOCK_CHAIN_WORKSHOP.jpeg',
    skills: ['Blockchain', 'Solidity', 'Web3', 'Smart Contracts'],
    tutorials: [
      'Step 1: Blockchain basics and token standards',
      'Step 2: Smart contract design and auditing',
      'Step 3: Deploying dApps to live networks',
    ],
    learningContent: {
      mcqTests: [],
      pdfResources: [],
      videoResources: [],
    },
  },
  {
    id: '9',
    title: 'AI / MLOps Fundamentals',
    instructor: 'Nina Patel',
    date: '2026-05-12',
    time: '3:00 PM',
    duration: '4 hours',
    category: 'AI/ML',
    description: 'Understand ML lifecycle, model deployment, monitoring, and feedback loops using MLOps best practices.',
    price: 129.99,
    totalSeats: 30,
    availableSeats: 30,
    image: '/workshop-images/AI_WORKSHOP.jpeg',
    skills: ['Machine Learning', 'MLOps', 'Model Deployment', 'CI/CD'],
    tutorials: [
      'Lesson 1: MLOps fundamentals and workflow',
      'Lesson 2: Training/validation pipelines with CI',
      'Lesson 3: Deployment, monitoring, and retraining',
    ],
    learningContent: {
      mcqTests: [],
      pdfResources: [],
      videoResources: [],
    },
  },
  {
    id: '10',
    title: 'Full-stack TypeScript Development',
    instructor: 'Omar Ali',
    date: '2026-05-16',
    time: '11:00 AM',
    duration: '4 hours',
    category: 'Web Development',
    description: 'Build scalable full-stack applications using TypeScript, Node.js, React, and PostgreSQL.',
    price: 114.99,
    totalSeats: 35,
    availableSeats: 35,
    image: '/workshop-images/TYPESCRIPT_WORKSHOP.jpeg',
    skills: ['TypeScript', 'Node.js', 'React', 'SQL'],
    tutorials: [
      'Part 1: Strongly typed API design with Node/Express',
      'Part 2: React + TypeScript UI development',
      'Part 3: Database integration and deployment',
    ],
    learningContent: {
      mcqTests: [],
      pdfResources: [],
      videoResources: [],
    },
  },
  {
    id: '11',
    title: 'UI Testing with Playwright',
    instructor: 'Priya Sinha',
    date: '2026-05-20',
    time: '10:30 AM',
    duration: '3 hours',
    category: 'Quality Engineering',
    description: 'Write end-to-end tests for web applications using Playwright, focusing on resilient selectors, parallel execution, and CI integration.',
    price: 79.99,
    totalSeats: 40,
    availableSeats: 40,
    image: '/workshop-images/UI_UX_WORKSHOP.jpeg',
    skills: ['Testing', 'Playwright', 'E2E', 'CI/CD'],
    tutorials: [
      'Session 1: Playwright fundamentals and selectors',
      'Session 2: Cross-browser parallelism and traces',
      'Session 3: CI/CD pipeline integration and reporting',
    ],
    learningContent: {
      mcqTests: [
        {
          id: 'p1',
          question: 'Which command starts Playwright test runner for all browsers?',
          options: ['npx playwright test', 'npx playwright run', 'npm test', 'npm start'],
          answer: 'npx playwright test',
        },
      ],
      pdfResources: [
        {
          id: 'p1',
          title: 'Playwright Quickstart Guide',
          url: 'https://example.com/playwright-guide.pdf',
        },
      ],
      videoResources: [
        {
          id: 'p1',
          title: 'Getting Started with Playwright',
          url: 'https://www.youtube.com/watch?v=dqGnmraYSL0',
        },
      ],
    },
  },
  {
    id: '12',
    title: 'Data Engineering with Docker & Kafka',
    instructor: 'Frank Liu',
    date: '2026-05-22',
    time: '2:00 PM',
    duration: '4 hours',
    category: 'Data Engineering',
    description: 'Architect data pipelines with containerization and Kafka, focusing on partitioning, throughput, and fault tolerance.',
    price: 129.99,
    totalSeats: 30,
    availableSeats: 30,
    image: '/workshop-images/AI_WORKSHOP.jpeg',
    skills: ['Docker', 'Kafka', 'ETL', 'Data Pipelines'],
    tutorials: [
      'Chapter 1: Kafka topics, partitions, and consumer groups',
      'Chapter 2: Dockerizing data microservices',
      'Chapter 3: Stream processing with Kafka Streams',
    ],
    learningContent: {
      mcqTests: [
        {
          id: 'd1',
          question: 'In Kafka, what component ensures group message consumption?',
          options: ['Broker', 'Producer', 'Consumer group', 'Zookeeper'],
          answer: 'Consumer group',
        },
      ],
      pdfResources: [
        {
          id: 'd1',
          title: 'Kafka Architecture Deep Dive',
          url: 'https://example.com/kafka-architecture.pdf',
        },
      ],
      videoResources: [
        {
          id: 'd1',
          title: 'Build Reliable Streaming Pipelines',
          url: 'https://www.youtube.com/watch?v=1WhvlCICcxI',
        },
      ],
    },
  },
];

export const WorkshopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const mergeWithDefaults = (base: Workshop[]) => {
      const map = new Map(base.map(w => [w.id, w]));
      const merged = INITIAL_WORKSHOPS.map(initial => map.get(initial.id) || initial);
      const extra = base.filter(w => !map.has(w.id));
      return normalizeAndSaveWorkshops([...merged, ...extra]);
    };

    const hydrate = async () => {
      try {
        const response = await fetch('/api/workshops');
        if (!response.ok) throw new Error('Failed to fetch workshops from backend');
        const apiWorkshops: Workshop[] = await response.json();
        if (apiWorkshops && apiWorkshops.length > 0) {
          setWorkshops(mergeWithDefaults(apiWorkshops));
        }
      } catch (err) {
        const storedWorkshops = localStorage.getItem('workshops');
        if (storedWorkshops) {
          const parsed: Workshop[] = JSON.parse(storedWorkshops);
          setWorkshops(mergeWithDefaults(parsed));
        } else {
          const normalized = normalizeAndSaveWorkshops(INITIAL_WORKSHOPS);
          setWorkshops(normalized);
        }
      }

      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const apiBookings: Booking[] = await response.json();
          setBookings(apiBookings.map(b => ({
            id: b.id,
            userId: (b as any).userId?._id || b.userId,
            workshopId: (b as any).workshopId?._id || b.workshopId,
            bookingDate: b.bookingDate,
            paymentId: b.paymentId,
            status: b.status,
            amount: b.amount,
          })));
          localStorage.setItem('bookings', JSON.stringify(apiBookings));
        } else {
          const storedBookings = localStorage.getItem('bookings');
          if (storedBookings) setBookings(JSON.parse(storedBookings));
        }
      } catch (err) {
        const storedBookings = localStorage.getItem('bookings');
        if (storedBookings) setBookings(JSON.parse(storedBookings));
      }
    };

    hydrate();
  }, []);

  const addBooking = async (booking: Booking) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: booking.userId,
          workshopId: booking.workshopId,
          amount: booking.amount,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const createdBooking = await response.json();
      const bookingToUse: Booking = {
        id: createdBooking._id || booking.id,
        userId: (createdBooking.userId && createdBooking.userId._id) || booking.userId,
        workshopId: (createdBooking.workshopId && createdBooking.workshopId._id) || booking.workshopId,
        bookingDate: createdBooking.bookingDate || booking.bookingDate,
        paymentId: createdBooking.paymentId || booking.paymentId,
        status: createdBooking.status || booking.status,
        amount: createdBooking.amount || booking.amount,
      };

      const newBookings = [...bookings, bookingToUse];
      setBookings(newBookings);
      localStorage.setItem('bookings', JSON.stringify(newBookings));

      setWorkshops(prevWorkshops => {
        const updated = prevWorkshops.map(w =>
          w.id === booking.workshopId
            ? { ...w, availableSeats: w.availableSeats - 1 }
            : w
        );
        localStorage.setItem('workshops', JSON.stringify(updated));
        return updated;
      });

      return true;
    } catch (error) {
      console.error('Error adding booking', error);
      return false;
    }
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && booking.status === 'confirmed') {
      // Update booking status
      const updatedBookings = bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      );
      setBookings(updatedBookings);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));

      // Return the seat
      updateSeatAvailability(booking.workshopId, -1);
    }
  };

  const getBookingsByUser = (userId: string): Booking[] => {
    return bookings.filter(b => b.userId === userId);
  };

  const getWorkshopById = (id: string): Workshop | undefined => {
    return workshops.find(w => w.id === id);
  };

  const getRegisteredUsersByWorkshop = (workshopId: string): RegisteredUser[] => {
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    return users
      .filter((u: any) =>
        bookings.some(
          b => b.workshopId === workshopId && b.userId === u.id && b.status === 'confirmed'
        )
      )
      .map((u: any) => ({ id: u.id, name: u.name, email: u.email }));
  };

  const updateSeatAvailability = (workshopId: string, seatsToDeduct: number) => {
    const updatedWorkshops = workshops.map(w =>
      w.id === workshopId
        ? { ...w, availableSeats: w.availableSeats - seatsToDeduct }
        : w
    );
    setWorkshops(updatedWorkshops);
    localStorage.setItem('workshops', JSON.stringify(updatedWorkshops));
  };

  return (
    <WorkshopContext.Provider
      value={{
        workshops,
        bookings,
        addBooking,
        cancelBooking,
        getBookingsByUser,
        getWorkshopById,
        getRegisteredUsersByWorkshop,
        updateSeatAvailability,
      }}
    >
      {children}
    </WorkshopContext.Provider>
  );
};

export const useWorkshops = () => {
  const context = useContext(WorkshopContext);
  if (context === undefined) {
    throw new Error('useWorkshops must be used within a WorkshopProvider');
  }
  return context;
};
