
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, RoundedBox, ContactShadows } from '@react-three/drei'
import { motion } from 'motion/react'
import {
  Aperture, Box, Check, ChevronDown, CircleHelp, Download,
  Heart, Layers3, Maximize2, RotateCcw, ScanLine, Settings2,
  Share2, Sparkles, ZoomIn, ZoomOut
} from 'lucide-react'

const colors = [
  { name: 'Obsidian', value: '#27242e' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Pearl', value: '#ded9d0' },
  { name: 'Forest', value: '#36584a' },
]

function Speaker({ color }: { color: string }) {
  return (
    <group>
      {/* Sculpted speaker body */}
      <RoundedBox
        args={[1.9, 2.65, 0.72]}
        radius={0.28}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={color}
          roughness={0.27}
          metalness={0.38}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      {/* Front speaker surround */}
      <mesh position={[0, -0.05, 0.375]}>
        <cylinderGeometry args={[0.69, 0.69, 0.07, 64]} />
        <meshStandardMaterial color="#17151c" metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh position={[0, -0.05, 0.425]}>
        <torusGeometry args={[0.56, 0.035, 12, 64]} />
        <meshStandardMaterial color="#a78bfa" metalness={0.7} roughness={0.25} />
      </mesh>

      <mesh position={[0, -0.05, 0.43]}>
        <cylinderGeometry args={[0.49, 0.49, 0.045, 64]} />
        <meshStandardMaterial color="#302b3b" roughness={0.65} />
      </mesh>

      <mesh position={[0, -0.05, 0.46]}>
        <torusGeometry args={[0.35, 0.012, 8, 64]} />
        <meshStandardMaterial color="#71618f" metalness={0.5} roughness={0.35} />
      </mesh>

      <mesh position={[0, -0.05, 0.46]}>
        <circleGeometry args={[0.31, 48]} />
        <meshStandardMaterial color="#24202d" roughness={0.9} />
      </mesh>

      {/* Small status light */}
      <mesh position={[0, 0.92, 0.38]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#c4b5fd" />
      </mesh>

      {/* Top control */}
      <mesh position={[0, 1.34, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.07, 32]} />
        <meshStandardMaterial color="#aaa3b8" metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  )
}

function ProductViewer({ color, sceneKey }: {
  color: string
  sceneKey: number
}) {
  return (
    <Canvas
      key={sceneKey}
      camera={{ position: [4, 2.8, 5.5], fov: 38 }}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-4, 1, -2]} intensity={25} color="#8b5cf6" />
      <pointLight position={[2, 3, -3]} intensity={12} color="#c4b5fd" />

      <group position={[0, -0.15, 0]}>
        <Speaker color={color} />
      </group>

      <ContactShadows
        position={[0, -1.65, 0]}
        opacity={0.4}
        scale={5}
        blur={2.5}
        far={4}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={3.5}
        maxDistance={9}
        minPolarAngle={0.45}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  )
}

export default function App() {
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [sceneKey, setSceneKey] = useState(0)
  const [liked, setLiked] = useState(false)
  const [activeTab, setActiveTab] = useState('Material')
  const [showGrid, setShowGrid] = useState(true)
  const [showInfo, setShowInfo] = useState(true)

  return (
    <main className="min-h-screen bg-[#0b0a0f] text-[#f5f3fa]">
      {/* Header */}
      <header className="flex h-[68px] items-center justify-between border-b border-white/[0.07] px-5 md:px-8">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white">
            <Aperture size={22} />
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-[0.14em]">
              FORMA<span className="text-violet-400">3D</span>
            </div>
            <div className="mt-0.5 text-[9px] tracking-[0.23em] text-white/40">
              PRODUCT STUDIO
            </div>
          </div>
        </a>

        <div className="hidden items-center gap-7 text-xs text-white/50 md:flex">
          <button className="text-white">Studio</button>
          <button className="transition hover:text-white">My projects</button>
          <button className="transition hover:text-white">Discover</button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLiked(!liked)}
            aria-label="Toggle favorite"
            className={`rounded-lg border p-2.5 transition ${
              liked
                ? 'border-violet-400/40 bg-violet-400/10 text-violet-300'
                : 'border-white/10 text-white/60 hover:text-white'
            }`}
          >
            <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => alert('Your product studio is ready to export once export support is added.')}
            className="flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-xs font-semibold transition hover:bg-violet-400"
          >
            <Share2 size={15} />
            <span className="hidden sm:inline">Share project</span>
          </button>
        </div>
      </header>

      {/* Project heading */}
      <section className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
            <span>My workspace</span>
            <span>/</span>
            <span className="text-violet-300">Product design</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
            Soundform <span className="text-white/30">One</span>
          </h1>
          <p className="mt-1.5 text-xs text-white/45">
            Portable speaker · Interactive 3D preview
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[10px] text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live 3D preview
          <ChevronDown size={13} />
        </div>
      </section>

      {/* Studio workspace */}
      <section className="grid gap-4 px-4 pb-6 md:px-6 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
        {/* Left panel */}
        <aside className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-[#111016] p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold">Workspace</h2>
            <Settings2 size={15} className="text-white/40" />
          </div>

          <button className="flex items-center gap-3 rounded-xl border border-violet-400/25 bg-violet-400/[0.09] p-3 text-left">
            <div className="rounded-lg bg-violet-400/15 p-2 text-violet-300">
              <Box size={18} />
            </div>
            <div>
              <div className="text-xs font-medium">3D Viewer</div>
              <div className="mt-1 text-[10px] text-white/40">Interactive scene</div>
            </div>
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-3 rounded-xl p-3 text-left text-white/55 transition hover:bg-white/[0.04] hover:text-white"
          >
            <Layers3 size={18} />
            <span className="text-xs">Product details</span>
          </button>

          <div className="my-1 h-px bg-white/[0.07]" />

          <div className="text-[10px] uppercase tracking-[0.16em] text-white/35">
            Scene settings
          </div>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className="flex items-center justify-between py-2 text-xs text-white/65"
          >
            Show grid
            <span className={`h-5 w-9 rounded-full p-0.5 transition ${showGrid ? 'bg-violet-500' : 'bg-white/15'}`}>
              <span className={`block h-4 w-4 rounded-full bg-white transition ${showGrid ? 'translate-x-4' : ''}`} />
            </span>
          </button>

          <div className="mt-auto rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <Sparkles size={17} className="mb-3 text-violet-300" />
            <p className="text-xs font-medium">Design without limits.</p>
            <p className="mt-1.5 text-[10px] leading-relaxed text-white/40">
              Explore form, material, and light in an interactive 3D space.
            </p>
          </div>
        </aside>

        {/* Main viewport */}
        <div className="relative min-h-[430px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#100e17] lg:min-h-[600px]">
          {/* Ambient gradients */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_43%,rgba(125,75,190,0.17),transparent_58%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_65%,rgba(11,10,15,0.55))]" />

          {showGrid && (
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(190,160,255,.24) 1px, transparent 1px), linear-gradient(90deg, rgba(190,160,255,.24) 1px, transparent 1px)',
                backgroundSize: '38px 38px',
                maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 80%, transparent)',
                transform: 'perspective(500px) rotateX(12deg) scale(1.2)',
                transformOrigin: 'center bottom',
              }}
            />
          )}

          <div className="absolute left-5 top-5 z-10">
            <div className="flex items-center gap-2 text-[10px] text-white/50">
              <ScanLine size={14} className="text-violet-300" />
              VIEWPORT / 01
            </div>
            <div className="mt-2 text-[10px] text-white/30">Drag to rotate · Scroll to zoom</div>
          </div>

          <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
            <button
              title="Reset view"
              onClick={() => setSceneKey(k => k + 1)}
              className="rounded-lg border border-white/10 bg-black/30 p-2.5 text-white/60 backdrop-blur transition hover:text-white"
            >
              <RotateCcw size={16} />
            </button>
            <button
              title="Toggle grid"
              onClick={() => setShowGrid(!showGrid)}
              className="rounded-lg border border-white/10 bg-black/30 p-2.5 text-white/60 backdrop-blur transition hover:text-white"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <ProductViewer color={selectedColor.value} sceneKey={sceneKey} />
          </motion.div>

          {showInfo && (
            <div className="absolute bottom-20 left-5 z-10">
              <div className="text-[10px] uppercase tracking-[0.18em] text-violet-300/80">
                Object / 001
              </div>
              <div className="mt-1 text-sm font-medium">Soundform One</div>
              <div className="mt-1 text-[10px] text-white/40">Studio speaker concept</div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#17141e]/85 p-3 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
                <Box size={16} />
              </div>
              <div>
                <div className="text-[11px] font-medium">Soundform One</div>
                <div className="mt-0.5 text-[9px] text-white/40">3D product model</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Ready
            </div>
          </div>
        </div>

        {/* Right customization panel */}
        <aside className="flex flex-col gap-5 rounded-2xl border border-white/[0.07] bg-[#111016] p-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold">Customize object</h2>
              <Settings2 size={15} className="text-white/40" />
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-white/40">
              Refine the appearance of your product in real time.
            </p>
          </div>

          <div className="flex gap-1 rounded-xl bg-black/30 p-1">
            {['Material', 'Finish'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-lg py-2 text-[11px] transition ${
                  activeTab === tab
                    ? 'bg-white/[0.09] text-white'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium">
                {activeTab === 'Material' ? 'Body color' : 'Finish color'}
              </span>
              <span className="text-[10px] text-white/35">{selectedColor.name}</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {colors.map(color => (
                <button
                  key={color.name}
                  title={color.name}
                  aria-label={`Select ${color.name}`}
                  onClick={() => setSelectedColor(color)}
                  className={`relative flex aspect-square items-center justify-center rounded-xl border transition ${
                    selectedColor.name === color.name
                      ? 'border-violet-400 ring-1 ring-violet-400/40'
                      : 'border-white/10 hover:border-white/40'
                  }`}
                >
                  <span
                    className="h-full w-full rounded-[9px]"
                    style={{ backgroundColor: color.value }}
                  />
                  {selectedColor.name === color.name && (
                    <Check
                      size={17}
                      className={`absolute ${color.name === 'Pearl' ? 'text-black' : 'text-white'}`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/[0.07]" />

          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-medium">Model information</span>
              <CircleHelp size={14} className="text-white/35" />
            </div>
            <div className="space-y-3">
              {[
                ['Object type', 'Portable speaker'],
                ['Geometry', 'Procedural mesh'],
                ['Viewport', 'Real-time 3D'],
                ['Renderer', 'WebGL'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-2 text-[10px]">
                  <span className="text-white/40">{label}</span>
                  <span className="text-right text-white/75">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-xl border border-violet-400/15 bg-violet-400/[0.045] p-3">
            <div className="flex items-center gap-2 text-[11px] font-medium text-violet-200">
              <Sparkles size={14} />
              Studio preview
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-white/45">
              This is a procedural demonstration model. Custom imported 3D assets can be added later.
            </p>
          </div>

          <button
            onClick={() => alert('Export functionality will be implemented in a later step.')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 py-3 text-xs font-semibold transition hover:bg-violet-400"
          >
            <Download size={15} />
            Export model
          </button>
        </aside>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-4 text-[10px] text-white/30">
        <span>FORMA3D STUDIO · INTERACTIVE PRODUCT DESIGN</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Local preview
        </span>
      </footer>
    </main>
  )
}
