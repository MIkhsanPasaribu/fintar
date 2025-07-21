import BookingSystem from "@/components/booking/booking-system";

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-main to-bg-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookingSystem />
      </div>
    </div>
  );
}
