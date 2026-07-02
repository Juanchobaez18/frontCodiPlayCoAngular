import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  // Game State
  gridSize = 5;
  robotPos = { x: 0, y: 0 };
  starPos = { x: 4, y: 4 };
  codeLines: string[] = ['// Inicia la aventura', 'robot.posicion(0, 0);'];
  missionAccomplished = false;

  // Helpers para la plantilla
  get gridRows() {
    return Array(this.gridSize).fill(0).map((_, i) => i);
  }
  
  get gridCols() {
    return Array(this.gridSize).fill(0).map((_, i) => i);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.missionAccomplished) return;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.moveRobot('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.moveRobot('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.moveRobot('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.moveRobot('right');
        break;
    }
  }

  moveRobot(direction: string) {
    if (this.missionAccomplished) return;

    let moved = false;
    if (direction === 'up' && this.robotPos.y > 0) {
      this.robotPos.y--;
      this.codeLines.push('robot.moverArriba(1);');
      moved = true;
    } else if (direction === 'down' && this.robotPos.y < this.gridSize - 1) {
      this.robotPos.y++;
      this.codeLines.push('robot.moverAbajo(1);');
      moved = true;
    } else if (direction === 'left' && this.robotPos.x > 0) {
      this.robotPos.x--;
      this.codeLines.push('robot.moverIzquierda(1);');
      moved = true;
    } else if (direction === 'right' && this.robotPos.x < this.gridSize - 1) {
      this.robotPos.x++;
      this.codeLines.push('robot.moverDerecha(1);');
      moved = true;
    } else {
      this.codeLines.push('// ¡Cuidado, límite del mapa!');
    }

    if (moved) {
      this.checkWinCondition();
    }
    
    // Auto-scroll the IDE container if possible
    setTimeout(() => {
      const codeEditor = document.getElementById('code-editor-content');
      if (codeEditor) {
        codeEditor.scrollTop = codeEditor.scrollHeight;
      }
    }, 50);
  }

  checkWinCondition() {
    if (this.robotPos.x === this.starPos.x && this.robotPos.y === this.starPos.y) {
      this.missionAccomplished = true;
      this.codeLines.push('// ¡Estrella encontrada!');
      this.codeLines.push('misionCumplida = true;');
    }
  }

  resetGame() {
    this.robotPos = { x: 0, y: 0 };
    this.starPos = {
      x: Math.floor(Math.random() * (this.gridSize - 1)) + 1,
      y: Math.floor(Math.random() * (this.gridSize - 1)) + 1
    };
    this.codeLines = ['// Reiniciando aventura', 'robot.posicion(0, 0);'];
    this.missionAccomplished = false;
  }
}
