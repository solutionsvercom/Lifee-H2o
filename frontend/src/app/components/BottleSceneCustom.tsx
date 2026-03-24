import React, { memo, useEffect, useRef } from "react";
import * as THREE from "three";

interface BottleSceneCustomProps {
  labelBg: string[];
  nameText: string;
  subText: string;
  accentColor: string;
  bottomText: string;
  autoRotate?: boolean;
}

function buildLabelTexture({
  labelBg,
  nameText,
  subText,
  accentColor,
  bottomText,
}: BottleSceneCustomProps): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    fallback.needsUpdate = true;
    return fallback;
  }

  const fitName = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length <= 12) return { text: trimmed, font: "800 110px 'Segoe UI', Arial, sans-serif" };
    if (trimmed.length <= 18) return { text: trimmed, font: "800 86px 'Segoe UI', Arial, sans-serif" };
    return { text: `${trimmed.slice(0, 20)}...`, font: "800 76px 'Segoe UI', Arial, sans-serif" };
  };
  const fitLine = (value: string, max: number) => {
    const trimmed = value.trim();
    return trimmed.length > max ? `${trimmed.slice(0, max)}...` : trimmed;
  };

  const gradient = ctx.createLinearGradient(0, 0, 1024, 0);
  const stops = Math.max(labelBg.length - 1, 1);
  labelBg.forEach((color, idx) => {
    gradient.addColorStop(idx / stops, color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 640);

  const topHighlight = ctx.createLinearGradient(0, 0, 0, 220);
  topHighlight.addColorStop(0, "rgba(255,255,255,0.24)");
  topHighlight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = topHighlight;
  ctx.fillRect(0, 0, 1024, 220);

  // Keep text dark and high-contrast for stronger readability and premium look.
  const darkText = "#111827";
  const dividerColor = accentColor.toLowerCase() === "#ffffff" ? "#1f2937" : accentColor;
  ctx.textAlign = "left";
  ctx.shadowColor = "rgba(255,255,255,0.18)";
  ctx.shadowBlur = 6;
  ctx.fillStyle = darkText;
  const fittedName = fitName(nameText || "LIFEE");
  ctx.font = fittedName.font;
  ctx.fillText(fittedName.text, 88, 178);
  ctx.shadowBlur = 0;

  ctx.fillStyle = darkText;
  ctx.font = "600 42px 'Trebuchet MS', Arial, sans-serif";
  ctx.fillText(fitLine(subText || "Special Edition", 28), 92, 246);

  ctx.strokeStyle = dividerColor;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(92, 286);
  ctx.lineTo(932, 286);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = darkText;
  ctx.font = "900 142px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("1L", 512, 430);

  ctx.beginPath();
  ctx.moveTo(164, 454);
  ctx.lineTo(860, 454);
  ctx.stroke();

  ctx.font = "700 40px 'Trebuchet MS', Arial, sans-serif";
  ctx.fillText(fitLine(bottomText || "PREMIUM WATER", 30), 512, 536);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function BottleSceneCustom(props: BottleSceneCustomProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  const labelTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const labelMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const W = Math.max(container.clientWidth, 200);
    const H = Math.max(container.clientHeight, 280);
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
    camera.position.set(0, -0.3, 9);
    camera.lookAt(0, -0.3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x4488aa, 2.5));
    const backHalo = new THREE.PointLight(0xffffff, 10, 25);
    backHalo.position.set(0, 1.5, -6);
    scene.add(backHalo);

    const keyLight = new THREE.DirectionalLight(0xd0eeff, 2.5);
    keyLight.position.set(1, 4, 10);
    scene.add(keyLight);

    const rimL = new THREE.DirectionalLight(0x66aacc, 1.5);
    rimL.position.set(-6, 2, 3);
    scene.add(rimL);

    const rimR = new THREE.DirectionalLight(0x66aacc, 1.5);
    rimR.position.set(6, 2, 3);
    scene.add(rimR);

    const topPt = new THREE.PointLight(0xffffff, 2, 20);
    topPt.position.set(0, 10, 4);
    scene.add(topPt);

    const G = new THREE.Group();
    G.scale.set(1.6, 1, 1.6);
    scene.add(G);

    const shape = [
      [0.0, -3.7], [0.01, -3.7], [0.38, -3.68], [0.54, -3.55], [0.6, -3.38],
      [0.62, -3.1], [0.58, -2.88], [0.62, -2.66], [0.58, -2.44], [0.62, -2.22],
      [0.58, -2.0], [0.62, -1.78], [0.62, -1.4], [0.62, 1.3], [0.6, 1.62],
      [0.52, 1.98], [0.4, 2.28], [0.28, 2.56], [0.23, 2.7], [0.21, 2.88],
      [0.21, 3.1], [0.235, 3.15], [0.235, 3.26], [0.21, 3.3], [0.21, 3.4],
    ].map(([x, y]) => new THREE.Vector2(x, y));

    const bottleGeo = new THREE.LatheGeometry(shape, 96);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xb8ddf5,
      transparent: true,
      opacity: 0.32,
      roughness: 0.03,
      metalness: 0.0,
      transmission: 0.88,
      thickness: 0.4,
      ior: 1.49,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      side: THREE.DoubleSide,
    });
    G.add(new THREE.Mesh(bottleGeo, glassMat));

    const waterShape = [
      [0.0, -3.68], [0.55, -3.58], [0.57, -3.1], [0.53, -2.88], [0.57, -2.66],
      [0.53, -2.44], [0.57, -2.22], [0.53, -2.0], [0.57, -1.78], [0.57, -1.4],
      [0.57, -1.1], [0.57, -0.8], [0.57, -0.5], [0.57, -0.22], [0.55, -0.06],
      [0.0, -0.06],
    ].map(([x, y]) => new THREE.Vector2(x, y));

    const waterGeo = new THREE.LatheGeometry(waterShape, 96);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x2f9fd6,
      transparent: true,
      opacity: 0.82,
      roughness: 0.0,
      transmission: 0.4,
      thickness: 2.2,
      ior: 1.33,
      side: THREE.FrontSide,
    });
    G.add(new THREE.Mesh(waterGeo, waterMat));

    const labelTex = buildLabelTexture(propsRef.current);
    labelTextureRef.current = labelTex;
    const labelGeo = new THREE.CylinderGeometry(0.625, 0.625, 2.1, 96, 1, true);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTex,
      roughness: 0.25,
      side: THREE.FrontSide,
    });
    labelMaterialRef.current = labelMat;
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = -0.25;
    // Keep the readable face of the label toward the camera.
    labelMesh.rotation.y = Math.PI / 2;
    G.add(labelMesh);

    const capMat = new THREE.MeshPhysicalMaterial({
      color: 0x18263f,
      roughness: 0.3,
      metalness: 0.15,
      clearcoat: 0.9,
    });
    const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x243560, roughness: 0.5 });
    const capGroup = new THREE.Group();
    capGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.235, 0.44, 64), capMat));
    const topDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.235, 0.04, 64), capMat);
    topDisc.position.y = 0.24;
    capGroup.add(topDisc);
    for (let i = 0; i < 24; i++) {
      const r = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.42, 0.024), ridgeMat);
      const a = (i / 24) * Math.PI * 2;
      r.position.set(Math.cos(a) * 0.24, 0, Math.sin(a) * 0.24);
      r.rotation.y = -a;
      capGroup.add(r);
    }
    capGroup.position.y = 3.57;
    G.add(capGroup);

    const hlMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const hl1 = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 7.6), hlMat);
    hl1.position.set(0.5, 0.1, 0.37);
    hl1.rotation.y = -0.65;
    G.add(hl1);
    const hl2 = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 7.6), hlMat);
    hl2.position.set(0.42, 0.1, 0.46);
    hl2.rotation.y = -0.55;
    G.add(hl2);

    const dropMat = new THREE.MeshPhysicalMaterial({
      color: 0x88ccee,
      transparent: true,
      opacity: 0.6,
      roughness: 0.0,
      transmission: 0.55,
      ior: 1.33,
    });
    const rng = (s: number) => Math.abs(Math.sin(s * 127.1 + 311.7));
    for (let i = 0; i < 38; i++) {
      const s = rng(i) * 0.042 + 0.012;
      const d = new THREE.Mesh(new THREE.SphereGeometry(s, 8, 8), dropMat);
      const a = rng(i + 50) * Math.PI * 2;
      d.position.set(Math.cos(a) * 0.635, (rng(i + 100) - 0.5) * 7.0, Math.sin(a) * 0.635);
      G.add(d);
    }

    const refl = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 2.5),
      new THREE.MeshBasicMaterial({
        color: 0x2255aa,
        transparent: true,
        opacity: 0.1,
        depthWrite: false,
      })
    );
    refl.rotation.x = -Math.PI / 2;
    refl.position.y = -3.72;
    scene.add(refl);

    let targetRotation = 0;
    let dragVelocity = 0;
    let pointerDown = false;
    let previousX = 0;
    let animId = 0;
    const clock = new THREE.Clock();

    const onPointerDown = (event: PointerEvent) => {
      pointerDown = true;
      previousX = event.clientX;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointerDown) return;
      const delta = event.clientX - previousX;
      previousX = event.clientX;
      dragVelocity = delta * 0.0024;
      targetRotation += dragVelocity;
    };
    const onPointerUp = () => {
      pointerDown = false;
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const animate = () => {
      animId = window.requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (propsRef.current.autoRotate ?? true) {
        targetRotation += 0.0026;
      }
      G.rotation.y += (targetRotation - G.rotation.y) * 0.09;
      G.position.y = Math.sin(t * 0.7) * 0.08;
      dragVelocity *= 0.92;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(container);
    window.addEventListener("resize", onResize);

    const disposeScene = () => {
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        const material = (mesh as THREE.Mesh).material;
        if (Array.isArray(material)) {
          material.forEach((mat) => {
            const m = mat as THREE.Material & { map?: THREE.Texture | null };
            if (m.map) m.map.dispose();
            m.dispose();
          });
        } else if (material) {
          const m = material as THREE.Material & { map?: THREE.Texture | null };
          if (m.map) m.map.dispose();
          m.dispose();
        }
      });
    };

    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      disposeScene();
      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const existingTexture = labelTextureRef.current;
    const existingMaterial = labelMaterialRef.current;
    if (!existingTexture || !existingMaterial) return;

    const nextTexture = buildLabelTexture(props);
    existingMaterial.map = nextTexture;
    existingMaterial.needsUpdate = true;
    labelTextureRef.current = nextTexture;
    existingTexture.dispose();
  }, [props.labelBg, props.nameText, props.subText, props.accentColor, props.bottomText]);

  return <div ref={mountRef} className="absolute inset-0 h-full w-full" />;
}

export default memo(BottleSceneCustom);
