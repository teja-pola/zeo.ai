// translatePage.js
// Utility to translate all text nodes on the page using a translation API
export async function translatePage(targetLang) {
    // gather all textual content
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      { acceptNode: node => node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }
    );
    const texts = [];
    while (walker.nextNode()) {
      texts.push(walker.currentNode);
    }
  
    // batch original texts
    const originals = texts.map(node => node.nodeValue);
    try {
      const resp = await fetch(`/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetLang, texts: originals }),
      });
      const { translations } = await resp.json();
      // apply translations back to DOM
      texts.forEach((node, idx) => {
        node.nodeValue = translations[idx] || originals[idx];
      });
    } catch (err) {
      console.error('Translate error', err);
    }
  }
  