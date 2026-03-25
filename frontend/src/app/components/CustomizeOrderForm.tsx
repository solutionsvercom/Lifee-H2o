import { useState } from "react";
import { Upload } from "lucide-react";

type LabelFinish = "matte" | "glossy";

interface CustomizeOrderFormProps {
  title: string;
  subtitle: string;
}

export function CustomizeOrderForm({ title, subtitle }: CustomizeOrderFormProps) {
  const [customData, setCustomData] = useState({
    image: "",
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    message: "",
    finish: "glossy" as LabelFinish,
    quantity: 50,
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCustomData((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("http://localhost:5000/api/email/custom-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customData.name,
          email: customData.email,
          phone: customData.phone,
          orderType: title,
          quantity: customData.quantity,
          eventDate: customData.eventDate,
          customMessage: customData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success: Custom order sent successfully!");
        setCustomData({
          image: "",
          name: "",
          email: "",
          phone: "",
          eventDate: "",
          message: "",
          finish: "glossy",
          quantity: 50,
          location: "",
        });
      } else {
        setStatus("error: " + (data.error || "Failed to send custom order"));
      }
    } catch (_error) {
      setStatus("error: Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-[#0A2540] px-4 sm:px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="inline-flex items-center text-cyan-300 hover:text-cyan-200 mb-8">
          ← Back
        </a>
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
          <p className="text-cyan-100/80 mt-3">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-6">
          <div className="space-y-3">
            <label className="text-white font-semibold">Upload Image</label>
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload-page" />
              <label
                htmlFor="image-upload-page"
                className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-white/30 hover:border-cyan-400 transition-all cursor-pointer bg-white/5 hover:bg-white/10"
              >
                <Upload className="w-6 h-6 text-cyan-400" />
                <span className="text-white">{customData.image ? "Change Image" : "Upload High-Res Photo"}</span>
              </label>
            </div>
            {customData.image && <img src={customData.image} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />}
          </div>

          <div className="space-y-3">
            <label className="text-white font-semibold">Name(s)</label>
            <input
              type="text"
              value={customData.name}
              onChange={(e) => setCustomData({ ...customData, name: e.target.value })}
              placeholder="Enter name"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-white font-semibold">Email</label>
            <input
              type="email"
              value={customData.email}
              onChange={(e) => setCustomData({ ...customData, email: e.target.value })}
              placeholder="Enter email"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-white font-semibold">Phone</label>
            <input
              type="tel"
              value={customData.phone}
              onChange={(e) => setCustomData({ ...customData, phone: e.target.value })}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-white font-semibold">Event Date</label>
            <input
              type="date"
              value={customData.eventDate}
              onChange={(e) => setCustomData({ ...customData, eventDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-white font-semibold">Custom Message</label>
            <textarea
              value={customData.message}
              onChange={(e) => setCustomData({ ...customData, message: e.target.value })}
              placeholder="Add a special message..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-white font-semibold">Label Finish</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["matte", "glossy"] as const).map((finish) => (
                <button
                  type="button"
                  key={finish}
                  onClick={() => setCustomData({ ...customData, finish })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    customData.finish === finish ? "border-cyan-400 bg-cyan-400/20" : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="text-white font-semibold capitalize">{finish}</div>
                  <div className="text-xs text-cyan-100/60 mt-1">{finish === "matte" ? "Soft, elegant look" : "Shiny, premium feel"}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <h2 className="text-white font-semibold text-lg">Order Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white text-sm">Quantity</label>
                <input
                  type="number"
                  value={customData.quantity}
                  onChange={(e) => setCustomData({ ...customData, quantity: parseInt(e.target.value || "0") })}
                  min="25"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm">Delivery Location</label>
                <input
                  type="text"
                  value={customData.location}
                  onChange={(e) => setCustomData({ ...customData, location: e.target.value })}
                  placeholder="City"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="block mx-auto w-full max-w-[300px] py-4 px-6 text-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Request Custom Order"}
            </button>
          </div>
          {status.startsWith("success") && (
            <p className="text-center text-green-400">✅ Custom order sent successfully!</p>
          )}
          {status.startsWith("error") && (
            <p className="text-center text-red-400">❌ {status.replace(/^error:\s*/i, "")}</p>
          )}
        </form>
      </div>
    </main>
  );
}
