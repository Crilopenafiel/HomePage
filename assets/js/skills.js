/* ================================================================
   skills.js — Comb-Shape Interactive SVG Visualiser
   ================================================================ */

(function () {
  'use strict';

  const svg     = document.getElementById('skill-svg');
  const tooltip = document.getElementById('skill-tooltip');
  const tabs    = document.querySelectorAll('.skill-tab');
  if (!svg || !tabs.length) return;

  /* ----------------------------------------------------------------
     Shape definitions
  ---------------------------------------------------------------- */
  const SHAPES = {
    i: {
      hasBreadth: false,
      label: 'Deep specialist in one domain. Extreme depth, limited breadth.',
      teeth: [
        { id: 'mining', label: 'Mining &\nMetallurgy', depth: 1.0, color: '#1B4F72' }
      ]
    },
    t: {
      hasBreadth: true,
      label: 'Deep expertise in one area, broad awareness across many.',
      teeth: [
        { id: 'mining', label: 'Mining &\nMetallurgy', depth: 1.0, color: '#1B4F72' }
      ]
    },
    pi: {
      hasBreadth: true,
      label: 'Deep expertise in two domains, with broad generalist knowledge.',
      teeth: [
        { id: 'mining',  label: 'Mining &\nMetallurgy', depth: 1.0, color: '#1B4F72' },
        { id: 'ai',      label: 'AI / ML\nAnalytics',  depth: 0.9, color: '#00BFA6' }
      ]
    },
    comb: {
      hasBreadth: true,
      label: 'Multiple deep expertise domains combined with broad cross-disciplinary knowledge. Cristián\'s profile.',
      teeth: [
        {
          id: 'mining',
          label: 'Mining &\nMetallurgy',
          depth: 1.0,
          color: '#1B5E82',
          tooltipTitle: 'Mining & Metallurgy',
          tooltipItems: [
            'Bachelor of Engineering, Universidad de Chile',
            'Truck dispatch system at Antofagasta PLC (−18% idle time)',
            'Synthetic Rock Mass modelling at El Teniente'
          ]
        },
        {
          id: 'software',
          label: 'Software\nEngineering',
          depth: 0.82,
          color: '#00BFA6',
          tooltipTitle: 'Software Engineering & Architecture',
          tooltipItems: [
            'Cloud-native SaaS platform at Tiger Spider (multi-body dynamics)',
            'Master of Information Systems, University of Melbourne',
            'ANZ Innovation Hackathon Winner 2016'
          ]
        },
        {
          id: 'ai',
          label: 'AI / ML\nAnalytics',
          depth: 0.92,
          color: '#00A688',
          tooltipTitle: 'AI / Machine Learning / Advanced Analytics',
          tooltipItems: [
            '9.7% Cu grade uplift via ML models at Codelco Chuquicamata',
            '6.06% fine Cu uplift via XGBoost/EMCEE SAG mill optimisation',
            'GenAI and LightGBM comminution models at El Teniente'
          ]
        },
        {
          id: 'digital',
          label: 'Digital\nTransformation',
          depth: 0.87,
          color: '#D4812A',
          tooltipTitle: 'Digital Transformation & Change Management',
          tooltipItems: [
            'Corporate Director of Digital Transformation, Codelco (2019–21)',
            '$250M+ transformation portfolio across Glencore globally',
            'Founded data governance committee and data science unit at Codelco'
          ]
        },
        {
          id: 'leadership',
          label: 'Strategic\nLeadership',
          depth: 0.8,
          color: '#B06A1F',
          tooltipTitle: 'Strategic Leadership & Portfolio Management',
          tooltipItems: [
            '$25M+ CAPEX digital optimisation portfolio (Glencore Copper)',
            'Australian Global Talent visa — recognised exceptional ability',
            'Led cross-functional teams across 3 continents'
          ]
        }
      ]
    }
  };

  /* ----------------------------------------------------------------
     Layout constants
  ---------------------------------------------------------------- */
  const PAD          = 32;
  const BREADTH_H    = 38;
  const BREADTH_GAP  = 24;
  const LABEL_H      = 44;
  const SVG_H        = 360;
  const MAX_TOOTH_H  = SVG_H - PAD - BREADTH_H - BREADTH_GAP - LABEL_H - PAD;
  const TOOTH_W_MAX  = 100;
  const TOOTH_GAP    = 18;

  let currentShape = 'comb';
  let svgWidth = svg.clientWidth || 700;

  /* ----------------------------------------------------------------
     SVG helpers
  ---------------------------------------------------------------- */
  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  /* ----------------------------------------------------------------
     Render a shape
  ---------------------------------------------------------------- */
  function render(shapeKey, animate = true) {
    const shape = SHAPES[shapeKey];
    if (!shape) return;

    svgWidth = svg.clientWidth || 700;
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${SVG_H}`);
    svg.innerHTML = '';

    const teeth = shape.teeth;
    const n = teeth.length;
    const availW = svgWidth - PAD * 2;
    const toothW = Math.min(TOOTH_W_MAX, (availW - (n - 1) * TOOTH_GAP) / n);
    const totalW = n * toothW + (n - 1) * TOOTH_GAP;
    const startX = PAD + (availW - totalW) / 2;
    const topY   = PAD;

    // ── Breadth bar ──
    if (shape.hasBreadth) {
      const bw = svgWidth - PAD * 2;
      const bRect = svgEl('rect', {
        x: PAD, y: topY,
        width: animate ? 0 : bw,
        height: BREADTH_H,
        rx: 4,
        fill: '#1A3A5C',
        opacity: 0.9
      });
      svg.appendChild(bRect);

      if (animate) {
        requestAnimationFrame(() => {
          bRect.style.transition = 'width 0.55s cubic-bezier(0.34,1.56,0.64,1)';
          bRect.setAttribute('width', bw);
        });
      }

      // Breadth label
      const bText = svgEl('text', {
        x: PAD + bw / 2, y: topY + BREADTH_H / 2 + 5,
        'text-anchor': 'middle',
        fill: '#8899AA',
        'font-family': 'JetBrains Mono, monospace',
        'font-size': '11',
        'letter-spacing': '0.12em'
      });
      bText.textContent = 'BREADTH — Cross-domain knowledge base';
      svg.appendChild(bText);
    }

    const teethTopY = topY + (shape.hasBreadth ? BREADTH_H + BREADTH_GAP : 0);

    // ── Teeth ──
    teeth.forEach((tooth, i) => {
      const x  = startX + i * (toothW + TOOTH_GAP);
      const th = MAX_TOOTH_H * tooth.depth;
      const ty = teethTopY;

      // Shadow/glow rect (slightly larger, faded)
      const glow = svgEl('rect', {
        x: x - 2, y: ty,
        width: toothW + 4,
        height: animate ? 0 : th,
        rx: 5,
        fill: tooth.color,
        opacity: 0.18
      });
      svg.appendChild(glow);

      // Main bar
      const bar = svgEl('rect', {
        x: x, y: ty,
        width: toothW,
        height: animate ? 0 : th,
        rx: 4,
        fill: tooth.color,
        opacity: 0.92,
        'data-tooth': tooth.id,
        style: 'cursor: pointer'
      });
      svg.appendChild(bar);

      // Depth percentage text (inside bar)
      const pct = Math.round(tooth.depth * 100);
      const pctText = svgEl('text', {
        x: x + toothW / 2,
        y: ty + 22,
        'text-anchor': 'middle',
        fill: '#fff',
        'font-family': 'JetBrains Mono, monospace',
        'font-size': '11',
        'font-weight': '600',
        opacity: animate ? 0 : 1,
        'pointer-events': 'none'
      });
      pctText.textContent = pct + '%';
      svg.appendChild(pctText);

      // Label (below bar)
      const labelY = teethTopY + MAX_TOOTH_H + 16;
      const lines = tooth.label.split('\n');
      lines.forEach((line, li) => {
        const t = svgEl('text', {
          x: x + toothW / 2,
          y: labelY + li * 15,
          'text-anchor': 'middle',
          fill: '#8899AA',
          'font-family': 'Outfit, sans-serif',
          'font-size': '11',
          'pointer-events': 'none'
        });
        t.textContent = line;
        svg.appendChild(t);
      });

      // Animate bars growing
      if (animate) {
        const delay = i * 80;
        setTimeout(() => {
          bar.style.transition  = 'height 0.55s cubic-bezier(0.34,1.56,0.64,1), y 0.55s cubic-bezier(0.34,1.56,0.64,1)';
          glow.style.transition = 'height 0.55s cubic-bezier(0.34,1.56,0.64,1), y 0.55s cubic-bezier(0.34,1.56,0.64,1)';
          pctText.style.transition = 'opacity 0.3s ease';

          bar.setAttribute('height', th);
          bar.setAttribute('y', ty);
          glow.setAttribute('height', th);
          glow.setAttribute('y', ty);

          setTimeout(() => {
            pctText.setAttribute('opacity', 1);
          }, 350 + delay);
        }, delay);
      }

      // Hover tooltip (comb only)
      if (shapeKey === 'comb' && tooth.tooltipTitle) {
        bar.addEventListener('mouseenter', (e) => showTooltip(tooth, e));
        bar.addEventListener('mouseleave', () => hideTooltip());
        bar.addEventListener('focus',      (e) => showTooltip(tooth, e));
        bar.addEventListener('blur',       () => hideTooltip());
        bar.setAttribute('tabindex', '0');
        bar.setAttribute('role', 'button');
        bar.setAttribute('aria-label', tooth.tooltipTitle);
      }
    });

    // ── Shape description ──
    let descEl = document.getElementById('skill-shape-desc');
    if (!descEl) {
      descEl = document.createElement('p');
      descEl.id = 'skill-shape-desc';
      descEl.style.cssText = 'text-align:center;font-size:0.85rem;color:var(--text-muted);margin-top:1rem;min-height:2.5em;transition:opacity 0.3s;';
      svg.parentElement.after(descEl);
    }
    descEl.style.opacity = 0;
    setTimeout(() => {
      descEl.textContent = shape.label;
      descEl.style.opacity = 1;
    }, 200);
  }

  /* ----------------------------------------------------------------
     Tooltip
  ---------------------------------------------------------------- */
  function showTooltip(tooth, event) {
    tooltip.removeAttribute('hidden');
    tooltip.innerHTML = `
      <h4>${tooth.tooltipTitle}</h4>
      <ul>${tooth.tooltipItems.map(i => `<li>${i}</li>`).join('')}</ul>
    `;
    positionTooltip(event);
  }

  function hideTooltip() {
    tooltip.setAttribute('hidden', '');
  }

  function positionTooltip(event) {
    const wrap = svg.closest('.skill-diagram-wrap');
    if (!wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    const x = event.clientX - wrapRect.left;
    const y = event.clientY - wrapRect.top;
    const tW = 260;
    const left = Math.min(x + 12, wrap.clientWidth - tW - 8);
    tooltip.style.left = left + 'px';
    tooltip.style.top  = Math.max(0, y - 80) + 'px';
  }

  /* ----------------------------------------------------------------
     Tab switching
  ---------------------------------------------------------------- */
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const shape = tab.dataset.shape;
      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      currentShape = shape;
      hideTooltip();
      render(shape, true);
    });
  });

  /* ----------------------------------------------------------------
     Resize observer
  ---------------------------------------------------------------- */
  const resizeObs = new ResizeObserver(() => render(currentShape, false));
  resizeObs.observe(svg.parentElement);

  /* ----------------------------------------------------------------
     Initial render
  ---------------------------------------------------------------- */
  render('comb', false);

})();
