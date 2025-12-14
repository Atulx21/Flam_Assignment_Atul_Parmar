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



    // --- CLASS 2: BEZIER CURVE ---
    class BezierCurve {
        constructor() {
            // Fixed Endpoints
            this.p0 = { x: 50, y: canvas.height / 2 };
            this.p3 = { x: canvas.width - 50, y: canvas.height / 2 };

            // Dynamic Control Points (Physics enabled)
            this.p1 = new PhysicsPoint(canvas.width / 3, canvas.height / 2);
            this.p2 = new PhysicsPoint((canvas.width / 3) * 2, canvas.height / 2);
        }

        calculatePoint(t) {
            const u = 1 - t;
            const tt = t * t;
            const uu = u * u;
            const uuu = uu * u;
            const ttt = tt * t;

            // Standard Cubic Bézier Formula
            let x = uuu * this.p0.x + 3 * uu * t * this.p1.x + 3 * u * tt * this.p2.x + ttt * this.p3.x;
            let y = uuu * this.p0.y + 3 * uu * t * this.p1.y + 3 * u * tt * this.p2.y + ttt * this.p3.y;

            return { x, y };
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.p0.x, this.p0.y);

            for (let i = 0; i <= CONFIG.numSamples; i++) {
                let t = i / CONFIG.numSamples;
                let pos = this.calculatePoint(t);
                ctx.lineTo(pos.x, pos.y);
            }
        
            ctx.strokeStyle = CONFIG.lineColor;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Draw Control Points
            this.p1.draw(ctx);
            this.p2.draw(ctx);
        }
    }

    // Instantiate the Curve
    const curve = new BezierCurve();

    // Replace the animate() function to draw the curve
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        curve.draw(ctx); // Draw the static curve
        requestAnimationFrame(animate);
    }

    // Start Loop
    animate();