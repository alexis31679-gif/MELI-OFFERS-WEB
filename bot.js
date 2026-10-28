import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Conectar con Firebase usando tu Llave Maestra
const serviceAccount = JSON.parse(fs.readFileSync('./firebase-key.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function actualizarCatalogoAPI() {
  console.log('🚀 INICIANDO ACTUALIZACIÓN VÍA API OFICIAL DE MERCADO LIBRE...');
  
  const productosRef = db.collection('productos');
  const snapshot = await productosRef.get();

  if (snapshot.empty) {
    console.log('❌ No hay productos en la base de datos.');
    return;
  }

  console.log(`📦 Revisando ${snapshot.size} productos en milisegundos...\n`);

  let actualizados = 0;
  let agotados = 0;
  let errores = 0;

  for (const doc of snapshot.docs) {
    const datosProducto = doc.data();
    const titulo = datosProducto.titulo || 'Producto sin título';
    const linkScraper = datosProducto.linkScraper;
    const precioViejo = datosProducto.precio;

    console.log(`--------------------------------------------------`);
    console.log(`🔍 Analizando: ${titulo.substring(0, 40)}...`);

    if (!linkScraper || !linkScraper.includes('mercadolibre.com.mx')) {
      console.log('⚠️  SALTADO: Link no válido.');
      errores++;
      continue;
    }

    // 1. Extraer el ID del producto (Ej: MLM1189753123) usando una Expresión Regular
    const match = linkScraper.match(/MLM-?\d+/);
    if (!match) {
      console.log('⚠️  ERROR: No se pudo extraer el ID (MLM...) del enlace.');
      errores++;
      continue;
    }
    const idProducto = match[0].replace('-', ''); // Quitamos el guion para que quede MLM1189753123

    try {
      // 2. La puerta trasera: Usamos el buscador público en lugar del endpoint bloqueado
      const respuesta = await fetch(`https://api.mercadolibre.com/sites/MLM/search?q=${idProducto}`);
      const infoBusqueda = await respuesta.json();

      // Si el buscador no arroja resultados
      if (!infoBusqueda.results || infoBusqueda.results.length === 0) {
        console.log(`🚫 ERROR: El producto fue borrado o no aparece.`);
        errores++;
        continue;
      }

      // Tomamos el primer resultado que nos arroje el buscador
      const infoAPI = infoBusqueda.results[0]; 
      const precioActual = infoAPI.price;
      const agotado = infoAPI.available_quantity === 0;

      // 3. Tomar decisiones y actualizar Firebase
      if (agotado) {
        console.log(`🚨 ESTADO OFICIAL: ¡AGOTADO (Stock 0)!`);
        await productosRef.doc(doc.id).update({ disponible: false });
        agotados++;
      } else if (precioActual) {
        const cambioDePrecio = precioActual !== precioViejo;
        const msjPrecio = cambioDePrecio ? `¡Cambió de $${precioViejo} a $${precioActual}!` : `Mismo precio: $${precioActual}`;
        
        console.log(`✅ ESTADO: Activo | 💰 ${msjPrecio}`);
        await productosRef.doc(doc.id).update({ 
          precio: precioActual,
          disponible: true 
        });
        actualizados++;
      } else {
        console.log(`⚠️ ERROR RARO: Sin precio en el buscador.`);
        errores++;
      }

    } catch (error) {
      console.log(`🚫 ERROR DE CONEXIÓN: ${error.message}`);
      errores++;
    }
  }

  console.log(`\n==================================================`);
  console.log(`🤖 REPORTE FINAL (SIN BLOQUEOS NI CAPTCHAS)`);
  console.log(`==================================================`);
  console.log(`🟢 Actualizados: ${actualizados}`);
  console.log(`🔴 Agotados/Pausados: ${agotados}`);
  console.log(`🟡 Errores: ${errores}`);
}

actualizarCatalogoAPI();