
import { useEffect, useState } from 'react'
import { Html } from '@react-three/drei'
import {
  Box3,
  Color,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

type ImportedModelProps = {
  url: string
  materialColor: string
  roughness: number
  metalness: number
  customizeMaterial: boolean
  onLoaded?: () => void
  onError?: (message: string) => void
}

function cloneMaterial(material: Material): Material {
  const cloned = material.clone()

  if (cloned instanceof MeshStandardMaterial) {
    cloned.userData.originalColor = cloned.color.getHex()
    cloned.userData.originalRoughness = cloned.roughness
    cloned.userData.originalMetalness = cloned.metalness
  }

  return cloned
}

export default function ImportedModel({
  url,
  materialColor,
  roughness,
  metalness,
  customizeMaterial,
  onLoaded,
  onError,
}: ImportedModelProps) {
  const [model, setModel] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loader = new GLTFLoader()

    setModel(null)
    setLoading(true)

    loader.load(
      url,
      (gltf) => {
        if (!active) return

        const object = gltf.scene.clone(true)

        // Clone materials so the original asset is not modified.
        object.traverse((child) => {
          if (!(child instanceof Mesh)) return

          if (Array.isArray(child.material)) {
            child.material = child.material.map(cloneMaterial)
          } else {
            child.material = cloneMaterial(child.material)
          }
        })

        // Center and scale the model to fit the viewer.
        const bounds = new Box3().setFromObject(object)
        const size = bounds.getSize(new Vector3())
        const center = bounds.getCenter(new Vector3())
        const largestDimension = Math.max(size.x, size.y, size.z)

        if (largestDimension > 0) {
          const scale = 2.5 / largestDimension
          object.scale.multiplyScalar(scale)
          object.position.sub(center.multiplyScalar(scale))
        }

        setModel(object)
        setLoading(false)
        onLoaded?.()
      },
      undefined,
      (error) => {
        if (!active) return

        console.error('Could not load 3D model:', error)
        setLoading(false)
        onError?.('Could not load this model. Please try another GLB file.')
      },
    )

    return () => {
      active = false
    }
  }, [url, onLoaded, onError])

  // Apply live changes without reloading the model.
  useEffect(() => {
    if (!model) return

    model.traverse((child) => {
      if (!(child instanceof Mesh)) return

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]

      materials.forEach((material) => {
        if (!(material instanceof MeshStandardMaterial)) return

        if (customizeMaterial) {
          material.color.set(materialColor)
          material.roughness = roughness
          material.metalness = metalness
        } else {
          const originalColor = material.userData.originalColor
          const originalRoughness = material.userData.originalRoughness
          const originalMetalness = material.userData.originalMetalness

          if (originalColor !== undefined) {
            material.color.copy(new Color(originalColor))
          }

          if (originalRoughness !== undefined) {
            material.roughness = originalRoughness
          }

          if (originalMetalness !== undefined) {
            material.metalness = originalMetalness
          }
        }

        material.needsUpdate = true
      })
    })
  }, [model, materialColor, roughness, metalness, customizeMaterial])

  if (loading) {
    return (
      <Html center>
        <div
          style={{
            color: '#d8b4fe',
            background: '#17131f',
            padding: '12px 18px',
            borderRadius: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          Loading 3D model...
        </div>
      </Html>
    )
  }

  if (!model) return null

  return <primitive object={model} />
}
