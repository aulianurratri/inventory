// app/layout.js
import './globals.css'; // ← penting!

export const metadata = {
  title: 'Sistem Inventory',
  description: 'Dashboard Admin',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
