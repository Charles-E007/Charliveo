import type { SVGProps } from "react";

type CharliveoLogoProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  /** Logo layout: symbol only, symbol above the name, or symbol beside the name. */
  variant?: "icon" | "stacked" | "horizontal";
  /** Any CSS color value, such as #111111, currentColor, or white. */
  color?: string;
};

const CRESCENT_PATH =
  "M 361 82 C 328 81 301 86 278 99 C 254 113 238 140 229 176 C 218 218 218 260 222 302 C 227 355 243 398 269 434 C 298 474 339 502 388 516 C 431 528 475 524 515 511 C 541 503 562 490 582 472 C 557 522 517 565 467 592 C 416 619 359 628 303 619 C 242 610 188 582 146 539 C 105 497 80 440 73 380 C 65 319 77 257 104 204 C 131 151 174 109 226 82 C 268 61 314 51 361 51 C 421 51 473 68 517 99 C 545 119 563 147 570 174 C 577 201 570 224 553 239 C 537 253 515 255 495 248 C 476 242 460 229 445 211 C 429 191 411 159 395 132 C 383 112 371 95 361 82 Z";

export default function CharliveoLogo({
  variant = "horizontal",
  color = "currentColor",
  width,
  height,
  ...props
}: CharliveoLogoProps) {
  const viewBox =
    variant === "icon"
      ? "0 0 683 699"
      : variant === "stacked"
        ? "0 0 683 820"
        : "0 0 700 240";

  const defaultWidth = variant === "icon" ? 64 : variant === "stacked" ? 240 : 300;
  const defaultHeight = variant === "icon" ? 66 : variant === "stacked" ? 288 : 103;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width ?? defaultWidth}
      height={height ?? defaultHeight}
      role="img"
      aria-label="Charliveo"
      focusable="false"
      {...props}
    >
      {variant === "icon" ? (
        <path d={CRESCENT_PATH} fill={color} />
      ) : variant === "stacked" ? (
        <>
          <path d={CRESCENT_PATH} fill={color} />
          <text
            x="341.5"
            y="758"
            fill={color}
            fontFamily="Inter, Arial, Helvetica, sans-serif"
            fontSize="88"
            fontWeight="650"
            letterSpacing="-2.5"
            textAnchor="middle"
          >
            Charliveo
          </text>
        </>
      ) : (
        <>
          <path d={CRESCENT_PATH} fill={color} transform="translate(0 0) scale(0.32)" />
          <text
            x="245"
            y="150"
            fill={color}
            fontFamily="Inter, Arial, Helvetica, sans-serif"
            fontSize="86"
            fontWeight="650"
            letterSpacing="-2.5"
          >
            Charliveo
          </text>
        </>
      )}
    </svg>
  );
}
