import { m, useInView } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Upload, Building2, Cake, Heart } from "lucide-react";
import BottleSceneCustom from "./BottleSceneCustom";

const STATUS_HIDE_MS = 10000;
const REQUEST_TIMEOUT_MS = 12000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

type OccasionType = "wedding" | "corporate" | "birthday" | null;
type LabelFinish = "matte" | "glossy";

const occasions = [
  {
    id: "wedding" as const,
    icon: Heart,
    title: "Wedding",
    description: "Elegant personalized bottles for your special day",
    theme: "Gold/White Luxury",
    backgroundImage:
      "https://images.unsplash.com/photo-1761574044344-394d47e1a96c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd2VkZGluZyUyMGNlcmVtb255JTIwYnJpZGUlMjBncm9vbXxlbnwxfHx8fDE3NzM3NzkzNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    labelText: "Aarav & Meera",
    labelSubtext: "Special Edition",
    bottomText: "12 December 2026",
    labelBg: ["#f5e6c8", "#fff8ee"],
    accentColor: "#c9a84c",
    colors: { primary: "#D4AF37", secondary: "#FFFFFF", text: "#000000" },
  },
  {
    id: "corporate" as const,
    icon: Building2,
    title: "Corporate",
    description: "Professional branded bottles for your business",
    theme: "Clean Minimal",
    backgroundImage:
      "https://images.unsplash.com/photo-1758630737900-a28682c5aa69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBjb3Jwb3JhdGUlMjBidXNpbmVzcyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzM3NzkzNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    labelText: "LIFEE",
    labelSubtext: "Corporate Edition",
    bottomText: "PREMIUM WATER",
    labelBg: ["#ffffff", "#f0f4f8"],
    accentColor: "#1a2a4a",
    colors: { primary: "#0EA5E9", secondary: "#FFFFFF", text: "#FFFFFF" },
  },
  {
    id: "birthday" as const,
    icon: Cake,
    title: "Birthday",
    description: "Vibrant custom bottles for birthday celebrations",
    theme: "Soft Vibrant",
    backgroundImage:
      "https://images.unsplash.com/photo-1721804812395-12c7c963ca52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwY2VsZWJyYXRpb24lMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzM2ODA5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    labelText: "Riya",
    labelSubtext: "Birthday Edition",
    bottomText: "Celebrate!",
    labelBg: ["#ff6eb0", "#ffb347"],
    accentColor: "#ffffff",
    colors: { primary: "#EC4899", secondary: "#FDE047", text: "#FFFFFF" },
  },
];

export function BottleCustomizer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>(null);
  const [formData, setFormData] = useState({
    image: "",
    contactName: "",
    phone: "",
    email: "",
    names: "",
    companyName: "",
    tagline: "",
    birthdayName: "",
    age: "",
    eventDate: "",
    customMessage: "",
    labelFinish: "glossy" as LabelFinish,
    quantity: 50,
    deliveryLocation: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fetchAbortRef = useRef<AbortController | null>(null);
  const statusTimeoutRef = useRef<number | null>(null);
  const [previewRotationEnabled, setPreviewRotationEnabled] = useState(false);
  const [previewLabel, setPreviewLabel] = useState({
    nameText: "LIFEE",
    subText: "Corporate Edition",
    bottomText: "PREMIUM WATER",
  });
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

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_BYTES) {
      setStatus("error");
      setErrorMessage("Image too large. Please use image under 5MB.");
      return;
    }
    compressImage(file)
      .then((base64Image) => {
        setFormData((prev) => ({ ...prev, image: base64Image }));
        setStatus("");
        setErrorMessage("");
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("Failed to process image");
      });
  }, [compressImage]);

  const currentOccasion = selectedOccasion ? occasions.find((o) => o.id === selectedOccasion) : null;
  const getOrderType = useCallback(() => {
    switch (selectedOccasion) {
      case "wedding":
        return "Wedding";
      case "corporate":
        return "Corporate";
      case "birthday":
        return "Birthday";
      default:
        return "";
    }
  }, [selectedOccasion]);

  const getPreviewData = useCallback(() => {
    switch (getOrderType()) {
      case "Wedding":
        return {
          line1: formData.names || "John & Jane",
          line2: formData.eventDate || "Event Date",
          line3: formData.customMessage || "",
        };
      case "Corporate":
        return {
          line1: formData.companyName || "Company Name",
          line2: formData.tagline || "Your Tagline",
          line3: "",
        };
      case "Birthday":
        return {
          line1: formData.birthdayName || "Name",
          line2: formData.age ? `Sweet ${formData.age}` : "Birthday",
          line3: formData.customMessage || "",
        };
      default:
        return {
          line1: currentOccasion?.labelText || "LIFEE",
          line2: currentOccasion?.labelSubtext || "Corporate Edition",
          line3: currentOccasion?.bottomText || "PREMIUM WATER",
        };
    }
  }, [formData, getOrderType, currentOccasion]);

  const targetPreviewLabel = useMemo(
    () => ({
      nameText: getPreviewData().line1,
      subText: getPreviewData().line2,
      bottomText: getPreviewData().line3,
    }),
    [getPreviewData]
  );

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

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPreviewLabel(targetPreviewLabel);
    }, 100);
    return () => window.clearTimeout(timeoutId);
  }, [targetPreviewLabel]);

  const handleSelectOccasion = useCallback((occasionId: OccasionType) => {
    setSelectedOccasion(occasionId);
    setPreviewRotationEnabled(false);
    setStatus("");
    setErrorMessage("");
    setLoading(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.contactName || !formData.phone || !formData.email) {
        setStatus("error");
        setErrorMessage("Contact Name, Phone and Email are required");
        return;
      }

      const orderType = getOrderType();
      if (!orderType) {
        setStatus("error");
        setErrorMessage("Please select an order type");
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

      try {
        const response = await fetch("http://localhost:5000/api/email/custom-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: ac.signal,
          body: JSON.stringify({
            ...formData,
            orderType,
            uploadedImage: formData.image,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setFormData({
            image: "",
            contactName: "",
            phone: "",
            email: "",
            names: "",
            companyName: "",
            tagline: "",
            birthdayName: "",
            age: "",
            eventDate: "",
            customMessage: "",
            labelFinish: "glossy",
            quantity: 50,
            deliveryLocation: "",
          });
          setPreviewRotationEnabled(false);
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
        setStatus("error");
        setErrorMessage("Cannot connect to server");
      } finally {
        window.clearTimeout(requestTimeout);
        setLoading(false);
      }
    },
    [formData, getOrderType]
  );

  return (
    <section
      id="customizer"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#0A2540] scroll-mt-24"
    >
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(14, 165, 233, 0.3) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto w-full max-w-[min(100%,1400px)]">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-[clamp(2rem,5vh,4rem)] text-center"
        >
          <h2 className="mb-[clamp(1rem,3vh,1.5rem)] text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight text-white">
            Craft Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Signature Bottle</span>
          </h2>
          <p className="mx-auto max-w-2xl text-[clamp(0.9rem,1.5vw,1.1rem)] text-cyan-100/80">
            Personalize premium water bottles with precision-designed labels for your special moments.
          </p>
        </m.div>

        {!selectedOccasion ? (
          <div className="bottle-occasion-grid">
            {occasions.map((occasion, index) => {
              const Icon = occasion.icon;
              return (
                <m.div
                  key={occasion.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  onClick={() => handleSelectOccasion(occasion.id)}
                  className="group flex h-full min-h-0 w-full min-w-0 cursor-pointer flex-col"
                >
                  <div className="bottle-occasion-card relative flex h-full min-h-0 flex-1 flex-col overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg transition-all duration-500 hover:border-white/30">
                    <div className="bottle-occasion-media relative">
                      <m.img
                        src={occasion.backgroundImage}
                        alt={`${occasion.title} scene`}
                        width={1080}
                        height={720}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>

                    <div className="bottle-occasion-body">
                      <div className="flex shrink-0 items-center gap-3">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${occasion.colors.primary}20` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: occasion.colors.primary }} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[clamp(1.1rem,2vw,1.5rem)] font-bold text-white">{occasion.title}</h3>
                          <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/50">{occasion.theme}</p>
                        </div>
                      </div>

                      <p className="mt-2 min-h-0 flex-1 text-[clamp(0.75rem,1.2vw,0.95rem)] leading-relaxed text-cyan-100/70">
                        {occasion.description}
                      </p>

                      <m.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bottle-occasion-btn text-[clamp(0.85rem,1.3vw,1rem)] font-semibold transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${occasion.colors.primary}, ${occasion.colors.secondary})`,
                          color: occasion.id === "wedding" || occasion.id === "corporate" ? (occasion.id === "wedding" ? "#000" : "#fff") : "#000",
                        }}
                      >
                        Customize Now
                      </m.button>
                    </div>

                    <m.div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `radial-gradient(circle at 50% 50%, ${occasion.colors.primary}20, transparent 70%)` }}
                    />
                  </div>
                </m.div>
              );
            })}
          </div>
        ) : (
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <div className="grid gap-[clamp(1rem,3vw,3rem)] [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
              <div className="relative">
                <div className="sticky top-8">
                  <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-lg border border-white/10 p-5 sm:p-8 lg:p-12 flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

                    <div className="relative min-h-[clamp(15rem,40vh,22.5rem)] w-full cursor-grab active:cursor-grabbing">
                      <BottleSceneCustom
                        labelBg={currentOccasion?.labelBg || ["#ffffff", "#f0f4f8"]}
                        nameText={previewLabel.nameText}
                        subText={previewLabel.subText}
                        accentColor={currentOccasion?.accentColor || "#1a2a4a"}
                        bottomText={previewLabel.bottomText}
                        autoRotate={previewRotationEnabled}
                      />
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                      <p className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/60">
                        {previewRotationEnabled ? "Preview rotation is active • Drag to rotate" : "Bottle is still • Click Bottle Preview to start slow rotation"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <m.button type="button" onClick={() => setSelectedOccasion(null)} whileHover={{ x: -5 }} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 mb-4">
                  ← Back to occasions
                </m.button>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/20 bg-white/10 p-[clamp(1rem,2vw,2rem)] backdrop-blur-lg">
                  <div className="space-y-3">
                    <label className="text-white font-semibold">Upload Image</label>
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-white/30 hover:border-cyan-400 transition-all cursor-pointer bg-white/5 hover:bg-white/10"
                      >
                        <Upload className="w-6 h-6 text-cyan-400" />
                        <span className="text-white">{formData.image ? "Change Image" : "Upload High-Res Photo"}</span>
                      </label>
                    </div>
                    {formData.image && (
                      <img
                        src={formData.image}
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
                    <label className="text-white font-semibold">Contact Person Name *</label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Who should we contact?"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-white font-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-white font-semibold">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                      required
                    />
                  </div>

                  <div className="border-t border-white/10 my-2" />

                  {selectedOccasion === "wedding" && (
                    <>
                      <div className="space-y-3">
                        <label className="text-white font-semibold">Name(s)</label>
                        <input
                          type="text"
                          value={formData.names}
                          onChange={(e) => setFormData({ ...formData, names: e.target.value })}
                          placeholder="John & Jane"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-white font-semibold">Event Date</label>
                        <input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-white font-semibold">Custom Message</label>
                        <textarea
                          value={formData.customMessage}
                          onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                          placeholder="Add a special message..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all resize-none"
                        />
                      </div>
                    </>
                  )}

                  {selectedOccasion === "corporate" && (
                    <>
                      <div className="space-y-3">
                        <label className="text-white font-semibold">Company Name</label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="Company Name"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-white font-semibold">Tagline</label>
                        <input
                          type="text"
                          value={formData.tagline}
                          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                          placeholder="Your tagline"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-white font-semibold">Event Date</label>
                        <input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      </div>
                    </>
                  )}

                  {selectedOccasion === "birthday" && (
                    <>
                      <div className="space-y-3">
                        <label className="text-white font-semibold">Birthday Name</label>
                        <input
                          type="text"
                          value={formData.birthdayName}
                          onChange={(e) => setFormData({ ...formData, birthdayName: e.target.value })}
                          placeholder="Name"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-white font-semibold">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          min="1"
                          placeholder="Age"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-white font-semibold">Event Date</label>
                        <input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-white font-semibold">Custom Message</label>
                        <textarea
                          value={formData.customMessage}
                          onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                          placeholder="Add a special message..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all resize-none"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-3">
                    <label className="text-white font-semibold">Label Finish</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(["matte", "glossy"] as const).map((finish) => (
                        <m.button
                          type="button"
                          key={finish}
                          onClick={() => setFormData({ ...formData, labelFinish: finish })}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.labelFinish === finish ? "border-cyan-400 bg-cyan-400/20" : "border-white/20 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="text-white font-semibold capitalize">{finish}</div>
                          <div className="mt-1 text-[clamp(0.75rem,1.2vw,0.95rem)] text-cyan-100/60">{finish === "matte" ? "Soft, elegant look" : "Shiny, premium feel"}</div>
                        </m.button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <h3 className="text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white">Order Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-white">Quantity</label>
                        <input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value || "0", 10) })}
                          min="25"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[clamp(0.75rem,1.2vw,0.95rem)] text-white">Delivery Location</label>
                        <input
                          type="text"
                          value={formData.deliveryLocation}
                          onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                          placeholder="City"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col flex-wrap justify-center gap-3 pt-4 sm:flex-row">
                    <m.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPreviewRotationEnabled((prev) => !prev)}
                      className={`w-full max-w-[min(100%,300px)] rounded-xl border px-6 py-4 text-center text-[clamp(0.85rem,1.3vw,1rem)] font-semibold transition-all ${
                        previewRotationEnabled
                          ? "bg-cyan-400/20 border-cyan-300 text-cyan-100"
                          : "bg-white/10 border-white/20 text-white hover:bg-white/15"
                      }`}
                    >
                      {previewRotationEnabled ? "Bottle Preview On" : "Bottle Preview"}
                    </m.button>
                    <m.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="w-full max-w-[min(100%,300px)] rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 text-center text-[clamp(0.85rem,1.3vw,1rem)] font-semibold text-white shadow-lg shadow-cyan-500/50 transition-all hover:shadow-cyan-500/70 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? "⏳ Sending..." : "Request Custom Order"}
                    </m.button>
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
          </m.div>
        )}
      </div>
    </section>
  );
}
