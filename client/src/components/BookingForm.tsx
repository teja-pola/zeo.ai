import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, X, CheckCircle, ArrowLeft } from 'lucide-react';

type BookingFormProps = {
  counsellor: any;
  selectedSlot: any;
  onBack: () => void;
  onConfirm: (details: any) => void;
  onCancel: () => void;
};

export default function BookingForm({ counsellor, selectedSlot, onBack, onConfirm, onCancel }: BookingFormProps) {
  const [bookingDetails, setBookingDetails] = useState({
    sessionType: 'Video Call',
    problems: '',
    additionalNotes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(bookingDetails);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Book Session</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Counsellor Info */}
          <div className="md:col-span-1">
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={counsellor.image}
                    alt={counsellor.name}
                    className="w-24 h-24 rounded-full object-cover mb-3"
                  />
                  <h3 className="text-lg font-semibold">{counsellor.name}</h3>
                  <p className="text-sm text-gray-600">{counsellor.title}</p>
                  <div className="mt-2 flex items-center text-sm text-yellow-500">
                    ★ {counsellor.rating}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {new Date(selectedSlot.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">
                        {selectedSlot.time} ({selectedSlot.duration} mins)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Type
                  </label>
                  <Select
                    value={bookingDetails.sessionType}
                    onValueChange={(value) =>
                      setBookingDetails({ ...bookingDetails, sessionType: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Video Call">Video Call</SelectItem>
                      <SelectItem value="Phone Call">Phone Call</SelectItem>
                      <SelectItem value="In-Person">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What would you like to discuss? *
                  </label>
                  <Textarea
                    value={bookingDetails.problems}
                    onChange={(e) =>
                      setBookingDetails({ ...bookingDetails, problems: e.target.value })
                    }
                    placeholder="Briefly describe what you'd like to discuss (e.g., anxiety, stress, relationships, etc.)"
                    className="min-h-[100px]"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This helps your counsellor prepare for your session.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <Textarea
                    value={bookingDetails.additionalNotes}
                    onChange={(e) =>
                      setBookingDetails({ ...bookingDetails, additionalNotes: e.target.value })
                    }
                    placeholder="Any additional information you'd like to share..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" className="bg-[#345E2C] hover:bg-[#2a4a24] text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
