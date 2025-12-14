/**
 * FLAM INTERNSHIP ASSIGNMENT
 * Interactive Bézier Curve with Physics
 * -------------------------------------
 * Architecture:
 * 1. PhysicsPoint: Handles the spring/mass physics for P1 & P2.
 * 2. BezierCurve: Handles the mathematical curve generation B(t).
 * 3. Animation Loop: Orchestrates the rendering.
 */

// --- CONFIGURATION ---
const CONFIG = {
    // Visuals
    lineColor: '#38bdf8',       // Light Blue
    pointColor: '#f472b6',      // Pink
    tangentColor: 'rgba(255, 255, 255, 0.3)',
    
    // Physics Parameters (Tuned for Force-based Model)
    // Note: 'k' controls snap, 'damping' controls air resistance
    springStiffness: 0.1,       
    damping: 0.12,              
    
    // Interaction
    pointOffset: 100,           // Distance of control points from mouse cursor
    
    // Rendering
    numSamples: 100,            // Curve resolution
    tangentInterval: 12         // Tangent density
};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Mouse State
const mouse = { x: 0, y: 0 };

// --- RESIZE HANDLING ---
// Ensures the canvas coordinate system remains accurate if window changes
function resizeCanvas() {
    canvas.width = 800;  // Internal Logic Resolution
    canvas.height = 500;
    
    // Re-center mouse to prevent jump on reload
    mouse.x = canvas.width / 2;
    mouse.y = canvas.height / 2;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();


// --- CLASS 1: THE PHYSICS POINT ---
class PhysicsPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
    }

    /**
     * Updates physics using the specific assignment formula:
     * acceleration = -k * (position - target) - damping * velocity
     */
    update(targetX, targetY) {
        // 1. Calculate Displacement (position - target)
        const dx = this.x - targetX;
        const dy = this.y - targetY;

        // 2. Calculate Forces
        // Spring Force = -k * displacement
        const springFx = -CONFIG.springStiffness * dx;
        const springFy = -CONFIG.springStiffness * dy;

        // Damping Force = -damping * velocity
        const dampFx = -CONFIG.damping * this.vx;
        const dampFy = -CONFIG.damping * this.vy;

        // 3. Acceleration (F = ma, assuming mass = 1)
        const ax = springFx + dampFx;
        const ay = springFy + dampFy;

        // 4. Integration (Euler Method)
        this.vx += ax;
        this.vy += ay;
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

// --- CLASS 2: THE BÉZIER MATH ---
class BezierCurve {
    constructor() {
        // Fixed Endpoints (P0, P3)
        this.p0 = { x: 50, y: canvas.height / 2 };
        this.p3 = { x: canvas.width - 50, y: canvas.height / 2 };

        // Dynamic Control Points (P1, P2)
        this.p1 = new PhysicsPoint(canvas.width / 3, canvas.height / 2);
        this.p2 = new PhysicsPoint((canvas.width / 3) * 2, canvas.height / 2);
    }

    /**
     * Calculates curve coordinate B(t)
     * Formula: (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
     */
    calculatePoint(t) {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;

        const x = uuu * this.p0.x + 
                  3 * uu * t * this.p1.x + 
                  3 * u * tt * this.p2.x + 
                  ttt * this.p3.x;

        const y = uuu * this.p0.y + 
                  3 * uu * t * this.p1.y + 
                  3 * u * tt * this.p2.y + 
                  ttt * this.p3.y;

        return { x, y };
    }

    /**
     * Calculates tangent vector B'(t)
     * Formula: 3(1-t)²(P₁-P₀) + 6(1-t)t(P₂-P₁) + 3t²(P₃-P₂)
     */
    calculateTangent(t) {
        const u = 1 - t;

        // Derivative Component 1
        const term1_scale = 3 * u * u;
        const t1x = term1_scale * (this.p1.x - this.p0.x);
        const t1y = term1_scale * (this.p1.y - this.p0.y);

        // Derivative Component 2
        const term2_scale = 6 * u * t;
        const t2x = term2_scale * (this.p2.x - this.p1.x);
        const t2y = term2_scale * (this.p2.y - this.p1.y);

        // Derivative Component 3
        const term3_scale = 3 * t * t;
        const t3x = term3_scale * (this.p3.x - this.p2.x);
        const t3y = term3_scale * (this.p3.y - this.p2.y);

        // Vector Sum
        const tx = t1x + t2x + t3x;
        const ty = t1y + t2y + t3y;

        // Normalization
        let len = Math.sqrt(tx * tx + ty * ty);
        if (len === 0) len = 1;

        return { x: tx / len, y: ty / len };
    }

    update() {
        // Update physics with offset from configuration
        this.p1.update(mouse.x - CONFIG.pointOffset, mouse.y);
        this.p2.update(mouse.x + CONFIG.pointOffset, mouse.y);
    }

    draw(ctx) {
        // 1. Draw Curve Path
        ctx.beginPath();
        ctx.moveTo(this.p0.x, this.p0.y);

        for (let i = 0; i <= CONFIG.numSamples; i++) {
            const t = i / CONFIG.numSamples;
            const pos = this.calculatePoint(t);
            ctx.lineTo(pos.x, pos.y);

            // Draw Tangents
            if (i % CONFIG.tangentInterval === 0 && i > 0 && i < CONFIG.numSamples) {
                const tan = this.calculateTangent(t);
                this.drawTangent(ctx, pos, tan);
            }
        }
        
        ctx.strokeStyle = CONFIG.lineColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // 2. Draw Control Points
        this.p1.draw(ctx);
        this.p2.draw(ctx);
        
        // 3. Draw Skeleton (Visual Aid)
        this.drawSkeleton(ctx);
    }

    drawSkeleton(ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(this.p0.x, this.p0.y);
        ctx.lineTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.lineTo(this.p3.x, this.p3.y);
        ctx.stroke();
        ctx.restore();
    }

    drawTangent(ctx, pos, tan) {
        ctx.save();
        ctx.strokeStyle = CONFIG.tangentColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + tan.x * 20, pos.y + tan.y * 20);
        ctx.stroke();
        ctx.restore();
    }
}

// --- MAIN EXECUTION ---
const curve = new BezierCurve();

// Mouse Event Listener
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    curve.update();
    curve.draw(ctx);
    requestAnimationFrame(animate);
}

animate();