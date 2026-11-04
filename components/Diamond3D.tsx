'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/** Round brilliant cut with physically based refraction and dispersion ("fire"). */
function brilliantGeometry(): THREE.BufferGeometry {
  const seg = 16;
  const table = 0.56, crownH = 0.33, girdleR = 1, girdleH = 0.04, pavD = 0.86;
  const pos: number[] = [];
  const ring = (r: number, y: number, off = 0) =>
    Array.from({ length: seg }, (_, i) => {
      const a = ((i + off) / seg) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
    });
  const tbl = ring(table, crownH, 0.5);
  const star = ring(0.78, crownH * 0.62, 0);
  const gTop = ring(girdleR, girdleH / 2, 0.5);
  const gTopMid = ring(girdleR, girdleH / 2, 0);
  const gBot = ring(girdleR, -girdleH / 2, 0.5);
  const gBotMid = ring(girdleR, -girdleH / 2, 0);
  const lower = ring(0.42, -pavD * 0.6, 0);
  const culet = new THREE.Vector3(0, -pavD, 0);
  const top = new THREE.Vector3(0, crownH, 0);
  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  for (let i = 0; i < seg; i++) {
    const n = (i + 1) % seg;
    tri(top, tbl[n], tbl[i]); // table
    tri(tbl[i], tbl[n], star[n]); // star facets
    tri(tbl[i], star[n], gTop[i]); // bezel
    tri(star[n], tbl[n], gTop[n]);
    tri(gTop[i], star[n], gTopMid[n]); // upper girdle
    tri(star[n], gTop[n], gTopMid[n]);
    tri(gTop[i], gTopMid[n], gBotMid[n]); // girdle band
    tri(gTop[i], gBotMid[n], gBot[i]);
    tri(gTopMid[n], gTop[n], gBot[n]);
    tri(gTopMid[n], gBot[n], gBotMid[n]);
    tri(gBot[i], gBotMid[n], lower[n]); // lower girdle
    tri(gBotMid[n], gBot[n], lower[n]);
    tri(gBot[i], lower[n], lower[i]);
    tri(lower[i], lower[n], culet); // pavilion mains
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

export function Diamond3D({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    let cleanup = () => {};
    let cancelled = false;
    // Heavy WebGL setup waits for the browser to be idle so it never blocks first paint or input.
    const hasIdle = typeof window.requestIdleCallback === 'function';
    const handle = hasIdle ? window.requestIdleCallback(start, { timeout: 1200 }) : window.setTimeout(start, 300);

    function start() {
      if (cancelled) return;
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch {
        return;
      }
      const coarse = matchMedia('(pointer: coarse)').matches;
      renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.25 : 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      camera.position.set(0, 1.6, 5.2);
      camera.lookAt(0, 0, 0);

      const geo = brilliantGeometry();
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0, roughness: 0, transmission: 1, thickness: 1.6, ior: 2.42,
        dispersion: 6, specularIntensity: 1, envMapIntensity: 2.2, flatShading: true,
        iridescence: 0.25, iridescenceIOR: 1.6, clearcoat: 1, clearcoatRoughness: 0, side: THREE.DoubleSide,
      });
      const gem = new THREE.Mesh(geo, mat);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 10), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 }));
      const group = new THREE.Group();
      group.add(gem, edges);
      group.rotation.x = 0.32;
      scene.add(group);

      const lights = [0xffffff, 0xffe2b0, 0xbfd8ff].map((c, i) => {
        const l = new THREE.PointLight(c, 18, 12);
        l.userData.phase = i * 2.1;
        scene.add(l);
        return l;
      });

      let w = 0, h = 0, baseX = 0, baseY = 0;
      const resize = () => {
        w = canvas.clientWidth; h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const dist = camera.position.length();
        const visH = 2 * Math.tan((camera.fov * Math.PI) / 360) * dist;
        const visW = visH * camera.aspect;
        if (camera.aspect > 1.1) {
          group.scale.setScalar(Math.min(1.35, visW * 0.21));
          baseX = visW * 0.22; baseY = 0.55;
        } else {
          group.scale.setScalar(Math.min(0.9, visW * 0.36));
          baseX = 0; baseY = visH * 0.3;
        }
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      const mouse = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; };
      window.addEventListener('pointermove', onMove);

      let drag: number | null = null, vel = 0;
      const down = (e: PointerEvent) => { drag = e.clientX; };
      const up = () => { drag = null; };
      const move = (e: PointerEvent) => { if (drag !== null) { vel += (e.clientX - drag) * 0.0012; drag = e.clientX; } };
      canvas.addEventListener('pointerdown', down);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointermove', move);

      let visible = true;
      const io = new IntersectionObserver(([e]) => { visible = e.intersectionRatio > 0.3; }, { threshold: [0, 0.3, 0.6] });
      io.observe(canvas);

      const clock = new THREE.Clock();
      let spin = 0, intro = 0, raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        const t = clock.getElapsedTime();
        intro = Math.min(1, intro + 0.006);
        const e = 1 - Math.pow(1 - intro, 4);
        spin += 0.0035 + vel;
        vel *= 0.94;
        group.rotation.y = spin + (1 - e) * 2.5;
        group.rotation.x += (0.32 + mouse.y * 0.35 - group.rotation.x) * 0.05;
        group.rotation.z += (-mouse.x * 0.2 - group.rotation.z) * 0.05;
        group.position.x = baseX;
        group.position.y = baseY + Math.sin(t * 1.1) * 0.05 - (1 - e) * 0.6;
        gem.scale.setScalar(0.6 + e * 0.4);
        edges.scale.copy(gem.scale);
        lights.forEach((l, i) => {
          const a = t * (0.5 + i * 0.13) + l.userData.phase;
          l.position.set(Math.cos(a) * 3, 1.5 + Math.sin(a * 1.3) * 1.5, Math.sin(a) * 3);
        });
        renderer.render(scene, camera);
      };
      // compile shaders off the main thread where supported, then fade the canvas in
      renderer.compileAsync(scene, camera).catch(() => {}).then(() => {
        if (cancelled) return;
        canvas.style.opacity = '1';
        clock.start();
        loop();
      });

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect(); io.disconnect();
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointermove', move);
        canvas.removeEventListener('pointerdown', down);
        geo.dispose(); mat.dispose(); pmrem.dispose(); renderer.dispose();
      };
    }

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle); else clearTimeout(handle);
      cleanup();
    };
  }, []);

  return <canvas ref={ref} className={className} style={{ opacity: 0, transition: 'opacity 1.6s cubic-bezier(.19,1,.22,1)' }} />;
}
