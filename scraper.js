import puppeteer from 'puppeteer';

async function probarScraperRobot() {
  // Pon tu enlace de prueba aquí
  const url = 'https://www.mercadolibre.com.mx/social/saez8208194?matt_word=tecnologia&matt_tool=94932618&forceInApp=true&ref=BGkg%2Bw3aojjr61Id3HH49vNLSWTr3%2FWRtEPDrPq0qeq60RXSKZf0RL0SAe7ZmD9XY1agAaZAXrAT3pAOUnpJt6aJAV%2BxCvezhVrtgymQ01X57CrU0BOS2mGQk9dmYYY9LyKNga%2FUG5ltyRmh%2FGwdSffM3QJxwfV%2B5YiK5rBIJ622ztvKWzTqh4ZpXOtYP0K9T%2FJVAPg%3D';

  console.log('🤖 Encendiendo el robot (visible para ver la magia)...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  console.log('🌐 Entrando a tu página de Afiliado (Social)...');
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    console.log('🖱️ Buscando el botón azul de "Ir a producto"...');
    
    // Extraemos el enlace real del botón para saltar el escaparate
    const enlaceReal = await page.evaluate(() => {
      const enlaces = Array.from(document.querySelectorAll('a'));
      // Encontramos el botón que diga "ir a producto" o tenga "/MLM" en el link
      const boton = enlaces.find(a => a.innerText.toLowerCase().includes('ir a producto') || a.href.includes('/MLM'));
      return boton ? boton.href : null;
    });

    if (enlaceReal) {
      console.log(`🔗 ¡Botón encontrado! Viajando a la página real de Mercado Libre...`);
      await page.goto(enlaceReal, { waitUntil: 'networkidle2', timeout: 30000 });
    } else {
      console.log('⚠️ No encontré el botón, intentaré sacar el precio de esta misma pantalla.');
    }

    console.log('🔍 Extrayendo el precio exacto con descuento...');

    const datos = await page.evaluate(() => {
      // Buscamos la etiqueta oculta perfecta de Google
      const metaPrecio = document.querySelector('meta[itemprop="price"]');
      let precioFinal = metaPrecio ? metaPrecio.getAttribute('content') : null;

      // Respaldo manual por si la etiqueta falla
      if (!precioFinal) {
        const cajaPrecio = document.querySelector('.ui-pdp-price__main-container') || document.querySelector('.ui-pdp-price__second-line');
        if (cajaPrecio) {
          const fraccion = cajaPrecio.querySelector('.andes-money-amount__fraction')?.innerText.replace(/,/g, '') || '';
          const centavos = cajaPrecio.querySelector('.andes-money-amount__cents')?.innerText || '00';
          if (fraccion) precioFinal = `${fraccion}.${centavos}`;
        }
      }

      const textoPagina = document.body.innerText.toLowerCase();
      const pausada = textoPagina.includes('publicación pausada') || textoPagina.includes('finalizada') || textoPagina.includes('agotado');

      return {
        precio: precioFinal,
        pausada: pausada,
        urlFinal: window.location.href
      };
    });

    if (datos.pausada) {
      console.log('⚠️ ALERTA: Esta publicación está pausada, finalizada o agotada.');
    } else if (datos.precio) {
      console.log(`✅ ¡ÉXITO TOTAL! El precio final rebajado es: $${datos.precio}`);
    } else {
      console.log('❌ No pudimos sacar el precio final. URL:', datos.urlFinal);
    }

  } catch (error) {
    console.error('🚫 Error en la matriz:', error.message);
  } finally {
    // Pausa de 3 segundos para que veas dónde terminó el robot antes de cerrarse
    await new Promise(r => setTimeout(r, 3000));
    await browser.close();
    console.log('🔌 Robot apagado.');
  }
}

probarScraperRobot();