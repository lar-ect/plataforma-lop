// Mova seu mouse na janela ao lado 
// para ver o processing em ação

function setup() {
  createCanvas(400, 400);
}

function draw() {
  fill(255);
  rect(0, 0, 400, 400);
  
  fill(200, 200, 200);
  rect(mouseX-40, mouseY-40, 80, 80);
}