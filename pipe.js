class Pipe {
  constructor() {

    // How big is the empty space
    let spacing = pipeEnd.width*2;
    // Where is th center of the empty space
    let centery = random(spacing, canvasHeight - spacing - groundHeight);

    // Top and bottom of pipe
    this.top = centery - spacing / 2;
    this.bottom = canvasHeight - (centery + spacing / 2);
    // Starts at the edge
    this.x = canvasWidth;
    // Width of pipe
    this.w = pipeEnd.width;
    // How fast
    this.speed = 6;
  }

  // Did this pipe hit a bird?
  hits(bird) {
    if ((bird.y - bird.ry) < this.top || (bird.y + bird.ry) > (canvasHeight - this.bottom)) {
      if (bird.x + bird.rx > this.x && bird.x < this.x + this.w) {
        return true;
      }
      else if(bird.x > this.x && bird.x - bird.rx < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  // Draw the pipe
  show() {
    ctx.drawImage(pipeEnd, this.x, canvasHeight - this.bottom);
    ctx.drawImage(pipeBody, this.x, canvasHeight - this.bottom + pipeEnd.height, pipeBody.width, this.bottom - pipeEnd.height);
    
    ctx.save();
    ctx.scale(1, -1);
    ctx.translate(0, -canvasHeight);
    ctx.drawImage(pipeEnd, this.x, canvasHeight - this.top);
    ctx.drawImage(pipeBody, this.x, canvasHeight - this.top + pipeEnd.height, pipeBody.width, this.top - pipeEnd.height);
    ctx.restore();
  }

  // Update the pipe
  update() {
    this.x -= this.speed;
  }

  // Has it moved offscreen?
  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }
}