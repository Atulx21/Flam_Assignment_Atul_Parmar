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

// Track mouse position (account for CSS scaling)
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
});


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

        // Derivative Formula: B'(t)
    calculateTangent(t) {
        const u = 1 - t;
        
        // Derivative Terms (The slope of the curve)
        let t1x = 3 * (u * u) * (this.p1.x - this.p0.x);
        let t1y = 3 * (u * u) * (this.p1.y - this.p0.y);
        
        let t2x = 6 * u * t * (this.p2.x - this.p1.x);
        let t2y = 6 * u * t * (this.p2.y - this.p1.y);
        
        let t3x = 3 * (t * t) * (this.p3.x - this.p2.x);
        let t3y = 3 * (t * t) * (this.p3.y - this.p2.y);

        let tx = t1x + t2x + t3x;
        let ty = t1y + t2y + t3y;

        // Normalize (Make the vector length exactly 1)
        let len = Math.sqrt(tx*tx + ty*ty);
        if (len === 0) len = 1;
        return { x: tx/len, y: ty/len };
    }

    // Helper to draw the white line
    drawTangent(ctx, pos, tan) {
        ctx.save();
        ctx.strokeStyle = CONFIG.tangentColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + tan.x * 20, pos.y + tan.y * 20); // Line length 20px
        ctx.stroke();
        ctx.restore();
    }

        update() {
            // P1 chases 100px LEFT of mouse
            this.p1.update(mouse.x - 100, mouse.y);
            // P2 chases 100px RIGHT of mouse
            this.p2.update(mouse.x + 100, mouse.y);
        }

       draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.p0.x, this.p0.y);

        for (let i = 0; i <= CONFIG.numSamples; i++) {
            let t = i / CONFIG.numSamples;
            let pos = this.calculatePoint(t);
            ctx.lineTo(pos.x, pos.y);

            // --- NEW: Tangent Drawing Logic ---
            // Only draw tangents occasionally (defined in CONFIG)
            if (i % CONFIG.tangentInterval === 0 && i > 0 && i < CONFIG.numSamples) {
                let tan = this.calculateTangent(t);
                this.drawTangent(ctx, pos, tan);
            }
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
        curve.update(); // Calculate physics for control points
        curve.draw(ctx); // Draw updated curve
        requestAnimationFrame(animate);
    }

    // Start Loop
    animate();