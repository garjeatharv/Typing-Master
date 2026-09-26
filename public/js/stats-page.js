document.addEventListener('DOMContentLoaded', async () => {
  const sessionsBody = document.getElementById('sessions-body');
  const paginationEl = document.getElementById('sessions-pagination');
  const chartRoot = document.getElementById('session-chart');
  const chartTooltip = document.getElementById('session-chart-tooltip');

  const PAGE_SIZE = 10;
  let currentPage = 0;
  let totalSessions = 0;

  const summaryIds = ['stat-sessions', 'stat-best-wpm', 'stat-avg-wpm', 'stat-avg-accuracy'];
  const statsSummary = document.getElementById('stats-summary');

  function skeletonTableHtml(rows = 5) {
    const row = `<tr class="skeleton-row">${'<td><span class="shimmer shimmer--cell"></span></td>'.repeat(6)}</tr>`;
    return row.repeat(rows);
  }

  function setSummaryLoading(loading) {
    if (statsSummary) {
      statsSummary.classList.toggle('is-loading', loading);
      statsSummary.setAttribute('aria-busy', loading ? 'true' : 'false');
    }
    summaryIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('shimmer', loading);
      el.classList.toggle('shimmer--stat', loading);
      el.setAttribute('aria-hidden', loading ? 'true' : 'false');
      if (loading) el.textContent = '\u00a0';
    });
  }

  function setChartLoading(loading) {
    if (!chartRoot) return;
    if (loading) {
      chartRoot.innerHTML = '';
      chartRoot.classList.add('shimmer', 'shimmer--chart');
      chartRoot.setAttribute('aria-busy', 'true');
      return;
    }
    chartRoot.classList.remove('shimmer', 'shimmer--chart');
    chartRoot.removeAttribute('aria-busy');
  }

  function setTableLoading(loading) {
    if (!sessionsBody) return;
    sessionsBody.setAttribute('aria-busy', loading ? 'true' : 'false');
    if (loading) sessionsBody.innerHTML = skeletonTableHtml();
  }

  function setStatValue(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('shimmer', 'shimmer--stat');
    el.removeAttribute('aria-hidden');
    el.textContent = text;
  }

  function renderTableRows(sessions) {
    if (!sessions.length) {
      sessionsBody.innerHTML =
        '<tr><td colspan="6" class="empty-row">No sessions on this page.</td></tr>';
      return;
    }

    sessionsBody.innerHTML = sessions
      .map(
        (session) => `<tr>
          <td>${TM.formatSessionDate(session.createdAt)}</td>
          <td>${TM.formatSessionMode(session)}</td>
          <td>${session.category}</td>
          <td>${session.wpm}</td>
          <td>${session.accuracy}%</td>
          <td>${session.wordCount}</td>
        </tr>`
      )
      .join('');
  }

  function renderPagination() {
    if (!paginationEl) return;

    const totalPages = Math.max(1, Math.ceil(totalSessions / PAGE_SIZE));
    if (totalSessions <= PAGE_SIZE) {
      paginationEl.innerHTML = '';
      paginationEl.hidden = true;
      return;
    }

    paginationEl.hidden = false;
    const prevDisabled = currentPage === 0 ? 'disabled' : '';
    const nextDisabled = currentPage >= totalPages - 1 ? 'disabled' : '';

    paginationEl.innerHTML =
      `<button type="button" class="pagination-btn" data-page="prev" ${prevDisabled}>Previous</button>` +
      `<span class="pagination-status">Page <strong>${currentPage + 1}</strong> of ${totalPages}</span>` +
      `<button type="button" class="pagination-btn" data-page="next" ${nextDisabled}>Next</button>`;
  }

  async function loadSessionsPage(page) {
    setTableLoading(true);
    const skip = page * PAGE_SIZE;
    const listRes = await TM.request(`/api/sessions?limit=${PAGE_SIZE}&skip=${skip}`);
    totalSessions = listRes.data.total || 0;
    currentPage = page;
    renderTableRows(listRes.data.sessions || []);
    renderPagination();
  }

  if (paginationEl) {
    paginationEl.addEventListener('click', (event) => {
      const target = event.target.closest('[data-page]');
      if (!target || target.disabled) return;

      const totalPages = Math.max(1, Math.ceil(totalSessions / PAGE_SIZE));
      if (target.dataset.page === 'prev' && currentPage > 0) {
        loadSessionsPage(currentPage - 1);
      }
      if (target.dataset.page === 'next' && currentPage < totalPages - 1) {
        loadSessionsPage(currentPage + 1);
      }
    });
  }

  setSummaryLoading(true);
  setChartLoading(true);
  setTableLoading(true);

  try {
    const statsRes = await TM.request('/api/sessions/stats');
    const stats = statsRes.data;

    setSummaryLoading(false);
    setStatValue('stat-sessions', stats.totalSessions);
    setStatValue('stat-best-wpm', stats.bestWpm || '0');
    setStatValue('stat-avg-wpm', stats.avgWpm || '0');
    setStatValue('stat-avg-accuracy', `${stats.avgAccuracy || 0}%`);

    const chartRes = await TM.request('/api/sessions?limit=15');
    const chartSessions = chartRes.data.sessions || [];

    if (!stats.totalSessions) {
      setChartLoading(false);
      if (chartRoot) {
        chartRoot.innerHTML = '<p class="session-chart__empty">No sessions yet. Complete a test on the practice page.</p>';
      }
      sessionsBody.innerHTML =
        '<tr><td colspan="6" class="empty-row">No sessions yet. Complete a test on the practice page.</td></tr>';
      if (paginationEl) paginationEl.hidden = true;
      return;
    }

    setChartLoading(false);
    if (chartRoot && chartSessions.length) {
      new TM.SessionChart(chartRoot, chartTooltip, chartSessions);
    }

    await loadSessionsPage(0);
  } catch (err) {
    setSummaryLoading(false);
    setChartLoading(false);
    summaryIds.forEach((id) => setStatValue(id, '—'));
    if (chartRoot) chartRoot.innerHTML = `<p class="session-chart__empty">${err.message}</p>`;
    sessionsBody.innerHTML = `<tr><td colspan="6" class="empty-row">${err.message}</td></tr>`;
    sessionsBody.setAttribute('aria-busy', 'false');
    if (paginationEl) paginationEl.hidden = true;
  }
});
