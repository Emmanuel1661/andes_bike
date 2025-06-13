import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminProductos3D() {
  const [productos, setProductos] = useState([]);
  const [editProducto, setEditProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductos3D();
  }, []);

  async function fetchProductos3D() {
    setLoading(true);
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .or('glb_url.is.not.null,usdz_url.is.not.null');

    if (!error) setProductos(data);
    setLoading(false);
  }

  async function handleSave(producto) {
    const { error } = await supabase
      .from('productos')
      .update({
        glb_url: producto.glb_url,
        usdz_url: producto.usdz_url
      })
      .eq('id', producto.id);

    if (!error) {
      alert('Producto actualizado');
      setEditProducto(null);
      fetchProductos3D();
    } else {
      alert('Error al actualizar producto');
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Seguro quieres eliminar este producto?')) return;
    const { error } = await supabase.from('productos').delete().eq('id', id);
    if (!error) {
      alert('Producto eliminado');
      fetchProductos3D();
    } else {
      alert('Error al eliminar producto');
    }
  }

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Administrar Productos con Modelos 3D</h2>
      {productos.length === 0 && <p>No hay productos con modelos 3D.</p>}
      {productos.map(prod => (
        <div
          key={prod.id}
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            maxWidth: 600,
          }}
        >
          <h3>{prod.nombre}</h3>

          {editProducto?.id === prod.id ? (
            <>
              <label>
                URL GLB:<br />
                <input
                  type="text"
                  value={editProducto.glb_url || ''}
                  onChange={e => setEditProducto({ ...editProducto, glb_url: e.target.value })}
                  style={{ width: '100%', padding: 8, marginBottom: 8 }}
                  placeholder="https://..."
                />
              </label>
              <label>
                URL USDZ:<br />
                <input
                  type="text"
                  value={editProducto.usdz_url || ''}
                  onChange={e => setEditProducto({ ...editProducto, usdz_url: e.target.value })}
                  style={{ width: '100%', padding: 8, marginBottom: 8 }}
                  placeholder="https://..."
                />
              </label>
              <button onClick={() => handleSave(editProducto)} style={{ marginRight: 8 }}>
                Guardar
              </button>
              <button onClick={() => setEditProducto(null)}>Cancelar</button>
            </>
          ) : (
            <>
              <p><strong>GLB:</strong> {prod.glb_url || 'No configurado'}</p>
              <p><strong>USDZ:</strong> {prod.usdz_url || 'No configurado'}</p>
              <button onClick={() => setEditProducto(prod)} style={{ marginRight: 8 }}>
                Editar
              </button>
              <button onClick={() => handleDelete(prod.id)} style={{ backgroundColor: 'red', color: 'white' }}>
                Eliminar
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
