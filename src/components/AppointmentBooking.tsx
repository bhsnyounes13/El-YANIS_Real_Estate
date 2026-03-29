import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface AppointmentBookingProps {
  propertyId: string;
  agentId: string;
  agentName: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function AppointmentBooking({ propertyId, agentId, agentName }: AppointmentBookingProps) {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    }
  }, [selectedDate]);

  const checkAvailability = async () => {
    try {
      const { data: bookedSlots, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('agent_id', agentId)
        .eq('appointment_date', selectedDate)
        .in('status', ['pending', 'confirmed']);

      if (error) throw error;

      const bookedTimes = bookedSlots?.map(slot => slot.appointment_time) || [];
      const slots = timeSlots.map(time => ({
        time,
        available: !bookedTimes.includes(time)
      }));

      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error checking availability:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          property_id: propertyId,
          agent_id: agentId,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          notes: notes,
          status: 'pending'
        })
        .select();

      if (insertError) {
        if (insertError.code === '23505') {
          setError(language === 'ar' ? 'هذا الموعد محجوز مسبقاً. يرجى اختيار وقت آخر.' : language === 'fr' ? 'Ce créneau est déjà réservé. Veuillez choisir un autre horaire.' : 'This time slot is already booked. Please choose another time.');
        } else {
          throw insertError;
        }
        return;
      }

      setSuccess(true);
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setNotes('');
      setSelectedTime('');
      setSelectedDate('');

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error booking appointment:', err);
      setError(err.message || (language === 'ar' ? 'حدث خطأ أثناء الحجز' : language === 'fr' ? 'Une erreur est survenue lors de la réservation' : 'An error occurred while booking'));
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all border border-gray-100 dark:border-gray-700 animate-scale-in">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
        {language === 'ar' ? 'احجز موعد للمعاينة' : language === 'fr' ? 'Réserver une visite' : 'Book a Viewing'}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {language === 'ar' ? `سيتم اللقاء مع الوكيل ${agentName}` : language === 'fr' ? `Rendez-vous avec l'agent ${agentName}` : `Meeting with agent ${agentName}`}
      </p>

      {success && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start animate-slide-up shadow-lg">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0 animate-scale-in" />
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-100">
              {language === 'ar' ? 'تم الحجز بنجاح!' : language === 'fr' ? 'Réservation confirmée !' : 'Booking Successful!'}
            </h4>
            <p className="text-green-700 dark:text-green-300 text-sm mt-1">
              {language === 'ar' ? 'سيتم التواصل معك قريباً لتأكيد الموعد.' : language === 'fr' ? 'Vous serez contacté bientôt pour confirmer le rendez-vous.' : 'You will be contacted soon to confirm your appointment.'}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start animate-slide-up shadow-lg">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0 animate-scale-in" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'الاسم الكامل' : language === 'fr' ? 'Nom complet' : 'Full Name'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            placeholder={language === 'ar' ? 'أدخل اسمك' : language === 'fr' ? 'Entrez votre nom' : 'Enter your name'}
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'Email' : 'Email'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="email"
            required
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : language === 'fr' ? 'Entrez votre email' : 'Enter your email'}
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Phone className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'رقم الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone Number'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="tel"
            required
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            placeholder={language === 'ar' ? 'أدخل رقم هاتفك' : language === 'fr' ? 'Entrez votre numéro' : 'Enter your phone number'}
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'تاريخ الموعد' : language === 'fr' ? 'Date du rendez-vous' : 'Appointment Date'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="date"
            required
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          />
        </div>

        {selectedDate && availableSlots.length > 0 && (
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'وقت الموعد' : language === 'fr' ? 'Heure du rendez-vous' : 'Appointment Time'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map(slot => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    !slot.available
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed line-through'
                      : selectedTime === slot.time
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 hover:scale-105 hover:shadow-md'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MessageSquare className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'ملاحظات إضافية' : language === 'fr' ? 'Notes supplémentaires' : 'Additional Notes'}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none"
            placeholder={language === 'ar' ? 'أي معلومات إضافية...' : language === 'fr' ? 'Informations supplémentaires...' : 'Any additional information...'}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !selectedDate || !selectedTime}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
        >
          {loading
            ? language === 'ar' ? 'جاري الحجز...' : language === 'fr' ? 'Réservation...' : 'Booking...'
            : language === 'ar' ? 'احجز الآن' : language === 'fr' ? 'Réserver maintenant' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}
