/* Original diagram renderers. Canvas 2D draws projected 3D geometry: no WebGL,
   external library, remote assets, or continuous render loop while idle.
   Every scene is a deterministic function of progress in [0, 1]. */
const clamp = value => Math.min(1, Math.max(0, value));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = t => t * t * (3 - 2 * t);
const phase = t => smooth(clamp((t - .1) / .8));
const TAU = Math.PI * 2;

function circle(ctx, x, y, radius, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha *= clamp(alpha);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(.01, radius), 0, TAU);
  ctx.fill();
  ctx.restore();
}
function line(ctx, x1, y1, x2, y2, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
function box(ctx, x, y, width, height, palette, fill = true) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 5);
  if (fill) { ctx.fillStyle = palette.paper; ctx.fill(); }
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  ctx.stroke();
}
function viewport(ctx, palette, draw) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(18, 10, 204, 124, 5);
  ctx.clip();
  draw();
  ctx.restore();
  box(ctx, 18, 10, 204, 124, palette, false);
}
function scrollScene(ctx, id, t, p) {
  viewport(ctx, p, () => {
    if (id === 'scroll-parallax') {
      // The three depth layers travel different distances for the same scroll.
      [p.gold, p.teal, p.red].forEach((color, i) => {
        const y = mix(105 + i * 22, 55 - i * 38, t);
        circle(ctx, 72 + i * 49, y, 26 - i * 5, color, .5 + i * .25);
      });
    } else if (id === 'scroll-scrub') {
      line(ctx, 42, 72, 198, 72, p.line);
      [p.red, p.teal, p.gold].forEach((color, i) => {
        const angle = i * TAU / 3 + t * Math.PI;
        circle(ctx, mix(65 + i * 55, 120 + Math.cos(angle) * 42, t),
          mix(72, 72 + Math.sin(angle) * 42, t), 13, color);
      });
    } else if (id === 'scroll-pin') {
      for (let i = 0; i < 6; i++) {
        const y = 32 + i * 49 - t * 196;
        circle(ctx, 162, y, 10, i % 2 ? p.gold : p.teal, .65);
        line(ctx, 183, y, 208, y, p.line);
      }
      const y = t < .22 ? mix(101, 47, t / .22) : t > .8 ? mix(47, -10, (t - .8) / .2) : 47;
      circle(ctx, 80, y, 22, p.red);
      line(ctx, 45, 24, 110, 24, p.line);
    } else if (id === 'scroll-horizontal') {
      [p.red, p.teal, p.gold].forEach((color, i) => {
        const x = 120 + i * 170 - t * 340;
        box(ctx, x - 67, 29, 134, 86, p);
        circle(ctx, x, 72, 24, color);
      });
    } else if (id === 'scroll-reveal') {
      [p.red, p.teal, p.gold].forEach((color, i) => {
        const y = 118 + i * 49 - t * 210;
        const visible = clamp((125 - y) / 40);
        circle(ctx, 120, y, 17 * mix(.65, 1, visible), color, visible);
      });
    } else if (id === 'scroll-stack') {
      [p.red, p.teal, p.gold].forEach((color, i) => {
        const arrived = i === 0 ? 1 : clamp((t * 2.8 - (i - 1)) * 1.4);
        const recede = clamp(t * 3 - i - 1);
        const width = 146 - recede * 14;
        const y = mix(153, 36 + i * 6, arrived) - recede * 5;
        box(ctx, 120 - width / 2, y, width, 78, p);
        circle(ctx, 120, y + 39, 19 - recede * 2, color);
      });
    }
  });
  line(ctx, 232, 19, 232, 125, p.line);
  circle(ctx, 232, mix(23, 121, t), 3, p.teal);
}

function page(ctx, palette, color, { x = 24, y = 17, scale = 1, alpha = 1 } = {}) {
  ctx.save();
  ctx.globalAlpha *= clamp(alpha);
  ctx.translate(x + 96, y + 55);
  ctx.scale(scale, scale);
  box(ctx, -96, -55, 192, 110, palette);
  circle(ctx, -39, 0, 22, color);
  circle(ctx, 26, -17, 9, color, .45);
  circle(ctx, 52, 17, 14, color, .7);
  line(ctx, -74, -36, 74, -36, palette.line);
  ctx.restore();
}
function navigationScene(ctx, id, t, p) {
  const q = phase(t);
  viewport(ctx, p, () => {
    if (id === 'nav-push') {
      page(ctx, p, p.red, { x: 24 - q * 204 });
      page(ctx, p, p.teal, { x: 24 + (1 - q) * 204 });
    } else if (id === 'nav-cover') {
      page(ctx, p, p.red);
      page(ctx, p, p.teal, { y: 17 + (1 - q) * 120 });
    } else if (id === 'nav-axis') {
      page(ctx, p, p.red, { scale: mix(1, 1.3, q), alpha: 1 - clamp(q * 2) });
      page(ctx, p, p.teal, { scale: mix(.65, 1, q), alpha: clamp((q - .2) / .8) });
    } else if (id === 'nav-fade-through') {
      page(ctx, p, p.red, { alpha: 1 - clamp(q / .35) });
      const enter = clamp((q - .4) / .6);
      page(ctx, p, p.teal, { scale: mix(.92, 1, enter), alpha: enter });
    } else if (id === 'nav-container') {
      box(ctx, 24, 17, 192, 110, p, false);
      circle(ctx, 169, 45, 12, p.gold, 1 - q);
      circle(ctx, 169, 96, 12, p.teal, 1 - q);
      const x = mix(39, 24, q), y = mix(42, 17, q);
      const w = mix(64, 192, q), h = mix(60, 110, q);
      box(ctx, x, y, w, h, p);
      circle(ctx, mix(71, 81, q), 72, mix(16, 22, q), p.red);
      circle(ctx, 146, 55, 9, p.teal, q);
      circle(ctx, 172, 89, 14, p.gold, q);
    } else if (id === 'nav-iris') {
      page(ctx, p, p.red);
      ctx.save();
      ctx.beginPath(); ctx.arc(81, 72, .01 + q * 172, 0, TAU); ctx.clip();
      page(ctx, p, p.teal);
      ctx.restore();
    }
  });
}

// Perspective projection. Positive z points into the scene. Moving the camera
// changes relative depth; changing focal length scales the same perspective.
function project(point, camera = {}) {
  const { x = 0, y = 0, z = 0, yaw = 0, pitch = 0, roll = 0, focal = 180 } = camera;
  const dx = point[0] - x, dy = point[1] - y, dz = point[2] - z;
  const xx = Math.cos(yaw) * dx - Math.sin(yaw) * dz;
  const zz = Math.sin(yaw) * dx + Math.cos(yaw) * dz;
  const yy = Math.cos(pitch) * dy - Math.sin(pitch) * zz;
  const depth = Math.sin(pitch) * dy + Math.cos(pitch) * zz;
  if (depth < 15) return null;
  const rx = Math.cos(roll) * xx + Math.sin(roll) * yy;
  const ry = -Math.sin(roll) * xx + Math.cos(roll) * yy;
  return { x: 120 + rx * focal / depth, y: 72 + ry * focal / depth, scale: focal / depth, depth };
}
function worldLine(ctx, a, b, camera, p) {
  const pa = project(a, camera), pb = project(b, camera);
  if (pa && pb) line(ctx, pa.x, pa.y, pb.x, pb.y, p.line);
}
function floor(ctx, camera, p) {
  [-240, -120, 0, 120, 240].forEach(x => worldLine(ctx, [x, 76, 140], [x, 76, 820], camera, p));
  [170, 260, 380, 540, 780].forEach(z => worldLine(ctx, [-300, 76, z], [300, 76, z], camera, p));
}
function spheres(ctx, objects, camera, focus = null) {
  const projected = objects.map(object => ({ ...object, view: project(object.position, camera) }))
    .filter(object => object.view).sort((a, b) => b.view.depth - a.view.depth);
  projected.forEach(({ view, radius, color }) => {
    ctx.save();
    if (focus !== null) ctx.filter = `blur(${Math.min(5, Math.abs(view.depth - focus) / 65)}px)`;
    circle(ctx, view.x, view.y, radius * view.scale, color);
    ctx.restore();
  });
}
function cameraScene(ctx, id, t, p) {
  const q = phase(t);
  const camera = {};
  let focus = null;
  // A central subject and two distant landmarks make perspective changes legible.
  const objects = [
    { position: [0, 0, 260], radius: 25, color: p.red },
    { position: [-142, -44, 480], radius: 38, color: p.teal },
    { position: [161, 24, 550], radius: 45, color: p.gold },
  ];
  if (id === 'camera-pan') camera.yaw = mix(-.2, .2, q);
  if (id === 'camera-tilt') camera.pitch = mix(-.16, .16, q);
  if (id === 'camera-truck') camera.x = mix(-58, 58, q);
  if (id === 'camera-pedestal') camera.y = mix(48, -48, q);
  if (id === 'camera-dolly') camera.z = q * 115;
  if (id === 'camera-pull-out') camera.z = mix(100, -70, q);
  if (id === 'camera-zoom') camera.focal = mix(180, 310, q);
  if (id === 'camera-dolly-zoom') {
    camera.z = q * 135;
    // f / subject distance stays constant, so the red subject holds its size.
    camera.focal = 180 * (260 - camera.z) / 260;
  }
  if (id === 'camera-orbit') {
    const angle = mix(-.43, .43, q);
    camera.x = Math.sin(angle) * 260;
    camera.z = 260 - Math.cos(angle) * 260;
    camera.yaw = -angle;
  }
  if (id === 'camera-roll') camera.roll = q * Math.PI / 3;
  if (id === 'camera-focus') focus = mix(260, 510, q);
  if (id === 'camera-handheld') {
    camera.yaw = Math.sin(t * 19) * .018 + Math.sin(t * 43) * .005;
    camera.pitch = Math.sin(t * 23) * .01;
    camera.roll = Math.sin(t * 14) * .012;
  }
  viewport(ctx, p, () => {
    floor(ctx, camera, p);
    spheres(ctx, objects, camera, focus);
  });
  // The frame is stationary while the view within it moves.
  line(ctx, 115, 72, 125, 72, p.line);
  line(ctx, 120, 67, 120, 77, p.line);
}

function rotate(point, rx, ry) {
  const [x, y, z] = point;
  const yy = y * Math.cos(rx) - z * Math.sin(rx);
  const zz = y * Math.sin(rx) + z * Math.cos(rx);
  return [x * Math.cos(ry) + zz * Math.sin(ry), yy, -x * Math.sin(ry) + zz * Math.cos(ry)];
}
function disc(ctx, center, radius, rx, ry, color) {
  const points = Array.from({ length: 49 }, (_, i) => {
    const a = i / 48 * TAU;
    const r = rotate([Math.cos(a) * radius, Math.sin(a) * radius, 0], rx, ry);
    return project(r.map((v, axis) => v + center[axis]));
  });
  ctx.fillStyle = color;
  ctx.beginPath();
  points.forEach((v, i) => { if (v) ctx[i === 0 ? 'moveTo' : 'lineTo'](v.x, v.y); });
  ctx.closePath(); ctx.fill();
}
function spatialScene(ctx, id, t, p) {
  const q = phase(t);
  if (id === 'spatial-flip') {
    const angle = q * Math.PI;
    disc(ctx, [0, 0, 240], 48, 0, angle, Math.cos(angle) >= 0 ? p.red : p.teal);
    const marker = rotate([20, -16, 0], 0, angle);
    const view = project([marker[0], marker[1], marker[2] + 239]);
    if (view) circle(ctx, view.x, view.y, 5 * view.scale, p.paper, .8);
  } else if (id === 'spatial-depth') {
    const objects = [p.red, p.teal, p.gold].map((color, i) => ({
      position: [-45 + i * 45, (i % 2 ? -1 : 1) * 17, 430 + i * 80 - q * 280], radius: 23, color,
    }));
    floor(ctx, {}, p); spheres(ctx, objects, {});
  } else if (id === 'spatial-carousel') {
    const objects = [p.red, p.teal, p.gold].map((color, i) => {
      const a = i * TAU / 3 + t * TAU;
      return { position: [Math.sin(a) * 90, 0, 270 + Math.cos(a) * 90], radius: 27, color };
    });
    spheres(ctx, objects, {});
  } else if (id === 'spatial-explode') {
    [p.gold, p.teal, p.red].forEach((color, i) => {
      const center = [(i - 1) * q * 64, (i - 1) * q * 43, 260 - i * 12];
      disc(ctx, center, 43, -.45, .45, color);
    });
  } else if (id === 'spatial-field') {
    const colors = [p.red, p.teal, p.gold];
    const objects = Array.from({ length: 36 }, (_, i) => ({
      // Fixed seeds keep hover replays and scrubbing reproducible.
      position: [Math.sin(i * 127.1) * 150, Math.cos(i * 311.7) * 85, 80 + ((i * 53 + (1 - t) * 450) % 450)],
      radius: 3.5 + i % 3, color: colors[i % 3],
    }));
    spheres(ctx, objects, {});
  } else if (id === 'spatial-tilt') {
    const rx = mix(0, -.65, q), ry = mix(0, .75, q);
    const corners = [[-94, -58, 0], [94, -58, 0], [94, 58, 0], [-94, 58, 0]]
      .map(pt => { const rotated = rotate(pt, rx, ry); rotated[2] += 260; return rotated; });
    corners.forEach((pt, i) => worldLine(ctx, pt, corners[(i + 1) % 4], {}, p));
    [p.red, p.teal, p.gold].forEach((color, i) => {
      const center = rotate([(i - 1) * 57, 0, 0], rx, ry); center[2] += 260;
      disc(ctx, center, 21, rx, ry, color);
    });
  }
}

const sceneIds = new Set([
  'scroll-parallax', 'scroll-scrub', 'scroll-pin', 'scroll-horizontal', 'scroll-reveal', 'scroll-stack',
  'spatial-flip', 'spatial-depth', 'spatial-carousel', 'spatial-explode', 'spatial-field', 'spatial-tilt',
  'nav-push', 'nav-cover', 'nav-axis', 'nav-fade-through', 'nav-container', 'nav-iris',
  'camera-pan', 'camera-tilt', 'camera-truck', 'camera-pedestal', 'camera-dolly', 'camera-pull-out',
  'camera-zoom', 'camera-dolly-zoom', 'camera-orbit', 'camera-roll', 'camera-focus', 'camera-handheld',
]);

export function createScene(id, canvas) {
  if (!canvas || !sceneIds.has(id)) return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const style = getComputedStyle(canvas);
  const palette = {
    red: style.getPropertyValue('--study-red').trim(),
    teal: style.getPropertyValue('--study-teal').trim(),
    gold: style.getPropertyValue('--study-gold').trim(),
    line: style.getPropertyValue('--study-line').trim(),
    paper: style.getPropertyValue('--color-bg').trim(),
  };
  const scale = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(240 * scale);
  canvas.height = Math.round(144 * scale);
  ctx.scale(scale, scale);
  const render = id.startsWith('scroll-') ? scrollScene : id.startsWith('nav-') ? navigationScene
    : id.startsWith('camera-') ? cameraScene : spatialScene;
  return {
    duration: id.startsWith('camera-') ? 3400 : 2800,
    draw(progress) {
      ctx.clearRect(0, 0, 240, 144);
      ctx.save();
      render(ctx, id, clamp(progress), palette);
      ctx.restore();
    },
  };
}
