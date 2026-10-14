import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ======================================================================================
 * HOW TO SWAP THIS PLACEHOLDER FOR A REAL .GLTF / .GLB MODEL:
 * --------------------------------------------------------------------------------------
 * 1. Place your 3D asset in the `public/models/` folder (e.g. `public/models/watch.glb`).
 * 2. Preload the asset for instantaneous display:
 *      useGLTF.preload('/models/watch.glb');
 * 3. Replace the JSX in this component with:
 *      const { scene, animations } = useGLTF('/models/watch.glb');
 *      const clonedScene = useMemo(() => scene.clone(), [scene]);
 *      // Optional: Traverse clonedScene to update materials, castShadow, receiveShadow:
 *      // clonedScene.traverse((child) => {
 *      //   if (child.isMesh) {
 *      //     child.castShadow = true;
 *      //     child.receiveShadow = true;
 *      //   }
 *      // });
 *      return <primitive object={clonedScene} scale={1} {...props} />;
 * ====================================================================================== */

// You can uncomment the import below when you are ready to use your GLTF/GLB model:
// import { useGLTF } from '@react-three/drei';

export function ProductWatch({ variant, isExploded, ...props }) {
  // References for dynamic, frame-based animations (avoiding React state re-renders in 60fps loop)
  const groupRef = useRef();
  const gear1Ref = useRef();
  const gear2Ref = useRef();
  const secondHandRef = useRef();
  const minuteHandRef = useRef();
  const bezelLayerRef = useRef();
  const crystalLayerRef = useRef();
  const dialLayerRef = useRef();

  // Procedural Hour Markers Array (computed once, declarative JSX rendering)
  const hourMarkers = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 0.82;
      return {
        x: Math.sin(angle) * radius,
        y: Math.cos(angle) * radius,
        rotZ: -angle,
        isQuarter: i % 3 === 0,
      };
    });
  }, []);

  // Frame loop for floating physics, gear ticking, and smooth layer interpolation
  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    // 1. Subtle, organic floating oscillation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.06;
      groupRef.current.rotation.y = Math.sin(elapsed * 0.5) * 0.08;
    }

    // 2. Continuous mechanical gear rotation (Tourbillon simulation)
    if (gear1Ref.current) gear1Ref.current.rotation.z += delta * 1.8;
    if (gear2Ref.current) gear2Ref.current.rotation.z -= delta * 1.4;

    // 3. Realistic ticking sweep watch hands
    if (secondHandRef.current) secondHandRef.current.rotation.z -= delta * 2.0;
    if (minuteHandRef.current) minuteHandRef.current.rotation.z -= delta * 0.15;

    // 4. Smooth lerp animation for Exploded / Inspection Mode
    const targetBezelZ = isExploded ? 0.45 : 0;
    const targetCrystalZ = isExploded ? 0.75 : 0;
    const targetDialZ = isExploded ? 0.18 : 0;

    if (bezelLayerRef.current) {
      bezelLayerRef.current.position.z = THREE.MathUtils.lerp(
        bezelLayerRef.current.position.z,
        targetBezelZ,
        delta * 6
      );
    }
    if (crystalLayerRef.current) {
      crystalLayerRef.current.position.z = THREE.MathUtils.lerp(
        crystalLayerRef.current.position.z,
        targetCrystalZ,
        delta * 6
      );
    }
    if (dialLayerRef.current) {
      dialLayerRef.current.position.z = THREE.MathUtils.lerp(
        dialLayerRef.current.position.z,
        targetDialZ,
        delta * 6
      );
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* -------------------- 1. MAIN WATCH CHASSIS & CASE -------------------- */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.28, 64]} />
        <meshStandardMaterial
          color={variant.caseColor}
          metalness={variant.metalness}
          roughness={variant.roughness}
        />
      </mesh>

      {/* Top & Bottom Lug Attachments */}
      {[-1.12, 1.12].map((yOffset, i) => (
        <group key={`lug-${i}`} position={[0, yOffset, -0.02]}>
          <mesh castShadow receiveShadow position={[-0.6, 0, 0]}>
            <boxGeometry args={[0.18, 0.45, 0.24]} />
            <meshStandardMaterial
              color={variant.caseColor}
              metalness={variant.metalness}
              roughness={variant.roughness}
            />
          </mesh>
          <mesh castShadow receiveShadow position={[0.6, 0, 0]}>
            <boxGeometry args={[0.18, 0.45, 0.24]} />
            <meshStandardMaterial
              color={variant.caseColor}
              metalness={variant.metalness}
              roughness={variant.roughness}
            />
          </mesh>
          {/* Lug Spring Bar */}
          <mesh castShadow position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 1.3, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* -------------------- 2. STRAPS (UPPER & LOWER) -------------------- */}
      {[-1.9, 1.9].map((yPos, i) => (
        <mesh
          key={`strap-${i}`}
          position={[0, yPos, -0.06]}
          rotation={[i === 0 ? 0.25 : -0.25, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.08, 1.3, 0.12]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* -------------------- 3. WINDING CROWN & PUSHERS -------------------- */}
      <group position={[1.15, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.22, 32]} />
          <meshStandardMaterial color={variant.caseColor} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Knurled accent ring on crown */}
        <mesh position={[0, 0.06, 0]}>
          <torusGeometry args={[0.125, 0.015, 16, 32]} />
          <meshStandardMaterial color={variant.accentColor} metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Chronograph Pushers */}
      {[-0.6, 0.6].map((angle, i) => (
        <mesh
          key={`pusher-${i}`}
          position={[Math.cos(angle) * 1.1, Math.sin(angle) * 1.1, 0]}
          rotation={[0, 0, angle - Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.07, 0.07, 0.18, 24]} />
          <meshStandardMaterial color={variant.caseColor} metalness={0.9} roughness={0.3} />
        </mesh>
      ))}

      {/* -------------------- 4. EXPLODABLE BEZEL LAYER -------------------- */}
      <group ref={bezelLayerRef} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0.15]} castShadow>
          <torusGeometry args={[1.02, 0.09, 24, 64]} />
          <meshStandardMaterial
            color={variant.caseColor}
            metalness={variant.metalness}
            roughness={Math.max(0.08, variant.roughness - 0.1)}
          />
        </mesh>
      </group>

      {/* -------------------- 5. EXPLODABLE DIAL & MOVEMENT -------------------- */}
      <group ref={dialLayerRef} position={[0, 0, 0]}>
        {/* Dial Face Plate */}
        <mesh position={[0, 0, 0.1]} receiveShadow>
          <cylinderGeometry args={[0.96, 0.96, 0.04, 64]} />
          <meshStandardMaterial
            color={variant.dialColor}
            roughness={0.65}
            metalness={0.4}
          />
        </mesh>

        {/* Outer Minute Track Ring */}
        <mesh position={[0, 0, 0.125]}>
          <ringGeometry args={[0.88, 0.93, 64]} />
          <meshBasicMaterial color="#334155" />
        </mesh>

        {/* 12 Radial Hour Markers */}
        {hourMarkers.map((marker, i) => (
          <mesh
            key={`marker-${i}`}
            position={[marker.x, marker.y, 0.13]}
            rotation={[0, 0, marker.rotZ]}
          >
            <boxGeometry args={[marker.isQuarter ? 0.038 : 0.02, marker.isQuarter ? 0.12 : 0.07, 0.015]} />
            <meshStandardMaterial
              color={marker.isQuarter ? variant.accentColor : '#ffffff'}
              emissive={marker.isQuarter ? variant.accentColor : '#ffffff'}
              emissiveIntensity={marker.isQuarter ? 0.8 : 0.2}
              roughness={0.2}
            />
          </mesh>
        ))}

        {/* Skeleton / Tourbillon Aperture (Open Heart Mechanism) */}
        <group position={[0, -0.32, 0.12]}>
          {/* Escapement Window Rim */}
          <mesh>
            <ringGeometry args={[0.26, 0.3, 32]} />
            <meshStandardMaterial color={variant.accentColor} metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Rotating Tourbillon Gear 1 */}
          <group ref={gear1Ref}>
            <mesh>
              <ringGeometry args={[0.08, 0.25, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.2} />
            </mesh>
          </group>

          {/* Rotating Secondary Pinion Gear 2 */}
          <group ref={gear2Ref} position={[0.09, 0.09, 0.01]}>
            <mesh>
              <ringGeometry args={[0.04, 0.14, 6]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
        </group>

        {/* Chronograph Sub-Dial */}
        <group position={[0, 0.36, 0.12]}>
          <mesh>
            <ringGeometry args={[0.18, 0.21, 32]} />
            <meshBasicMaterial color={variant.accentColor} opacity={0.6} transparent />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.012, 0.14, 0.005]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Center Hub & Hands */}
        <group position={[0, 0, 0.14]}>
          {/* Center Pinion Cap */}
          <mesh position={[0, 0, 0.03]}>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 32]} />
            <meshStandardMaterial color={variant.accentColor} metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Hour Hand */}
          <group rotation={[0, 0, -Math.PI / 3]}>
            <mesh position={[0, 0.24, 0.01]} castShadow>
              <boxGeometry args={[0.038, 0.48, 0.01]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>

          {/* Minute Hand */}
          <group ref={minuteHandRef} rotation={[0, 0, Math.PI / 6]}>
            <mesh position={[0, 0.34, 0.018]} castShadow>
              <boxGeometry args={[0.026, 0.68, 0.01]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>

          {/* High-Frequency Sweep Second Hand */}
          <group ref={secondHandRef}>
            <mesh position={[0, 0.36, 0.025]}>
              <boxGeometry args={[0.01, 0.76, 0.006]} />
              <meshStandardMaterial
                color={variant.accentColor}
                emissive={variant.accentColor}
                emissiveIntensity={0.6}
              />
            </mesh>
            {/* Counterbalance tail */}
            <mesh position={[0, -0.15, 0.025]}>
              <boxGeometry args={[0.018, 0.16, 0.006]} />
              <meshStandardMaterial color={variant.accentColor} />
            </mesh>
          </group>
        </group>
      </group>

      {/* -------------------- 6. EXPLODABLE SAPPHIRE CRYSTAL LENS -------------------- */}
      <group ref={crystalLayerRef} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0.22]}>
          <cylinderGeometry args={[0.96, 0.96, 0.04, 64]} />
          <meshPhysicalMaterial
            roughness={0.05}
            transmission={0.92}
            thickness={0.4}
            ior={1.77} // Physical index of refraction for Sapphire Crystal
            color="#ffffff"
            transparent
            opacity={0.35}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>
      </group>
    </group>
  );
}
