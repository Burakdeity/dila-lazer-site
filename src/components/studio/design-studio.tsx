"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Type,
  Palette,
  Ruler,
  Download,
  MessageCircle,
  Sparkles,
  RotateCcw,
  Layers,
  Wand2,
  CheckCircle2,
  FileImage,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl } from "@/lib/utils";
import { NeonWallPreview } from "@/components/studio/neon-wall-preview";
import { FontPicker } from "@/components/studio/font-picker";
import { NeonFontsLoader } from "@/components/studio/neon-fonts-loader";
import { defaultNeonFont, type NeonFont } from "@/data/neon-fonts";

const neonColors = [
  { id: "pembe", hex: "#FF4DA6", name: "Pembe" },
  { id: "kirmizi", hex: "#FF0040", name: "Kırmızı" },
  { id: "mavi", hex: "#00BFFF", name: "Mavi" },
  { id: "yesil", hex: "#39FF14", name: "Yeşil" },
  { id: "mor", hex: "#BF00FF", name: "Mor" },
  { id: "altin", hex: "#FFD700", name: "Altın" },
  { id: "beyaz", hex: "#FFFFFF", name: "Beyaz" },
  { id: "rgb", hex: "linear-gradient(90deg, #FF0040, #00BFFF, #39FF14)", name: "RGB" },
];

const productTypes = [
  { id: "neon", name: "Neon LED", material: "neon" },
  { id: "mdf", name: "MDF", material: "mdf" },
  { id: "pleksi", name: "Pleksi", material: "pleksi" },
  { id: "3d", name: "3D Kutu Harf", material: "3d" },
  { id: "led", name: "LED / Elektronik", material: "led" },
];

const sizes = [
  { id: "small", label: "Küçük", dim: "40×20 cm", w: 40, h: 20 },
  { id: "medium", label: "Orta", dim: "60×30 cm", w: 60, h: 30 },
  { id: "large", label: "Büyük", dim: "80×40 cm", w: 80, h: 40 },
  { id: "xlarge", label: "XL", dim: "100×50 cm", w: 100, h: 50 },
];

const steps = [
  { num: 1, title: "Tasarla", desc: "Yazı, renk ve boyut seçin" },
  { num: 2, title: "Önizle", desc: "Canlı neon simülasyonu" },
  { num: 3, title: "Teklif", desc: "WhatsApp üzerinden fiyat alın" },
];

const designTabs = [
  { id: "text", label: "Yazı", icon: Type },
  { id: "font", label: "Font", icon: Type },
  { id: "color", label: "Renk", icon: Palette },
] as const;

const extraTabs = [
  { id: "product", label: "Ürün", icon: Layers },
  { id: "logo", label: "Logo", icon: FileImage },
] as const;

type DesignTabId = (typeof designTabs)[number]["id"];
type ExtraTabId = (typeof extraTabs)[number]["id"];
type TabId = DesignTabId | ExtraTabId;

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-gray-100">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-brand-red/8 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-brand-red" />
        </div>
        <h3 className="font-semibold text-brand-black text-sm sm:text-base">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function buildQuoteMessage(
  text: string,
  font: NeonFont,
  colorName: string,
  sizeDim: string,
  productName: string,
) {
  return `Merhaba, özel tasarımım için fiyat teklifi almak istiyorum.

Yazı: ${text}
Font: ${font.name}
Renk: ${colorName}
Boyut: ${sizeDim}
Ürün: ${productName}`;
}

export function DesignStudio() {
  const [activeTab, setActiveTab] = useState<TabId>("text");
  const [text, setText] = useState("Kendin Yarat!");
  const [font, setFont] = useState<NeonFont>(defaultNeonFont);
  const [color, setColor] = useState(neonColors[0]);
  const [size, setSize] = useState(sizes[1]);
  const [productType, setProductType] = useState(productTypes[0]);
  const [material, setMaterial] = useState(productTypes[0].material);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    suggestion: string;
    neonVersion: string;
    estimatedDays: number;
  } | null>(null);

  const whatsAppQuoteUrl = getWhatsAppUrl(
    buildQuoteMessage(text, font, color.name, size.dim, productType.name),
  );

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target?.result as string);
      setAiAnalyzing(true);
      setTimeout(() => {
        setAiAnalyzing(false);
        setAiResult({
          suggestion: "3D Kutu Harf + Neon Kombinasyon",
          neonVersion: "Logo konturları neon flex ile aydınlatılabilir",
          estimatedDays: 10,
        });
      }, 2000);
    };
    reader.readAsDataURL(file);
  }, []);

  const resetDesign = () => {
    setText("Kendin Yarat!");
    setLogoPreview(null);
    setAiResult(null);
    setFont(defaultNeonFont);
    setColor(neonColors[0]);
    setSize(sizes[1]);
    setProductType(productTypes[0]);
    setMaterial("neon");
  };

  const glowColor = color.id === "rgb" ? "#FF0040" : color.hex;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <NeonFontsLoader />
      {/* Üst banner */}
      <div className="bg-brand-black text-white">
        <div className="max-w-[1400px] mx-auto px-4 py-6 sm:py-10 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-brand-red mb-2 sm:mb-3">
                <Wand2 className="h-3.5 w-3.5" />
                Kendin Tasarla
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-3">
                Profesyonel Tasarım Stüdyosu
              </h1>
              <p className="text-white/65 max-w-xl text-sm sm:text-base leading-relaxed">
                Yazınızı yazın, rengi ve boyutu seçin — canlı neon önizlemesi ile tasarımınızı oluşturun
                dakikalar içinde siparişe hazır olun.
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 shrink-0">
              <Link
                href="/teklif-al"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-white/20 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Teklif Al
              </Link>
              <button
                onClick={resetDesign}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-white/10 text-xs sm:text-sm font-medium hover:bg-white/15 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Sıfırla
              </button>
            </div>
          </div>

          {/* Adımlar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 sm:mt-10">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-red text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {step.num}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{step.title}</p>
                  <p className="text-xs text-white/50 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-5 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {/* Önizleme — mobilde üstte */}
          <div className="xl:col-span-2 order-1">
            <div className="xl:sticky xl:top-24 space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-100 bg-gray-50">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500">Canlı Önizleme</span>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Duvar · gece/gündüz · ON/OFF</p>
                </div>

                <NeonWallPreview
                  text={text}
                  font={font}
                  glowColor={glowColor}
                  colorName={color.name}
                  sizeDim={size.dim}
                  sizeId={size.id}
                  productName={productType.name}
                  logoPreview={logoPreview}
                  isRgb={color.id === "rgb"}
                />
              </div>

              <AnimatePresence>
                {aiResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-5 rounded-2xl bg-white border border-brand-red/20 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-brand-red" />
                      <span className="text-sm font-semibold text-brand-black">AI Tasarım Önerisi</span>
                    </div>
                    <p className="text-sm text-gray-600">{aiResult.suggestion}</p>
                    <p className="text-xs text-gray-400 mt-1.5">{aiResult.neonVersion}</p>
                    <p className="text-xs font-medium text-brand-red mt-2">
                      Tahmini üretim süresi: {aiResult.estimatedDays} iş günü
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Teklif kartı */}
              <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="mb-1">
                  <span className="text-sm font-medium text-brand-black">Fiyat Teklifi</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 sm:mb-5 leading-relaxed">
                  Her tasarım özel üretimdir. Güncel fiyat ve teslimat süresi için tasarım
                  detaylarınızı WhatsApp üzerinden paylaşın; size özel teklif hazırlayalım.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a href={whatsAppQuoteUrl} target="_blank" rel="noopener noreferrer" className="sm:col-span-2">
                    <Button variant="whatsapp" className="w-full justify-center min-h-[44px]">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp ile Teklif Al
                    </Button>
                  </a>
                  <Link href="/teklif-al" className="sm:col-span-2">
                    <Button variant="outline" className="w-full justify-center min-h-[44px]">
                      <Download className="h-4 w-4" />
                      Detaylı Teklif Formu
                    </Button>
                  </Link>
                </div>
                <ul className="mt-4 sm:mt-5 space-y-2">
                  {["Ücretsiz tasarım desteği", "2 yıl garanti", "81 ile teslimat"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Kontroller */}
          <div className="xl:col-span-3 order-2 space-y-3 sm:space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200">
                {designTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all relative ${
                      activeTab === tab.id
                        ? "text-brand-red bg-brand-red/5"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-brand-red rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 p-2 border-b border-gray-100 bg-gray-50/80">
                {extraTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-brand-black text-white"
                        : "text-gray-500 hover:bg-white"
                    }`}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "text" && (
                  <Panel title="Tabela Yazısı" icon={Type}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Neon yazınız</label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Yazınızı girin"
                      maxLength={40}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-brand-black text-base sm:text-lg placeholder:text-gray-400 focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10"
                    />
                    <p className="text-xs text-gray-400 mt-2">{text.length}/40 karakter</p>
                    <div className="mt-5 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-xs text-gray-400 mb-2">Seçili font önizlemesi</p>
                      <p
                        className="text-2xl truncate"
                        style={{
                          fontFamily: `"${font.family}", cursive`,
                          fontWeight: font.weight,
                          fontStyle: font.style,
                          letterSpacing: font.letterSpacing,
                          textTransform: font.textTransform,
                          color: glowColor,
                        }}
                      >
                        {text || "Kendin Yarat!"}
                      </p>
                    </div>
                  </Panel>
                )}

                {activeTab === "font" && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                    <FontPicker
                      selectedId={font.id}
                      onSelect={setFont}
                      previewColor="#374151"
                    />
                  </div>
                )}

                {activeTab === "color" && (
                  <div className="space-y-4">
                    <Panel title="Neon Rengi" icon={Palette}>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
                        {neonColors.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setColor(c)}
                            className="flex flex-col items-center gap-2 group"
                          >
                            <span
                              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 transition-all shadow-sm ${
                                color.id === c.id
                                  ? "border-brand-red scale-110 ring-2 ring-brand-red/20"
                                  : "border-gray-200 group-hover:border-gray-300"
                              }`}
                              style={{ background: c.hex }}
                            />
                            <span className="text-[10px] text-gray-500 font-medium">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </Panel>
                    <Panel title="Boyut" icon={Ruler}>
                      <div className="grid grid-cols-2 gap-3">
                        {sizes.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSize(s)}
                            className={`px-4 py-4 rounded-xl text-left border transition-all ${
                              size.id === s.id
                                ? "bg-brand-red text-white border-brand-red shadow-sm"
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <span className="block text-sm font-semibold">{s.label}</span>
                            <span className={`block text-xs mt-0.5 ${size.id === s.id ? "text-white/70" : "text-gray-400"}`}>
                              {s.dim}
                            </span>
                          </button>
                        ))}
                      </div>
                    </Panel>
                  </div>
                )}

                {activeTab === "product" && (
                  <div className="space-y-4">
                    <Panel title="Ürün Tipi" icon={Layers}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {productTypes.map((pt) => (
                          <button
                            key={pt.id}
                            onClick={() => {
                              setProductType(pt);
                              setMaterial(pt.material);
                            }}
                            className={`px-4 py-3.5 rounded-xl text-sm font-medium border transition-all ${
                              productType.id === pt.id
                                ? "bg-brand-red text-white border-brand-red shadow-sm"
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {pt.name}
                          </button>
                        ))}
                      </div>
                    </Panel>
                    <Panel title="Malzeme" icon={Ruler}>
                      <div className="flex flex-wrap gap-2">
                        {["neon", "pleksi", "3d", "led"].map((m) => (
                          <button
                            key={m}
                            onClick={() => setMaterial(m)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium border capitalize transition-all ${
                              material === m
                                ? "bg-brand-black text-white border-brand-black"
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {m === "3d" ? "3D CNC" : m === "neon" ? "Neon Flex" : m}
                          </button>
                        ))}
                      </div>
                    </Panel>
                  </div>
                )}

                {activeTab === "logo" && (
                  <Panel title="Logo Yükle & AI Analiz" icon={Upload}>
                    <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-brand-red/40 hover:bg-brand-red/[0.02] transition-all group">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-brand-red/10 flex items-center justify-center mb-4 transition-colors">
                        <Upload className="h-6 w-6 text-gray-400 group-hover:text-brand-red transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-brand-black">Dosya seçin veya sürükleyin</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, SVG veya JPG — maks. 10 MB</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                    {logoPreview && (
                      <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200">
                          <Image src={logoPreview} alt="Logo" fill className="object-contain p-1" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-brand-black truncate">Logo yüklendi</p>
                          <p className="text-xs text-gray-400">Önizlemede görüntüleniyor</p>
                        </div>
                        <button
                          onClick={() => { setLogoPreview(null); setAiResult(null); }}
                          className="text-xs text-gray-400 hover:text-brand-red transition-colors"
                        >
                          Kaldır
                        </button>
                      </div>
                    )}
                    {aiAnalyzing && (
                      <div className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-brand-red/5 border border-brand-red/10">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-red border-t-transparent shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-brand-black">AI logonuzu analiz ediyor...</p>
                          <p className="text-xs text-gray-500 mt-0.5">En uygun üretim yöntemi hesaplanıyor</p>
                        </div>
                      </div>
                    )}
                  </Panel>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Alt bilgi */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { title: "Uzman Destek", desc: "Tasarım ekibimiz her adımda yanınızda" },
            { title: "Hızlı Üretim", desc: "Onay sonrası 7-14 iş günü teslimat" },
            { title: "Kalite Garantisi", desc: "Tüm özel üretimlerde 2 yıl garanti" },
          ].map((item) => (
            <div key={item.title} className="p-5 rounded-2xl bg-white border border-gray-200 text-center shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-brand-red mx-auto mb-2" />
              <p className="font-semibold text-brand-black text-sm">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
