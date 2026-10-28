import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { ArrowLeft, Save, CheckCircle, AlertCircle, Lock } from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  
  // ESTADOS DEL CANDADO DE SEGURIDAD
  const [pin, setPin] = useState('');
  const [autorizado, setAutorizado] = useState(false);
  const PIN_SECRETO = "M3l10Ff@//"; // decirle al cheke de la contraseña

  // ESTADOS ORIGINALES DEL FORMULARIO
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [formData, setFormData] = useState({
    categoria: '1',
    titulo: '',
    precio: '',
    precioOriginal: '',
    imagen: '',
    linkAfiliado: '',
    linkScraper: ''
  });

  // FUNCIONES
  const verificarPin = (e) => {
    e.preventDefault();
    if (pin === PIN_SECRETO) {
      setAutorizado(true);
    } else {
      alert('PIN incorrecto. Intruso detectado. Este sistema se autodestruira y se borrara en automatico: Ruta: //System 32');
      setPin('');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const nuevoProducto = {
        categoria: String(formData.categoria).trim(),
        titulo: formData.titulo.trim(),
        precio: parseFloat(formData.precio) || 0, // Por si le pones 0 o lo dejas vacío
        precioOriginal: formData.precioOriginal ? parseFloat(formData.precioOriginal) : 0,
        imagen: formData.imagen.trim(),
        linkAfiliado: formData.linkAfiliado.trim(),
        linkScraper: formData.linkScraper.trim(),
        disponible: true 
      };

      await addDoc(collection(db, 'productos'), nuevoProducto);

      setMensaje({ texto: '¡Producto agregado con éxito!', tipo: 'exito' });
      
      setFormData({
        ...formData,
        titulo: '',
        precio: '',
        precioOriginal: '',
        imagen: '',
        linkAfiliado: '',
        linkScraper: ''
      });
      
    } catch (error) {
      console.error("Error al guardar:", error);
      setMensaje({ texto: 'Hubo un error al guardar el producto.', tipo: 'error' });
    }
    
    setLoading(false);
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
  };

  // ==========================================
  // EL MURO DE SEGURIDAD (PANTALLA DE BLOQUEO)
  // ==========================================
  if (!autorizado) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-950 px-4 relative z-10">
        <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl w-full max-w-sm flex flex-col items-center">
          <div className="bg-yellow-500/10 p-4 rounded-full mb-4">
            <Lock className="text-yellow-500" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white text-center mb-2 tracking-tight">Acceso Restringido</h2>
          <p className="text-neutral-400 text-sm text-center mb-8">Ingresa el código maestro para continuar.</p>
          
          <form onSubmit={verificarPin} className="w-full">
            <input 
              type="password" 
              placeholder="••••"
              className="w-full p-4 mb-4 bg-neutral-950/50 border border-white/10 text-white rounded-xl focus:outline-none focus:border-yellow-500/50 text-center tracking-[1em] text-xl font-bold transition-colors"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-black py-4 rounded-xl transition-all active:scale-[0.98]"
            >
              Desbloquear Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // EL FORMULARIO NORMAL (SI ESTÁ AUTORIZADO)
  // ==========================================
  return (
    <main className="w-full flex-grow flex flex-col items-center pt-8 md:pt-12 px-6 pb-24 relative z-10 animate-fade-up">
      <div className="w-full max-w-3xl mb-8">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors bg-neutral-900/50 px-4 py-2 rounded-full border border-white/5 hover:border-white/20 backdrop-blur-md w-max"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Volver al inicio</span>
        </button>
      </div>

      <div className="w-full max-w-3xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Panel de Administrador</h1>
        <p className="text-neutral-400 mb-8">Agrega nuevos productos al catálogo de MeliOffers.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-neutral-300 font-medium text-sm">ID de la Categoría</label>
            <select 
              name="categoria" 
              value={formData.categoria} 
              onChange={handleChange}
              className="bg-neutral-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/50 transition-colors"
              required
            >
              <option value="1">1 - Tecnología e Innovación</option>
              <option value="2">2 - Hogar y Herramientas</option>
              <option value="3">3 - Moda para H y M</option>
              <option value="4">4 - Videojuegos y PC</option>
              <option value="5">5 - Deportes y Fitness</option>
              <option value="6">6 - Accesorios Automotrices</option>
              <option value="7">7 - Salud y Belleza</option>
              <option value="8">8 - Bebes y Juguetes</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-300 font-medium text-sm">Título del Producto</label>
            <input 
              type="text" 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange}
              placeholder="Ej: BOPARTE Multicontacto..." 
              className="bg-neutral-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/50 transition-colors"
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-300 font-medium text-sm">Precio Actual ($) (Opcional)</label>
              <input 
                type="number" 
                step="0.01"
                name="precio" 
                value={formData.precio} 
                onChange={handleChange}
                placeholder="0.00" 
                className="bg-neutral-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-neutral-300 font-medium text-sm">Precio Original ($) - Opcional</label>
              <input 
                type="number" 
                step="0.01"
                name="precioOriginal" 
                value={formData.precioOriginal} 
                onChange={handleChange}
                placeholder="0.00" 
                className="bg-neutral-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-300 font-medium text-sm">URL de la Imagen</label>
            <input 
              type="url" 
              name="imagen" 
              value={formData.imagen} 
              onChange={handleChange}
              placeholder="https://http2.mlstatic.com/..." 
              className="bg-neutral-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/50 transition-colors"
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-300 font-medium text-sm">Enlace de Afiliado (Cliente)</label>
            <input 
              type="url" 
              name="linkAfiliado" 
              value={formData.linkAfiliado} 
              onChange={handleChange}
              placeholder="https://www.mercadolibre.com.mx/social/..." 
              className="bg-neutral-950/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/50 transition-colors"
              required 
            />
          </div>

          {mensaje.texto && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${mensaje.tipo === 'exito' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
              {mensaje.tipo === 'exito' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium text-sm">{mensaje.texto}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-black py-4 rounded-xl transition-all active:scale-[0.98] mt-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-neutral-950/20 border-t-neutral-950 rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={20} strokeWidth={2.5} />
                Guardar Producto Chaval
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}