import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Upload } from "lucide-react";
import { apiUrl } from "../utils/apiUrl";

const STATUS_HIDE_MS = 10000;
const REQUEST_TIMEOUT_MS = 30000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

type LabelFinish = "matte" | "glossy";

interface CustomizeOrderFormProps {
  title: string;
  subtitle: string;
}

function CustomizeOrderFormInner({ title, subtitle }: CustomizeOrderFormProps) {
  const getOrderType = useCallback(() => {
    if (/wedding/i.test(title)) return "Wedding";
    if (/corporate/i.test(title)) return "Corporate";
    if (/birthday/i.test(title)) return "Birthday";
    return title;
  }, [title]);

  const getInitialFormData = useCallback(() => {
    const orderType = getOrderType();
    return {
      image: "",
      contactName: "",
      names: "",
      email: "",
      phone: "",
      eventDate: "",
      message: "",
      finish: "glossy" as LabelFinish,
      quantity: orderType === "Corporate" ? 100 : 50,
      location: "",
    };
  }, [getOrderType]);

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

  const [customData, setCustomData] = useState(getInitialFormData);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedImageBase64, setUploadedImageBase64] = useState("");
  const fetchAbortRef = useRef<AbortController | null>(null);
  const statusTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    console.log("Form component mounted");
  }, []);

  useEffect(() => {
    console.log("Form data changed:", customData);
  }, [customData]);

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

  const resetForm = useCallback(() => {
    setCustomData(getInitialFormData());
    setUploadedImageBase64("");
    setErrorMessage("");
    setStatus("");
  }, [getInitialFormData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("=== SUBMIT CLICKED ===");
      console.log("Event type:", e.type);
      const orderType = getOrderType();
      console.log("Submitting form data:", customData);
      console.log("Order type:", orderType);
      console.log("Uploaded image:", uploadedImageBase64 ? "YES" : "NO");
      if (!customData.contactName) {
        alert("Please enter Contact Person Name");
        return;
      }
      if (!customData.phone) {
        alert("Please enter Phone Number");
        return;
      }
      if (!customData.email) {
        alert("Please enter Email Address");
        return;
      }
      fetchAbortRef.current?.abort();
      const ac = new AbortController();
      fetchAbortRef.current = ac;
      setLoading(true);
      setStatus("");
      setErrorMessage("");
      let didTimeout = false;
      const requestTimeout = window.setTimeout(() => {
        didTimeout = true;
        ac.abort();
      }, REQUEST_TIMEOUT_MS);

      const payload = {
        contactName: customData.contactName,
        phone: customData.phone,
        email: customData.email,
        orderType,
        names: customData.names || "",
        companyName: "",
        tagline: "",
        birthdayName: "",
        age: "",
        eventDate: customData.eventDate || "",
        customMessage: customData.message || "",
        labelFinish: customData.finish === "glossy" ? "Glossy" : "Matte",
        quantity: customData.quantity || 50,
        deliveryLocation: customData.location || "",
        uploadedImage: uploadedImageBase64 || null,
      };
      console.log("Final payload:", payload);

      try {
        const response = await fetch(apiUrl("/api/email/custom-order"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ac.signal,
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log("Server response:", data);

        if (data.success) {
          resetForm();
          setStatus("success");
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
        console.error("Submit error:", error);
        setStatus("error");
        setErrorMessage("Cannot connect to server. Make sure backend is running on port 5000");
      } finally {
        window.clearTimeout(requestTimeout);
        setLoading(false);
      }
    },
    [customData, getOrderType, resetForm, uploadedImageBase64]
  );

  return (
    <main className="min-h-[100svh] bg-gradient-to-br from-slate-900 to-[#0A2540] px-[clamp(1rem,5vw,5rem)] py-[clamp(2rem,6vh,4rem)]">
      <div className="section-container mx-auto w-full max-w-[min(100%,1400px)]">
        <Link to="/" prefetch="intent" className="mb-[clamp(1.5rem,4vh,2rem)] inline-flex items-center text-[clamp(0.85rem,1.3vw,1rem)] text-cyan-300 hover:text-cyan-200">
          ← Back
        </Link>
        <div className="mb-[clamp(2rem,5vh,3rem)] text-center">
          <h1 className="text-[clamp(2rem,5vw,4rem)] font-bold text-white">{title}</h1>
          <p className="mt-3 text-[clamp(0.9rem,1.5vw,1.1rem)] text-cyan-100/80">{subtitle}</p>
        </div>

        <div className="custom-order-form-shell mx-auto w-full max-w-[min(100%,560px)]">
          <form onSubmit={handleSubmit} className="custom-order-form space-y-6 rounded-3xl border border-white/20 bg-white/10 p-[clamp(1rem,2vw,2rem)] backdrop-blur-lg">
          <div className="space-y-3">
            <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] font-semibold text-white">Upload Image</label>
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
                fetchPriority="low"
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] font-semibold text-white">Contact Person Name *</label>
            <input
              type="text"
              value={customData.contactName}
              onChange={(e) => setCustomData((prev) => ({ ...prev, contactName: e.target.value }))}
              placeholder="Who should we contact?"
              className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] font-semibold text-white">Phone Number *</label>
            <input
              type="tel"
              value={customData.phone}
              onChange={(e) => setCustomData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
              className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] font-semibold text-white">Email Address *</label>
            <input
              type="email"
              value={customData.email}
              onChange={(e) => setCustomData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email address"
              className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
              required
            />
          </div>

          <div className="border-t border-white/10 my-2" />

          <div className="space-y-3">
            <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] font-semibold text-white">Name(s)</label>
            <input
              type="text"
              value={customData.names}
              onChange={(e) => setCustomData((prev) => ({ ...prev, names: e.target.value }))}
              placeholder="Enter name"
              className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] font-semibold text-white">Event Date</label>
            <input
              type="date"
              value={customData.eventDate}
              onChange={(e) => setCustomData((prev) => ({ ...prev, eventDate: e.target.value }))}
              className="event-date-input w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] font-semibold text-white">Custom Message</label>
            <textarea
              value={customData.message}
              onChange={(e) => setCustomData((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Add a special message..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] font-semibold text-white">Label Finish</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["matte", "glossy"] as const).map((finish) => (
                <button
                  type="button"
                  key={finish}
                  onClick={() => setCustomData((prev) => ({ ...prev, finish }))}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    customData.finish === finish ? "border-cyan-400 bg-cyan-400/20" : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="text-[clamp(0.85rem,1.3vw,1rem)] font-semibold capitalize text-white">{finish}</div>
                  <div className="mt-1 text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/60">{finish === "matte" ? "Soft, elegant look" : "Shiny, premium feel"}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <h2 className="text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white">Order Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-white">Quantity</label>
                <input
                  type="number"
                  value={customData.quantity}
                  onChange={(e) => setCustomData((prev) => ({ ...prev, quantity: parseInt(e.target.value || "0", 10) }))}
                  min="25"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-white">Delivery Location</label>
                <input
                  type="text"
                  value={customData.location}
                  onChange={(e) => setCustomData((prev) => ({ ...prev, location: e.target.value }))}
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
              onClick={(e) => {
                if (loading) {
                  e.preventDefault();
                }
              }}
              className="mx-auto block w-full max-w-[min(100%,300px)] rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 text-center text-[clamp(0.85rem,1.3vw,1rem)] font-semibold text-white shadow-lg shadow-cyan-500/50 transition-all hover:shadow-cyan-500/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "⏳ Sending..." : "Request Custom Order"}
            </button>
          </div>
          {status === "success" && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/20 p-4 text-center text-[clamp(0.75rem,1.2vw,0.95rem)] text-green-300">
              ✅ Order request sent successfully! We will contact you within 24 hours.
            </div>
          )}
          {status === "error" && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/20 p-4 text-center text-[clamp(0.75rem,1.2vw,0.95rem)] text-red-300">❌ {errorMessage}</div>
          )}
          </form>
        </div>
      </div>
    </main>
  );
}

export const CustomizeOrderForm = memo(CustomizeOrderFormInner);
