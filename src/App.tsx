
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  RoundedBox,
  ContactShadows,
} from '@react-three/drei'
import { motion } from 'motion/react'

import {
  Aperture,
  Box,
  Check,
  ChevronDown,
  CircleHelp,
  Download,
  FileBox,
  Heart,
  Layers3,
  Maximize2,
  RotateCcw,
  ScanLine,
  Settings2,
  Share2,
  Sparkles,
  Upload,
  X,
  Rotate3D,
  Palette,
  Sun,
} from 'lucide-react'

import ImportedModel from './components/ImportedModel'

const colors = [
  { name: 'Obsidian', value: '#27242e' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Pearl', value: '#ded9d0' },
  { name: 'Forest', value: '#36584a' },
]

type MaterialSettings = {
  color: string
  roughness: number
  metalness: number
}

function Speaker({
  color,
  roughness,
  metalness,
}: MaterialSettings) {
  return (
    <group>
      <RoundedBox
        args={[1.9, 2.65, 0.72]}
        radius={0.28}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      <mesh position={[0, -0.05, 0.375]}>
        <cylinderGeometry args={[0.69, 0.69, 0.07, 64]} />
        <meshStandardMaterial
          color="#17151c"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, -0.05, 0.425]}>
        <torusGeometry args={[0.56, 0.035, 12, 64]} />
        <meshStandardMaterial
          color="#a78bfa"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, -0.05, 0.43]}>
        <cylinderGeometry args={[0.49, 0.49, 0.045, 64]} />
        <meshStandardMaterial color="#302b3b" roughness={0.65} />
      </mesh>

      <mesh position={[0, -0.05, 0.46]}>
        <torusGeometry args={[0.35, 0.012, 8, 64]} />
        <meshStandardMaterial
          color="#71618f"
          metalness={0.5}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[0, -0.05, 0.46]}>
        <circleGeometry args={[0.31, 48]} />
        <meshStandardMaterial color="#24202d" roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.92, 0.38]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#c4b5fd" />
      </mesh>

      <mesh position={[0, 1.34, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.07, 32]} />
        <meshStandardMaterial
          color="#aaa3b8"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>
    </group>
  )
}

type ProductViewerProps = {
  sceneKey: number
  modelUrl: string | null
  material: MaterialSettings
  customizeMaterial: boolean
  onModelLoaded: () => void
  onModelError: (message: string) => void
}

function ProductViewer({
  sceneKey,
  modelUrl,
  material,
  customizeMaterial,
  onModelLoaded,
  onModelError,
}: ProductViewerProps) {
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

      <pointLight
        position={[-4, 1, -2]}
        intensity={25}
        color="#8b5cf6"
      />

      <pointLight
        position={[2, 3, -3]}
        intensity={12}
        color="#c4b5fd"
      />

      <group position={[0, -0.15, 0]}>
        {modelUrl ? (
          <ImportedModel
            url={modelUrl}
            materialColor={material.color}
            roughness={material.roughness}
            metalness={material.metalness}
            customizeMaterial={customizeMaterial}
            onLoaded={onModelLoaded}
            onError={onModelError}
          />
        ) : (
          <Speaker
            color={material.color}
            roughness={material.roughness}
            metalness={material.metalness}
          />
        )}
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

  const [roughness, setRoughness] = useState(0.27)
  const [metalness, setMetalness] = useState(0.38)
  const [customizeMaterial, setCustomizeMaterial] = useState(false)

  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [modelName, setModelName] = useState('Soundform One')
  const [uploadStatus, setUploadStatus] = useState(
    'Built-in demonstration model',
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!modelUrl) return

    return () => URL.revokeObjectURL(modelUrl)
  }, [modelUrl])

  const handleModelLoaded = useCallback(() => {
    setUploadStatus('Imported model loaded successfully')
  }, [])

  const handleModelError = useCallback((message: string) => {
    setUploadStatus(message)
    setModelUrl(null)
    setModelName('Soundform One')
  }, [])

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!file.name.toLowerCase().endsWith('.glb')) {
      setUploadStatus('Please select a .glb file.')
      return
    }

    setUploadStatus('Loading your 3D model...')
    setModelName(file.name)
    setModelUrl(URL.createObjectURL(file))
  }

  const restoreDefaultModel = () => {
    setModelUrl(null)
    setModelName('Soundform One')
    setUploadStatus('Built-in demonstration model')
    setSceneKey((key) => key + 1)
    setCustomizeMaterial(false)
    setSelectedColor(colors[0])
    setRoughness(0.27)
    setMetalness(0.38)
  }

  const isImported = Boolean(modelUrl)

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
            onClick={() =>
              alert('Project sharing will be implemented in a later step.')
            }
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

          <h1 className="max-w-[70vw] truncate text-2xl font-medium tracking-tight md:text-3xl">
            {isImported ? modelName : 'Soundform One'}
          </h1>

          <p className="mt-1.5 text-xs text-white/45">
            {isImported
              ? 'Imported 3D asset · Interactive preview'
              : 'Portable speaker · Interactive 3D preview'}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[10px] text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live 3D preview
          <ChevronDown size={13} />
        </div>
      </section>

      {/* Main workspace */}
      <section className="grid gap-4 px-4 pb-6 md:px-6 lg:grid-cols-[220px_minmax(0,1fr)_280px]">
        {/* Left sidebar */}
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
              <div className="mt-1 text-[10px] text-white/40">
                Interactive scene
              </div>
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
            3D assets
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,model/gltf-binary"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-xl border border-violet-400/25 bg-violet-500/[0.10] p-3 text-left transition hover:bg-violet-500/[0.18]"
          >
            <div className="rounded-lg bg-violet-400/15 p-2 text-violet-300">
              <Upload size={18} />
            </div>
            <div>
              <div className="text-xs font-medium">Import 3D model</div>
              <div className="mt-1 text-[10px] text-white/40">
                Choose a .glb file
              </div>
            </div>
          </button>

          {isImported && (
            <button
              onClick={restoreDefaultModel}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] text-white/55 transition hover:bg-white/[0.05] hover:text-white"
            >
              <X size={14} />
              Restore demo speaker
            </button>
          )}

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <FileBox size={17} className="mb-3 text-violet-300" />
            <p className="text-xs font-medium">Supported format</p>
            <p className="mt-1.5 text-[10px] leading-relaxed text-white/40">
              Import binary glTF (.glb) models.
            </p>
          </div>

          <div className="my-1 h-px bg-white/[0.07]" />

          <div className="text-[10px] uppercase tracking-[0.16em] text-white/35">
            Scene settings
          </div>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className="flex items-center justify-between py-2 text-xs text-white/65"
          >
            Show grid
            <span
              className={`h-5 w-9 rounded-full p-0.5 transition ${
                showGrid ? 'bg-violet-500' : 'bg-white/15'
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-white transition ${
                  showGrid ? 'translate-x-4' : ''
                }`}
              />
            </span>
          </button>

          <div className="mt-auto rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <Sparkles size={17} className="mb-3 text-violet-300" />
            <p className="text-xs font-medium">Design without limits.</p>
            <p className="mt-1.5 text-[10px] leading-relaxed text-white/40">
              Explore shape, material, and finish in an interactive 3D space.
            </p>
          </div>
        </aside>

        {/* 3D viewport */}
        <div className="relative min-h-[430px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#100e17] lg:min-h-[600px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_43%,rgba(125,75,190,0.17),transparent_58%)]" />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_65%,rgba(11,10,15,0.55))]" />

          {showGrid && (
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(190,160,255,.24) 1px, transparent 1px), linear-gradient(90deg, rgba(190,160,255,.24) 1px, transparent 1px)',
                backgroundSize: '38px 38px',
                maskImage:
                  'linear-gradient(to bottom, transparent, black 30%, black 80%, transparent)',
                transform:
                  'perspective(500px) rotateX(12deg) scale(1.2)',
                transformOrigin: 'center bottom',
              }}
            />
          )}

          <div className="absolute left-5 top-5 z-10">
            <div className="flex items-center gap-2 text-[10px] text-white/50">
              <ScanLine size={14} className="text-violet-300" />
              VIEWPORT / 01
            </div>
            <div className="mt-2 text-[10px] text-white/30">
              Drag to rotate · Scroll to zoom
            </div>
          </div>

          <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
            <button
              title="Reset view"
              onClick={() => setSceneKey((key) => key + 1)}
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
            <ProductViewer
              sceneKey={sceneKey}
              modelUrl={modelUrl}
              material={{
                color: selectedColor.value,
                roughness,
                metalness,
              }}
              customizeMaterial={customizeMaterial}
              onModelLoaded={handleModelLoaded}
              onModelError={handleModelError}
            />
          </motion.div>

          {showInfo && (
            <div className="absolute bottom-20 left-5 z-10 max-w-[65%]">
              <div className="text-[10px] uppercase tracking-[0.18em] text-violet-300/80">
                {isImported ? 'Imported asset' : 'Object / 001'}
              </div>
              <div className="mt-1 truncate text-sm font-medium">
                {isImported ? modelName : 'Soundform One'}
              </div>
              <div className="mt-1 text-[10px] text-white/40">
                {isImported ? 'Your uploaded 3D model' : 'Studio speaker concept'}
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#17141e]/90 p-3 backdrop-blur-xl">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
                <Box size={16} />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[11px] font-medium">
                  {modelName}
                </div>
                <div className="mt-0.5 truncate text-[9px] text-white/40">
                  {uploadStatus}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 text-[10px] text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {isImported ? 'Imported' : 'Demo'}
            </div>
          </div>
        </div>

        {/* Customization panel */}
        <aside className="flex flex-col gap-5 rounded-2xl border border-white/[0.07] bg-[#111016] p-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold">Customize object</h2>
              <Settings2 size={15} className="text-white/40" />
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-white/40">
              Adjust color and surface properties in real time.
            </p>
          </div>

          <div className="flex gap-1 rounded-xl bg-black/30 p-1">
            {['Material', 'Finish'].map((tab) => (
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

          {/* Color palette */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium">
                {activeTab === 'Material' ? 'Body color' : 'Finish color'}
              </span>
              <span className="text-[10px] text-white/35">
                {selectedColor.name}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  aria-label={`Select ${color.name}`}
                  onClick={() => {
                    setSelectedColor(color)
                    setCustomizeMaterial(true)
                  }}
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
                      className={`absolute ${
                        color.name === 'Pearl' ? 'text-black' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Roughness control */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-medium">
                <Sun size={14} className="text-violet-300" />
                Roughness
              </div>
              <span className="text-[10px] tabular-nums text-violet-200">
                {roughness.toFixed(2)}
              </span>
            </div>

            <input
              aria-label="Material roughness"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={roughness}
              onChange={(event) => {
                setRoughness(Number(event.target.value))
                setCustomizeMaterial(true)
              }}
              className="mt-4 w-full accent-violet-400"
            />

            <div className="mt-1 flex justify-between text-[9px] text-white/35">
              <span>Glossy</span>
              <span>Matte</span>
            </div>
          </div>

          {/* Metalness control */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-medium">
                <Rotate3D size={14} className="text-violet-300" />
                Metalness
              </div>
              <span className="text-[10px] tabular-nums text-violet-200">
                {metalness.toFixed(2)}
              </span>
            </div>

            <input
              aria-label="Material metalness"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={metalness}
              onChange={(event) => {
                setMetalness(Number(event.target.value))
                setCustomizeMaterial(true)
              }}
              className="mt-4 w-full accent-violet-400"
            />

            <div className="mt-1 flex justify-between text-[9px] text-white/35">
              <span>Non-metal</span>
              <span>Metal</span>
            </div>
          </div>

          {/* Reset material controls */}
          <button
            onClick={() => {
              setSelectedColor(colors[0])
              setRoughness(0.27)
              setMetalness(0.38)
              setCustomizeMaterial(false)
            }}
            className="flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-[11px] text-white/60 transition hover:border-violet-400/30 hover:text-white"
          >
            <RotateCcw size={13} />
            Reset material
          </button>

          <div className="h-px bg-white/[0.07]" />

          {/* Model information */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-medium">Model information</span>
              <CircleHelp size={14} className="text-white/35" />
            </div>

            <div className="space-y-3">
              {[
                ['Object type', isImported ? 'Imported asset' : 'Portable speaker'],
                ['Geometry', isImported ? 'GLB / glTF' : 'Procedural mesh'],
                ['Viewport', 'Real-time 3D'],
                ['Renderer', 'WebGL'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-2 text-[10px]"
                >
                  <span className="text-white/40">{label}</span>
                  <span className="text-right text-white/75">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-xl border border-violet-400/15 bg-violet-400/[0.045] p-3">
            <div className="flex items-center gap-2 text-[11px] font-medium text-violet-200">
              <Palette size={14} />
              Live materials
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-white/45">
              {isImported
                ? 'Material controls update compatible surfaces in your imported model.'
                : 'Change the speaker color, glossiness, and metallic appearance.'}
            </p>
          </div>

          <button
            onClick={() =>
              alert('3D model export will be implemented in a later step.')
            }
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
