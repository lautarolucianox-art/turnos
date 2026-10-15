import "./globals.css";
export const metadata = { title: "Reservá tu turno", description: "Elegí día y horario y reservá en segundos." };
export default function RootLayout({ children }) {
  return (<html lang="es"><body>{children}</body></html>);
}
