// src/features/home/components/map/PhilosopherMarker.tsx
import { useEffect, useMemo } from "react";
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
    .leaflet-marker-icon.philo-marker-wrap { z-index: 700 !important; }
    .philo-marker-wrap { pointer-events: auto; }

    .philo-marker.sm {
      width: 64px;
      height: auto; 
      min-height: 88px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,6));
      box-sizing: border-box;
    }

    .philo-marker-portrait {
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
    .philo-marker-portrait img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover;
      object-position: center;
      filter: grayscale(100%);
      display: block;
    }

    .philo-marker-flagline {
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

    .philo-marker-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 10px;
      letter-spacing: .2px;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,6);
      
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      word-wrap: break-word;
      max-width: 58px;
    }

    .philo-marker-years {
      font-size: 9px;
      color: #bbb;
      
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      word-wrap: break-word;
      max-width: 58px;
      margin-top: 1px;
    }
  `;
  const style = document.createElement("style");
  style.id = "philosopher-marker-inline-css-sm";
  style.textContent = css;
  document.head.appendChild(style);
  stylesInjected = true;
}

export default function PhilosopherMarker({ philosopher, onMarkerClick }: Props) {
  useEffect(() => { ensureMarkerStyles(); }, []);

  const latNum = Number(philosopher.lat);
  const lngNum = Number(philosopher.lng);
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return null;

  const name = philosopher.name ?? "";
  const years = philosopher.years ?? "";
  const portraitSrc = philosopher.image || PLACEHOLDER_IMG;
  const flagSrc = philosopher.flag || "";

  const icon: DivIcon = useMemo(() => {
    const html = `
      <div class="philo-marker sm" role="img" aria-label="${name}">
        <div class="philo-marker-portrait">
          <img src="${portraitSrc}" alt="${name}" draggable="false" />
        </div>
        <div class="philo-marker-flagline">
          ${flagSrc ? `<img src="${flagSrc}" alt="" class="philo-marker-flag" />` : ""}
          <div class="philo-marker-caption">
            <div class="philo-marker-name" title="${name}">${name}</div>
            <div class="philo-marker-years" title="${years}">${years}</div>
          </div>
        </div>
      </div>
    `;
    return divIcon({
      className: "philo-marker-wrap",
      html,
      iconSize: [64, 88], 
      iconAnchor: [32, 44],
      tooltipAnchor: [0, -44],
    });
  }, [portraitSrc, flagSrc, name, years]);

  const handleClick = () => onMarkerClick?.(philosopher);

  return (
    <Marker position={[latNum, lngNum]} icon={icon} eventHandlers={{ click: handleClick }}>
      <Tooltip direction="top" offset={[0, -44]} opacity={0.9}>
        {name}
      </Tooltip>
    </Marker>
  );
}