import { useParams, useNavigate } from 'react-router-dom';
import { useWorkshops } from '../contexts/WorkshopContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Calendar, Clock, DollarSign, Users, User, ArrowLeft, CheckCircle2,
  BookOpen, Zap, Share2, MapPin, FileText, Video, HelpCircle, UserCheck
} from 'lucide-react';
import { WorkshopCover } from '../components/WorkshopCover';
import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface RegisteredUser {
  id: string;
  name: string;
}

export const WorkshopDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkshopById, getBookingsByWorkshop, loading: workshopsLoading } = useWorkshops();
  const { isAuthenticated, user } = useAuth();
  const workshop = getWorkshopById(id!);

  const registeredUsers = workshop
    ? getBookingsByWorkshop(workshop.id)
        .filter((booking) => booking.status === 'confirmed')
        .map((booking) => ({ id: booking.userId, name: booking.userName || 'Anonymous User' }))
    : [];

  if (workshopsLoading) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full size-8 border-2 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="size-10 text-gray-300" />
          </div>
          <h2 className="text-2xl mb-2 text-gray-700">Workshop not found</h2>
          <p className="text-gray-500 mb-6">The workshop you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Back to Workshops</Button>
        </div>
      </div>
    );
  }

  const seatPercentage = (workshop.availableSeats / workshop.totalSeats) * 100;
  const seatsBooked = workshop.totalSeats - workshop.availableSeats;

  const getSeatInfo = () => {
    if (seatPercentage > 50) return { color: 'text-green-600', bg: 'bg-green-50 border-green-200', bar: 'bg-green-500', text: 'Good availability' };
    if (seatPercentage > 20) return { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', bar: 'bg-yellow-500', text: 'Filling up fast' };
    if (seatPercentage > 0) return { color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', bar: 'bg-orange-500', text: 'Almost full' };
    return { color: 'text-red-600', bg: 'bg-red-50 border-red-200', bar: 'bg-red-500', text: 'Sold out' };
  };

  const seatInfo = getSeatInfo();
  
  const isUserRegistered = isAuthenticated && registeredUsers.some(u => u.id === user?.id);

  const handleRegister = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/payment/${workshop.id}`);
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 pb-20">
      {/* Hero Banner */}
      <div className="px-3 pt-2 sm:px-4">
        <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-3xl">
          <WorkshopCover
            category={workshop.category}
            image={workshop.image}
            title={workshop.title}
            className="h-[22rem] md:h-[26rem]"
          />
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-gray-950/10" />

          <div className="absolute inset-x-0 top-0 z-[3] flex items-center justify-between p-5 sm:p-6">
            <button
              onClick={() => navigate('/')}
              className="press flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-sm text-white ring-1 ring-white/20 backdrop-blur-md hover:bg-white/20"
            >
              <ArrowLeft className="size-4" />
              All workshops
            </button>
            <span className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white ring-1 ring-white/20 backdrop-blur-md">
              {workshop.category}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-[3] p-6 sm:p-10">
            <div className="mx-auto max-w-5xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <p className="eyebrow mb-3 text-indigo-200">
                  {new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <h1 className="max-w-[22ch] text-3xl leading-[1.05] tracking-[-0.03em] text-white md:text-5xl">
                  {workshop.title}
                </h1>
                <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
                  <User className="size-4" />
                  Taught by <span className="text-white">{workshop.instructor}</span>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Quick info bar */}
            <div className="bg-white rounded-2xl ring-1 ring-gray-900/[0.06] p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    icon: Calendar, label: 'Date',
                    value: new Date(workshop.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  },
                  { icon: Clock, label: 'Time', value: workshop.time },
                  { icon: Zap, label: 'Duration', value: workshop.duration },
                  { icon: MapPin, label: 'Format', value: 'Online' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="bg-indigo-50 rounded-xl p-2 flex-shrink-0">
                      <Icon className="size-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
                <TabsTrigger 
                  value="about" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none px-1 py-3 bg-transparent text-gray-500 hover:text-gray-700"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none px-1 py-3 bg-transparent text-gray-500 hover:text-gray-700"
                >
                  Learning Content
                </TabsTrigger>
                <TabsTrigger 
                  value="attendees" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none px-1 py-3 bg-transparent text-gray-500 hover:text-gray-700"
                >
                  Attendees
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6 space-y-6">
                {/* About */}
                <div className="bg-white rounded-2xl ring-1 ring-gray-900/[0.06] p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="size-5 text-indigo-500" />
                    About This Workshop
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{workshop.description}</p>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-2xl ring-1 ring-gray-900/[0.06] p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-indigo-500" />
                    Skills You'll Learn
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {workshop.skills.map(skill => (
                      <div key={skill} className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3">
                        <div className="size-2 rounded-full bg-indigo-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-6 space-y-6">
                <div className="bg-white rounded-2xl ring-1 ring-gray-900/[0.06] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="size-5 text-indigo-500" />
                      Course Materials
                    </h2>
                    {!isUserRegistered && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                        Register to access
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    {/* PDFs */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">PDF Resources</h3>
                      <div className="grid gap-3">
                        {workshop.learningContent?.pdfs?.map((pdf, i) => (
                          <div
                            key={i}
                            onClick={isUserRegistered ? () => openExternalLink(pdf.url) : undefined}
                            className={`flex items-center justify-between p-3 rounded-xl border ${isUserRegistered ? 'bg-white hover:bg-gray-50 border-gray-200 cursor-pointer' : 'bg-gray-50 border-gray-100 opacity-60'}`}
                            role={isUserRegistered ? 'button' : undefined}
                            tabIndex={isUserRegistered ? 0 : -1}
                            onKeyDown={(event) => {
                              if (isUserRegistered && (event.key === 'Enter' || event.key === ' ')) {
                                openExternalLink(pdf.url);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                                <FileText className="size-4" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{pdf.title}</span>
                            </div>
                            {isUserRegistered && <Button variant="ghost" size="sm" className="h-8 text-indigo-600">Download</Button>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Videos */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Video Lectures</h3>
                      <div className="grid gap-3">
                        {workshop.learningContent?.videos?.map((video, i) => (
                          <div
                            key={i}
                            onClick={isUserRegistered ? () => openExternalLink(video.url) : undefined}
                            className={`flex items-center justify-between p-3 rounded-xl border ${isUserRegistered ? 'bg-white hover:bg-gray-50 border-gray-200 cursor-pointer' : 'bg-gray-50 border-gray-100 opacity-60'}`}
                            role={isUserRegistered ? 'button' : undefined}
                            tabIndex={isUserRegistered ? 0 : -1}
                            onKeyDown={(event) => {
                              if (isUserRegistered && (event.key === 'Enter' || event.key === ' ')) {
                                openExternalLink(video.url);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                <Video className="size-4" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700 block">{video.title}</span>
                                <span className="text-xs text-gray-500">{video.duration}</span>
                              </div>
                            </div>
                            {isUserRegistered && <Button variant="ghost" size="sm" className="h-8 text-indigo-600">Watch</Button>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* MCQs */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Assessments</h3>
                      <div className="grid gap-3">
                        {workshop.learningContent?.mcqs?.map((mcq, i) => (
                          <div
                            key={i}
                            onClick={isUserRegistered ? () => navigate(`/workshop/${workshop.id}/quiz/${i}`) : undefined}
                            className={`flex items-center justify-between p-3 rounded-xl border ${isUserRegistered ? 'bg-white hover:bg-gray-50 border-gray-200 cursor-pointer' : 'bg-gray-50 border-gray-100 opacity-60'}`}
                            role={isUserRegistered ? 'button' : undefined}
                            tabIndex={isUserRegistered ? 0 : -1}
                            onKeyDown={(event) => {
                              if (isUserRegistered && (event.key === 'Enter' || event.key === ' ')) {
                                navigate(`/workshop/${workshop.id}/quiz/${i}`);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                                <HelpCircle className="size-4" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700 block">{mcq.title}</span>
                                <span className="text-xs text-gray-500">{mcq.questions} Questions</span>
                              </div>
                            </div>
                            {isUserRegistered && <Button variant="ghost" size="sm" className="h-8 text-indigo-600">Start Quiz</Button>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attendees" className="mt-6">
                <div className="bg-white rounded-2xl ring-1 ring-gray-900/[0.06] p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <UserCheck className="size-5 text-indigo-500" />
                    Registered Attendees ({registeredUsers.length})
                  </h2>
                  
                  {registeredUsers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {registeredUsers.map((u, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="size-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-700">{u.name}</span>
                          {u.id === user?.id && (
                            <Badge variant="outline" className="ml-auto text-xs bg-indigo-50 text-indigo-700 border-indigo-200">You</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="size-12 mx-auto text-gray-300 mb-3" />
                      <p>No one has registered yet. Your seat could be the first.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Price & Register Card */}
            <div className="bg-white rounded-2xl ring-1 ring-gray-900/[0.06] overflow-hidden sticky top-20">
              <div className="grain bg-gray-950 p-5">
                <p className="text-white/70 text-xs mb-1">Workshop Price</p>
                <div className="flex items-baseline gap-1">
                  <DollarSign className="size-5 text-white mb-0.5" />
                  <span className="text-4xl font-semibold tracking-tight text-white tabular">{workshop.price}</span>
                </div>
              </div>
              <div className="p-5">
                {isUserRegistered ? (
                   <Button
                    size="lg"
                    disabled
                    className="w-full rounded-xl border-0 text-base h-12 shadow-none bg-green-50 text-green-700 cursor-default"
                  >
                    <CheckCircle2 className="size-5 mr-2" />
                    Already Registered
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={handleRegister}
                      disabled={workshop.availableSeats === 0}
                      className={`w-full rounded-xl border-0 text-base h-12 shadow-lg transition-all ${
                        workshop.availableSeats === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                          : 'bg-gray-900 hover:bg-indigo-700 text-white hover:-translate-y-0.5'
                      }`}
                    >
                      {workshop.availableSeats === 0 ? 'Workshop Full' : (isAuthenticated ? 'Register Now →' : 'Login to Register')}
                    </Button>
                    {!isAuthenticated && workshop.availableSeats > 0 && (
                      <p className="text-center text-xs text-gray-400 mt-2">You need to sign in to register</p>
                    )}
                  </>
                )}
              </div>
              
              {/* Seat Availability */}
              <div className={`border-t p-5 ${seatInfo.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Seat Availability</span>
                  </div>
                  <span className={`text-xs font-medium ${seatInfo.color}`}>{seatInfo.text}</span>
                </div>

                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-semibold text-gray-800">{workshop.availableSeats}</span>
                  <span className="text-sm text-gray-500">/ {workshop.totalSeats} seats left</span>
                </div>

                <div className="h-2 bg-white/70 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - seatPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                    className={`h-full rounded-full ${seatInfo.bar}`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {seatsBooked} {seatsBooked === 1 ? 'person has' : 'people have'} already registered
                </p>
              </div>
            </div>

            {/* Instructor card */}
            <div className="bg-white rounded-2xl ring-1 ring-gray-900/[0.06] p-5">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Your Instructor</h3>
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-2xl text-indigo-800">
                    {workshop.instructor.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{workshop.instructor}</p>
                  <p className="text-xs text-gray-500">{workshop.category} Expert</p>
                </div>
              </div>
            </div>

            {/* Share button */}
            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition-colors"
            >
              <Share2 className="size-4" />
              Share Workshop
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
