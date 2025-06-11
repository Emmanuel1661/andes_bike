// src/pages/AlertasStock.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { MdWarningAmber } from "react-icons/md";

export default function AlertasStock() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlertas = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("alertas_stock")
        .select(`
          id, umbral, alerta_activada, producto_id,
          productos:producto_id (
            nombre, stock, tipo, marca, descripcion
          )
        `)
        .eq("alerta_activada", true)
        .order("id", { ascending: false });
      setAlertas(data || []);
      setLoading(false);
    };
    fetchAlertas();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-10 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-red-600">
        <MdWarningAmber size={38} className="text-yellow-500" />
        Alertas de Stock Bajo
      </h2>
      {loading ? (
        <div className="text-xl font-bold py-8 text-center text-gray-700">Cargando alertas...</div>
      ) : alertas.length === 0 ? (
        <div className="text-lg font-semibold py-8 text-center text-green-600">
          ¡No hay productos con stock bajo!
        </div>
      ) : (
        <table className="w-full text-left bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="py-2 px-3">ID Alerta</th>
              <th className="py-2 px-3">Nombre Producto</th>
              <th className="py-2 px-3">Stock</th>
              <th className="py-2 px-3">Umbral</th>
              <th className="py-2 px-3">Tipo</th>
              <th className="py-2 px-3">Marca</th>
              <th className="py-2 px-3">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {alertas.map((alerta) => (
              <tr key={alerta.id} className={alerta.productos?.stock === 0 ? "bg-red-200 font-bold" : "bg-yellow-50"}>
                <td className="py-2 px-3">{alerta.id}</td>
                <td className="py-2 px-3">{alerta.productos?.nombre || "-"}</td>
                <td className="py-2 px-3 text-center">{alerta.productos?.stock}</td>
                <td className="py-2 px-3 text-center">{alerta.umbral}</td>
                <td className="py-2 px-3">{alerta.productos?.tipo}</td>
                <td className="py-2 px-3">{alerta.productos?.marca}</td>
                <td className="py-2 px-3">{alerta.productos?.descripcion || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
