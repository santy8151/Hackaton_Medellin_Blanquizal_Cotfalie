import { useRef, useState, type FormEvent, type KeyboardEvent, type PointerEvent } from 'react';
import { Activity, ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, Droplets, ExternalLink, Globe2, Layers3, Menu, Mountain, Play, Radio, Waves, X } from 'lucide-react';

const modules = [
  { id: '01', title: 'Medellín y el Agua: Territorio y Quebradas', source: 'Museo del Agua EPM / EAFIT', time: '04:15', summary: 'Sigue el agua desde las montañas hasta Medellín.', description: 'Descubre la cuenca del Río Aburrá y el viaje del agua desde los páramos hasta la ciudad.', tags: ['Territorio', 'Cuencas', 'Medellín'], accent: 'teal', visual: 'mountain' },
  { id: '02', title: 'Cuidado, Eficiencia y Ahorro Inteligente', source: 'EPM Ecosistema Sostenible', time: '05:30', summary: 'Aprende a ahorrar agua y volver a usarla.', description: 'Estrategias de consumo responsable, tecnología de reutilización y prevención de pérdidas.', tags: ['Innovación', 'Ahorro', 'Sostenibilidad'], accent: 'lime', visual: 'drop' },
  { id: '03', title: 'El Reto del Abastecimiento: Fenómeno de El Niño', source: 'Alcaldía de Medellín / Gestión del Riesgo', time: '06:10', summary: 'Descubre cómo El Niño afecta los embalses.', description: 'Comprende el impacto del cambio climático en los embalses y la urgencia de soluciones.', tags: ['El Niño', 'Embalses', 'Resiliencia'], accent: 'coral', visual: 'sun' },
];
const nodes = [
  { id: 'RIO-MEDELLIN', title: 'Eje Central: Río Medellín (Aburrá)', short: 'Eje Central', x: 50, y: 52, state: 'MODERADO', detail: 'Arteria fluvial principal que atraviesa el valle de sur a norte conectando los 10 municipios.', capacity: '74%', flow: '42.5 m³/s', type: 'Telemetría ultrasónica' },
  { id: 'RIOGRANDE-II', title: 'Embalse Riogrande II', short: 'Embalse Riogrande II', x: 35, y: 18 },
  { id: 'PIEDRAS-BLANCAS', title: 'Embalse Piedras Blancas (Arví)', short: 'Piedras Blancas · Arví', x: 75, y: 32 },
  { id: 'SANTA-ELENA', title: 'Quebrada Santa Elena', short: 'Q. Santa Elena', x: 68, y: 50 },
  { id: 'LA-IGUANA', title: 'Quebrada La Iguaná', short: 'Q. La Iguaná', x: 28, y: 48 },
  { id: 'VILLA-HERMOSA', title: 'Planta de Potabilización Villa Hermosa', short: 'Villa Hermosa', x: 58, y: 40 },
];
const scenes = [
  { n: '01', kind: 'Territorio', title: 'Montañas que guardan el agua', summary: 'La lluvia baja por montañas y bosques.', text: 'El Valle de Aburrá recoge la lluvia entre laderas, bosques y nacimientos que alimentan la ciudad.', tag: 'Laderas del Valle', art: 'mountain' },
  { n: '02', kind: 'Medellín en 2D', title: 'Una ciudad atravesada por el río', summary: 'El río pasa junto al Metro y los barrios.', text: 'Metro, metrocable, barrios y puentes conviven con el Río Medellín en una postal ilustrada de la ciudad.', tag: 'Metro + Metrocable', art: 'city' },
  { n: '03', kind: 'Ciclo vivo', title: 'De la nube a la quebrada', summary: 'Una gota viaja de la nube al río.', text: 'Cada gota recorre techos, calles y quebradas antes de volver al gran corredor hídrico del valle.', tag: 'Quebradas urbanas', art: 'rain' },
  { n: '04', kind: 'Alerta', title: 'El agua también se agota', summary: 'El calor y las fugas cambian el camino del agua.', text: 'El calor, las fugas y el consumo acelerado presionan embalses y redes de abastecimiento.', tag: 'Reto de abastecimiento', art: 'sun' },
  { n: '05', kind: 'Comunidad', title: 'Blanquizal se organiza', summary: 'El barrio se une para cuidar el agua.', text: 'El conocimiento del barrio se convierte en mapas, hábitos y decisiones colectivas para cuidar el agua.', tag: 'Voces del territorio', art: 'people' },
  { n: '06', kind: 'Movilidad hídrica', title: 'Conectar soluciones', summary: 'Las ideas conectan a toda la ciudad.', text: 'Como el Metro conecta comunas, los datos conectan hogares, instituciones y respuestas rápidas.', tag: 'Innovación conectada', art: 'network' },
  { n: '07', kind: 'Prototipos', title: 'Ideas que ahorran gotas', summary: 'Sensores e ideas para ahorrar agua.', text: 'Sensores, captación de lluvia y educación ambiental convierten creatividad en impacto medible.', tag: 'Laboratorio ciudadano', art: 'bulb' },
  { n: '08', kind: 'Futuro', title: 'Medellín vuelve a fluir', summary: 'Una ciudad verde que cuida su agua.', text: 'Una ciudad más verde, consciente y resiliente nace cuando cada equipo pone su solución en movimiento.', tag: 'Ciudad regenerativa', art: 'future' },
];

const yellowMascot = `${import.meta.env.BASE_URL}images/mascota-amarilla.webp`;
const blueMascot = `${import.meta.env.BASE_URL}images/mascota-estrella.webp`;

function SceneArt({ type, mascot }: { type: string; mascot: string }) {
  return <div className={`scene-art art-${type}`} aria-hidden="true">
    <div className="scene-disc" /><div className="scene-mountain m-one" /><div className="scene-mountain m-two" />
    <div className="scene-river" /><div className="scene-city"><i/><i/><i/><i/><i/></div>
    <div className="scene-lines" /><div className="scene-spark"/>
    <img className="scene-mascot" src={mascot} alt=""/>
  </div>;
}

type EmbeddedMedia = { kind: 'YouTube' | 'Canva'; src: string };

function createEmbed(raw: string): EmbeddedMedia | string {
  let url: URL;
  try {
    const value = raw.trim();
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return 'Pega un enlace válido de YouTube o Canva.';
  }

  if (url.username || url.password || (url.port && url.port !== '443' && url.port !== '80')) {
    return 'Pega un enlace público de YouTube o Canva.';
  }

  const host = url.hostname.toLowerCase();
  const youtubeHost = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host);
  if (youtubeHost) {
    const parts = url.pathname.split('/').filter(Boolean);
    const videoId = host === 'youtu.be'
      ? parts[0]
      : url.pathname === '/watch'
        ? url.searchParams.get('v')
        : ['embed', 'shorts', 'live'].includes(parts[0] ?? '')
          ? parts[1]
          : null;
    if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
      return 'Ese enlace no parece ser un video de YouTube.';
    }
    return { kind: 'YouTube', src: `https://www.youtube-nocookie.com/embed/${videoId}` };
  }

  if (host === 'canva.com' || host.endsWith('.canva.com')) {
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] !== 'design' || !parts[1]) {
      return 'Pega el enlace para ver una presentación de Canva.';
    }
    const lastPart = parts[parts.length - 1]?.toLowerCase();
    if (lastPart === 'edit' || lastPart === 'present') parts[parts.length - 1] = 'view';
    else if (!['view', 'watch'].includes(lastPart ?? '')) parts.push('view');
    const embedUrl = new URL(`https://www.canva.com/${parts.join('/')}`);
    embedUrl.searchParams.set('embed', '');
    return { kind: 'Canva', src: embedUrl.toString() };
  }

  return 'Por ahora funciona con enlaces públicos de YouTube o Canva.';
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['aprender', 'Conoce el agua'], ['material', 'Material'], ['telemetria', 'Telemetría'], ['relato', 'El relato']];
  return <header className="topbar">
    <a href="#inicio" className="brand" aria-label="HackMedellín Agua y Futuro, inicio"><span className="brand-mark"><Droplets size={19}/></span><span><b>HACKMEDELLÍN</b><small>AGUA & FUTURO <i>2026</i></small></span></a>
    <nav className={`nav-links ${open ? 'nav-open' : ''}`} aria-label="Navegación principal">
      {links.map(([id, label], i) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><small>0{i + 1}</small>{label}</a>)}
    </nav>
    <a className="nav-join" href="https://hacktoonmedellinblanquizal.netlify.app/join"><span>Entrar al reto</span><ArrowUpRight size={16}/></a>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>{open ? <X/> : <Menu/>}</button>
  </header>;
}

function HeroOrb() {
  const [rotation, setRotation] = useState({ x: -8, y: 10 });
  const dragStart = useRef<{ pointerId: number; x: number; y: number; rotateX: number; rotateY: number } | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    dragStart.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, rotateX: rotation.x, rotateY: rotation.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    setRotation({
      x: Math.max(-35, Math.min(35, start.rotateX - (event.clientY - start.y) * 0.45)),
      y: Math.max(-40, Math.min(40, start.rotateY + (event.clientX - start.x) * 0.45)),
    });
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = 8;
    if (!event.key.startsWith('Arrow')) return;
    event.preventDefault();
    setRotation((current) => ({
      x: Math.max(-35, Math.min(35, current.x + (event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0))),
      y: Math.max(-40, Math.min(40, current.y + (event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0))),
    }));
  };

  return <div className="orb-stage" aria-label="Gota de agua interactiva">
    <div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="orbit orbit-c"/>
    <button
      type="button"
      className="droplet-control"
      style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
      aria-label="Gira la gota de agua: arrástrala o usa las flechas del teclado."
      title="¡Arrastra la gota para girarla!"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => { dragStart.current = null; }}
      onPointerCancel={() => { dragStart.current = null; }}
      onKeyDown={handleKeyDown}
    >
      <svg className="orb-svg" viewBox="0 0 420 420" role="img" aria-hidden="true">
        <defs>
          <radialGradient id="water" cx="34%" cy="26%"><stop offset="0" stopColor="#d5fff8" stopOpacity=".98"/><stop offset=".24" stopColor="#47eadd" stopOpacity=".94"/><stop offset=".68" stopColor="#078ca2" stopOpacity=".88"/><stop offset="1" stopColor="#063b53" stopOpacity=".93"/></radialGradient>
          <linearGradient id="drop-side" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a0fff4" stopOpacity=".8"/><stop offset=".42" stopColor="#43e1d2" stopOpacity=".12"/><stop offset="1" stopColor="#001e36" stopOpacity=".7"/></linearGradient>
          <pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.2" fill="#c7fff8" opacity=".72"/></pattern>
          <clipPath id="drop-mask"><path d="M210 35C241 88 333 184 333 270c0 73-55 116-123 116S87 343 87 270C87 184 179 88 210 35Z"/></clipPath>
          <filter id="glow"><feGaussianBlur stdDeviation="17"/></filter>
        </defs>
        <ellipse cx="210" cy="264" rx="125" ry="128" fill="#18eed6" opacity=".23" filter="url(#glow)"/>
        <path d="M210 35C241 88 333 184 333 270c0 73-55 116-123 116S87 343 87 270C87 184 179 88 210 35Z" fill="url(#water)" stroke="#a1fff4" strokeWidth="2" strokeOpacity=".78"/>
        <rect x="78" y="32" width="264" height="359" fill="url(#dots)" clipPath="url(#drop-mask)" opacity=".72"/>
        <path d="M210 35C241 88 333 184 333 270c0 73-55 116-123 116S87 343 87 270C87 184 179 88 210 35Z" fill="url(#drop-side)" clipPath="url(#drop-mask)"/>
        <path d="M119 246c6-49 34-94 72-128M116 273c2 49 20 80 52 101" fill="none" stroke="#e0fffa" strokeOpacity=".72" strokeWidth="5" strokeLinecap="round"/>
        <ellipse cx="263" cy="200" rx="11" ry="19" fill="#f1fffd" opacity=".82" filter="url(#glow)"/>
        <circle cx="263" cy="200" r="5" fill="#fff"/>
        <path d="M287 272c-5 34-23 61-48 77" fill="none" stroke="#bffff4" strokeOpacity=".58" strokeWidth="2" strokeDasharray="3 8"/>
      </svg>
    </button>
    <span className="drag-hint">¡GIRA LA GOTA!</span>
    <span className="orb-coordinate coord-top">6.2442° N&nbsp; 75.5812° W</span>
    <span className="orb-coordinate coord-bottom"><i/> NODO CENTRAL · VALLE DE ABURRÁ ONLINE</span>
    <span className="orb-cross cross-one">+</span><span className="orb-cross cross-two">+</span>
  </div>;
}

function App() {
  const [activeNode, setActiveNode] = useState(nodes[0]);
  const [activeDeck, setActiveDeck] = useState(0);
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [openScene, setOpenScene] = useState<string | null>(null);
  const [mediaLink, setMediaLink] = useState('');
  const [embeddedMedia, setEmbeddedMedia] = useState<EmbeddedMedia | null>(null);
  const [mediaMessage, setMediaMessage] = useState('');

  const handleMediaSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = createEmbed(mediaLink);
    if (typeof result === 'string') {
      setEmbeddedMedia(null);
      setMediaMessage(result);
      return;
    }
    setEmbeddedMedia(result);
    setMediaMessage(`¡Listo! Aquí está tu ${result.kind}.`);
  };

  return <div className="page-grain">
    <Header/>
    <main>
      <section className="hero" id="inicio">
        <div className="hero-grid grid-fade"/>
        <div className="hero-copy">
          <div className="eyebrow reveal"><span className="eyebrow-dot"/><span>EXPERIENCIA DIGITAL MEDELLÍN 2026</span><span className="eyebrow-line"/></div>
          <h1 className="display reveal delay-1">EL AGUA<br/><em>CONECTA TODO.</em></h1>
          <p className="hero-intro reveal delay-2">El agua conecta las montañas, los ríos y los barrios de Medellín. ¡Ayudemos a cuidarla!</p>
          <div className="hero-actions reveal delay-3">
            <a className="button-primary" href="https://hacktoonmedellinblanquizal.netlify.app/join"><Droplets size={17}/> Ingresar a la sala <ArrowRight size={16}/></a>
            <a className="button-quiet" href="#aprender"><Play size={15}/> Conoce el reto</a>
          </div>
          <div className="hero-stats">
            <div><strong>20</strong><span>Equipos de Impacto</span></div><div><strong>200+</strong><span>Innovadores Hídricos</span></div><div><strong>5h</strong><span>Reto Contrarreloj</span></div>
          </div>
        </div>
        <HeroOrb/>
        <div className="hero-foot mono"><span>MEDELLÍN / ANTIOQUIA</span><span>INNOVACIÓN CIUDADANA <i>—</i> AGUA VIVA</span></div>
      </section>

      <section className="intro-strip">
        <div className="strip-symbol"><Waves size={23}/></div><p><strong>¡El agua nos conecta!</strong></p>
        <img className="strip-mascot" src={yellowMascot} alt="" aria-hidden="true"/>
        <div className="strip-rule"/><span className="strip-note mono">UNA CUENCA<br/>MUCHAS IDEAS</span>
        <a href="#telemetria" className="strip-link">Ver la red hídrica <ArrowDown size={15}/></a>
      </section>

      <section className="section learn-section" id="aprender">
        <div className="section-top"><div><span className="section-kicker"><span>EXPERIENCIA 01</span><span className="kicker-mark">/</span><span>CONTENIDOS OFICIALES</span></span><h2 className="display">CONOCE<br/><em>EL AGUA.</em></h2></div>
          <p className="section-lead">Tres videos para descubrir el agua, el ahorro y el clima.</p>
        </div>
        <div className="module-list">
          {modules.map((m, i) => <article className={`module-card module-${m.accent} ${openModule === m.id ? 'module-expanded' : ''}`} key={m.id}>
            <button className="module-main" onClick={() => setOpenModule(openModule === m.id ? null : m.id)} aria-expanded={openModule === m.id}>
              <div className="module-visual">
                {m.visual === 'mountain' ? <><Mountain size={49}/><span className="visual-river"/></> : m.visual === 'drop' ? <><Droplets size={53}/><span className="visual-ripple"/></> : <><span className="solar-disc"/><Activity size={31}/></>}
                <img className="module-mascot" src={i === 1 ? blueMascot : yellowMascot} alt="" aria-hidden="true"/>
                <span className="visual-number">{m.id}</span>
              </div>
              <div className="module-copy"><div className="module-meta"><span>{m.source}</span><span className="module-time"><Play size={11}/>{m.time}</span></div><h3>{m.title}</h3><p>{m.summary}</p><div className="tag-row">{m.tags.map(tag => <span key={tag}>#{tag}</span>)}</div></div>
              <span className="module-arrow">{openModule === m.id ? <X size={18}/> : <ArrowUpRight size={19}/>}</span>
            </button>
            {openModule === m.id && <div className="module-detail"><div className="detail-label mono"><BookOpen size={15}/> ¡A DESCUBRIR!</div><p>{m.description}</p><div className="detail-source">{m.source}<div className="tag-row">{m.tags.map(tag => <span key={tag}>#{tag}</span>)}</div></div><a href="#material" className="text-link">Ver material <ArrowRight size={15}/></a></div>}
          </article>)}
        </div>
        <div className="module-foot"><span className="mono">01 — 03</span><span>Explora cada módulo para abrir su guía de observación</span><ChevronDown size={16}/></div>
      </section>

      <section className="deck-section" id="material">
        <div className="deck-orbit" aria-hidden="true"/><div className="deck-inner">
          <div className="deck-copy"><span className="section-kicker"><span>EXPERIENCIA 02</span><span className="kicker-mark">/</span><span>HERRAMIENTAS PARA IDEAR</span></span>
            <h2 className="display">DE LA PREGUNTA<br/>AL <em>PROTOTIPO.</em></h2>
            <p>Videos y presentaciones para aprender jugando.</p>
            <div className="deck-tabs" role="tablist" aria-label="Presentaciones de ideación">
              <button className={activeDeck === 0 ? 'selected' : ''} onClick={() => setActiveDeck(0)} role="tab" aria-selected={activeDeck === 0}>01 <span>Canva Design Deck</span></button>
              <button className={activeDeck === 1 ? 'selected' : ''} onClick={() => setActiveDeck(1)} role="tab" aria-selected={activeDeck === 1}>02 <span>PowerPoint / OneDrive</span></button>
            </div>
          </div>
          <div className="deck-panel">
            <div className="deck-card-head"><span className="deck-icon"><Layers3 size={20}/></span><span className="mono">{activeDeck === 0 ? 'CANVA DESIGN DECK' : 'POWERPOINT / ONEDRIVE'}</span><span className="deck-state"><i/>{activeDeck === 0 ? 'RECURSO EXTERNO' : 'VISTA NO DISPONIBLE'}</span></div>
            <h3>{activeDeck === 0 ? 'Guía de Innovación & Metodología HackMedellín' : 'Deck de ideación en PowerPoint'}</h3>
            <p>{activeDeck === 0 ? 'Guía para crear ideas y prototipos.' : 'El material se abre en PowerPoint / OneDrive. La vista previa no está disponible aquí.'}</p>
            <div className={`deck-preview ${embeddedMedia ? 'has-embed' : ''}`}>
              {embeddedMedia ? <iframe className="media-iframe" src={embeddedMedia.src} title={`Reproductor de ${embeddedMedia.kind}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/> : <><div className="preview-grid"/><img className="preview-mascot" src={blueMascot} alt="" aria-hidden="true"/><div className="preview-caption mono">TU VIDEO O PRESENTACIÓN APARECERÁ AQUÍ</div></>}
            </div>
            <form className="media-link-form" onSubmit={handleMediaSubmit}>
              <label htmlFor="media-link">Pega un enlace de YouTube o Canva</label>
              <div className="media-input-row">
                <input id="media-link" type="text" inputMode="url" autoComplete="url" maxLength={2000} placeholder="youtube.com o canva.com" value={mediaLink} onChange={(event) => { setMediaLink(event.target.value); setMediaMessage(''); }} required/>
                <button type="submit"><Play size={14}/>{embeddedMedia ? 'Cambiar' : 'Ver'}</button>
              </div>
              {mediaMessage && <p className={`media-message ${!embeddedMedia ? 'media-error' : ''}`} role="status" aria-live="polite">{mediaMessage}</p>}
            </form>
            {activeDeck === 0 ? <a className="deck-open" href="https://www.canva.com/design/play" target="_blank" rel="noreferrer">Abrir en pestaña completa <ExternalLink size={16}/></a> : <div className="deck-unavailable"><span>No hay un enlace público disponible en esta experiencia.</span><span>El deck no se muestra como contenido embebido.</span></div>}
          </div>
        </div>
      </section>

      <section className="telemetry-section section" id="telemetria">
        <div className="section-top telemetry-top"><div><span className="section-kicker"><span>EXPERIENCIA 03</span><span className="kicker-mark">/</span><span>TELEMETRÍA VIVA · MEDELLÍN</span></span><h2 className="display">LEE LA<br/><em>CUENCA.</em></h2></div>
          <p className="section-lead">Toca los puntos del mapa para explorar la cuenca.</p></div>
        <div className="telemetry-wrap">
          <div className="map-panel">
            <div className="map-toolbar"><span><span className="live-dot"/> RED HÍDRICA ENFOCADA</span><span className="mono">VALLE DE ABURRÁ <Globe2 size={13}/></span></div>
            <div className="map-canvas">
              <div className="map-contours contour-a"/><div className="map-contours contour-b"/>
              <svg className="river-map" viewBox="0 0 700 440" preserveAspectRatio="none" aria-hidden="true">
                <path d="M375 -5C330 48 405 76 352 123S414 188 337 234 388 294 319 334 351 390 290 450" fill="none" stroke="#29ded0" strokeWidth="2.2" opacity=".75"/>
                <path d="M374 84C280 91 253 128 164 141M352 164c90 8 123 43 208 38M339 244c-83-4-137 31-214 56M323 315c86-11 149 12 227 37" fill="none" stroke="#39b4bf" strokeWidth="1.1" strokeDasharray="4 7" opacity=".55"/>
                <path d="M390 8C345 58 420 84 369 130S430 196 352 242 402 298 335 340 367 393 306 450" fill="none" stroke="#31aab9" strokeWidth="16" opacity=".055"/>
              </svg>
              <div className="contour-label mono label-a">CUENCA ALTA</div><div className="contour-label mono label-b">LADERA OCCIDENTAL</div><div className="contour-label mono label-c">RÍO ABURRÁ</div>
              {nodes.map(node => <button key={node.id} className={`map-node ${activeNode.id === node.id ? 'node-active' : ''}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} onClick={() => setActiveNode(node)} aria-label={`Explorar ${node.title}`} title={node.title}><span className="node-pulse"/><span className="node-core"/></button>)}
              <div className="map-legend mono"><i/> NODO SELECCIONADO</div>
            </div>
            <div className="node-list">{nodes.map((node, i) => <button key={node.id} onClick={() => setActiveNode(node)} className={activeNode.id === node.id ? 'node-list-active' : ''}><span className="node-index mono">0{i + 1}</span><span>{node.short}</span><span className="list-dot"/></button>)}</div>
          </div>
          <aside className="sensor-card">
            <div className="sensor-head"><div><span className="sensor-label mono"><Radio size={13}/> SENSOR HIDROLÓGICO #{activeNode.id}</span><h3>{activeNode.title}</h3></div>{activeNode.state && <span className="sensor-status">{activeNode.state}</span>}</div>
            <p className="sensor-description">{activeNode.detail ?? `${activeNode.title} es uno de los puntos de agua del Valle de Aburrá.`}</p>
            {activeNode.capacity ? <>
              <div className="capacity-block"><div className="capacity-title"><span>NIVEL DE CAPACIDAD</span><strong>{activeNode.capacity}</strong></div><div className="capacity-track"><i/></div></div>
              <div className="flow-block"><div><span>CAUDAL MEDIDO</span><strong>{activeNode.flow}</strong></div><div><span>TIPO DE SENSOR</span><strong className="sensor-type">{activeNode.type}</strong></div></div>
              <div className="sensor-connections"><span className="mono">AFLUENTES & CONEXIONES DE CUENCA</span><div><span>Quebrada Santa Elena</span><span>Quebrada La Iguaná</span><span>Quebrada Altavista</span></div></div>
            </> : <div className="sensor-note"><Activity size={17}/><span>¡Este punto está activo! Aún no hay una lectura publicada.</span></div>}
            <div className="sensor-footer"><span><Check size={14}/> Nodo activo en la red</span><span className="mono">MEDELLÍN · CO</span></div>
          </aside>
        </div>
        <div className="telemetry-foot"><span>6 NODOS DE TELEMETRÍA ACTIVOS</span><span className="mono">SELECCIONA UN PUNTO PARA EXPLORAR <ArrowRight size={13}/></span></div>
      </section>

      <section className="story-section" id="relato">
        <div className="story-backdrop"/><div className="story-inner">
          <div className="story-heading"><div><span className="section-kicker"><span>RELATO ILUSTRADO DEL TERRITORIO</span><span className="kicker-mark">/</span><span>8 ESCENAS DE CIUDAD</span></span><h2 className="display">EL VIAJE DEL AGUA,<br/><em>CAPÍTULO A CAPÍTULO.</em></h2></div>
            <p>Ocho escenas ilustradas de Medellín y su agua.</p></div>
          <div className="story-grid">
            {scenes.map(scene => <article key={scene.n} className={`story-card ${openScene === scene.n ? 'story-expanded' : ''}`}>
              <button onClick={() => setOpenScene(openScene === scene.n ? null : scene.n)} aria-expanded={openScene === scene.n} className="story-button">
                <SceneArt type={scene.art} mascot={Number(scene.n) % 2 === 0 ? blueMascot : yellowMascot}/><div className="story-card-copy"><div className="story-card-meta"><span>{scene.kind}</span><span className="mono">{scene.n}</span></div><h3>{scene.title}</h3><p>{scene.summary}</p><div className="story-card-foot"><span>{scene.tag}</span><span className="story-expand">{openScene === scene.n ? <X size={15}/> : <ArrowUpRight size={16}/>}</span></div></div>
              </button>
              {openScene === scene.n && <div className="story-detail"><span className="mono">POSTAL {scene.n} / 08</span><p>{scene.text} Una escena para mirar el territorio desde el cuidado y la imaginación colectiva.</p></div>}
            </article>)}
          </div>
        </div>
      </section>
      <section className="closing-cta">
        <div className="cta-watermark"><Droplets/></div><span className="section-kicker"><span>EL AGUA NOS CONVOCA</span><span className="kicker-mark">/</span><span>EL FUTURO LO HACEMOS JUNTOS</span></span>
        <h2 className="display">TU IDEA TAMBIÉN<br/><em>HACE CORRIENTE.</em></h2>
        <p>El reto de Medellín necesita miradas distintas. Trae la tuya a la sala.</p>
        <a className="button-primary" href="https://hacktoonmedellinblanquizal.netlify.app/join"><Droplets size={17}/> Ingresar a la sala <ArrowRight size={16}/></a>
      </section>
    </main>
    <footer className="footer"><a href="#inicio" className="brand"><span className="brand-mark"><Droplets size={17}/></span><span><b>HACKMEDELLÍN</b><small>AGUA & FUTURO <i>2026</i></small></span></a><span>Una experiencia de innovación ciudadana para Medellín.</span><a href="#inicio" className="back-top">VOLVER ARRIBA <ArrowUpRight size={13}/></a></footer>
  </div>;
}

export default App;
