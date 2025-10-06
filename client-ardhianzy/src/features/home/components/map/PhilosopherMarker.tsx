// src/features/home/components/map/PhilosopherMarker.tsx
import { useEffect, useMemo } from "react";
import { Marker, Tooltip } from "react-leaflet";
import { divIcon, type DivIcon } from "leaflet";
import type { TimelinePhilosopher } from "@/data/philosophers";

type Props = {
  philosopher: TimelinePhilosopher;
  onMarkerClick?: (p: TimelinePhilosopher) => void;
};

const PLACEHOLDER_IMG = "/assets/philosophers/placeholder.png";

let stylesInjected = false;
function ensureMarkerStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  const css = `
    /* ====== Marker kecil (diperkecil) ====== */
    .leaflet-marker-icon.philo-marker-wrap { z-index: 700 !important; }
    .philo-marker-wrap { pointer-events: auto; }

    .philo-marker.sm {
      width: 64px;
      height: 88px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,.6));
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
    }
    .philo-marker-portrait img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(100%);
      display: block;
    }

    .philo-marker-flagline {
      width: 64px;
      height: 24px;
      background: #1b1b1b;
      border: 1.5px solid #999;
      border-top: none;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 4px;
    }

    .philo-marker-flag { height: 12px; width: auto; display: block; }
    .philo-marker-caption { line-height: 1; }

    .philo-marker-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 10px;
      letter-spacing: .2px;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,.6);
      white-space: nowrap;
      max-width: 44px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .philo-marker-years {
      font-size: 9px;
      color: #bbb;
      white-space: nowrap;
      max-width: 44px;
      overflow: hidden;
      text-overflow: ellipsis;
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