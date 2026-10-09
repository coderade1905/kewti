import React, { useState } from "react";

export type KewtiLogoName =
  | "addis_ababa_science_and_technology_university"
  | "addis_ababa_university"
  | "african_union"
  | "amhara_bank"
  | "amole"
  | "awash_international_bank"
  | "awash_international_bank_no_text"
  | "ayat_real_estate"
  | "bahir_dar_university"
  | "bandira_addis_map_entertainment"
  | "bank_of_abyssinia"
  | "blueMoon"
  | "cbe_birr_light"
  | "cbe_birr_normal"
  | "cellutech"
  | "chapa"
  | "chapa_gradient"
  | "chapa_no_text"
  | "commercial_bank_of_ethiopia"
  | "cooperative_bank_of_oromia"
  | "dangote"
  | "dashen_bank"
  | "ethio_telecom"
  | "ethiopian_agricultural_transformation_agency"
  | "ethiopian_air_force"
  | "ethiopian_airlines"
  | "ethiopian_defense_force"
  | "ethiopian_sugar_corporation"
  | "flintstone_homes"
  | "gasha_digital_technology"
  | "gift_real_estate"
  | "habesha_beer"
  | "hibret_bank"
  | "hibret_bank_no_text"
  | "hilton"
  | "hyatt_regency"
  | "iceaddis"
  | "innohub"
  | "jimma_university"
  | "kacha"
  | "legacy_real_estate"
  | "loline_mag"
  | "marriott"
  | "mice"
  | "ministry_of_health"
  | "ministry_of_peace"
  | "ministry_of_transport"
  | "moenco"
  | "national_bank_of_ethiopia"
  | "national_oil_ethiopia"
  | "noah_real_estate"
  | "nyala_motors"
  | "office_of_the_prime_minister"
  | "oromia_international_bank"
  | "qinash"
  | "ramada"
  | "ride"
  | "sap"
  | "save_the_children"
  | "sirabota"
  | "sunshine"
  | "tele_birr"
  | "tomoca"
  | "tourism_ethiopia"
  | "tsehay_real_estate"
  | "uneca"
  | "washington_medical_center"
  | "yotek_real_estate"
  | "zemen_bank"
  | (string & {});

export type KewtiLogoSize = "xs" | "sm" | "md" | "lg" | "xl" | number | string;

const SIZE_MAP: Record<"xs" | "sm" | "md" | "lg" | "xl", number> = {
  xs: 16,
  sm: 24,
  md: 40,
  lg: 56,
  xl: 80,
};

const FILE_MAP: Record<string, { png?: string; svg?: string }> = {
  cooperative_bank_of_oromia: {
    png: "Cooperative_Bank_of_Oromia.png",
  },
  flintstone_homes: {
    png: "flinstone_homes.png",
  },
};

export interface KewtiLogoProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "size"> {
  /** Logo identifier name from registry */
  name: KewtiLogoName;
  /** Base URL pointing to the registry hosting public assets (Required) */
  registryUrl: string;
  /** Size preset ('sm', 'md', etc.) or explicit number/string */
  size?: KewtiLogoSize;
  /** Format of the logo image asset */
  format?: "svg" | "png";
  /** Optional fallback UI when image fails to load */
  fallback?: React.ReactNode;
}

function formatTitle(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const KewtiLogo = React.forwardRef<HTMLImageElement, KewtiLogoProps>(
  (
    {
      name,
      registryUrl,
      size = "md",
      format = "svg",
      fallback,
      alt,
      className,
      style,
      onError,
      ...props
    },
    ref
  ) => {
    const [hasError, setHasError] = useState(false);

    const dimension =
      typeof size === "number"
        ? `${size}px`
        : size in SIZE_MAP
        ? `${SIZE_MAP[size as keyof typeof SIZE_MAP]}px`
        : size;

    const override = FILE_MAP[name]?.[format];
    const fileName = override ? override : `${name}.${format}`;
    const cleanBaseUrl = registryUrl.replace(/\/+$/, "");
    const src = `${cleanBaseUrl}/logos/${name}/${fileName}`;

    if (hasError) {
      if (fallback) return <>{fallback}</>;
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: dimension,
            height: dimension,
            backgroundColor: "#f3f4f6",
            color: "#9ca3af",
            fontSize: "10px",
            borderRadius: "4px",
            ...style,
          }}
          className={className}
          title={`Logo not found: ${name}`}
        >
          {name.slice(0, 3).toUpperCase()}
        </span>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || `${formatTitle(name)} logo`}
        width={dimension}
        height={dimension}
        loading="lazy"
        onError={(e) => {
          setHasError(true);
          onError?.(e);
        }}
        style={{
          width: dimension,
          height: dimension,
          objectFit: "contain",
          display: "inline-block",
          ...style,
        }}
        className={className}
        {...props}
      />
    );
  }
);

KewtiLogo.displayName = "KewtiLogo";