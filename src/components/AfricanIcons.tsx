import React from "react";

/**
 * Brand seal featuring the authentic Africa continent silhouette
 * from the original African Shop repo, reimagined in terracotta & Kente gold.
 */
export const AfricaEmblem: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 40,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="as-bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#261A14" />
        <stop offset="100%" stopColor="#140D0A" />
      </linearGradient>
      <linearGradient id="as-gold" x1="20" y1="20" x2="112" y2="112" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F5C358" />
        <stop offset="52%" stopColor="#DF7C26" />
        <stop offset="100%" stopColor="#C84B24" />
      </linearGradient>
    </defs>
    <rect width="128" height="128" rx="30" fill="url(#as-bg)" />
    <rect
      x="6.5"
      y="6.5"
      width="115"
      height="115"
      rx="24"
      stroke="#EAB338"
      strokeOpacity="0.4"
      strokeWidth="2"
    />
    {/* Subtle Adinkra corner diamonds */}
    <path d="M64 14L69 19L64 24L59 19Z" fill="#EAB338" fillOpacity="0.75" />
    <g transform="translate(15 16) scale(0.192)">
      <path
        d="M217.9 78.4 221.3 78.8 222.8 80.4 225.5 79.8 226.2 80.3 224.2 83.3 224.2 84.8 225.4 86.4 225.6 87.4 225.0 90.5 222.4 93.2 222.4 94.4 223.0 95.4 225.2 96.0 227.0 98.1 229.3 99.1 234.3 100.4 237.1 100.3 240.4 100.8 247.0 102.9 248.1 103.6 250.1 106.9 250.9 107.6 261.6 110.4 266.7 112.6 267.7 112.7 268.9 112.3 271.8 110.0 272.1 109.0 271.5 105.9 272.9 103.4 276.3 101.3 280.0 100.5 286.8 101.4 289.0 103.3 292.7 104.5 297.0 105.1 299.1 106.5 305.7 106.7 317.4 109.9 319.6 109.5 324.1 107.2 327.4 106.8 331.5 107.2 333.6 108.5 335.4 108.4 339.5 109.4 342.6 109.5 344.8 108.7 345.5 108.8 348.3 115.1 348.6 117.0 345.0 124.9 343.8 125.7 341.6 125.1 341.2 125.6 341.3 126.4 344.5 133.0 348.0 138.5 352.3 143.6 352.5 144.5 352.0 146.1 352.4 148.4 358.0 152.9 359.0 154.3 360.3 158.0 359.7 160.5 360.0 163.7 361.8 169.9 362.5 170.8 367.0 174.0 369.6 179.1 371.6 184.1 380.7 190.6 387.9 197.8 391.2 200.3 391.8 201.3 391.9 202.3 390.6 204.0 390.4 204.8 392.6 206.8 394.0 208.9 396.1 210.5 399.2 210.5 403.3 209.5 409.0 208.8 413.4 207.3 416.0 206.9 418.1 206.0 422.2 205.8 426.5 204.8 430.4 202.9 431.4 203.0 432.0 203.9 431.6 209.5 430.4 212.0 428.9 217.1 423.3 228.8 418.7 236.3 408.8 247.9 403.5 252.0 395.5 257.1 391.4 260.4 385.7 266.5 383.6 269.9 379.9 272.4 378.1 274.3 376.4 275.1 375.4 278.1 373.8 280.7 372.9 283.3 371.2 285.2 370.4 286.6 369.0 290.3 368.7 292.4 369.2 294.0 371.7 295.7 372.1 296.5 371.0 299.8 371.1 304.1 374.4 311.0 376.6 313.3 377.3 315.3 377.2 319.7 377.9 324.6 378.0 331.5 378.8 334.4 375.8 340.8 374.6 342.3 371.9 344.5 361.7 349.0 356.5 353.5 353.9 355.1 348.4 359.7 348.0 361.1 348.1 363.3 350.3 367.0 352.1 371.8 351.8 377.3 352.1 379.8 351.4 381.0 349.6 382.5 339.7 386.7 337.6 388.4 337.2 389.8 338.3 391.7 338.3 393.1 337.0 397.2 336.3 401.3 335.0 403.6 330.1 407.2 326.5 412.4 323.8 415.7 314.8 423.2 310.6 425.7 305.9 427.4 303.2 427.9 301.6 429.0 298.7 428.7 296.0 429.3 291.1 428.7 287.8 429.1 285.3 429.0 280.2 430.8 275.9 431.7 273.0 433.3 271.8 433.6 270.4 433.4 268.1 432.0 266.1 431.4 263.8 429.9 263.2 428.8 263.0 425.9 261.9 423.0 263.1 421.0 262.7 417.7 259.4 413.0 253.6 403.2 249.6 399.0 247.7 395.8 243.6 380.4 243.4 373.6 242.8 371.3 238.5 365.4 234.1 356.0 230.8 351.9 230.0 350.2 229.3 344.3 230.2 339.8 233.8 328.9 239.3 321.3 239.9 316.6 239.4 314.7 235.9 308.0 235.8 306.7 237.0 304.5 236.9 302.8 234.9 296.7 232.6 293.4 232.3 291.1 230.9 287.4 226.5 281.9 221.6 277.1 218.5 273.5 214.9 267.8 215.0 266.1 216.1 263.9 217.8 258.5 217.6 255.6 219.6 248.1 219.4 246.4 217.9 244.1 215.8 242.9 214.4 240.9 212.3 239.3 208.4 240.3 205.8 240.5 203.9 241.1 199.8 240.9 197.3 238.3 194.9 234.1 192.2 231.8 190.8 231.4 182.6 231.4 176.2 232.6 167.4 235.7 164.1 237.6 160.0 238.7 155.3 237.7 152.6 237.6 149.1 236.7 146.5 236.7 139.7 237.7 131.7 240.7 129.4 240.7 128.0 240.4 123.3 238.3 111.2 229.1 106.3 226.6 103.7 224.3 102.3 222.2 101.2 217.9 97.9 213.9 95.0 211.9 93.5 208.8 89.2 205.8 86.8 205.1 84.4 202.1 83.3 198.0 83.4 194.7 81.8 191.9 80.0 190.0 80.1 189.4 82.1 187.7 84.4 184.1 84.8 182.8 84.9 180.0 86.2 176.7 86.6 172.6 85.6 165.8 85.8 163.0 84.7 161.1 82.4 159.0 82.1 158.0 82.5 154.7 84.4 152.9 85.4 151.4 86.0 148.4 87.2 145.9 89.8 142.8 92.3 141.0 93.2 138.9 93.8 135.9 94.8 134.0 95.8 132.9 98.9 130.8 102.2 126.1 104.8 124.2 109.8 123.3 116.3 118.6 119.7 115.5 120.3 113.9 119.3 108.6 122.1 101.6 125.2 98.5 130.5 96.2 134.0 94.1 139.1 86.4 142.4 86.1 146.3 88.1 151.4 88.0 158.0 88.9 163.3 86.3 168.8 85.3 172.5 83.3 177.2 81.9 186.5 81.0 197.3 80.9 202.7 79.4 206.6 79.4 209.2 80.3 212.1 80.3ZM421.7 321.9 422.4 321.8 423.0 322.3 425.6 326.2 426.6 329.3 427.4 334.4 428.6 336.9 428.4 338.5 427.3 340.3 425.7 339.9 425.1 340.4 425.4 344.1 425.0 345.1 423.8 346.7 423.3 351.0 411.7 384.1 410.5 385.1 407.4 386.0 403.3 387.9 402.1 387.9 396.5 385.6 395.3 384.7 394.3 382.4 393.6 377.7 391.9 373.6 391.6 370.7 392.2 368.1 392.8 367.2 394.5 366.2 397.4 359.9 397.3 357.4 395.5 352.5 395.2 348.0 397.9 342.2 407.0 339.6 414.2 334.0 415.3 332.4 415.7 329.9 417.9 329.2 419.8 327.0 420.4 323.5Z"
        fill="url(#as-gold)"
      />
    </g>
  </svg>
);

/**
 * Custom African-inspired dual-tone category icons
 * Inspired by wax motifs, calabashes, terracotta pottery, and woven baskets.
 */
export const CategoryIcon: React.FC<{
  categoryId: string;
  className?: string;
}> = ({ categoryId, className = "w-7 h-7" }) => {
  switch (categoryId) {
    case "mode":
      // Embroidered African Tunic / Boubou with diamond motif
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path
            d="M11 5L5 9.5L8 15L10.5 13.5V27H21.5V13.5L24 15L27 9.5L21 5C19.8 6.8 18 7.8 16 7.8C14 7.8 12.2 6.8 11 5Z"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M16 10.5L19 14L16 17.5L13 14L16 10.5Z"
            fill="#EAB338"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M10.5 22.5H21.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      );

    case "beaute":
      // Carved Calabash Bowl with Shea Botanical Leaf & Radiant Spark
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path
            d="M6 16.5C6 22.3 10.5 26 16 26C21.5 26 26 22.3 26 16.5H6Z"
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 16.5C10.5 13.2 13 12 16 12C19 12 21.5 13.2 23 16.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M16 4.5L17.4 8L21 9.4L17.4 10.8L16 14.3L14.6 10.8L11 9.4L14.6 8L16 4.5Z"
            fill="#EAB338"
          />
          <path d="M11 20.5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "alimentation":
      // West African Clay Pot (Canari) & Botanical Spice Leaf
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path
            d="M11 11H21L23.5 15.5C25 18.4 23.8 26 16 26C8.2 26 7 18.4 8.5 15.5L11 11Z"
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M9.5 11H22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M16 11C16 7.5 18.5 5 22 5C22 8.2 19.6 10.6 16 11Z"
            fill="#EAB338"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 19L13.2 17L16 19L18.8 17L21.5 19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "electronique":
      // Sleek Smartphone with Radiant Geometric Signal Waves
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <rect
            x="9.5"
            y="4.5"
            width="13"
            height="23"
            rx="3.2"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M14 23.5H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M16 10.5L18.8 13.3L16 16.1L13.2 13.3L16 10.5Z"
            fill="#EAB338"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path d="M5.5 11.5C4.5 13 4.5 15.5 5.5 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M26.5 11.5C27.5 13 27.5 15.5 26.5 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    case "maison":
      // Architectural Sahelian / West African Arch Home & Sun
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path
            d="M5 14L16 5.5L27 14V26.5H5V14Z"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12.5 26.5V19C12.5 17.1 14.1 15.5 16 15.5C17.9 15.5 19.5 17.1 19.5 19V26.5"
            fill="#EAB338"
            fillOpacity="0.45"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle cx="16" cy="11" r="1.4" fill="currentColor" />
        </svg>
      );

    case "artisanat":
    default:
      // Handwoven Raffia Basket with Zigzag Weave
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path
            d="M6 14H26L23.5 25.5H8.5L6 14Z"
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M11 14C11 9.5 13.2 6.5 16 6.5C18.8 6.5 21 9.5 21 14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8.5 19.5L11.5 17L14.5 19.5L17.5 17L20.5 19.5L23.5 17"
            stroke="#EAB338"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

/**
 * Geometric Kente / Bogolan ornamental accent used next to titles & dividers.
 */
export const AdinkraOrnament: React.FC<{ className?: string }> = ({
  className = "w-14 h-3.5",
}) => (
  <svg viewBox="0 0 84 18" fill="none" className={className} aria-hidden="true">
    <path d="M2 9H22" stroke="#C84B24" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M28 9L34 3L40 9L34 15L28 9Z" fill="#C84B24" />
    <path d="M42 9L48 3L54 9L48 15L42 9Z" fill="#EAB338" />
    <path d="M56 9L62 3L68 9L62 15L56 9Z" fill="#1B6B4A" />
    <path d="M72 9H82" stroke="#C84B24" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
