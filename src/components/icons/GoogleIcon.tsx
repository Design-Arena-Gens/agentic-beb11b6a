"use client";

type GoogleIconProps = {
  className?: string;
};

export const GoogleIcon = ({ className }: GoogleIconProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 488 512"
    fill="currentColor"
  >
    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123.6 24.5 166.9 64.9l-67.7 65.1C284.2 96.6 181.8 92 121.2 150.2 92.4 176.5 77 214 77 256c0 86.1 64.3 152.5 147 152.5 94.1 0 129.4-67.5 135.1-102.5H248v-82h236.1c2.2 12.1 3.9 24.3 3.9 37.8z" />
  </svg>
);
