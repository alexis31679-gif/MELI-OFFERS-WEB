import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { categorias } from '../data/data';
// Importamos las funciones de Firebase
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Asegúrate de que la ruta apunte a tu archivo firebase.js

// --- COMPONENTE DE TARJETA ---
function ProductCard({ data }) {
  const formatearPrecio = (precio) => {
    if (precio === undefined || precio === null) return '';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio);
  };

  // Como en Firebase ya los guardaste como números (double), ya no tenemos que limpiarlos
  const descuento = data.precioOriginal ? Math.round(((data.precioOriginal - data.precio) / data.precioOriginal) * 100) : null;

  return (
    <div className="group relative bg-neutral-900/30 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-[2rem] p-4 flex flex-col h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">

      <div className="w-full h-56 bg-white rounded-2xl overflow-hidden relative mb-5 p-4 flex items-center justify-center shadow-inner">
        <img 
          src={data.imagen} 
          alt={data.titulo} 
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col flex-grow px-2">
        <h3 className="text-neutral-300 font-medium text-sm leading-snug mb-3 line-clamp-2 group-hover:text-white transition-colors">
          {data.titulo}
        </h3>

          <a 
            href={data.linkAfiliado} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold py-3.5 px-4 rounded-xl transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          >
            Ver en Mercado Libre
            <ExternalLink size={18} strokeWidth={2.5} />
          </a>
        </div>
      </div>
  );
}

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categoria = categorias.find(c => String(c.id) === String(categoryId));

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        // Hacemos una consulta a la colección "productos" donde la "categoria" coincida
        const q = query(collection(db, "productos"), where("categoria", "==", categoryId));
        const querySnapshot = await getDocs(q);
        
        const productosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log("Productos cargados desde Firebase:", productosData);
        setProductos(productosData);
        setLoading(false);
      } catch (error) {
        console.error("Error obteniendo documentos de Firebase: ", error);
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProductos();
    }
  }, [categoryId]);

  if (!categoria) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-bold mb-4">Categoría no encontrada</h2>
        <button onClick={() => navigate('/')} className="text-yellow-400 hover:underline">Volver al inicio</button>
      </div>
    );
  }

  return (
    <main className="w-full flex-grow flex flex-col items-center pt-8 md:pt-12 px-6 pb-24 relative z-10 animate-fade-up">
      <div className="w-full max-w-6xl mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors bg-neutral-900/50 px-4 py-2 rounded-full border border-white/5 hover:border-white/20 backdrop-blur-md"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Volver</span>
        </button>
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 md:items-center mb-12">
        <div className={`p-5 rounded-3xl ${categoria.bgIcon} ${categoria.color} border border-white/10 w-max shadow-[0_0_30px_rgba(255,255,255,0.05)]`}>
          <categoria.icono size={40} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            {categoria.nombre}
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl leading-relaxed">
            {categoria.descripcion}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="w-full max-w-6xl flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.length > 0 ? (
            productos.map((prod) => (
              <ProductCard key={prod.id} data={prod} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[2rem]">
              <p className="text-neutral-500 font-medium">Aún no hay productos en esta categoría.</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}