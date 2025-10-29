import "./globals.css";

export const metadata = {
  title: "ONG Ndao hifanosika",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
