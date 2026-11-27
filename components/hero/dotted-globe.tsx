'use client'

import { geoEquirectangular, geoInterpolate, geoPath } from 'd3-geo'
import { useEffect, useRef } from 'react'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import landTopology from 'world-atlas/land-110m.json'

type City = { name: string; lat: number; lng: number }

const CITIES: City[] = [
  { name: 'Almaty', lat: 43.24, lng: 76.89 },
  { name: 'Astana', lat: 51.17, lng: 71.43 },
  { name: 'Tashkent', lat: 41.3, lng: 69.24 },
  { name: 'Bishkek', lat: 42.87, lng: 74.59 },
  { name: 'Moscow', lat: 55.75, lng: 37.62 },
  { name: 'Baku', lat: 40.41, lng: 49.87 },
  { name: 'Tbilisi', lat: 41.72, lng: 44.79 },
  { name: 'Istanbul', lat: 41.01, lng: 28.98 },
  { name: 'Dubai', lat: 25.2, lng: 55.27 },
  { name: 'Riyadh', lat: 24.71, lng: 46.68 },
  { name: 'Cairo', lat: 30.04, lng: 31.23 },
  { name: 'Berlin', lat: 52.52, lng: 13.4 },
  { name: 'Warsaw', lat: 52.23, lng: 21.01 },
  { name: 'Paris', lat: 48.85, lng: 2.35 },
  { name: 'London', lat: 51.5, lng: -0.12 },
  { name: 'Mumbai', lat: 19.07, lng: 72.88 },
  { name: 'Singapore', lat: 1.35, lng: 103.8 },
  { name: 'Seoul', lat: 37.56, lng: 126.97 },
  { name: 'Tokyo', lat: 35.68, lng: 139.69 },
  { name: 'Novosibirsk', lat: 55.03, lng: 82.92 },
]

const ROUTES: [string, string][] = [
  ['Almaty', 'Moscow'],
  ['Almaty', 'Dubai'],
  ['Almaty', 'Tashkent'],
  ['Almaty', 'Seoul'],
  ['Astana', 'Berlin'],
  ['Astana', 'Istanbul'],
  ['Astana', 'Novosibirsk'],
  ['Tashkent', 'Mumbai'],
  ['Bishkek', 'Tokyo'],
  ['Moscow', 'London'],
  ['Moscow', 'Baku'],
  ['Baku', 'Riyadh'],
  ['Tbilisi', 'Warsaw'],
  ['Istanbul', 'Paris'],
  ['Dubai', 'Singapore'],
  ['Dubai', 'Cairo'],
  ['Novosibirsk', 'Seoul'],
  ['Mumbai', 'Singapore'],
]

const DEG = Math.PI / 180
const CENTER_LAT = 28 * DEG
const ARC_SAMPLES = 56
const RED = '224,32,47'

type Arc = { points: [number, number, number][]; offset: number; duration: number }

function buildLandDots(count: number) {
  const width = 720
  const height = 360
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return new Float32Array(0)

  const topology = landTopology as unknown as Topology<{ land: GeometryCollection }>
  const land = feature(topology, topology.objects.land)
  const projection = geoEquirectangular().scale(width / (2 * Math.PI)).translate([width / 2, height / 2])
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  geoPath(projection, ctx)(land)
  ctx.fill()
  const pixels = ctx.getImageData(0, 0, width, height).data

  const dots: number[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const lat = Math.asin(y)
    const lng = ((i * golden) % (2 * Math.PI)) - Math.PI
    const px = Math.floor(((lng / DEG + 180) / 360) * width) % width
    const py = Math.min(height - 1, Math.floor(((90 - lat / DEG) / 180) * height))
    if (pixels[(py * width + px) * 4 + 3] > 128) dots.push(lat, lng)
  }
  return new Float32Array(dots)
}

function buildArcs(): Arc[] {
  const byName = new Map(CITIES.map((c) => [c.name, c]))
  return ROUTES.map(([from, to], i) => {
    const a = byName.get(from)!
    const b = byName.get(to)!
    const interpolate = geoInterpolate([a.lng, a.lat], [b.lng, b.lat])
    const distance = Math.hypot(a.lng - b.lng, a.lat - b.lat) / 180
    const lift = 0.05 + distance * 0.35
    const points: [number, number, number][] = []
    for (let s = 0; s <= ARC_SAMPLES; s++) {
      const t = s / ARC_SAMPLES
      const [lng, lat] = interpolate(t)
      points.push([lat * DEG, lng * DEG, Math.sin(Math.PI * t) * lift])
    }
    return { points, offset: (i * 0.618) % 1, duration: 2.6 + (i % 4) * 0.5 }
  })
}

export default function DottedGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compact = window.innerWidth < 640
    const landDots = buildLandDots(compact ? 12000 : 24000)
    const arcs = buildArcs()
    const sinC = Math.sin(CENTER_LAT)
    const cosC = Math.cos(CENTER_LAT)

    let size = 0
    let frame = 0
    let visible = true
    let rotation = -62 * DEG
    let time = 0
    let last = performance.now()
    const pointer = { x: 0, target: 0 }

    const project = (lat: number, lng: number, altitude: number, cx: number, cy: number, radius: number) => {
      const cosLat = Math.cos(lat)
      const dl = lng + rotation
      const x = cosLat * Math.sin(dl)
      const y = cosC * Math.sin(lat) - sinC * cosLat * Math.cos(dl)
      const z = sinC * Math.sin(lat) + cosC * cosLat * Math.cos(dl)
      const scale = radius * (1 + altitude)
      const visibleSide = z > 0 || (x * x + y * y) * (1 + altitude) * (1 + altitude) > 1
      return { sx: cx + x * scale, sy: cy - y * scale, z, visible: visibleSide }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      size = canvas.getBoundingClientRect().width
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduceMotion) draw()
    }

    const draw = () => {
      const cx = size / 2
      const cy = size / 2
      const radius = size * 0.4
      ctx.clearRect(0, 0, size, size)

      const atmosphere = ctx.createRadialGradient(cx, cy, radius * 0.92, cx, cy, radius * 1.28)
      atmosphere.addColorStop(0, `rgba(${RED},0.45)`)
      atmosphere.addColorStop(0.25, `rgba(${RED},0.16)`)
      atmosphere.addColorStop(1, `rgba(${RED},0)`)
      ctx.fillStyle = atmosphere
      ctx.fillRect(0, 0, size, size)

      const body = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.4, radius * 0.1, cx, cy, radius)
      body.addColorStop(0, '#1a1214')
      body.addColorStop(1, '#070707')
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = `rgba(${RED},0.55)`
      ctx.lineWidth = 1
      ctx.stroke()

      const dotSize = Math.max(1.1, size / 700)
      ctx.fillStyle = '#ffffff'
      for (let i = 0; i < landDots.length; i += 2) {
        const p = project(landDots[i], landDots[i + 1], 0, cx, cy, radius)
        if (p.z <= 0) continue
        ctx.globalAlpha = 0.12 + p.z * 0.6
        ctx.fillRect(p.sx, p.sy, dotSize, dotSize)
      }

      ctx.lineCap = 'round'
      for (const arc of arcs) {
        const progress = reduceMotion ? 0.7 : ((time / arc.duration + arc.offset) % 1.6) / 1.2
        ctx.globalAlpha = 1
        ctx.strokeStyle = `rgba(${RED},0.18)`
        ctx.lineWidth = 1
        ctx.beginPath()
        let started = false
        for (const [lat, lng, alt] of arc.points) {
          const p = project(lat, lng, alt, cx, cy, radius)
          if (!p.visible) {
            started = false
            continue
          }
          if (started) ctx.lineTo(p.sx, p.sy)
          else ctx.moveTo(p.sx, p.sy)
          started = true
        }
        ctx.stroke()

        if (progress > 1) continue
        const head = Math.floor(progress * ARC_SAMPLES)
        const tail = Math.max(0, head - 14)
        for (let s = tail; s < head; s++) {
          const a = project(arc.points[s][0], arc.points[s][1], arc.points[s][2], cx, cy, radius)
          const b = project(arc.points[s + 1][0], arc.points[s + 1][1], arc.points[s + 1][2], cx, cy, radius)
          if (!a.visible || !b.visible) continue
          const strength = (s - tail + 1) / (head - tail)
          ctx.strokeStyle = strength > 0.85 ? `rgba(255,220,222,${strength})` : `rgba(${RED},${strength})`
          ctx.lineWidth = 1 + strength * 1.6
          ctx.beginPath()
          ctx.moveTo(a.sx, a.sy)
          ctx.lineTo(b.sx, b.sy)
          ctx.stroke()
        }
      }

      for (let i = 0; i < CITIES.length; i++) {
        const city = CITIES[i]
        const p = project(city.lat * DEG, city.lng * DEG, 0.005, cx, cy, radius)
        if (p.z <= 0.05) continue
        const pulse = reduceMotion ? 0.5 : (time * 0.55 + i * 0.13) % 1
        ctx.globalAlpha = (1 - pulse) * p.z
        ctx.strokeStyle = `rgb(${RED})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, 2 + pulse * 12, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 0.5 + p.z * 0.5
        ctx.fillStyle = `rgb(${RED})`
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, 2.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, 1, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (now: number) => {
      const dt = Math.min(64, now - last) / 1000
      last = now
      if (visible) {
        time += dt
        pointer.x += (pointer.target - pointer.x) * 0.05
        rotation -= dt * 0.06
        const base = rotation
        rotation = base + pointer.x * 0.25
        draw()
        rotation = base
      }
      frame = requestAnimationFrame(loop)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.target = (event.clientX / window.innerWidth - 0.5) * 2
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    visibilityObserver.observe(canvas)
    resize()

    if (reduceMotion) {
      draw()
    } else {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      frame = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="block aspect-square w-full animate-in fade-in duration-1000" />
}
