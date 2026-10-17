
import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  OrbitControls,
  RoundedBox,
} from '@react-three/drei'
import { motion } from 'motion/react'
import {
  Box,
  Check,
  Download,
  Eye,
  EyeOff,
  Heart,
  Layers3,
  Maximize2,
  RotateCcw,
  RotateCw,
  Settings2,
  SlidersHorizontal,
  Upload,
  X,
} from 'lucide-react'

import ImportedModel from './components/ImportedModel'
import type { ModelDimensions } from './components/ImportedModel'

type MaterialSettings = {
  color: string
  roughness: number
  metalness: number
}

const colorOptions = [
  { name: 'Obsidian', value: '#25232b' },
  { name: 'Pearl', value: '#e8e5ed' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Rose', value: '#e9a1b3' },
  { name: 'Sage', value: '#9cae9b' },
  { name: 'Amber', value: '#d7a76d' },
]

function Speaker({ material }: { material: MaterialSettings }) {
  return (
    <group>
      <RoundedBox
        args={[1.45, 2.35, 0.88]}
        radius={0.14}
        smoothness={5}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={material.color}
          roughness={material.roughness}
          metalness={material.metalness}
          clearcoat={0.32}
          clearcoatRoughness={0.25}
        />
      </RoundedBox>

      <RoundedBox
        args={[1.23, 2.12, 0.075]}
        radius={0.1}
        smoothness={5}
        position={[0, 0, 0.445]}
        castShadow
      >
        <meshStandardMaterial
          color={material.color}
          roughness={Math.min(1, material.roughness + 0.12)}
          metalness={material.metalness * 0.5}
        />
      </RoundedBox>

      <group position={[0, 0.49, 0.505]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.37, 0.37, 0.045, 64]} />
          <meshStandardMaterial
            color="#17151c"
            metalness={0.72}
            roughness={0.3}
          />
        </mesh>

        <mesh position={[0, 0, 0.03]} castShadow>
          <sphereGeometry args={[0.29, 32, 32]} />
          <meshPhysicalMaterial
            color="#38333f"
            metalness={0.38}
            roughness={0.4}
            clearcoat={0.6}
          />
        </mesh>

        <mesh position={[0, 0, 0.07]} castShadow>
          <sphereGeometry args={[0.105, 32, 32]} />
          <meshStandardMaterial
            color="#a78bfa"
            metalness={0.5}
            roughness={0.28}
          />
        </mesh>
      </group>

      <group position={[0, -0.43, 0.505]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.43, 0.43, 0.045, 64]} />
          <meshStandardMaterial
            color="#17151c"
            metalness={0.75}
            roughness={0.3}
          />
        </mesh>

        <mesh position={[0, 0, 0.025]} castShadow>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshPhysicalMaterial
            color="#49424f"
            metalness={0.3}
            roughness={0.42}
            clearcoat={0.45}
          />
        </mesh>

        <mesh position={[0, 0, 0.065]} castShadow>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial
            color="#27222f"
            metalness={0.55}
            roughness={0.32}
          />
        </mesh>
      </group>

      <mesh position={[0, -0.91, 0.49]}>
        <boxGeometry args={[0.28, 0.018, 0.012]} />
        <meshStandardMaterial
          color="#c4b5fd"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {[-0.46, 0.46].map((x) => (
        <RoundedBox
          key={x}
          args={[0.25, 0.09, 0.28]}
          radius={0.035}
          smoothness={3}
          position={[x, -1.19, 0]}
          castShadow
        >
          <meshStandardMaterial color="#17151c" roughness={0.65} />
        </RoundedBox>
      ))}
    </group>
  )
}

type ViewerProps = {
  modelUrl: string | null
  material: MaterialSettings
  customizeMaterial: boolean
  onModelLoaded: () => void
  onModelError: (message: string) => void
  onDimensions: (value: ModelDimensions) => void
}

function ProductViewer({
  modelUrl,
  material,
  customizeMaterial,
  onModelLoaded,
  onModelError,
  onDimensions,
}: ViewerProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [4.2, 2.7, 5.4], fov: 36 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#111016']} />
      <ambientLight intensity={0.8} />

      <directionalLight
        position={[4, 6, 5]}
        intensity={2.5}
        castShadow
      />

      <pointLight
        position={[-4, 1.5, -2]}
        intensity={12}
        color="#9b7bff"
      />

      <pointLight
        position={[3, -1, 3]}
        intensity={4}
        color="#e7c6ff"
      />

      <Environment preset="city" />

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
            onDimensions={onDimensions}
          />
        ) : (
          <Speaker material={material} />
        )}
      </group>

      <ContactShadows
        position={[0, -1.42, 0]}
        opacity={0.45}
        scale={5}
        blur={2.5}
        far={3}
      />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minDistance={2.5}
        maxDistance={10}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}

export default function App() {
  const [material, setMaterial] = useState<MaterialSettings>({
    color: '#8b5cf6',
    roughness: 0.38,
    metalness: 0.32,
  })

  const [customizeMaterial, setCustomizeMaterial] = useState(true)
  const [liked, setLiked] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [showInfo, setShowInfo] = useState(true)
  const [activeTab, setActiveTab] = useState<'material' | 'scene'>('material')
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [modelName, setModelName] = useState('')
  const [uploadStatus, setUploadStatus] = useState('Demo model ready')
  const [dimensions, setDimensions] = useState<ModelDimensions | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isImported = modelUrl !== null

  useEffect(() => {
    return () => {
      if (modelUrl) URL.revokeObjectURL(modelUrl)
    }
  }, [modelUrl])

  const handleModelLoaded = useCallback(() => {
    setUploadStatus('Imported model loaded successfully')
  }, [])

  const handleModelError = useCallback((message: string) => {
    console.error('Model loading error:', message)
    setUploadStatus('Could not load model. Try another GLB/GLTF.')
  }, [])

  const handleDimensions = useCallback((value: ModelDimensions) => {
    setDimensions(value)
  }, [])

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const supported =
      file.name.toLowerCase().endsWith('.glb') ||
      file.name.toLowerCase().endsWith('.gltf')

    if (!supported) {
      setUploadStatus('Please choose a .glb or .gltf file')
      event.target.value = ''
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      setUploadStatus('Maximum file size is 100 MB')
      event.target.value = ''
      return
    }

    setModelUrl(URL.createObjectURL(file))
    setModelName(file.name)
    setDimensions(null)
    setUploadStatus('Loading your 3D model...')
    event.target.value = ''
  }

  const restoreDemo = () => {
    setModelUrl(null)
    setModelName('')
    setDimensions(null)
    setMaterial({
      color: '#8b5cf6',
      roughness: 0.38,
      metalness: 0.32,
    })
    setUploadStatus('Demo model ready')
  }

  const downloadDemoInfo = () => {
    const info = {
      application: 'Forma3D',
      model: isImported ? modelName : 'Soundform One',
      material,
      dimensions,
      note: 'This file contains model information only, not 3D geometry.',
    }

    const blob = new Blob([JSON.stringify(info, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'forma3d-model-info.json'
    link.click()
    URL.revokeObjectURL(url)

    setUploadStatus('Model information downloaded as JSON')
  }

  return (
    <div className="min-h-screen bg-[#0b0a10] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-[76px] shrink-0 flex-col items-center border-r border-white/[0.07] bg-[#0e0d14] py-6 md:flex">
          <div className="mb-12 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500 shadow-lg shadow-violet-500/20">
            <Layers3 size={22} />
          </div>

          <nav className="flex flex-1 flex-col items-center gap-4">
            <button
              title="3D Studio"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"
            >
              <Box size={20} />
            </button>
            <button
              title="Materials"
              onClick={() => setActiveTab('material')}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white/45 hover:bg-white/[0.06] hover:text-white"
            >
              <SlidersHorizontal size={19} />
            </button>
            <button
              title="Scene"
              onClick={() => setActiveTab('scene')}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white/45 hover:bg-white/[0.06] hover:text-white"
            >
              <Settings2 size={19} />
            </button>
          </nav>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-white/[0.07] px-5 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <h1 className="text-sm font-semibold tracking-wide">
                  Forma<span className="text-violet-400">3D</span>
                </h1>
                <p className="mt-1 truncate text-xs text-white/40">
                  {isImported ? modelName : 'Soundform One / Product concept'}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setLiked((value) => !value)}
                title="Favorite"
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                  liked
                    ? 'border-pink-400/30 bg-pink-400/10 text-pink-300'
                    : 'border-white/10 text-white/55 hover:bg-white/[0.06]'
                }`}
              >
                <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={restoreDemo}
                className="hidden h-9 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs text-white/65 hover:bg-white/[0.06] sm:flex"
              >
                <RotateCcw size={14} />
                Reset
              </button>

              <button
                onClick={downloadDemoInfo}
                className="flex h-9 items-center gap-2 rounded-xl bg-violet-500 px-3 text-xs font-semibold hover:bg-violet-400 md:px-4"
              >
                <Download size={15} />
                <span className="hidden sm:inline">Export info</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
            <section className="flex min-h-[520px] min-w-0 flex-1 flex-col p-4 md:p-6">
              <div className="relative flex min-h-[460px] flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111016]">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute left-1/2 top-[42%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.09] blur-[100px]" />

                  {showGrid && (
                    <div
                      className="absolute inset-0 opacity-[0.11]"
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(167,139,250,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.18) 1px, transparent 1px)',
                        backgroundSize: '44px 44px',
                        maskImage:
                          'linear-gradient(to bottom, transparent, black 30%, black 80%, transparent)',
                      }}
                    />
                  )}
                </div>

                <div className="absolute left-5 top-5 z-10">
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-violet-300/80">
                    3D Workspace
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Interactive product visualization
                  </p>
                </div>

                <div className="absolute right-4 top-4 z-10 flex gap-2">
                  <button
                    onClick={() => setShowGrid((value) => !value)}
                    title="Toggle grid"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-white/55 hover:text-white"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => setShowInfo((value) => !value)}
                    title="Toggle dimensions"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-white/55 hover:text-white"
                  >
                    {showInfo ? <EyeOff size={16} /> : <Maximize2 size={16} />}
                  </button>

                  <button
                    onClick={() => window.location.reload()}
                    title="Reload studio"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-white/55 hover:text-white"
                  >
                    <RotateCw size={15} />
                  </button>
                </div>

                <div className="relative z-[1] min-h-[460px] flex-1">
                  <ProductViewer
                    modelUrl={modelUrl}
                    material={material}
                    customizeMaterial={customizeMaterial}
                    onModelLoaded={handleModelLoaded}
                    onModelError={handleModelError}
                    onDimensions={handleDimensions}
                  />
                </div>

                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-5 left-5 z-10 w-[190px] rounded-xl border border-white/[0.09] bg-[#17151e]/85 p-4 backdrop-blur-xl"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        Model dimensions
                      </p>
                      <Maximize2 size={13} className="text-violet-300" />
                    </div>

                    {(['x', 'y', 'z'] as const).map((axis) => (
                      <div
                        key={axis}
                        className="flex items-center justify-between py-1"
                      >
                        <span className="text-xs text-white/45">
                          Axis {axis.toUpperCase()}
                        </span>
                        <span className="font-mono text-xs text-white/85">
                          {dimensions
                            ? dimensions[axis].toFixed(3)
                            : isImported
                              ? '...'
                              : axis === 'x'
                                ? '1.450'
                                : axis === 'y'
                                  ? '2.350'
                                  : '0.880'}
                        </span>
                      </div>
                    ))}

                    <p className="mt-2 border-t border-white/[0.07] pt-2 text-[9px] leading-relaxed text-white/35">
                      Values are model units, not guaranteed physical measurements.
                    </p>
                  </motion.div>
                )}

                <div className="absolute bottom-5 right-5 z-10 hidden items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] text-white/35 backdrop-blur-md sm:flex">
                  <RotateCw size={12} />
                  Drag to rotate · Scroll to zoom
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2 text-[11px] text-white/40">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      uploadStatus.toLowerCase().includes('could not')
                        ? 'bg-red-400'
                        : uploadStatus.toLowerCase().includes('loading')
                          ? 'animate-pulse bg-amber-400'
                          : 'bg-emerald-400'
                    }`}
                  />
                  <span>{uploadStatus}</span>
                </div>
                <span className="text-[10px] text-white/25">
                  WebGL · Interactive viewport
                </span>
              </div>
            </section>

            <aside className="w-full shrink-0 border-t border-white/[0.07] bg-[#0e0d14] xl:w-[330px] xl:border-l xl:border-t-0">
              <div className="flex h-full flex-col">
                <div className="border-b border-white/[0.07] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold">Studio controls</h2>
                      <p className="mt-1 text-xs text-white/40">
                        Customize your 3D creation
                      </p>
                    </div>
                    <Settings2 size={18} className="text-violet-300" />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-white/[0.04] p-1">
                    <button
                      onClick={() => setActiveTab('material')}
                      className={`rounded-lg py-2.5 text-xs ${
                        activeTab === 'material'
                          ? 'bg-white/[0.09] font-medium text-white'
                          : 'text-white/45 hover:text-white/80'
                      }`}
                    >
                      Materials
                    </button>
                    <button
                      onClick={() => setActiveTab('scene')}
                      className={`rounded-lg py-2.5 text-xs ${
                        activeTab === 'scene'
                          ? 'bg-white/[0.09] font-medium text-white'
                          : 'text-white/45 hover:text-white/80'
                      }`}
                    >
                      Scene & model
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-5">
                  {activeTab === 'material' ? (
                    <motion.div
                      key="material-panel"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-7"
                    >
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-xs font-semibold text-white/85">
                            Surface color
                          </h3>
                          <span className="font-mono text-[10px] text-white/40">
                            {material.color.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-6 gap-2">
                          {colorOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() =>
                                setMaterial((current) => ({
                                  ...current,
                                  color: option.value,
                                }))
                              }
                              title={option.name}
                              className={`flex aspect-square items-center justify-center rounded-xl border ${
                                material.color === option.value
                                  ? 'border-violet-300 ring-2 ring-violet-400/30 ring-offset-2 ring-offset-[#0e0d14]'
                                  : 'border-white/10 hover:border-white/35'
                              }`}
                              style={{ backgroundColor: option.value }}
                            >
                              {material.color === option.value && (
                                <Check
                                  size={15}
                                  className={
                                    option.value === '#e8e5ed' ||
                                    option.value === '#9cae9b'
                                      ? 'text-black'
                                      : 'text-white'
                                  }
                                />
                              )}
                            </button>
                          ))}
                        </div>

                        <label className="mt-4 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                          <span
                            className="h-8 w-8 shrink-0 rounded-lg border border-white/10"
                            style={{ backgroundColor: material.color }}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs text-white/80">
                              Custom color
                            </span>
                            <span className="mt-1 block text-[10px] text-white/35">
                              Choose any color
                            </span>
                          </span>
                          <input
                            type="color"
                            value={material.color}
                            onChange={(event) =>
                              setMaterial((current) => ({
                                ...current,
                                color: event.target.value,
                              }))
                            }
                            className="h-8 w-9 cursor-pointer rounded-lg border-0 bg-transparent"
                            aria-label="Choose custom color"
                          />
                        </label>
                      </div>

                      <div className="border-t border-white/[0.07] pt-6">
                        <div className="mb-5 flex items-center justify-between">
                          <h3 className="text-xs font-semibold text-white/85">
                            Material properties
                          </h3>
                          <span className="rounded-md bg-violet-400/10 px-2 py-1 text-[9px] text-violet-300">
                            PBR
                          </span>
                        </div>

                        <label className="mb-6 block">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs text-white/65">Roughness</span>
                            <span className="font-mono text-xs text-violet-300">
                              {material.roughness.toFixed(2)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={material.roughness}
                            onChange={(event) =>
                              setMaterial((current) => ({
                                ...current,
                                roughness: Number(event.target.value),
                              }))
                            }
                            className="w-full accent-violet-400"
                          />
                          <div className="mt-2 flex justify-between text-[9px] text-white/30">
                            <span>Glossy</span>
                            <span>Matte</span>
                          </div>
                        </label>

                        <label className="block">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs text-white/65">Metalness</span>
                            <span className="font-mono text-xs text-violet-300">
                              {material.metalness.toFixed(2)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={material.metalness}
                            onChange={(event) =>
                              setMaterial((current) => ({
                                ...current,
                                metalness: Number(event.target.value),
                              }))
                            }
                            className="w-full accent-violet-400"
                          />
                          <div className="mt-2 flex justify-between text-[9px] text-white/30">
                            <span>Non-metal</span>
                            <span>Metal</span>
                          </div>
                        </label>
                      </div>

                      <div className="border-t border-white/[0.07] pt-5">
                        <label className="flex cursor-pointer items-center justify-between gap-3">
                          <span>
                            <span className="block text-xs text-white/80">
                              Apply material
                            </span>
                            <span className="mt-1 block text-[10px] text-white/40">
                              Customize supported model materials
                            </span>
                          </span>
                          <input
                            type="checkbox"
                            checked={customizeMaterial}
                            onChange={(event) =>
                              setCustomizeMaterial(event.target.checked)
                            }
                            className="h-4 w-4 accent-violet-400"
                          />
                        </label>
                      </div>

                      <button
                        onClick={() =>
                          setMaterial({
                            color: '#8b5cf6',
                            roughness: 0.38,
                            metalness: 0.32,
                          })
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-3 text-xs text-white/60 hover:bg-white/[0.04] hover:text-white"
                      >
                        <RotateCcw size={14} />
                        Reset material
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="scene-panel"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="mb-3 text-xs font-semibold text-white/85">
                          Import 3D model
                        </h3>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="group flex w-full flex-col items-center rounded-2xl border border-dashed border-violet-400/25 bg-violet-400/[0.04] px-4 py-7 text-center hover:border-violet-400/60 hover:bg-violet-400/[0.08]"
                        >
                          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                            <Upload size={20} />
                          </span>
                          <span className="text-xs font-medium text-white/85">
                            Choose a 3D file
                          </span>
                          <span className="mt-2 text-[10px] text-white/40">
                            GLB or GLTF · Max 100 MB
                          </span>
                        </button>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>

                      <div className="border-t border-white/[0.07] pt-5">
                        <h3 className="mb-3 text-xs font-semibold text-white/85">
                          Current model
                        </h3>
                        <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                              <Box size={19} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-white/85">
                                {isImported ? modelName : 'Soundform One'}
                              </p>
                              <p className="mt-1 text-[10px] text-white/40">
                                {isImported ? 'Imported 3D asset' : 'Demo object'}
                              </p>
                            </div>
                            {isImported && (
                              <button
                                onClick={restoreDemo}
                                title="Remove imported model"
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:bg-white/[0.06] hover:text-white"
                              >
                                <X size={15} />
                              </button>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={restoreDemo}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-3 text-xs text-white/60 hover:bg-white/[0.04] hover:text-white"
                        >
                          <RotateCcw size={14} />
                          Restore demo speaker
                        </button>
                      </div>

                      <div className="border-t border-white/[0.07] pt-5">
                        <h3 className="mb-3 text-xs font-semibold text-white/85">
                          Viewport
                        </h3>
                        <button
                          onClick={() => setShowGrid((value) => !value)}
                          className="flex w-full items-center justify-between rounded-xl border border-white/[0.07] px-3 py-3 text-xs text-white/65 hover:bg-white/[0.04]"
                        >
                          <span className="flex items-center gap-2">
                            {showGrid ? <Eye size={15} /> : <EyeOff size={15} />}
                            Show background grid
                          </span>
                          <span
                            className={`h-2 w-2 rounded-full ${
                              showGrid ? 'bg-violet-400' : 'bg-white/20'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => setShowInfo((value) => !value)}
                          className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/[0.07] px-3 py-3 text-xs text-white/65 hover:bg-white/[0.04]"
                        >
                          <span className="flex items-center gap-2">
                            <Maximize2 size={15} />
                            Show dimensions
                          </span>
                          <span
                            className={`h-2 w-2 rounded-full ${
                              showInfo ? 'bg-violet-400' : 'bg-white/20'
                            }`}
                          />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="border-t border-white/[0.07] p-5">
                  <button
                    onClick={downloadDemoInfo}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 py-3.5 text-xs font-semibold hover:bg-violet-400"
                  >
                    <Download size={15} />
                    Export model information
                  </button>
                  <p className="mt-3 text-center text-[10px] leading-relaxed text-white/30">
                    Exports model details and material settings as JSON.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
