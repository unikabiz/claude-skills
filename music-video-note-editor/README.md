# 🎹 Editor de Notas Musicais para Vídeos

Um aplicativo web interativo para adicionar notas musicais visuais a vídeos do YouTube, ideal para criar tutoriais de piano/teclado com notas coloridas sincronizadas com o vídeo.

## 🌟 Funcionalidades

### 1. **Player de Vídeo Integrado**
- Carregue qualquer vídeo do YouTube usando o link
- Controles de reprodução: Play/Pause, avançar/retroceder 5 segundos
- Timeline visual mostrando a posição atual do vídeo

### 2. **Editor de Notas Musicais**
- Adicione notas musicais em qualquer momento do vídeo
- 12 notas disponíveis: Dó, Dó#, Ré, Ré#, Mi, Fá, Fá#, Sol, Sol#, Lá, Lá#, Si
- Escolha a oitava (1-7) e duração de cada nota
- Visualização em timeline colorida

### 3. **Sistema de Cores Inteligente**
- **Notas naturais** (sem sustenido): cores claras e vibrantes
  - Dó: Verde claro
  - Ré: Azul claro
  - Mi: Amarelo
  - Fá: Vermelho claro
  - Sol: Roxo claro
  - Lá: Laranja claro
  - Si: Rosa claro

- **Notas sustenidas** (#): cores escuras
  - Dó#: Verde escuro
  - Ré#: Azul escuro
  - Fá#: Vermelho escuro
  - Sol#: Roxo escuro (Índigo)
  - Lá#: Laranja escuro

### 4. **Gerador de Prompts Educacionais**
Gera automaticamente dicas personalizadas sobre:
- ✋ **Posição das mãos**: Como posicionar dedos, pulsos e braços
- 💪 **Intensidade**: Controle de dinâmica e pressão nas teclas
- 🎵 **Uso do pedal**: Quando e como usar o pedal sustain
- ⏱️ **Ritmo e timing**: Técnicas de metrônomo e contagem
- 🎹 **Técnica geral**: Dicas de prática e aprendizado

### 5. **Exportação e Salvamento**
- **Salvar Projeto (JSON)**: Salve todo o projeto incluindo vídeo e notas
- **Carregar Projeto**: Continue editando projetos salvos anteriormente
- **Exportar Notas (CSV)**: Exporte apenas as notas para planilha

## 🚀 Como Usar

### Passo 1: Carregar Vídeo
1. Cole o link do YouTube no campo de entrada
2. Clique em "Carregar Vídeo"
3. Aguarde o vídeo carregar

**Formatos aceitos:**
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `VIDEO_ID` (apenas o ID)

### Passo 2: Adicionar Notas
1. Reproduza o vídeo e pause no momento desejado
2. Selecione a nota clicando no botão correspondente
3. Escolha a oitava e duração
4. Clique em "➕ Adicionar Nota no Tempo Atual"

**Dicas:**
- As notas aparecem na timeline com as cores correspondentes
- Clique em uma nota na timeline para ir até aquele momento
- Passe o mouse sobre uma nota para ver o botão de deletar

### Passo 3: Visualizar Timeline
- A linha vermelha mostra a posição atual do vídeo
- Blocos coloridos representam as notas adicionadas
- A régua inferior mostra os marcadores de tempo

### Passo 4: Gerar Prompts Educacionais
1. Clique em "🤖 Gerar Dicas Automáticas"
2. O sistema analisará as notas e criará dicas personalizadas
3. Você pode adicionar dicas específicas usando os botões de categoria
4. Edite o texto livremente na área de texto

### Passo 5: Salvar Seu Trabalho
**Salvar Projeto Completo:**
- Clique em "💾 Salvar Projeto (JSON)"
- Um arquivo JSON será baixado com tudo: vídeo, notas e prompts

**Carregar Projeto:**
- Clique em "📂 Carregar Projeto"
- Selecione o arquivo JSON salvo anteriormente

**Exportar Notas:**
- Clique em "📄 Exportar Notas (CSV)"
- Abra o CSV em Excel, Google Sheets, etc.

## 🎨 Exemplo de Uso

### Criando um Tutorial de "Twinkle Twinkle Little Star"

1. **Carregue o vídeo** com a música
2. **Adicione as notas** conforme aparecem:
   - 0:00s - Dó4 (0.5s) - Verde claro
   - 0:05s - Dó4 (0.5s) - Verde claro
   - 0:10s - Sol4 (0.5s) - Roxo claro
   - 0:15s - Sol4 (0.5s) - Roxo claro
   - ... e assim por diante

3. **Gere os prompts** com dicas de como tocar
4. **Salve o projeto** para editar depois
5. **Exporte as notas** se precisar usar em outro software

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilos e animações
- **JavaScript (Vanilla)**: Lógica da aplicação
- **YouTube IFrame API**: Integração com vídeos do YouTube

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (versões recentes)
- ✅ Responsivo para tablets
- ⚠️ Requer conexão com internet (para carregar vídeos do YouTube)

## 🎯 Casos de Uso

1. **Professores de Música**: Criar materiais didáticos para alunos
2. **YouTubers**: Produzir vídeos tutoriais de piano/teclado
3. **Estudantes**: Marcar notas em vídeos para praticar
4. **Músicos**: Transcrever músicas de vídeos

## 📝 Formato dos Arquivos

### Projeto (JSON)
```json
{
  "version": "1.0",
  "videoId": "VIDEO_ID",
  "videoUrl": "https://youtu.be/...",
  "notes": [
    {
      "id": 1234567890,
      "note": "C",
      "octave": 4,
      "startTime": 5.2,
      "duration": 0.5,
      "color": "#90EE90"
    }
  ],
  "prompts": "Texto com dicas...",
  "createdAt": "2025-10-25T..."
}
```

### Notas (CSV)
```csv
Nota,Oitava,Tempo Início (s),Duração (s),Cor
C,4,5.20,0.5,#90EE90
D,4,5.80,0.5,#87CEEB
```

## 🔧 Instalação Local

1. Clone ou baixe este repositório
2. Abra `index.html` no navegador
3. Não requer servidor - funciona localmente!

```bash
# Ou use um servidor local simples
python -m http.server 8000
# Acesse: http://localhost:8000
```

## 💡 Dicas e Truques

- **Atalho de teclado**: Pressione Enter após colar o link para carregar o vídeo
- **Precisão**: Use os botões ⏪ -5s e ⏩ +5s para posicionar com precisão
- **Organização**: Salve projetos diferentes para músicas diferentes
- **Backup**: Exporte regularmente para não perder o trabalho

## 🐛 Solução de Problemas

**Vídeo não carrega:**
- Verifique se o link está correto
- Alguns vídeos têm restrições de incorporação
- Verifique sua conexão com internet

**Notas não aparecem:**
- Certifique-se de que selecionou uma nota antes de adicionar
- Verifique se o vídeo foi carregado completamente

**Timeline não atualiza:**
- Recarregue a página
- Verifique se o vídeo está reproduzindo

## 🤝 Contribuindo

Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Melhorar a documentação
- Fazer fork e criar pull requests

## 📄 Licença

Este projeto é de código aberto e está disponível para uso pessoal e educacional.

## 🎵 Divirta-se Criando!

Esperamos que este editor ajude você a criar incríveis tutoriais musicais e a aprender piano/teclado de forma mais visual e interativa!

---

**Desenvolvido com ❤️ para educadores e estudantes de música**
