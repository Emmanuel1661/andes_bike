import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function SearchResults({ search }) {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultados = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("productos")
        .select("id,nombre,precio,imagen,tipo,especificaciones,marca")
        .or(
          [
            `nombre.ilike.%${search}%`,
            `marca.ilike.%${search}%`,
            `tipo.ilike.%${search}%`,
            `especificaciones.ilike.%${search}%`
          ].join(",")
        );
      // FILTRA DUPLICADOS POR NOMBRE
      const unicos = [];
      const setNombres = new Set();
      for (const item of data || []) {
        const clave = `${item.nombre}`;
        if (!setNombres.has(clave)) {
          setNombres.add(clave);
          unicos.push(item);
        }
      }
      setResultados(unicos);
      setLoading(false);
    };
    if (search && search.length > 0) fetchResultados();
    else setResultados([]);
  }, [search]);

  // Función para obtener ruta de detalle según tipo
  const getDetalleLink = (producto) => {
    // Asegúrate que el tipo esté normalizado (mtb, ruta, downhill, accesorio...)
    if (
      producto.tipo === "mtb" ||
      producto.tipo === "ruta" ||
      producto.tipo === "downhill"
    ) {
      return `/bicicletas/${producto.id}`;
    }
    if (producto.tipo?.includes("accesorio")) {
      return `/accesorios/${producto.id}`;
    }
    if (producto.tipo?.includes("repuesto")) {
      return `/repuestos/${producto.id}`;
    }
    if (producto.tipo?.includes("ropa")) {
      return `/ropa/${producto.id}`;
    }
    // Ruta por defecto
    return `/producto/${producto.id}`;
  };

  return (
    <div className="container mx-auto max-w-6xl py-10 min-h-[60vh]">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900 drop-shadow-lg tracking-tight">
        Resultados de búsqueda
      </h1>
      <p className="mb-6 text-center text-lg text-gray-600">
        {search ? <>Mostrando resultados para: <b className="text-yellow-600">{search}</b></> : "Ingresa un término de búsqueda"}
      </p>
      {loading ? (
        <div className="text-2xl text-gray-700 font-semibold">Buscando...</div>
      ) : resultados.length === 0 ? (
        <div className="text-gray-500 text-lg text-center">No se encontraron resultados.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 place-items-center">
          {resultados.map((producto) => (
            <Link
              to={getDetalleLink(producto)}
              key={producto.id}
              className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center min-h-[340px] max-w-[420px] w-full hover:scale-105 hover:shadow-3xl transition cursor-pointer"
              style={{ textDecoration: "none" }}
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="h-48 w-full object-contain rounded-xl mb-5 bg-gray-100"
              />
              <div className="font-extrabold text-2xl md:text-3xl mb-1 text-neutral-900 text-center drop-shadow">
                {producto.nombre}
              </div>
              <div className="text-green-600 text-2xl font-bold mt-1 text-center drop-shadow">
                {producto.precio?.toLocaleString("es-CO")}
              </div>
              <div className="text-base text-yellow-600 font-semibold mt-2 text-center tracking-wide">
                {producto.marca} {producto.tipo && (" " + producto.tipo.toUpperCase())}
              </div>
              <div className="text-base mt-2 italic text-gray-700 text-center leading-snug">
                {producto.especificaciones}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
