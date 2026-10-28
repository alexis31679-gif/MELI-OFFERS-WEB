import { 
  Laptop, Wrench, Shirt, Zap, Sparkles, ChevronRight, 
  Gamepad2, Dumbbell, Car, Heart, Baby 
} from 'lucide-react';

export const categorias = [
  { id: 1, nombre: 'Tecnología e Innovación', descripcion: 'Laptops, smartphones y los gadgets más avanzados.', icono: Laptop, color: 'text-cyan-400', bgIcon: 'bg-cyan-500/10', imagen: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&auto=format&fit=crop' },
  { id: 2, nombre: 'Hogar y Herramientas', descripcion: 'Equipa y remodela tu espacio con calidad profesional.', icono: Wrench, color: 'text-orange-400', bgIcon: 'bg-orange-500/10', imagen: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=600&auto=format&fit=crop' },
  { id: 3, nombre: 'Moda para H y M', descripcion: 'Renueva tu estilo con las últimas tendencias de temporada.', icono: Shirt, color: 'text-fuchsia-400', bgIcon: 'bg-fuchsia-500/10', imagen: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop' },
  { id: 4, nombre: 'Videojuegos y PC', descripcion: 'Consolas, accesorios y componentes para gaming.', icono: Gamepad2, color: 'text-purple-400', bgIcon: 'bg-purple-500/10', imagen: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop' },
  { id: 5, nombre: 'Deportes y Fitness', descripcion: 'Todo para tu entrenamiento y vida activa.', icono: Dumbbell, color: 'text-green-400', bgIcon: 'bg-green-500/10', imagen: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop' },
  { id: 6, nombre: 'Accesorios Automotrices', descripcion: 'Llantas, autoestéreos y cuidado para tu vehículo.', icono: Car, color: 'text-red-400', bgIcon: 'bg-red-500/10', imagen: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=600&auto=format&fit=crop' },
  { id: 7, nombre: 'Salud y Belleza', descripcion: 'Cuidado personal, lociones y productos de bienestar.', icono: Heart, color: 'text-pink-400', bgIcon: 'bg-pink-500/10', imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop' },
  { id: 8, nombre: 'Bebés y Juguetes', descripcion: 'Todo lo necesario para los más pequeños del hogar.', icono: Baby, color: 'text-yellow-400', bgIcon: 'bg-yellow-500/10', imagen: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600&auto=format&fit=crop' },
];

export const productsData = {
  1: { // Tecnología e Innovación
    items: [
      { idMeli: "MLM3520270482", linkAfiliado: "https://mercadolibre.com/sec/1J6jFvB" },
      { idMeli: "MLM3307023969", linkAfiliado: "https://mercadolibre.com/sec/1Wo7zCv" },
      { idMeli: "MLM_AQUI_NUMERO_3", linkAfiliado: "https://mercadolibre.com/sec/2xiNUAm" },
      { idMeli: "MLM_AQUI_NUMERO_4", linkAfiliado: "https://mercadolibre.com/sec/1waT6H5" },
      { idMeli: "MLM_AQUI_NUMERO_5", linkAfiliado: "https://mercadolibre.com/sec/1dc8p52" },
      { idMeli: "MLM_AQUI_NUMERO_6", linkAfiliado: "https://mercadolibre.com/sec/324aznb" }
    ]
  },
  6: { // Accesorios Automotrices (Ejemplo para cuando agregues más)
    items: [
      { idMeli: "MLM525381024", linkAfiliado: "https://mercadolibre.com/..." } // Este es un ejemplo
    ]
  }
};