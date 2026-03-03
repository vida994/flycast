"use client";

import { QRCodeSVG } from "qrcode.react";

type QRCodeDisplayProps = {
  url: string;
};

export function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <QRCodeSVG value={url} size={320} level="H" />
      <p className="break-all text-center text-sm text-[var(--color-flycast-muted)]">
        {url}
      </p>
    </div>
  );
}
