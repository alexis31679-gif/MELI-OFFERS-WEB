import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { categorias } from '../data/data';

export default function Home() {
  const [isPaused, setIsPaused] = useState(false);
  const [zoomedCard, setZoomedCard] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    let animationFrameId;
    let direction = 1; 
    const speed = 0.4; 
    let exactPosition = scrollRef.current ? scrollRef.current.scrollLeft : 0;

    const scroll = () => {
      if (scrollRef.current && !isPaused && !zoomedCard) {
        const el = scrollRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;
        
        if (maxScroll > 0) {
          exactPosition += speed * direction;
          if (exactPosition >= maxScroll) {
            exactPosition = maxScroll;
            direction = -1;
          } else if (exactPosition <= 0) {
            exactPosition = 0;
            direction = 1;
          }
          el.scrollLeft = exactPosition;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, zoomedCard]);

  const handleCardClick = (e, id) => {
    e.preventDefault();
    setZoomedCard(id);
    setTimeout(() => {
      navigate(`/categoria/${id}`);
    }, 600);
  };

  const scrollConFlechas = (dir) => {
    if (scrollRef.current) {
      setIsPaused(true); 
      const cantidad = window.innerWidth < 768 ? 320 : 350; 
      
      scrollRef.current.scrollBy({ 
        left: dir === 'izq' ? -cantidad : cantidad, 
        behavior: 'smooth' 
      });
      
      setTimeout(() => setIsPaused(false), 600);
    }
  };

  return (
    <main className="flex flex-col items-center mt-12 md:mt-16 w-full flex-grow">
      
      <div className="text-center mb-6 px-6 relative animate-fade-up delay-300">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white drop-shadow-2xl">
          Descubre la <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500">
            oferta ideal
          </span>
        </h2>
      </div>

      <div className="w-full relative z-20 animate-fade-up delay-500 group/carrusel">
        
        <button 
          onClick={() => scrollConFlechas('izq')}
          className="absolute left-2 md:left-6 top-[42%] -translate-y-1/2 z-40 bg-neutral-900/90 hover:bg-yellow-500 text-neutral-400 hover:text-neutral-950 p-3 md:p-4 rounded-full backdrop-blur-xl border border-white/10 opacity-80 md:opacity-0 group-hover/carrusel:opacity-100 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>

        <div 
          ref={scrollRef}
          // ELIMINADO touch-pan-x para liberar el scroll vertical de tu teléfono
          className="flex overflow-x-auto gap-10 px-6 md:px-20 pt-16 pb-32 hide-scrollbar cursor-grab active:cursor-grabbing max-lg:snap-x max-lg:snap-mandatory will-change-scroll transform-gpu"
        >
          {categorias.map((cat) => (
           <Link 
              to={`/categoria/${cat.id}`}
              key={cat.id} 
              onClick={(e) => handleCardClick(e, cat.id)}
              // MOVIDOS AQUÍ: Solo se pausa la animación de PC si tocas la tarjeta específicamente
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className={`group relative shrink-0 w-[280px] md:w-[310px] h-[480px] max-lg:snap-center mirror-3d block outline-none focus:outline-none transition-all duration-700 ease-in-out ${
                zoomedCard === cat.id ? 'scale-[3] opacity-0 z-50 pointer-events-none' : 'z-10'
              } ${zoomedCard && zoomedCard !== cat.id ? 'opacity-0 scale-90' : ''}`}
            >
              <div className={`absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-yellow-500 to-orange-500 rounded-[2.5rem] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500 pointer-events-none ${zoomedCard === cat.id ? 'hidden' : ''}`}></div>

              <div className={`relative bg-neutral-900 border border-white/5 border-t-white/10 border-l-white/10 rounded-[2.5rem] flex flex-col h-full z-10 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-4 overflow-hidden transform-gpu ${
                zoomedCard === cat.id ? 'shadow-none' : 'shadow-[0_8px_20px_rgba(0,0,0,0.4)] group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)]'
              }`}>
                
                <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-0 group-hover:duration-1000 ease-out z-30 pointer-events-none"></div>

                <div className="absolute top-0 left-0 w-full h-72 overflow-hidden pointer-events-none z-10">
                  <img 
                    src={cat.imagen} 
                    alt={cat.nombre} 
                    className="w-full h-64 object-cover opacity-60 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 h-full bg-gradient-to-t from-neutral-900 from-25% via-neutral-900/60 to-transparent"></div>
                </div>

                <div className="p-8 flex flex-col h-full relative z-20 mt-20 pointer-events-none">
                  <div className={`p-4 rounded-2xl mb-4 transition-transform duration-500 group-hover:scale-110 ${cat.bgIcon} ${cat.color} border border-white/10 inline-block w-max shadow-md`}>
                    <cat.icono size={28} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-neutral-100 mb-2 group-hover:text-white transition-colors duration-300 tracking-tight leading-7 drop-shadow-md">
                    {cat.nombre}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow">
                    {cat.descripcion}
                  </p>
                  <div className="w-full flex items-center justify-between text-sm font-bold text-neutral-400 group-hover:text-white transition-colors duration-300 border-t border-white/10 pt-4 mt-auto">
                    <span>Explorar</span>
                    <div className={`p-2 rounded-full bg-neutral-950/50 group-hover:${cat.bgIcon} transition-colors duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]`}>
                      <ChevronRight size={18} className={cat.color} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button 
          onClick={() => scrollConFlechas('der')}
          className="absolute right-2 md:right-6 top-[42%] -translate-y-1/2 z-40 bg-neutral-900/90 hover:bg-yellow-500 text-neutral-400 hover:text-neutral-950 p-3 md:p-4 rounded-full backdrop-blur-xl border border-white/10 opacity-80 md:opacity-0 group-hover/carrusel:opacity-100 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
        >
          <ChevronRight size={28} strokeWidth={2.5} />
        </button>

      </div>

      <footer className="w-full max-w-4xl mx-auto px-6 mb-20 relative z-30 animate-fade-up delay-500">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12"></div>
        <div className="flex flex-col items-center text-center gap-8">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/30 to-yellow-300/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700 opacity-50"></div>
            <div className="relative p-1 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              <img src="/imagenmelioofers.jpeg" alt="Meli Offers Logo" className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover bg-neutral-900" />
            </div>
          </div>
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide">Tu Comunidad de <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Meli Offers</span></h3>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">Bienvenidos a nuestra comunidad. Nos dedicamos a seleccionar y presentar las mejores promociones del programa de Afiliados de Mercado Libre. Para servirte mejor, nuestras listas de productos se actualizan <strong className="text-neutral-200 font-semibold">semanalmente</strong>.</p>
            <p className="text-neutral-500 text-sm italic">Agradecemos tu visita. Síguenos en TikTok para descubrir ofertas flash antes que nadie.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
            <a href="https://www.tiktok.com/@meli.offers" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center gap-3 bg-neutral-900 border border-white/10 hover:border-yellow-500/50 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="w-5 h-5 fill-current relative z-10" viewBox="0 0 448 512"><path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/></svg>
              <span className="relative z-10">Seguir en TikTok</span>
            </a>
            <div className="flex items-center gap-2 text-neutral-600">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="text-xs font-bold tracking-widest">VERSIÓN 1.1</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}