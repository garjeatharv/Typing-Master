document.addEventListener('DOMContentLoaded', async () => {
  const sessionsBody = document.getElementById('sessions-body');
  const paginationEl = document.getElementById('sessions-pagination');
  const chartRoot = document.getElementById('session-chart');
  const chartTooltip = document.getElementById('session-chart-tooltip');

  const PAGE_SIZE = 10;
  let currentPage = 0;
  let totalSessions = 0;

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

  try {
    const statsRes = await TM.request('/api/sessions/stats');
    const stats = statsRes.data;

    document.getElementById('stat-sessions').textContent = stats.totalSessions;
    document.getElementById('stat-best-wpm').textContent = stats.bestWpm || '0';
    document.getElementById('stat-avg-wpm').textContent = stats.avgWpm || '0';
    document.getElementById('stat-avg-accuracy').textContent = `${stats.avgAccuracy || 0}%`;

    const chartRes = await TM.request('/api/sessions?limit=15');
    const chartSessions = chartRes.data.sessions || [];

    if (!stats.totalSessions) {
      if (chartRoot) {
        chartRoot.innerHTML = '<p class="session-chart__empty">No sessions yet. Complete a test on the practice page.</p>';
      }
      sessionsBody.innerHTML =
        '<tr><td colspan="6" class="empty-row">No sessions yet. Complete a test on the practice page.</td></tr>';
      if (paginationEl) paginationEl.hidden = true;
      return;
    }

    if (chartRoot && chartSessions.length) {
      new TM.SessionChart(chartRoot, chartTooltip, chartSessions);
    }

    await loadSessionsPage(0);
  } catch (err) {
    if (chartRoot) chartRoot.innerHTML = `<p class="session-chart__empty">${err.message}</p>`;
    sessionsBody.innerHTML = `<tr><td colspan="6" class="empty-row">${err.message}</td></tr>`;
    if (paginationEl) paginationEl.hidden = true;
  }
});
