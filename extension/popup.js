const statusLabel = document.getElementById('status');
const counts = document.getElementById('counts');
const notice = document.getElementById('notice');
const labels = {
  starting: '正在自动连接当前标签页…',
  on: '当前标签页已自动连接',
  stopping: '正在断开当前标签页…',
  error: '守卫会话异常',
  off: '当前标签页的请求守卫未连接',
};

async function readStatus() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!Number.isInteger(tab?.id)) throw new Error('找不到当前标签页。');
  const response = await chrome.runtime.sendMessage({ action: 'status', tabId: tab.id });
  if (response.error) throw new Error(response.error);
  return response.value;
}

function showNotice(message) {
  notice.textContent = message;
  notice.hidden = !message;
}

function render(state) {
  statusLabel.textContent = state.eligible ? labels[state.phase] : '当前页面不在自动守卫范围内';
  counts.hidden = !state.counts;
  if (state.counts) {
    for (const [name, value] of Object.entries(state.counts)) {
      document.getElementById(name).textContent = String(value);
    }
  }
  showNotice(state.notice);
}

try {
  render(await readStatus());
} catch (error) {
  statusLabel.textContent = '读取守卫状态失败';
  showNotice(error.message);
}
