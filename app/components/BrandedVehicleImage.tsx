import Image, { type ImageProps } from "next/image";
import type { CSSProperties } from "react";
import vehicleBranding from "../data/vehicle-branding.json";
import styles from "./BrandedVehicleImage.module.css";

type VehicleBranding = {
  src: string;
  width: number;
  height: number;
  front: number[] | null;
};

const branding: Record<string, VehicleBranding> = vehicleBranding;

/** Keep the photo and its transparent emblem in the same cover-cropped frame. */
export default function BrandedVehicleImage({ src, ...props }: Omit<ImageProps, "src"> & { src: string }) {
  const vehicle = branding[src];
  if (!vehicle) return <Image {...props} src={src} />;
  const frameStyle = {
    "--width-from-height": `${100 * vehicle.width / vehicle.height}cqh`,
    "--height-from-width": `${100 * vehicle.height / vehicle.width}cqw`,
  } as CSSProperties;
  const [x, y, width, height] = vehicle.front ?? [0, 0, 0, 0];

  return <div className={styles.viewport}>
    <div className={styles.frame} style={frameStyle}>
      <Image {...props} src={vehicle.src} />
      {vehicle.front && <span className={styles.emblem} aria-hidden="true" style={{
        left: `${x / vehicle.width * 100}%`,
        top: `${y / vehicle.height * 100}%`,
        width: `${width / vehicle.width * 100 / 0.9}%`,
        height: `${height / vehicle.height * 100 / 0.9}%`,
      }}>
        <Image src="/branding/td-chrome-open.png" alt="" fill sizes="90px" className={styles.badge} />
      </span>}
    </div>
  </div>;
}
