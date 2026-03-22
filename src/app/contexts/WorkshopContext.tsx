import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface WorkshopContextType {
  workshops: Workshop[];
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  getBookingsByUser: (userId: string) => Booking[];
  getWorkshopById: (id: string) => Workshop | undefined;
  updateSeatAvailability: (workshopId: string, seatsToDeduct: number) => void;
}

const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

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
    image: 'programming workspace laptop',
    skills: ['React', 'JavaScript', 'State Management', 'Hooks'],
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
    image: 'ui design sketching wireframe',
    skills: ['Figma', 'User Research', 'Prototyping', 'Accessibility'],
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
    image: 'data science analytics charts',
    skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning'],
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
    image: 'digital marketing social media',
    skills: ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
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
    image: 'cloud computing servers technology',
    skills: ['AWS', 'Cloud Architecture', 'DevOps', 'Scalability'],
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
    image: 'mobile app development smartphone',
    skills: ['React Native', 'Mobile Dev', 'iOS', 'Android'],
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
    image: 'cybersecurity network protection',
    skills: ['Security', 'Encryption', 'Authentication', 'OWASP'],
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
    image: 'blockchain cryptocurrency technology',
    skills: ['Blockchain', 'Solidity', 'Web3', 'Smart Contracts'],
  },
];

export const WorkshopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Initialize workshops from localStorage or use defaults
    const storedWorkshops = localStorage.getItem('workshops');
    if (storedWorkshops) {
      setWorkshops(JSON.parse(storedWorkshops));
    } else {
      setWorkshops(INITIAL_WORKSHOPS);
      localStorage.setItem('workshops', JSON.stringify(INITIAL_WORKSHOPS));
    }

    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const addBooking = (booking: Booking) => {
    const newBookings = [...bookings, booking];
    setBookings(newBookings);
    localStorage.setItem('bookings', JSON.stringify(newBookings));
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
