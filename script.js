/**
 * FLAM INTERNSHIP ASSIGNMENT
 * Interactive Bézier Curve with Physics
 */

// --- CONFIGURATION ---
const CONFIG = {
    lineColor: '#38bdf8',           // Light Blue
    pointColor: '#f472b6',          // Pink
    tangentColor: 'rgba(255, 255, 255, 0.3)', 
    springStiffness: 0.08,          // "k" value
    damping: 0.88,                  // Friction
    numSamples: 100,
    tangentInterval: 12
};

// --- SETUP CANVAS ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = 800;
    canvas.height = 500;
}
resizeCanvas();

// Global Mouse State
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };


// --- CLASS 1: PHYSICS POINT ---
class PhysicsPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
    }

    update(targetX, targetY) {
        // 1. Distance to target
        const dx = targetX - this.x;
        const dy = targetY - this.y;

        // 2. Acceleration (Hooke's Law: F = kx)
        const ax = dx * CONFIG.springStiffness;
        const ay = dy * CONFIG.springStiffness;

        // 3. Update Velocity
        this.vx += ax;
        this.vy += ay;

        // 4. Apply Damping (Friction)
        this.vx *= CONFIG.damping;
        this.vy *= CONFIG.damping;

        // 5. Update Position
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = CONFIG.pointColor;
        ctx.fill();
    }
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Debug Text
    ctx.fillStyle = "white";
    ctx.fillText("Setup Complete. Ready for Physics.", 50, 50);

    requestAnimationFrame(animate);
}

// Start Loop
animate();