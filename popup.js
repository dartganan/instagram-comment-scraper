document.addEventListener('DOMContentLoaded', async () => {
  const statusCard = document.getElementById('tab-status');
  const statusText = document.getElementById('tab-status-text');
  const btnSample = document.getElementById('btn-open-sample');

  // Check current tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      if (tab.url.includes('instagram.com/p/') || tab.url.includes('instagram.com/reel/')) {
        statusCard.className = 'status-card active';
        statusText.textContent = 'Post detectado! Use o painel flutuante na tela.';
      } else if (tab.url.includes('instagram.com')) {
        statusCard.className = 'status-card active';
        statusText.textContent = 'Instagram aberto. Navegue até um post para capturar.';
      } else {
        statusCard.className = 'status-card inactive';
        statusText.textContent = 'Abra um post do Instagram para começar.';
      }
    }
  } catch (e) {
    statusText.textContent = 'Pronto para uso.';
  }

  // Open sample post
  btnSample.addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://www.instagram.com/namoro.gov.br/p/DfS-ma_mr7-/',
    });
  });
});
