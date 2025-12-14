# Interactive Bézier Curve with Physics

**FLAM Internship Assignment Submission**

## 📋 Project Overview

This project implements an interactive cubic Bézier curve that responds to mouse input with realistic spring-damping physics. The curve behaves like a flexible rope, creating smooth, natural motion as control points follow the mouse cursor.

## 🎯 Assignment Requirements Met

✅ **Bézier Curve Math** - Cubic Bézier formula implemented from scratch  
✅ **Tangent Visualization** - Derivative B'(t) computed and rendered  
✅ **Spring-Damping Physics** - Hooke's law with velocity damping  
✅ **Real-time Interaction** - 60 FPS mouse-driven animation  
✅ **No External Libraries** - All math and physics coded manually  
✅ **Clean Architecture** - Organized into logical classes and sections

## 🔬 Mathematical Implementation

### 1. Cubic Bézier Curve Formula

The curve is defined by four control points (P₀, P₁, P₂, P₃) using the parametric equation:

```
B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
```

Where `t ∈ [0, 1]` is the parameter value.

**Implementation Details:**
- P₀ and P₃ are **fixed endpoints** (left and right edges)
- P₁ and P₂ are **dynamic control points** with physics
- The curve is sampled at 100 points (t = 0.00, 0.01, 0.02, ..., 1.00)

### 2. Tangent Vector Calculation

Tangents show the curve's direction at any point, computed using the derivative:

```
B'(t) = 3(1-t)²(P₁-P₀) + 6(1-t)t(P₂-P₁) + 3t²(P₃-P₂)
```

**Implementation:**
- Tangent vectors are normalized (length = 1)
- Drawn at regular intervals along the curve
- Visualized as short white lines perpendicular to the path

### 3. Spring-Damping Physics Model

Each control point (P₁, P₂) follows physics simulation:

```
acceleration = -k × (position - target) - damping × velocity
velocity += acceleration
position += velocity
```

**Parameters:**
- **k (spring stiffness)** = 0.08 - Controls how quickly points snap to target
- **damping** = 0.88 - Friction coefficient (closer to 1 = less friction)

**Behavior:**
- P₁ targets position: `(mouseX - 100, mouseY)` (100px left of cursor)
- P₂ targets position: `(mouseX + 100, mouseY)` (100px right of cursor)
- Creates natural "rope-like" motion with overshoot and settling

## 🏗️ Code Architecture

### File Structure
```
project/
├── index.html      # HTML structure
├── style.css       # Styling and layout
├── script.js       # Main logic (Bézier math + physics)
└── README.md       # This documentation
```

### Class Design

**1. `PhysicsPoint` Class**
- Represents a dynamic control point (P₁ or P₂)
- Properties: `x, y, vx, vy` (position and velocity)
- Methods:
  - `update(targetX, targetY)` - Applies spring physics
  - `draw(ctx)` - Renders as colored circle

**2. `BezierCurve` Class**
- Manages the entire curve system
- Properties: `p0, p1, p2, p3` (four control points)
- Methods:
  - `calculatePoint(t)` - Returns position at parameter t
  - `calculateTangent(t)` - Returns normalized tangent vector at t
  - `update()` - Updates physics for P₁ and P₂
  - `draw(ctx)` - Renders curve, tangents, and control points

**3. Animation Loop**
- Uses `requestAnimationFrame` for 60 FPS
- Steps: Clear canvas → Update physics → Draw curve → Repeat

## 🎨 Design Choices

### Visual Design
- **Dark theme** (#0f172a background) for professional tech aesthetic
- **Cyan curve** (#38bdf8) - High contrast, easy to see
- **Pink control points** (#f472b6) - Distinct from curve
- **Subtle tangents** (rgba white, 30% opacity) - Informative but not distracting

### Physics Tuning
- **Spring stiffness = 0.08** - Provides responsive but not instantaneous motion
- **Damping = 0.88** - Allows slight overshoot for realistic feel
- **100px offset** - Keeps control points separated for clear curve shaping

### Performance
- Fixed 800×500 canvas resolution
- 100 samples provides smooth curves without performance cost
- Tangents drawn every 12th point (8-9 tangents total)

## 🚀 Running the Project

### Option 1: Local Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server
```
Then open `http://localhost:8000`

### Option 2: Direct File
Simply open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)

### Option 3: Live Server (VS Code)
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

## 📊 Technical Specifications

- **Language:** Vanilla JavaScript (ES6+)
- **Canvas API:** 2D rendering context
- **Frame Rate:** 60 FPS (via requestAnimationFrame)
- **Resolution:** 800×500 pixels
- **Browser Support:** All modern browsers (Chrome 90+, Firefox 88+, Safari 14+)

## 🧪 Testing & Validation

**Math Validation:**
- Curve passes through P₀ at t=0 ✓
- Curve passes through P₃ at t=1 ✓
- Tangent vectors have unit length ✓
- Derivative formula matches analytical solution ✓

**Physics Validation:**
- Spring force proportional to displacement ✓
- Damping reduces velocity over time ✓
- System stable (no infinite acceleration) ✓

**Interaction Testing:**
- Mouse tracking accurate across canvas ✓
- 60 FPS maintained on modern hardware ✓
- Smooth motion without jitter ✓

## 🎓 Learning Outcomes

This project demonstrates understanding of:
1. **Parametric curves** - Mathematical representation of smooth paths
2. **Vector calculus** - Computing derivatives for tangent vectors
3. **Classical mechanics** - Spring-mass-damper systems
4. **Real-time graphics** - Canvas API and animation loops
5. **Object-oriented design** - Clean class architecture

## 📝 Future Enhancements (Optional)

- Add touch support for mobile devices
- Implement draggable control points
- Allow adjusting physics parameters via UI sliders
- Add multiple curves with different colors
- Export curve path as SVG

## 👤 Author

**Internship Assignment for FLAM**  
Date: December 2024

---

**Note:** This implementation uses no external libraries. All Bézier mathematics, physics simulation, and rendering are implemented from scratch as per assignment requirements.