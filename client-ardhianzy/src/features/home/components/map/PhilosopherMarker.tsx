// src/features/home/components/map/PhilosopherMarker.tsx
import { useEffect, useMemo, useState } from "react";
import { Marker, Tooltip } from "react-leaflet";
import { divIcon, type DivIcon } from "leaflet";

export type TimelinePhilosopher = {
  id: string | number;
  name: string;
  years: string;
  lat: number;
  lng: number;
  image?: string;
  flag?: string;
};

type Props = {
  philosopher: TimelinePhilosopher;
  onMarkerClick?: (p: TimelinePhilosopher) => void;
};

const PLACEHOLDER_IMG = "/assets/philosophers/placeholder.png";

let stylesInjected = false;
function ensureMarkerStyles() {
  if (stylesInjected || typeof document === "undefined") return;

  const css = `
    .leaflet-marker-icon.philo-marker-wrap { z-index: 3000 !important; }
    .philo-marker-wrap { pointer-events: auto; }

    /* ===== DESKTOP/TABLET (sm) ===== */
    .philo-marker.sm {
      width: 64px;
      height: auto;
      min-height: 88px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6));
      box-sizing: border-box;
    }

    .philo-marker-portrait.sm {
      width: 64px;
      height: 64px;
      background: #111;
      border: 1.5px solid #999;
      border-bottom: none;
      border-top-left-radius: 36px;
      border-top-right-radius: 36px;
      overflow: hidden;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .philo-marker-flagline.sm {
      width: 64px;
      height: auto;
      min-height: 24px;
      background: #1b1b1b;
      border: 1.5px solid #999;
      border-top: none;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      padding: 4px 2px;
      box-sizing: border-box;
    }

    .philo-marker-name.sm {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 10px;
      letter-spacing: .2px;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.6);
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      word-wrap: break-word;
      max-width: 58px;
    }

    .philo-marker-years.sm {
      font-size: 9px;
      color: #bbb;
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      word-wrap: break-word;
      max-width: 58px;
      margin-top: 1px;
    }

    .philo-marker.xs {
      width: 48px;
      height: auto;
      min-height: 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.55));
      box-sizing: border-box;
    }

    .philo-marker-portrait.xs {
      width: 48px;
      height: 48px;
      background: #111;
      border: 1.25px solid #999;
      border-bottom: none;
      border-top-left-radius: 28px;
      border-top-right-radius: 28px;
      overflow: hidden;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .philo-marker-flagline.xs {
      width: 48px;
      height: auto;
      min-height: 20px;
      background: #1b1b1b;
      border: 1.25px solid #999;
      border-top: none;
      border-bottom-left-radius: 7px;
      border-bottom-right-radius: 7px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      padding: 3px 2px;
      box-sizing: border-box;
    }

    .philo-marker-name.xs {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 9px;
      letter-spacing: .15px;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.55);
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      word-wrap: break-word;
      max-width: 44px;
    }

    .philo-marker-years.xs {
      font-size: 8px;
      color: #bbb;
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      word-wrap: break-word;
      max-width: 44px;
      margin-top: 1px;
    }

    .philo-marker-portrait img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover;
      object-position: center;
      filter: grayscale(100%);
      display: block;
    }

    .philo-marker-flag { height: 12px; width: auto; display: block; margin-bottom: 2px; }
    .philo-marker-caption {
      line-height: 1.1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 100%;
    }

    @media (max-width: 768px){
      .philo-marker-flag{ height: 10px; }
    }
  `;

  const style = document.createElement("style");
  style.id = "philosopher-marker-inline-css-responsive";
  style.textContent = css;
  document.head.appendChild(style);
  stylesInjected = true;
}

export default function PhilosopherMarker({ philosopher, onMarkerClick }: Props) {
  useEffect(() => {
    ensureMarkerStyles();
  }, []);

  const [vw, setVw] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  const isMobile = vw < 768;

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const latNum = Number(philosopher.lat);
  const lngNum = Number(philosopher.lng);
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return null;

  const name = philosopher.name ?? "";
  const years = philosopher.years ?? "";
  const portraitSrc = philosopher.image || PLACEHOLDER_IMG;
  const flagSrc = philosopher.flag || "";

  const icon: DivIcon = useMemo(() => {
    const sizeClass = isMobile ? "xs" : "sm";
    const w = isMobile ? 48 : 64;
    const h = isMobile ? 70 : 88;

    const html = `
      <div class="philo-marker ${sizeClass}" role="img" aria-label="${name}">
        <div class="philo-marker-portrait ${sizeClass}">
          <img src="${portraitSrc}" alt="${name}" draggable="false" />
        </div>
        <div class="philo-marker-flagline ${sizeClass}">
          ${flagSrc ? `<img src="${flagSrc}" alt="" class="philo-marker-flag" />` : ""}
          <div class="philo-marker-caption">
            <div class="philo-marker-name ${sizeClass}" title="${name}">${name}</div>
            <div class="philo-marker-years ${sizeClass}" title="${years}">${years}</div>
          </div>
        </div>
      </div>
    `;

    return divIcon({
      className: "philo-marker-wrap",
      html,
      iconSize: [w, h],
      iconAnchor: [Math.round(w / 2), Math.round(h / 2)],
      tooltipAnchor: [0, -Math.round(h / 2)],
    });
  }, [portraitSrc, flagSrc, name, years, isMobile]);

  const handleClick = () => onMarkerClick?.(philosopher);

  return (
    <Marker position={[latNum, lngNum]} icon={icon} eventHandlers={{ click: handleClick }}>
      <Tooltip direction="top" offset={[0, isMobile ? -3 : -5]} opacity={0.9}>
        {name}
      </Tooltip>
    </Marker>
  );
}