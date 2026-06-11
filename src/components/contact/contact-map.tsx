import { brand } from "@/lib/brand";
import { getGoogleMapsEmbedUrl, getGoogleMapsUrl } from "@/lib/utils";

export function ContactMap() {
  const query = brand.contact.mapsQuery;
  const embedUrl = getGoogleMapsEmbedUrl(query);
  const mapsUrl = getGoogleMapsUrl(query);

  return (
    <div className="not-prose mt-8">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-base font-semibold text-brand-black">Konum</h2>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand-red hover:underline shrink-0"
        >
          Google Haritalar&apos;da Aç
        </a>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <iframe
          title={`${brand.name} konum haritası`}
          src={embedUrl}
          className="w-full h-[280px] sm:h-[360px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">{brand.contact.address}</p>
    </div>
  );
}
