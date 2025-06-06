import type { Viewport } from "next";

export const metadata = {
  title: "API Documentation",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function SwaggerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}