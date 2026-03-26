import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Upload } from "lucide-react";

const STATUS_HIDE_MS = 10000;
const REQUEST_TIMEOUT_MS = 12000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

type LabelFinish = "matte" | "glossy";

interface CustomizeOrderFormProps {
  title: string;
  subtitle: string;
}

function CustomizeOrderFormInner({ title, subtitle }: CustomizeOrderFormProps) {
  const compressImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(MAX_IMAGE_DIMENSION / img.width, MAX_IMAGE_DIMENSION / img.height, 1);
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Unable to process image"));
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
        };
        img.onerror = () => reject(new Error("Invalid image file"));
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(file);
    });
  }, []);

  const [customData, setCustomData] = useState({
    image: "",
    contactName: "",
    names: "",
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
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedImageBase64, setUploadedImageBase64] = useState("");
  const fetchAbortRef = useRef<AbortController | null>(null);
  const statusTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      fetchAbortRef.current?.abort();
      if (statusTimeoutRef.current) {
        window.clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!status) return;
    if (statusTimeoutRef.current) {
      window.clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = window.setTimeout(() => {
      setStatus("");
      setErrorMessage("");
    }, STATUS_HIDE_MS);
  }, [status]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > MAX_IMAGE_BYTES) {
      alert("Image too large. Please use image under 5MB");
      return;
    }

    try {
      const base64String = await compressImage(file);
      setCustomData((prev) => ({ ...prev, image: base64String }));
      setUploadedImageBase64(base64String);
      setStatus("");
      setErrorMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("Failed to process image");
    }
  }, [compressImage]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!customData.contactName || !customData.phone || !customData.email) {
        setStatus("error");
        setErrorMessage("Contact Name, Phone and Email are required");
        return;
      }
      fetchAbortRef.current?.abort();
      const ac = new AbortController();
      fetchAbortRef.current = ac;
      setLoading(true);
      setStatus("");
      let didTimeout = false;
      const requestTimeout = window.setTimeout(() => {
        didTimeout = true;
        ac.abort();
      }, REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch("http://localhost:5000/api/email/custom-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ac.signal,
          body: JSON.stringify({
            contactName: customData.contactName,
            phone: customData.phone,
            email: customData.email,
            orderType: title,
            names: customData.names,
            quantity: customData.quantity,
            eventDate: customData.eventDate,
            customMessage: customData.message,
            labelFinish: customData.finish === "glossy" ? "Glossy" : "Matte",
            deliveryLocation: customData.location,
            uploadedImage: uploadedImageBase64 || null,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setErrorMessage("");
          setCustomData({
            image: "",
            contactName: "",
            names: "",
            email: "",
            phone: "",
            eventDate: "",
            message: "",
            finish: "glossy",
            quantity: 50,
            location: "",
          });
          setUploadedImageBase64("");
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Failed to send");
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError" && !didTimeout) return;
        if (didTimeout) {
          setStatus("error");
          setErrorMessage("Request timed out. Please try again.");
          return;
        }
        setStatus("error");
        setErrorMessage("Cannot connect to server");
      } finally {
        window.clearTimeout(requestTimeout);
        setLoading(false);
      }
    },
    [customData, title, uploadedImageBase64]
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-[#0A2540] px-4 sm:px-6 py-10">
      <div className="max-w-4xl mx-auto section-container">
        <Link to="/" prefetch="intent" className="inline-flex items-center text-cyan-300 hover:text-cyan-200 mb-8">
          ← Back
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
          <p className="text-cyan-100/80 mt-3">{subtitle}</p>
        </div>

        <div
          style={{
            maxWidth: "560px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <form onSubmit={handleSubmit} className="p-5 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-6">
          <div className="space-y-3">
            <label className="text-white text-sm font-semibold">Upload Image</label>
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
            {customData.image && (
              <img
                src={customData.image}
                alt="Preview"
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="space-y-3">
            <label className="text-white text-sm font-semibold">Contact Person Name *</label>
            <input
              type="text"
              value={customData.contactName}
              onChange={(e) => setCustomData({ ...customData, contactName: e.target.value })}
              placeholder="Who should we contact?"
              className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-white text-sm font-semibold">Phone Number *</label>
            <input
              type="tel"
              value={customData.phone}
              onChange={(e) => setCustomData({ ...customData, phone: e.target.value })}
              placeholder="Enter your phone number"
              className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-white text-sm font-semibold">Email Address *</label>
            <input
              type="email"
              value={customData.email}
              onChange={(e) => setCustomData({ ...customData, email: e.target.value })}
              placeholder="Enter your email address"
              className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
              required
            />
          </div>

          <div className="border-t border-white/10 my-2" />

          <div className="space-y-3">
            <label className="text-white text-sm font-semibold">Name(s)</label>
            <input
              type="text"
              value={customData.names}
              onChange={(e) => setCustomData({ ...customData, names: e.target.value })}
              placeholder="Enter name"
              className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-white text-sm font-semibold">Event Date</label>
            <input
              type="date"
              value={customData.eventDate}
              onChange={(e) => setCustomData({ ...customData, eventDate: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-white text-sm font-semibold">Custom Message</label>
            <textarea
              value={customData.message}
              onChange={(e) => setCustomData({ ...customData, message: e.target.value })}
              placeholder="Add a special message..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-white text-sm font-semibold">Label Finish</label>
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
                  className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm">Delivery Location</label>
                <input
                  type="text"
                  value={customData.location}
                  onChange={(e) => setCustomData({ ...customData, location: e.target.value })}
                  placeholder="City"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="block mx-auto w-full max-w-[300px] py-4 px-6 text-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "⏳ Sending..." : "Request Custom Order"}
            </button>
          </div>
          {status === "success" && (
            <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-center text-sm">
              ✅ Order request sent successfully! We will contact you within 24 hours.
            </div>
          )}
          {status === "error" && (
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-center text-sm">❌ {errorMessage}</div>
          )}
          </form>
        </div>
      </div>
    </main>
  );
}

export const CustomizeOrderForm = memo(CustomizeOrderFormInner);
