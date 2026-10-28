import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

import Home from './pages/home';
import CategoryPage from './pages/CategoryPage';
import AdminPage from './pages/AdminPage';

import { categorias } from './data/data';
import './App.css';

const WaveText = ({ text }) => {
  return (
    <span className="flex">
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block group-hover:animate-[wave_0.8s_ease-in-out_infinite]"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Evitamos calcular físicas del mouse en celulares
      if (window.innerWidth < 1024) return;
      setMousePos({ x: e.clientX, y: e.clientY });
      const offsetX = (e.clientX - window.innerWidth / 2) / 30;
      const offsetY = (e.clientY - window.innerHeight / 2) / 30;
      setMouseOffset({ x: offsetX, y: offsetY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <BrowserRouter>
      <style>
        {`
          @keyframes fadeDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-down { animation: fadeDown 1s ease-out forwards; }
          .animate-fade-up { animation: fadeUp 1s ease-out forwards; opacity: 0; }
          .delay-100 { animation-delay: 100ms; }
          
          /* Animaciones pesadas (Orbes), solo afectan a PC gracias a las clases de Tailwind */
          @keyframes orb-float-1 { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(15vw, 15vh) scale(1.4); } 100% { transform: translate(0, 0) scale(1); } }
          @keyframes orb-float-2 { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-15vw, -15vh) scale(1.4); } 100% { transform: translate(0, 0) scale(1); } }
          .animate-orb-1 { animation: orb-float-1 20s infinite alternate ease-in-out; }
          .animate-orb-2 { animation: orb-float-2 25s infinite alternate ease-in-out; }
          
          /* Animación súper ligera de fondo (GRADIENTE) */
          @keyframes pan-gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* MAGIA RESPONSIVA: Esta regla hace que los colores de fondo SOLO se vean en celulares y tablets.
             En PC (1024px o más) se queda el fondo negro base. */
          @media (max-width: 1023px) {
            .bg-mobile-animated {
              background: linear-gradient(-45deg, #0a0a0a, #2a1600, #001f29, #0a0a0a) !important;
              background-size: 400% 400% !important;
              animation: pan-gradient 20s ease infinite !important;
            }
          }
          
          /* Scroll oculto pero funcional */
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          
          @keyframes wave {
            0%, 100% { transform: translateY(0); color: inherit; }
            50% { transform: translateY(-5px); color: #facc15; }
          }
        `}
      </style>

      <div className="min-h-screen text-white font-sans selection:bg-yellow-500 selection:text-black relative flex flex-col overflow-hidden">
        
        {/* Fondo Interactivo Global de Mouse (Solo visible en PC: lg:block) */}
        <div className="hidden lg:block pointer-events-none fixed inset-0 z-0 transition-opacity duration-300" style={{ background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent 50%)` }} />
        
        {/* FONDO BASE: En PC es negro (bg-neutral-950), en celular cobra vida con bg-mobile-animated */}
        <div className="fixed inset-0 bg-neutral-950 bg-mobile-animated z-[-4]"></div>
        
        {/* Orbes Globales (Ocultos en móvil y tablet para evitar lag: hidden lg:block) */}
        <div className="hidden lg:block fixed inset-0 pointer-events-none z-[-3]" style={{ transform: `translate3d(${mouseOffset.x * -1}px, ${mouseOffset.y * -1}px, 0)` }}>
          <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-orange-600/30 rounded-full blur-[150px] animate-orb-1"></div>
        </div>
        <div className="hidden lg:block fixed inset-0 pointer-events-none z-[-2]" style={{ transform: `translate3d(${mouseOffset.x * 2}px, ${mouseOffset.y * 2}px, 0)` }}>
          <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-cyan-600/25 rounded-full blur-[150px] animate-orb-2"></div>
          <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-yellow-600/20 rounded-full blur-[150px] animate-orb-1" style={{ animationDelay: '-10s' }}></div>
        </div>

        <div className="relative z-10 flex flex-col flex-grow w-full">
          {/* Cinta superior optimizada (Fondo sólido en móvil) */}
          <div className="bg-neutral-900 lg:bg-black/50 lg:backdrop-blur-md border-b border-white/5 py-2 flex justify-center items-center">
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-yellow-500/80 tracking-widest uppercase animate-fade-down">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              Ventas Flash • Hasta 50% OFF
            </div>
          </div>

          <header className="mx-auto mt-6 w-full max-w-[95%] xl:max-w-7xl px-4 animate-fade-down delay-100 z-50">
            {/* Header optimizado */}
            <div className="flex flex-col xl:flex-row justify-between items-center px-4 py-4 bg-neutral-900 lg:bg-neutral-900/60 lg:backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl gap-4 xl:gap-8 w-full overflow-hidden">
              
              {/* Logo y Mensaje */}
              <div className="flex items-center gap-4 shrink-0 w-full xl:w-auto justify-center xl:justify-start">
                <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 flex items-center gap-2 hover:scale-105 transition-transform">
                  <Zap size={24} className="text-yellow-500 fill-yellow-500/20" />
                  MeliOffers
                </Link>
                <span className="text-neutral-400 text-sm font-medium border-l border-white/10 pl-4 py-1">
                  Bienvenido
                </span>
              </div>

              {/* Contenedor estricto para el scroll horizontal */}
              <div className="w-full overflow-x-auto hide-scrollbar pt-2 pb-1">
                <nav className="flex gap-6 text-xs md:text-sm font-semibold text-neutral-400 w-max px-2 mx-auto xl:mx-0">
                  {categorias.map(cat => (
                    <Link 
                      key={cat.id} 
                      to={`/categoria/${cat.id}`} 
                      className="group flex items-center hover:text-white transition-colors shrink-0"
                    >
                      <WaveText text={cat.nombre} />
                    </Link>
                  ))}
                </nav>
              </div>

            </div>
          </header>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categoria/:categoryId" element={<CategoryPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
          
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;