# 📸 Extensão Chrome: Instagram Comment Scraper & Exporter (v1.2.0)

Extensão para Google Chrome (Manifest V3) desenvolvida para extrair e exportar comentários de posts e reels do Instagram de forma automatizada, respeitando limites configuráveis ($X$ comentários ou até o fim) com proteção anti-bloqueio e **inclusão completa dos metadados do post** (Link, Autor e Legenda/Conteúdo).

---

## 📦 Estrutura dos Dados Exportados

Ao exportar, a ferramenta vincula **o contexto do post** a cada comentário:

### 1. Formato CSV (Excel)
Todas as linhas contêm o contexto do post, ideal para filtros, tabelas dinâmicas e importação em Pandas / PowerBI:
- `ID`: Número sequencial
- `Post_URL`: Link completo da publicação (ex: `https://www.instagram.com/namoro.gov.br/p/DfS-ma_mr7-/`)
- `Post_Autor`: Nome de usuário do criador do post (ex: `namoro.gov.br`)
- `Post_Legenda`: Texto/conteúdo original da publicação
- `Usuario`: Nome de usuário de quem comentou
- `Perfil_URL`: Link para o perfil do comentarista
- `Comentario_Texto`: Texto do comentário
- `Data_Comentario_ISO`: Data e hora exata em formato ISO 8601
- `Tempo_Relativo`: Exibição visual (`"2 sem"`, `"1 d"`, etc.)
- `Curtidas`: Quantidade de likes no comentário
- `E_Resposta`: Indica se é um comentário de resposta a outro (`Sim` / `Não`)
- `Data_Captura`: Timestamp da extração

### 2. Formato JSON
```json
{
  "post_info": {
    "url": "https://www.instagram.com/namoro.gov.br/p/DfS-ma_mr7-/",
    "shortcode": "DfS-ma_mr7-",
    "author": "namoro.gov.br",
    "author_url": "https://www.instagram.com/namoro.gov.br/",
    "caption": "Legenda completa do post...",
    "posted_at": "2024-05-12T14:20:00.000Z",
    "extracted_at": "2026-11-06T15:10:00.000Z",
    "total_comments": 142
  },
  "comments": [
    {
      "index": 1,
      "username": "fulano",
      "user_url": "https://www.instagram.com/fulano/",
      "avatar_url": "https://...",
      "comment_text": "Comentário aqui...",
      "likes": 5,
      "datetime_iso": "2024-05-12T...",
      "time_ago": "2 d",
      "is_reply": false,
      "is_caption": false,
      "captured_at": "2026-11-06T..."
    }
  ]
}
```

### 3. Copiar para Área de Transferência
Gera um cabeçalho resumido com o post, autor e legenda, seguido pelos comentários formatados:
```text
==================================================
POST: https://www.instagram.com/namoro.gov.br/p/DfS-ma_mr7-/
AUTOR: @namoro.gov.br
CONTEÚDO/LEGENDA:
Texto da legenda aqui...
TOTAL DE COMENTÁRIOS: 142
DATA DA EXTRAÇÃO: 06/11/2026 15:10
==================================================

@usuario1: Comentário 1
@usuario2: Comentário 2
```

---

## 🚀 Como Atualizar no Chrome

1. Abra `chrome://extensions/` no seu Chrome.
2. Clique no ícone de **Recarregar (🔄)** no card da extensão.
3. Volte para a aba do post e dê **F5** (atualizar a página).
4. Ou copie e cole o [`console_runner.js`](console_runner.js) no Console do navegador (`F12`).
