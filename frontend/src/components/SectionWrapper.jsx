//evita que se recargue la pagina
export default function SectionWrapper({ children }) {
  return (
    <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg flex-grow">
      {children}
    </main>
  );
}
