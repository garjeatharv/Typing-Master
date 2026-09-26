window.TM = window.TM || {};

class SessionChart {
  constructor(container, tooltipEl, sessions) {
    this.container = container;
    this.tooltipEl = tooltipEl;
    this.sessions = [...sessions].reverse().slice(-15);
    this.activeIndex = null;

    if (!this.container || !this.sessions.length) {
      if (this.container) {
        this.container.innerHTML = '<p class="session-chart__empty">Complete a few tests to see your trend.</p>';
      }
      return;
    }

    this.render();
    this.bindEvents();
  }

  getMaxWpm() {
    return Math.max(...this.sessions.map((s) => s.wpm), 1);
  }

  render() {
    const width = 640;
    const height = 220;
    const pad = { top: 16, right: 12, bottom: 28, left: 36 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const maxWpm = this.getMaxWpm();
    const barGap = 6;
    const barWidth = Math.max(8, (innerW - barGap * (this.sessions.length - 1)) / this.sessions.length);

    const points = this.sessions.map((session, index) => {
      const x = pad.left + index * (barWidth + barGap) + barWidth / 2;
      const barH = (session.wpm / maxWpm) * innerH;
      const y = pad.top + innerH - barH;
      return { x, y, barH, session, index };
    });

    const linePoints = points
      .map((p) => `${p.x},${pad.top + innerH - (p.session.wpm / maxWpm) * innerH}`)
      .join(' ');

    const bars = points
      .map(
        (p) => `<g class="session-chart__bar-group" data-index="${p.index}" tabindex="0" role="button" aria-label="${p.session.wpm} WPM">
          <rect class="session-chart__bar" x="${p.x - barWidth / 2}" y="${p.y}" width="${barWidth}" height="${p.barH}" rx="3" />
        </g>`
      )
      .join('');

    const gridLines = [0, 0.5, 1]
      .map((t) => {
        const y = pad.top + innerH - t * innerH;
        const label = Math.round(maxWpm * t);
        return `<line class="session-chart__grid" x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" />
          <text class="session-chart__axis" x="${pad.left - 8}" y="${y + 4}" text-anchor="end">${label}</text>`;
      })
      .join('');

    this.container.innerHTML = `
      <svg class="session-chart__svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${gridLines}
        <polyline class="session-chart__line" points="${linePoints}" />
        ${bars}
      </svg>`;

    this.points = points;
    this.svg = this.container.querySelector('.session-chart__svg');
  }

  bindEvents() {
    if (!this.svg || !this.tooltipEl) return;

    const groups = this.container.querySelectorAll('.session-chart__bar-group');
    groups.forEach((group) => {
      const index = Number(group.dataset.index);
      group.addEventListener('mouseenter', (e) => this.showTooltip(index, e));
      group.addEventListener('mousemove', (e) => this.moveTooltip(e));
      group.addEventListener('mouseleave', () => this.hideTooltip());
      group.addEventListener('focus', (e) => this.showTooltip(index, e));
      group.addEventListener('blur', () => this.hideTooltip());
    });

    this.container.addEventListener('mouseleave', () => this.hideTooltip());
  }

  showTooltip(index, event) {
    const point = this.points[index];
    if (!point) return;

    this.activeIndex = index;
    this.container.querySelectorAll('.session-chart__bar-group').forEach((g, i) => {
      g.classList.toggle('is-active', i === index);
    });

    const lines = TM.buildSessionTooltip(point.session).split('\n');
    this.tooltipEl.innerHTML = lines.map((line) => `<span>${line}</span>`).join('');
    this.tooltipEl.hidden = false;
    this.moveTooltip(event);
  }

  moveTooltip(event) {
    if (this.tooltipEl.hidden) return;
    this.tooltipEl.style.left = `${event.clientX}px`;
    this.tooltipEl.style.top = `${event.clientY}px`;
  }

  hideTooltip() {
    this.activeIndex = null;
    this.tooltipEl.hidden = true;
    this.container.querySelectorAll('.session-chart__bar-group').forEach((g) => {
      g.classList.remove('is-active');
    });
  }
}

TM.SessionChart = SessionChart;
