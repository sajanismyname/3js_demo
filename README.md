# AEROCRON X-1: Production React Three Fiber (R3F) 3D Showcase

A modular, production-ready 3D interactive product showcase built with **React**, **Three.js**, **@react-three/fiber (R3F)**, and **@react-three/drei**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies (already executed)
npm install

# 2. Run the local development server (with HMR)
npm run dev

# 3. Build for production deployment
npm run build
```

The application runs on `http://localhost:3000` by default.

---

## 🏛️ Architecture & Component Hierarchy

```
c:/Users/user/3js/
├── index.html                     # HTML shell with typography and viewport bounds
├── vite.config.js                 # Vite bundler config with React plugin
├── package.json                   # React 18, Three.js 0.169, R3F v8, Drei v9
└── src/
    ├── main.jsx                   # React root entry point
    ├── App.jsx                    # Root container: WebGL check, Canvas, Suspense, State
    ├── index.css                  # High-tech glassmorphic styling & responsive layout
    ├── hooks/
    │   └── useWebGLSupport.js     # Robust WebGL 1/2 hardware acceleration detector
    ├── components/
    │   ├── ui/
    │   │   ├── LoadingScreen.jsx  # 2D progress overlay driven by Drei's useProgress
    │   │   ├── WebGLErrorFallback.jsx # Graceful 2D fallback when WebGL is unavailable
    │   │   └── OverlayUI.jsx      # HUD with material selector, turntable & inspect toggles
    │   └── 3d/
    │       ├── Scene.jsx          # Main 3D scene orchestrator
    │       ├── CameraRig.jsx      # PerspectiveCamera + constrained OrbitControls
    │       ├── Lighting.jsx       # Studio 3-point lighting + soft shadows + HDR Environment
    │       ├── Pedestal.jsx       # Ground plane with ContactShadows
    │       └── ProductWatch.jsx   # Procedural mechanical watch with useFrame animation
```

---

## ⚙️ Production Standards & Design Patterns

### 1. Canvas & GPU Safeguards (`App.jsx`)
- **DPR Capping (`dpr={[1, 2]}`)**: Ensures high-DPI (Retina/Mobile) devices render crisp graphics without exceeding 2x resolution, protecting mobile GPUs from thermal throttling and battery drain.
- **Power Preference (`powerPreference: 'high-performance'`)**: Signals the browser to select dedicated GPUs on dual-GPU laptops.
- **WebGL Hardware Guard (`useWebGLSupport`)**: Catches lack of hardware acceleration or browser restrictions and renders a styled 2D fallback instead of a blank or crashed canvas.

### 2. Scene Lighting & Soft Shadows (`Lighting.jsx`)
- **Directional Light Key**: Tuned shadow map resolution (`2048x2048`), shadow bias (`-0.00015`) to eliminate shadow acne, and configured frustum bounds.
- **Secondary Rim Light**: Emphasizes metallic chamfers and silhouettes.
- **Drei `<Environment preset="city" />`**: Provides physically accurate image-based lighting (IBL) and environment reflections for metallic and glass surfaces.

### 3. Camera Rigging & Interaction Limits (`CameraRig.jsx`)
- **Field of View (FOV 42°)**: Realistic telephoto perspective eliminating wide-angle edge distortion.
- **Inertia Damping (`enableDamping`, `dampingFactor={0.05}`)**: Gives orbit controls silky smooth physical momentum.
- **Angle Constraints (`maxPolarAngle={Math.PI / 2 + 0.08}`)**: Clamps rotation above the floor to avoid clipping beneath the ground plane.
- **Distance Clamping (`minDistance={2.2}`, `maxDistance={7.5}`)**: Prevents the user from zooming inside geometry or wandering into empty space.

### 4. Memory Management & Automatic Disposal
- Geometry and material primitives are declared as JSX tags (`<cylinderGeometry>`, `<meshStandardMaterial>`). React Three Fiber automatically tracks and invokes `.dispose()` upon unmounting.
- No memory leaks from imperative `new THREE.Mesh()` declarations.

### 5. Smooth `useFrame` Animation (60-120 FPS)
- All animations (floating chassis oscillation, tourbillon gear movement, ticking watch hands, exploded layer interpolation) are handled inside `useFrame((state, delta) => ...)`.
- Mutations are applied directly to component `ref.current` properties rather than triggering React state updates, avoiding expensive React reconciliation cycles on each frame.
- Frame delta time (`delta`) is multiplied with rotation rates to guarantee identical speed across 60 Hz, 120 Hz, and 144 Hz monitors.

---

## 🔄 How to Replace the Placeholder with your Custom `.glb` / `.gltf` Model

1. **Place your model file**:
   Drop your `.glb` or `.gltf` file into the `public/` folder, e.g.:
   ```
   public/models/watch.glb
   ```

2. **Open `src/components/3d/ProductWatch.jsx`**:
   Import `useGLTF`:
   ```javascript
   import { useGLTF } from '@react-three/drei';
   ```

3. **Preload the model outside the component**:
   ```javascript
   useGLTF.preload('/models/watch.glb');
   ```

4. **Load and render the model**:
   Replace the procedural meshes with:
   ```javascript
   export function ProductWatch({ variant, isExploded, ...props }) {
     const { scene } = useGLTF('/models/watch.glb');
     const groupRef = useRef();

     // Optional: Enable shadows on all child meshes
     useMemo(() => {
       scene.traverse((child) => {
         if (child.isMesh) {
           child.castShadow = true;
           child.receiveShadow = true;
         }
       });
     }, [scene]);

     // Subtle floating animation
     useFrame((state) => {
       const t = state.clock.getElapsedTime();
       if (groupRef.current) {
         groupRef.current.position.y = Math.sin(t * 1.5) * 0.06;
       }
     });

     return (
       <group ref={groupRef} {...props}>
         <primitive object={scene} scale={1.0} />
       </group>
     );
   }
   ```
