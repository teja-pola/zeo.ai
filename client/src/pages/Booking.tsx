import { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// Mock data for counsellors
const mockCounsellors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Licensed Clinical Psychologist',
    specializations: ['Anxiety', 'Stress Management', 'Relationship Issues'],
    introduction: 'Specializing in cognitive behavioral therapy with 10+ years of experience helping students navigate academic and personal challenges.',
    availableSlots: [
      { id: 1, date: '2025-09-03', time: '10:00 AM', duration: 30 },
      { id: 2, date: '2025-09-03', time: '2:00 PM', duration: 30 },
      { id: 3, date: '2025-09-04', time: '11:00 AM', duration: 30 },
      { id: 4, date: '2025-09-04', time: '3:00 PM', duration: 30 },
    ],
    languages: ['English', 'Spanish'],
    rating: 4.9,
    image: '/placeholder.svg',
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Student Counsellor',
    specializations: ['Academic Stress', 'Career Guidance', 'Mindfulness'],
    introduction: 'Focus on helping students develop coping strategies and achieve academic success through evidence-based approaches.',
    availableSlots: [
      { id: 5, date: '2025-09-03', time: '9:00 AM', duration: 30 },
      { id: 6, date: '2025-09-03', time: '1:00 PM', duration: 30 },
      { id: 7, date: '2025-09-04', time: '10:00 AM', duration: 30 },
    ],
    languages: ['English', 'Mandarin'],
    rating: 4.7,
    image: '/placeholder.svg',
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    title: 'Licensed Professional Counselor',
    specializations: ['Depression', 'Trauma', 'Self-Esteem'],
    introduction: 'Experienced in trauma-informed care and helping students build resilience and emotional well-being.',
    availableSlots: [
      { id: 8, date: '2025-09-03', time: '11:00 AM', duration: 30 },
      { id: 9, date: '2025-09-04', time: '2:00 PM', duration: 30 },
      { id: 10, date: '2025-09-05', time: '9:00 AM', duration: 30 },
    ],
    languages: ['English', 'Spanish'],
    rating: 4.8,
    image: '/placeholder.svg',
  },
];

// Mock data for available dates
const availableDates = [
  '2025-09-03',
  '2025-09-04',
  '2025-09-05',
  '2025-09-06',
  '2025-09-07',
];

export default function Booking() {
  const [selectedCounsellor, setSelectedCounsellor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState<number>(1); // 1: Select counsellor, 2: Select slot, 3: Confirm booking
  const [bookingDetails, setBookingDetails] = useState({
    reason: '',
    notes: '',
  });

  // Initialize with first available date
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [selectedDate]);

  const handleCounsellorSelect = (counsellor: any) => {
    setSelectedCounsellor(counsellor);
    setBookingStep(2);
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    setBookingStep(3);
  };

  const handleBookingConfirm = () => {
    // In a real app, this would make an API call to book the session
    console.log('Booking confirmed:', {
      counsellor: selectedCounsellor,
      slot: selectedSlot,
      details: bookingDetails,
    });
    setBookingStep(4); // Show confirmation
  };

  const resetBooking = () => {
    setSelectedCounsellor(null);
    setSelectedSlot(null);
    setBookingStep(1);
    setBookingDetails({
      reason: '',
      notes: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#D2E4D3] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#345E2C] mb-4">
            Book a Session with a Counsellor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with professional counsellors for confidential support. 
            Choose from available time slots that fit your schedule.
          </p>
        </div>

        {bookingStep === 4 ? (
          // Booking confirmation
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#345E2C] flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Your session with {selectedCounsellor?.name} has been successfully booked.
                </p>
                
                <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                  <div className="flex items-center mb-4">
                    <img 
                      src={selectedCounsellor?.image} 
                      alt={selectedCounsellor?.name} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{selectedCounsellor?.name}</h3>
                      <p className="text-gray-600">{selectedCounsellor?.title}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-[#345E2C] mr-2" />
                      <span>{selectedSlot?.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-[#345E2C] mr-2" />
                      <span>{selectedSlot?.time} ({selectedSlot?.duration} min)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={resetBooking}
                    className="bg-[#345E2C] hover:bg-[#2a4a24] text-white px-6 py-3 rounded-full"
                  >
                    Book Another Session
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard'}
                    className="border-[#345E2C] text-[#345E2C] hover:bg-[#345E2C]/10 px-6 py-3 rounded-full"
                  >
                    View Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Counsellor list or slot selection */}
            <div className="lg:col-span-2">
              {bookingStep === 1 ? (
                // Counsellor selection
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Counsellors</h2>
                  <div className="space-y-6">
                    {mockCounsellors.map((counsellor) => (
                      <motion.div
                        key={counsellor.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                        onClick={() => handleCounsellorSelect(counsellor)}
                      >
                        <div className="p-6">
                          <div className="flex items-start">
                            <img 
                              src={counsellor.image} 
                              alt={counsellor.name} 
                              className="w-20 h-20 rounded-full object-cover mr-6"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900">{counsellor.name}</h3>
                                  <p className="text-[#345E2C] font-medium">{counsellor.title}</p>
                                </div>
                                <Badge variant="secondary" className="bg-[#D2E4D3] text-[#345E2C]">
                                  ★ {counsellor.rating}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mt-3">{counsellor.introduction}</p>
                              
                              <div className="mt-4">
                                <div className="flex flex-wrap gap-2">
                                  {counsellor.specializations.map((spec: string, idx: number) => (
                                    <Badge key={idx} variant="outline" className="border-[#345E2C] text-[#345E2C]">
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mt-4 flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>Speaks {counsellor.languages.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Next available slots:</span>
                              <Button 
                                className="bg-[#345E2C] hover:bg-[#2a4a24] text-white rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCounsellorSelect(counsellor);
                                }}
                              >
                                View Availability
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                // Slot selection
                <div>
                  <div className="flex items-center mb-6">
                    <Button 
                      variant="ghost" 
                      onClick={() => setBookingStep(1)}
                      className="text-[#345E2C] hover:bg-[#345E2C]/10"
                    >
                      ← Back to Counsellors
                    </Button>
                    <div className="flex-1 text-center">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCounsellor?.name}
                      </h2>
                      <p className="text-gray-600">{selectedCounsellor?.title}</p>
                    </div>
                  </div>
                  
                  <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 text-[#345E2C] mr-2" />
                        Select a Date and Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h3 className="font-medium text-gray-900 mb-3">Available Dates</h3>
                        <div className="flex flex-wrap gap-2">
                          {availableDates.map((date) => (
                            <Button
                              key={date}
                              variant={selectedDate === date ? "default" : "outline"}
                              className={`rounded-full ${
                                selectedDate === date 
                                  ? "bg-[#345E2C] hover:bg-[#2a4a24]" 
                                  : "border-[#345E2C] text-[#345E2C] hover:bg-[#345E2C]/10"
                              }`}
                              onClick={() => setSelectedDate(date)}
                            >
                              {new Date(date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Available Time Slots</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {selectedCounsellor?.availableSlots
                            .filter((slot: any) => slot.date === selectedDate)
                            .map((slot: any) => (
                              <Button
                                key={slot.id}
                                variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                                className={`rounded-full h-16 flex flex-col items-center justify-center ${
                                  selectedSlot?.id === slot.id
                                    ? "bg-[#345E2C] hover:bg-[#2a4a24]"
                                    : "border-[#345E2C] text-[#345E2C] hover:bg-[#345E2C]/10"
                                }`}
                                onClick={() => handleSlotSelect(slot)}
                              >
                                <span className="font-medium">{slot.time}</span>
                                <span className="text-xs">{slot.duration} min</span>
                              </Button>
                            ))}
                        </div>
                        
                        {selectedCounsellor?.availableSlots.filter((slot: any) => slot.date === selectedDate).length === 0 && (
                          <p className="text-gray-500 text-center py-8">
                            No available slots for this date. Please select another date.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            
            {/* Right column - Booking details or confirmation */}
            <div>
              {bookingStep === 3 && selectedSlot && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white shadow-lg rounded-2xl overflow-hidden sticky top-24">
                    <CardHeader>
                      <CardTitle>Confirm Your Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center mb-4">
                            <img 
                              src={selectedCounsellor?.image} 
                              alt={selectedCounsellor?.name} 
                              className="w-12 h-12 rounded-full object-cover mr-3"
                            />
                            <div>
                              <h3 className="font-bold">{selectedCounsellor?.name}</h3>
                              <p className="text-sm text-gray-600">{selectedCounsellor?.title}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 text-[#345E2C] mr-2" />
                              <span>{selectedSlot?.date}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 text-[#345E2C] mr-2" />
                              <span>{selectedSlot?.time}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                              Reason for Session
                            </label>
                            <select
                              id="reason"
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#345E2C]"
                              value={bookingDetails.reason}
                              onChange={(e) => setBookingDetails({...bookingDetails, reason: e.target.value})}
                            >
                              <option value="">Select a reason</option>
                              <option value="academic-stress">Academic Stress</option>
                              <option value="anxiety">Anxiety</option>
                              <option value="depression">Depression</option>
                              <option value="relationship-issues">Relationship Issues</option>
                              <option value="career-guidance">Career Guidance</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                              Additional Notes (Optional)
                            </label>
                            <textarea
                              id="notes"
                              rows={3}
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#345E2C]"
                              placeholder="Any specific concerns or information you'd like to share..."
                              value={bookingDetails.notes}
                              onChange={(e) => setBookingDetails({...bookingDetails, notes: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-[#345E2C] hover:bg-[#2a4a24] text-white py-3 rounded-full"
                          onClick={handleBookingConfirm}
                        >
                          Confirm Booking
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {bookingStep === 2 && (
                <Card className="bg-white shadow-lg rounded-2xl overflow-hidden sticky top-24">
                  <CardHeader>
                    <CardTitle>How Booking Works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#345E2C] flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs font-bold">1</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Select a Time Slot</p>
                          <p className="text-sm text-gray-500">Choose from available dates and times</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#345E2C] flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs font-bold">2</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Provide Details</p>
                          <p className="text-sm text-gray-500">Share your reason for booking</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#345E2C] flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs font-bold">3</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Confirmation</p>
                          <p className="text-sm text-gray-500">Receive booking confirmation</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 text-[#345E2C] mr-2" />
                          <span>30-minute confidential session</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}