// Jogo Agrinho - Herdeiro da Terra (Versão p5.js)
// Agro Forte, Futuro Sustentável: equilíbrio entre produção e meio ambiente

// Configurações do grid
let COLS = 15;
let ROWS = 12;
let TILE_W, TILE_H;

// Tipos de tile
const TILE_EMPTY = 0;
const TILE_PLANT = 1;
const TILE_WATER = 2;
const TILE_NATURE = 3;

// Estado do jogo
let grid = [];
let producao = 0;
let saudeAmbiental = 50;
let pontuacao = 0;
let turno = 0;
let mensagem = "🌾 Clique no solo para plantar, na água ou na mata para expandir equilíbrio!";
let feedbackTimeout = null;

// Botão reset
let resetButton;

function setup() {
  createCanvas(900, 550);
  TILE_W = width / COLS;
  TILE_H = height / ROWS;
  
  // Criar botão de reset
  resetButton = createButton('🌍 Reiniciar Fazenda');
  resetButton.position(width - 180, height + 10);
  resetButton.style('background-color', '#f5a623');
  resetButton.style('border', 'none');
  resetButton.style('padding', '8px 24px');
  resetButton.style('border-radius', '40px');
  resetButton.style('font-weight', 'bold');
  resetButton.style('color', '#2d4a22');
  resetButton.style('cursor', 'pointer');
  resetButton.style('font-family', 'Segoe UI, Poppins, sans-serif');
  resetButton.mousePressed(resetGame);
  
  inicializarJogo();
}

function draw() {
  background(201, 228, 197); // cor de fundo #c9e4c5
  
  desenharGrid();
  desenharInterface();
  desenharInfoPanel();
}

function desenharGrid() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let x = c * TILE_W;
      let y = r * TILE_H;
      let tipo = grid[r][c];
      
      if (tipo === TILE_EMPTY) {
        fill(221, 181, 130);
        rect(x, y, TILE_W - 0.5, TILE_H - 0.5);
        fill(194, 153, 107);
        rect(x + 2, y + 2, TILE_W - 4, TILE_H - 4);
        fill(184, 124, 58);
        for (let i = 0; i < 3; i++) {
          rect(x + 10 + i * 15, y + 20, 2, 4);
        }
      } 
      else if (tipo === TILE_PLANT) {
        let grad = drawingContext.createLinearGradient(x, y, x + TILE_W, y + TILE_H);
        grad.addColorStop(0, '#7cb518');
        grad.addColorStop(1, '#5e8c1a');
        drawingContext.fillStyle = grad;
        rect(x, y, TILE_W - 0.5, TILE_H - 0.5);
        fill(249, 161, 27);
        for (let i = 0; i < 3; i++) {
          rect(x + 12 + i * 12, y + 10, 4, 15);
        }
        fill(229, 214, 58);
        circle(x + TILE_W * 0.5, y + TILE_H * 0.3, 5);
      } 
      else if (tipo === TILE_WATER) {
        fill(74, 163, 194);
        rect(x, y, TILE_W - 0.5, TILE_H - 0.5);
        fill(122, 197, 224);
        for (let i = 0; i < 4; i++) {
          ellipse(x + 10 + i * 12, y + TILE_H - 12, 5, 3);
        }
        fill(255, 255, 255, 200);
        textSize(TILE_H * 0.5);
        textAlign(LEFT, TOP);
        text("💧", x + 5, y + TILE_H - 18);
      } 
      else if (tipo === TILE_NATURE) {
        fill(62, 122, 58);
        rect(x, y, TILE_W - 0.5, TILE_H - 0.5);
        fill(92, 168, 69);
        for (let i = 0; i < 3; i++) {
          rect(x + 8 + i * 15, y + 12, 4, 20);
        }
        fill(201, 226, 101);
        circle(x + TILE_W * 0.7, y + TILE_H * 0.3, 7);
        fill(30, 74, 26);
        textSize(TILE_H * 0.45);
        text("🌳", x + 5, y + TILE_H - 18);
      }
    }
  }
  
  // Borda
  stroke(245, 197, 66);
  strokeWeight(2);
  noFill();
  rect(2, 2, width - 4, height - 4);
}

function desenharInterface() {
  fill(44, 46, 30, 200);
  noStroke();
  rect(10, 10, 210, 38, 10);
  fill(249, 243, 207);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`🌍 Turno: ${turno}`, 18, 18);
}

function desenharInfoPanel() {
  // Painel superior com estatísticas (desenhado em vez de HTML)
  fill(44, 46, 30);
  noStroke();
  rect(10, height - 70, width - 20, 60, 15);
  
  fill(249, 243, 207);
  textSize(14);
  textAlign(CENTER, CENTER);
  
  // Produção
  fill(44, 62, 43);
  rect(20, height - 65, 100, 50, 25);
  fill(255, 217, 102);
  textSize(20);
  text(producao, 70, height - 40);
  fill(249, 243, 207);
  textSize(12);
  text("🌾 Colheita", 70, height - 58);
  
  // Saúde Ambiental
  fill(44, 62, 43);
  rect(130, height - 65, 100, 50, 25);
  fill(255, 217, 102);
  textSize(20);
  text(saudeAmbiental, 180, height - 40);
  fill(249, 243, 207);
  textSize(12);
  text("🌿 Saúde", 180, height - 58);
  
  // Pontuação
  fill(44, 62, 43);
  rect(240, height - 65, 100, 50, 25);
  fill(255, 217, 102);
  textSize(20);
  text(pontuacao, 290, height - 40);
  fill(249, 243, 207);
  textSize(12);
  text("⭐ Pontuação", 290, height - 58);
  
  // Mensagem
  fill(40, 44, 30);
  rect(360, height - 65, width - 550, 50, 25);
  fill(240, 240, 208);
  textSize(13);
  textAlign(CENTER, CENTER);
  text(mensagem, 360 + (width - 550) / 2, height - 40);
  
  // Legendas
  textSize(10);
  fill(43, 75, 30);
  text("🌱 Plantação | 💧 Água | 🌳 Biodiversidade | ⚖️ Equilíbrio", width/2, height - 10);
}

function mouseClicked() {
  // Verificar se o clique foi dentro do canvas
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    let col = floor(mouseX / TILE_W);
    let row = floor(mouseY / TILE_H);
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      acaoJogador(row, col);
      avancarTurno();
    }
  }
  return false;
}

function acaoJogador(row, col) {
  let tile = grid[row][col];
  
  if (tile === TILE_EMPTY) {
    grid[row][col] = TILE_PLANT;
    mostrarFeedback("🌱 Você plantou! +Produção futura", 1200);
    atualizarIndicadores();
    return true;
  } 
  else if (tile === TILE_WATER) {
    let vizinhasModificadas = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        let nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && (dr !== 0 || dc !== 0)) {
          if (grid[nr][nc] === TILE_EMPTY && random() < 0.55) {
            grid[nr][nc] = TILE_NATURE;
            vizinhasModificadas++;
          }
        }
      }
    }
    if (vizinhasModificadas > 0) {
      mostrarFeedback(`💧 Água vital! +${vizinhasModificadas} áreas de biodiversidade.`, 1400);
    } else {
      mostrarFeedback("💧 A água nutre o solo, tente plantar perto dela!", 1000);
    }
    atualizarIndicadores();
    return true;
  } 
  else if (tile === TILE_NATURE) {
    let vizinhos = [];
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        let nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && (dr !== 0 || dc !== 0) && grid[nr][nc] === TILE_EMPTY) {
          vizinhos.push([nr, nc]);
        }
      }
    }
    if (vizinhos.length > 0) {
      let [nr, nc] = vizinhos[floor(random(vizinhos.length))];
      if (random() < 0.7) {
        grid[nr][nc] = TILE_PLANT;
      } else {
        grid[nr][nc] = TILE_NATURE;
      }
      mostrarFeedback("🐞 Biodiversidade se espalhou! Novo crescimento sustentável.", 1300);
    } else {
      mostrarFeedback("🌳 A área natural protege o solo! +Saúde ambiental.", 1000);
      saudeAmbiental = min(100, saudeAmbiental + 3);
    }
    atualizarIndicadores();
    return true;
  } 
  else if (tile === TILE_PLANT) {
    let ganhoExtra = 12 + floor(random(12));
    producao += ganhoExtra;
    pontuacao += floor(ganhoExtra * (saudeAmbiental / 100 + 0.2));
    mostrarFeedback(`🌽 Colheita emergencial! +${ganhoExtra} de alimento`, 1200);
    
    if (saudeAmbiental < 40 && random() < 0.35) {
      grid[row][col] = TILE_EMPTY;
      mostrarFeedback("⚠️ Solo cansado! Rotacione culturas.", 1000);
    } else if (random() < 0.1) {
      grid[row][col] = TILE_EMPTY;
    }
    atualizarIndicadores();
    return true;
  }
  return false;
}

function recalcularSaudeAmbiental() {
  let totalCells = COLS * ROWS;
  let countNature = 0, countWater = 0, countPlant = 0;
  
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === TILE_NATURE) countNature++;
      else if (grid[r][c] === TILE_WATER) countWater++;
      else if (grid[r][c] === TILE_PLANT) countPlant++;
    }
  }
  
  let natureRatio = countNature / totalCells;
  let waterRatio = countWater / totalCells;
  let plantRatio = countPlant / totalCells;
  
  let saude = 0;
  saude += min(50, natureRatio * 100 * 0.8);
  saude += min(25, waterRatio * 100 * 0.9);
  
  if (countNature > 2 && countWater > 2 && countPlant > 3) saude += 12;
  if (plantRatio > 0.55) saude -= (plantRatio - 0.55) * 80;
  if (plantRatio > 0.70) saude -= 15;
  if (natureRatio < 0.06) saude -= 18;
  if (waterRatio < 0.05) saude -= 12;
  
  saudeAmbiental = constrain(floor(saude), 0, 100);
  return saudeAmbiental;
}

function calcularProducaoTurno() {
  let qtdPlant = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === TILE_PLANT) qtdPlant++;
    }
  }
  
  let eficiencia = 0.5 + (saudeAmbiental / 100) * 0.7;
  let ganho = floor(qtdPlant * (0.35 + eficiencia * 0.2));
  ganho = max(0, ganho);
  producao += ganho;
  
  let bonusEquilibrio = floor(ganho * (saudeAmbiental / 100 + 0.3));
  pontuacao += bonusEquilibrio;
  
  if (ganho > 0) mostrarFeedback(`🌾 +${ganho} de colheita!`, 1800);
}

function atualizarIndicadores() {
  recalcularSaudeAmbiental();
  calcularProducaoTurno();
  
  if (saudeAmbiental >= 80) {
    mensagem = "🏆 Agro forte + Natureza exuberante! Futuro sustentável! 🌎";
  } else if (saudeAmbiental >= 50) {
    mensagem = "⚖️ Bom equilíbrio: produção e meio ambiente em harmonia.";
  } else if (saudeAmbiental >= 25) {
    mensagem = "⚠️ Cuidado! Aumente áreas verdes e preserve água.";
  } else {
    mensagem = "🌧️ Alerta ecológico! Plante árvores e proteja nascentes!";
  }
}

function avancarTurno() {
  turno++;
  recalcularSaudeAmbiental();
  calcularProducaoTurno();
  
  // Regeneração natural
  if (turno % 2 === 0 && saudeAmbiental > 55) {
    let vazios = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c] === TILE_EMPTY && random() < 0.12) {
          vazios.push([r, c]);
        }
      }
    }
    if (vazios.length > 0) {
      let [r, c] = vazios[floor(random(vazios.length))];
      if (random() < 0.6) {
        grid[r][c] = TILE_NATURE;
      } else {
        grid[r][c] = TILE_WATER;
      }
      mostrarFeedback("🍃 Regeneração natural: nova área verde surgiu!", 1500);
    }
  }
  
  // Degradação
  if (saudeAmbiental < 25 && turno % 3 === 0) {
    let plantas = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c] === TILE_PLANT) plantas.push([r, c]);
      }
    }
    if (plantas.length > 0) {
      let [r, c] = plantas[floor(random(plantas.length))];
      grid[r][c] = TILE_EMPTY;
      mostrarFeedback("⚠️ Erosão! Perdemos uma plantação por falta de proteção ambiental.", 1700);
    }
  }
  
  atualizarIndicadores();
}

function mostrarFeedback(texto, duracao) {
  mensagem = texto;
  if (feedbackTimeout) clearTimeout(feedbackTimeout);
  feedbackTimeout = setTimeout(() => {
    if (saudeAmbiental >= 70) {
      mensagem = "🌿 Equilíbrio sustentável! Continue assim!";
    } else if (saudeAmbiental >= 40) {
      mensagem = "🌱 Cada ação conta: plante, preserve, colha.";
    } else {
      mensagem = "💚 Invista em biodiversidade para colher mais!";
    }
  }, duracao);
}

function inicializarJogo() {
  // Limpar grid
  for (let r = 0; r < ROWS; r++) {
    grid[r] = [];
    for (let c = 0; c < COLS; c++) {
      grid[r][c] = TILE_EMPTY;
    }
  }
  
  // Criar zonas iniciais
  for (let i = 0; i < 12; i++) {
    let r = floor(random(ROWS));
    let c = floor(random(COLS));
    grid[r][c] = TILE_WATER;
  }
  
  for (let i = 0; i < 18; i++) {
    let r = floor(random(ROWS));
    let c = floor(random(COLS));
    if (grid[r][c] === TILE_EMPTY) grid[r][c] = TILE_NATURE;
  }
  
  for (let i = 0; i < 20; i++) {
    let r = floor(random(ROWS));
    let c = floor(random(COLS));
    if (grid[r][c] === TILE_EMPTY) grid[r][c] = TILE_PLANT;
  }
  
  producao = 15;
  pontuacao = 80;
  turno = 0;
  recalcularSaudeAmbiental();
  mensagem = "🌾 Nova fazenda! Equilibre produção e meio ambiente!";
}

function resetGame() {
  inicializarJogo();
  if (feedbackTimeout) clearTimeout(feedbackTimeout);
  mensagem = "🌱 Fazenda renovada! Equilíbrio é poder.";
}
