// src/pages/Register.jsx
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    telefono: '',
    direccion: ''
  })
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje(null)
    setLoading(true)

    const { nombre, correo, contraseña, telefono, direccion } = form

    if (!correo || !contraseña || !nombre) {
      setMensaje('Por favor completa los campos obligatorios.')
      setLoading(false)
      return
    }

    // 1. Crear usuario en auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: correo,
      password: contraseña,
      options: {
        data: { nombre, telefono, direccion, rol: 'cliente' }
      }
    })

    if (signUpError) {
      setMensaje('Error: ' + signUpError.message)
      setLoading(false)
      return
    }

    const userId = signUpData.user?.id

    // 2. Guardar también en tabla usuarios
    if (userId) {
      await supabase.from('usuarios').insert([{
        id: userId,
        nombre,
        correo,
        telefono,
        direccion,
        rol: 'cliente',
        verificado: false
      }]).catch(err => {
        if (err.code !== '23505') {
          setMensaje("Error al guardar en la base de datos: " + err.message)
          setLoading(false)
          return
        }
      })
    }

    // 3. Reintentar login para activar sesión
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contraseña
    })

    if (loginError) {
      setMensaje("Cuenta creada, pero debes iniciar sesión manualmente.")
    } else {
      localStorage.setItem("user", JSON.stringify(loginData.user))
      setMensaje("¡Registro exitoso! Ya puedes usar tu cuenta.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8 space-y-4">
        <h1 className="text-2xl font-bold text-center">Registro - AndesBike</h1>

        {mensaje && (
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="nombre" placeholder="Nombre completo" className="input" onChange={handleChange} />
          <input type="email" name="correo" placeholder="Correo electrónico" className="input" onChange={handleChange} />
          <input type="password" name="contraseña" placeholder="Contraseña" className="input" onChange={handleChange} />
          <input type="tel" name="telefono" placeholder="Teléfono" className="input" onChange={handleChange} />
          <input type="text" name="direccion" placeholder="Dirección" className="input" onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            {loading ? 'Registrando…' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Inicia sesión</a>
        </p>
      </div>
    </div>
  )
}
