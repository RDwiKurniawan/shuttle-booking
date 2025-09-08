import React, { useState, useEffect } from "react";

const SHUTTLE_DATA_JSON = JSON.stringify([
  { operator: "Blue Shuttle", time: "08:00", price: 150000 },
  { operator: "TravelX", time: "09:30", price: 175000 },
  { operator: "CityTrans", time: "11:00", price: 160000 },
  { operator: "Blue Shuttle", time: "13:00", price: 155000 },
  { operator: "TravelX", time: "15:00", price: 180000 },
  { operator: "CityTrans", time: "17:00", price: 165000 },
  { operator: "Blue Shuttle", time: "19:00", price: 170000 },
  { operator: "TravelX", time: "21:00", price: 200000 },
]);

const CITIES = ["Jakarta", "Bandung", "Surabaya"];

const App = () => {
  const [view, setView] = useState("search");
  const [shuttleList, setShuttleList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    destination: "",
    date: "",
  });
  const [bookingDetails, setBookingDetails] = useState(null);

  const fetchShuttleData = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data = JSON.parse(SHUTTLE_DATA_JSON);
      setShuttleList(data);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat data shuttle.");
      setLoading(false);
    }
  };

  useEffect(() => {}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Validasi
    if (!formData.name.trim()) {
      setError("Nama penumpang tidak boleh kosong.");
      return;
    }
    if (formData.origin === formData.destination) {
      setError("Kota asal tidak boleh sama dengan kota tujuan.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError("Tanggal tidak boleh sebelum hari ini.");
      return;
    }

    fetchShuttleData();
    setView("results");
  };

  const handleSelectShuttle = (shuttle) => {
    setBookingDetails({
      ...formData,
      operator: shuttle.operator,
      time: shuttle.time,
      price: shuttle.price,
    });
    setView("summary");
  };

  const handleConfirmBooking = () => {
    setView("success");
  };

  const handleReset = () => {
    setView("search");
    setFormData({ name: "", origin: "", destination: "", date: "" });
    setBookingDetails(null);
  };

  const destinationCities = CITIES.filter((city) => city !== formData.origin);

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const renderView = () => {
    switch (view) {
      case "search":
        return (
          <section className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-700">
              Cari Jadwal Shuttle
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Penumpang
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Masukkan nama Anda"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="origin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kota Asal
                  </label>
                  <select
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Kota Asal</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="destination"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kota Tujuan
                  </label>
                  <select
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Kota Tujuan</option>
                    {destinationCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tanggal Berangkat
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={minDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              >
                Cari Shuttle
              </button>
            </form>
            {error && (
              <div className="text-center text-red-500 font-medium mt-4 p-3 bg-red-50 rounded-lg border border-red-200 animate-fade-in">
                {error}
              </div>
            )}
          </section>
        );

      case "results":
        if (loading) {
          return (
            <div className="text-center py-10 animate-fade-in">
              <div className="flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 mt-4 font-semibold">
                Mencari shuttle...
              </p>
            </div>
          );
        }
        return (
          <section className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-700">
              Jadwal Shuttle Tersedia
            </h2>
            <div className="space-y-4">
              {shuttleList.map((shuttle, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between border border-gray-200 space-x-4 transition transform hover:scale-105 duration-200"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-lg font-semibold text-gray-800">
                      {shuttle.operator}
                    </p>
                    <p className="text-sm text-gray-500">
                      Jam Keberangkatan:{" "}
                      <span className="font-medium text-gray-700">
                        {shuttle.time}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Harga:{" "}
                      <span className="font-bold text-green-600">
                        Rp{shuttle.price.toLocaleString("id-ID")}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectShuttle(shuttle)}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                  >
                    Pilih
                  </button>
                </div>
              ))}
            </div>
          </section>
        );

      case "summary":
        if (!bookingDetails) return null;
        return (
          <section className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-700">
              Ringkasan Pemesanan
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl shadow-inner space-y-4">
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div>
                  <p className="font-medium text-gray-800">Nama Penumpang:</p>
                  <p className="font-normal">{bookingDetails.name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Rute:</p>
                  <p className="font-normal">{`${bookingDetails.origin} → ${bookingDetails.destination}`}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    Tanggal Berangkat:
                  </p>
                  <p className="font-normal">{bookingDetails.date}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    Jam Keberangkatan:
                  </p>
                  <p className="font-normal">{bookingDetails.time}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-gray-800">Harga Tiket:</p>
                  <p className="font-normal text-xl font-bold text-green-600">
                    Rp{Number(bookingDetails.price).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleConfirmBooking}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
            >
              Konfirmasi Booking
            </button>
          </section>
        );

      case "success":
        return (
          <section className="text-center py-10 animate-fade-in">
            <svg
              className="mx-auto h-24 w-24 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-3xl font-bold text-green-600 mt-4">
              Booking Berhasil!
            </h2>
            <p className="text-gray-500 mt-2">
              Terima kasih, booking Anda berhasil!
            </p>
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Kembali ke Beranda
            </button>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
      <style>
        {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-in-out forwards;
                }
                `}
      </style>
      <main className="container mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-8">
        <header className="text-center pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">
            Booking Shuttle Online
          </h1>
          <p className="text-gray-500 mt-2">
            Pesan tiket shuttle Anda dengan mudah dan cepat
          </p>
        </header>

        {renderView()}
      </main>
    </div>
  );
};

export default App;
