'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** Round brilliant cut: mirror facets reflecting a high-contrast studio, the way a real stone shows black and white flashes. */
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

/** Bright room with hard softboxes, dark flags and a few tinted panels for the "fire": this contrast is what makes facets sparkle. */
function studioScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9ca0aa);
  const tints = [0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffd9a0, 0xa8c8ff, 0xffb0c8];
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const box = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 110; i++) {
    const flag = i % 3 === 0;
    const color = flag ? new THREE.Color(0x08080a) : new THREE.Color(tints[i % tints.length]).multiplyScalar(3 + rnd() * 9);
    const m = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color }));
    const y = rnd() * 2 - 1, a = rnd() * Math.PI * 2, r = Math.sqrt(1 - y * y);
    m.position.set(Math.cos(a) * r * 9, y * 9, Math.sin(a) * r * 9);
    m.scale.set(0.6 + rnd() * 1.9, 0.6 + rnd() * 1.9, 0.2);
    m.lookAt(0, 0, 0);
    scene.add(m);
  }
  return scene;
}

/** Gold band and four claws for the sapphire ring slide. */
function ringSetting(): { group: THREE.Group; material: THREE.Material; dispose: () => void } {
  const material = new THREE.MeshStandardMaterial({ color: 0xd9b36a, metalness: 1, roughness: 0.16 });
  const group = new THREE.Group();
  const band = new THREE.TorusGeometry(1, 0.075, 20, 120);
  const bandMesh = new THREE.Mesh(band, material);
  bandMesh.position.y = -1.32;
  bandMesh.scale.z = 2; // flat wide shank
  group.add(bandMesh);
  const geos: THREE.BufferGeometry[] = [band];
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2;
    const from = new THREE.Vector3(Math.cos(a) * 0.14, -0.36, Math.sin(a) * 0.14);
    const to = new THREE.Vector3(Math.cos(a) * 0.56, 0.1, Math.sin(a) * 0.56);
    const dir = to.clone().sub(from);
    const claw = new THREE.CylinderGeometry(0.03, 0.05, dir.length(), 10);
    const mesh = new THREE.Mesh(claw, material);
    mesh.position.copy(from).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(up, dir.normalize());
    group.add(mesh);
    geos.push(claw);
  }
  return { group, material, dispose: () => { geos.forEach((g) => g.dispose()); material.dispose(); } };
}

/** Soft contact shadow, so the stone stands on the light background instead of floating on it. */
function shadowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(40,34,26,.3)');
  g.addColorStop(0.5, 'rgba(40,34,26,.08)');
  g.addColorStop(1, 'rgba(40,34,26,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

const WHITE = new THREE.Color(0xffffff);
const SAPPHIRE = new THREE.Color(0x4f78ff);
const SAPPHIRE_GLOW = new THREE.Color(0x10268f);

export function Diamond3D({ className, layout = 'center', slide = 0 }: { className?: string; layout?: 'hero' | 'center'; slide?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const slideRef = useRef(slide);
  const redraw = useRef<() => void>(() => {});
  slideRef.current = slide;
  useEffect(() => { redraw.current(); }, [slide]);

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
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Quality tiers: 'high' = up to 1.75x resolution at full frame rate, 'low' = 1x resolution, 30 fps,
      // 'min' = reduced resolution and 15 fps for devices without real GPU power.
      let tier: 'high' | 'low' | 'min' = coarse ? 'low' : 'high';
      renderer.setPixelRatio(tier === 'high' ? Math.min(devicePixelRatio, 1.75) : 1);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const studio = studioScene();
      scene.environment = pmrem.fromScene(studio, 0.025).texture;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      camera.position.set(0, 1.6, 5.2);
      camera.lookAt(0, 0, 0);

      const geo = brilliantGeometry();
      // the far side of the stone seen through the crown: gives the depth of a real cut without a costly refraction pass
      const innerMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.04, flatShading: true, side: THREE.BackSide });
      const outerMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 1, roughness: 0.03, flatShading: true, transparent: true, opacity: 0.58,
        iridescence: 0.7, iridescenceIOR: 1.8, depthWrite: false,
      });
      const inner = new THREE.Mesh(geo, innerMat);
      const outer = new THREE.Mesh(geo, outerMat);
      const setTier = (next: 'low' | 'min') => {
        tier = next;
        renderer.setPixelRatio(next === 'low' ? 1 : 0.7);
        resize();
      };
      const setting = ringSetting();
      setting.group.visible = false;
      const gem = new THREE.Group();
      gem.add(inner, outer);
      const group = new THREE.Group();
      group.add(gem, setting.group);
      group.rotation.x = 0.02;
      scene.add(group);

      const shadowTex = shadowTexture();
      const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, toneMapped: false });
      const shadowGeo = new THREE.PlaneGeometry(1, 1);
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.visible = layout === 'hero';
      shadow.renderOrder = -1;
      scene.add(shadow);

      const lights = [0xffffff, 0xffe2b0, 0xbfd8ff].map((c, i) => {
        const l = new THREE.PointLight(c, 18, 12);
        l.userData.phase = i * 2.1;
        scene.add(l);
        return l;
      });

      let w = 0, h = 0, baseX = 0, baseY = 0, baseS = 1;
      const resize = () => {
        w = canvas.clientWidth; h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const dist = camera.position.length();
        const visH = 2 * Math.tan((camera.fov * Math.PI) / 360) * dist;
        const visW = visH * camera.aspect;
        const wide = camera.aspect > 1.1;
        if (layout === 'center') { baseS = Math.min(0.9, visW * 0.3, visH * 0.28); baseX = 0; baseY = 0; }
        else if (wide) { baseS = Math.min(0.92, visH * 0.31); baseX = visW * 0.2; baseY = 0.1; }
        else { baseS = Math.min(0.72, visW * 0.3, visH * 0.19); baseX = 0; baseY = visH * 0.2; }
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

      // the page scroll always wins: the gem holds still while the user scrolls
      let scrollingUntil = 0;
      const onScroll = () => { scrollingUntil = performance.now() + 160; };
      window.addEventListener('scroll', onScroll, { passive: true });

      let visible = true;
      const io = new IntersectionObserver(([e]) => { visible = e.intersectionRatio > 0.3; }, { threshold: [0, 0.3, 0.6] });
      io.observe(canvas);

      const clock = new THREE.Clock();
      let spin = 0, intro = 0, raf = 0, last = 0, morph = slideRef.current;
      // slide 2 turns the stone into a sapphire set in a gold ring
      const pose = () => {
        const s = baseS * (1 - 0.08 * morph);
        group.scale.setScalar(s);
        group.position.x = baseX;
        const color = WHITE.clone().lerp(SAPPHIRE, morph);
        innerMat.color.copy(color);
        outerMat.color.copy(color);
        innerMat.emissive.copy(SAPPHIRE_GLOW).multiplyScalar(morph);
        setting.group.visible = morph > 0.01;
        setting.group.scale.setScalar(0.85 + morph * 0.15);
        (setting.material as THREE.MeshStandardMaterial).opacity = morph;
        setting.material.transparent = morph < 0.99;
        const lift = morph * 1.05 * s;
        shadow.position.set(baseX, baseY - 1.3 * baseS, 0);
        shadow.scale.setScalar(baseS * 2.5);
        return lift;
      };
      // frame-time probe: after ~1 s at a tier, step down if frames are too slow
      let probeStart = 0, probeFrames = 0, probeSum = 0;
      const probe = (now: number, frameMs: number) => {
        if (tier === 'min') return;
        if (!probeStart) { probeStart = now; return; }
        probeFrames++; probeSum += frameMs;
        if (now - probeStart < 1000 || probeFrames < 4) return;
        const avg = probeSum / probeFrames;
        const limit = tier === 'high' ? 24 : 45; // high must hold ~40+ fps, low ~22+ fps (its cap is 30)
        if (avg > limit) {
          const next = tier === 'high' ? 'low' : 'min';
          setTier(next);
          if (next === 'low') { probeStart = 0; probeFrames = 0; probeSum = 0; return; } // probe the new tier too
        }
        probeStart = Infinity; // settled
      };
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden || now < scrollingUntil) { last = 0; return; }
        const cap = tier === 'high' ? 0 : tier === 'low' ? 31 : 64;
        if (last && now - last < cap) return;
        const frameMs = last ? now - last : 0;
        const dt = last ? Math.min(4, frameMs / 16.67) : 1; // animation speed independent of frame rate
        if (last) probe(now, frameMs);
        last = now;
        const t = clock.getElapsedTime();
        intro = Math.min(1, intro + 0.006 * dt);
        const e = 1 - Math.pow(1 - intro, 4);
        spin += (0.0035 + vel) * dt;
        vel *= Math.pow(0.94, dt);
        const k = 1 - Math.pow(0.95, dt);
        // the stone turns; the ring sways facing the viewer so the band never shows edge-on
        const sway = 0.55 + Math.sin(t * 0.5) * 0.35;
        group.rotation.y = (spin % (Math.PI * 2)) * (1 - morph) + sway * morph + (1 - e) * 2.5;
        group.rotation.x += (0.02 + morph * 0.26 + mouse.y * 0.3 - group.rotation.x) * k;
        group.rotation.z += (-mouse.x * 0.2 - group.rotation.z) * k;
        morph += (slideRef.current - morph) * (1 - Math.pow(0.93, dt));
        const lift = pose();
        group.position.y = baseY + lift + Math.sin(t * 1.1) * 0.04 - (1 - e) * 0.6;
        gem.scale.setScalar((0.6 + e * 0.4) * (1 - 0.42 * morph));
        gem.rotation.y = spin * morph;
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
        if (reduced) {
          // no motion: the slide change is applied at once
          redraw.current = () => { morph = slideRef.current; group.position.y = baseY + pose(); renderer.render(scene, camera); };
          redraw.current();
          return;
        }
        raf = requestAnimationFrame(loop);
      });

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect(); io.disconnect();
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('scroll', onScroll);
        canvas.removeEventListener('pointerdown', down);
        geo.dispose(); innerMat.dispose(); outerMat.dispose(); setting.dispose();
        shadowGeo.dispose(); shadowMat.dispose(); shadowTex.dispose();
        studio.traverse((o) => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose(); } });
        pmrem.dispose(); renderer.dispose();
      };
    }

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle); else clearTimeout(handle);
      cleanup();
    };
  }, [layout]);

  return <canvas ref={ref} className={className} style={{ opacity: 0, transition: 'opacity 1.6s cubic-bezier(.19,1,.22,1)' }} />;
}
