import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  title: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tags?: string[];
}

interface Link {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

// Sample data - would be generated from Obsidian vault
const sampleData: GraphData = {
  nodes: [
    { id: 'design-engineering', title: 'Design Engineering', x: 400, y: 250, vx: 0, vy: 0, tags: ['core'] },
    { id: 'react', title: 'React', x: 300, y: 150, vx: 0, vy: 0, tags: ['frontend'] },
    { id: 'webgpu', title: 'WebGPU', x: 500, y: 150, vx: 0, vy: 0, tags: ['graphics'] },
    { id: 'typescript', title: 'TypeScript', x: 200, y: 250, vx: 0, vy: 0, tags: ['language'] },
    { id: 'ai-tools', title: 'AI Tools', x: 550, y: 300, vx: 0, vy: 0, tags: ['ai'] },
    { id: 'solon-ai', title: 'Solon AI', x: 450, y: 380, vx: 0, vy: 0, tags: ['project'] },
    { id: 'astro', title: 'Astro', x: 250, y: 350, vx: 0, vy: 0, tags: ['framework'] },
    { id: 'digital-garden', title: 'Digital Garden', x: 350, y: 420, vx: 0, vy: 0, tags: ['concept'] },
    { id: 'three-js', title: 'Three.js', x: 600, y: 200, vx: 0, vy: 0, tags: ['graphics'] },
    { id: 'brutalism', title: 'Brutalism', x: 150, y: 180, vx: 0, vy: 0, tags: ['design'] },
  ],
  links: [
    { source: 'design-engineering', target: 'react' },
    { source: 'design-engineering', target: 'webgpu' },
    { source: 'design-engineering', target: 'typescript' },
    { source: 'react', target: 'astro' },
    { source: 'webgpu', target: 'three-js' },
    { source: 'ai-tools', target: 'solon-ai' },
    { source: 'design-engineering', target: 'ai-tools' },
    { source: 'astro', target: 'digital-garden' },
    { source: 'solon-ai', target: 'typescript' },
    { source: 'brutalism', target: 'design-engineering' },
    { source: 'digital-garden', target: 'design-engineering' },
  ],
};

const tagColors: Record<string, string> = {
  core: '#FF6B35',
  frontend: '#7C3AED',
  graphics: '#06B6D4',
  language: '#000000',
  ai: '#F472B6',
  project: '#A3E635',
  framework: '#EAB308',
  concept: '#8B5CF6',
  design: '#EC4899',
};

export function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([...sampleData.nodes]);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const isDragging = useRef(false);
  const draggedNode = useRef<Node | null>(null);

  // Physics constants
  const REPULSION = 8000;
  const SPRING_LENGTH = 100;
  const SPRING_STRENGTH = 0.03;
  const DAMPING = 0.9;
  const CENTER_PULL = 0.01;

  const simulate = useCallback(() => {
    const nodes = nodesRef.current;
    const links = sampleData.links;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Apply forces
    nodes.forEach((node, i) => {
      if (draggedNode.current?.id === node.id) return;

      let fx = 0;
      let fy = 0;

      // Repulsion between all nodes
      nodes.forEach((other, j) => {
        if (i === j) return;
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = REPULSION / (dist * dist);
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      });

      // Spring forces for links
      links.forEach((link) => {
        let other: Node | undefined;
        if (link.source === node.id) {
          other = nodes.find((n) => n.id === link.target);
        } else if (link.target === node.id) {
          other = nodes.find((n) => n.id === link.source);
        }
        if (other) {
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - SPRING_LENGTH) * SPRING_STRENGTH;
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        }
      });

      // Center pull
      fx += (centerX - node.x) * CENTER_PULL;
      fy += (centerY - node.y) * CENTER_PULL;

      // Apply velocity
      node.vx = (node.vx + fx) * DAMPING;
      node.vy = (node.vy + fy) * DAMPING;
      node.x += node.vx;
      node.y += node.vy;

      // Bounds
      node.x = Math.max(50, Math.min(dimensions.width - 50, node.x));
      node.y = Math.max(50, Math.min(dimensions.height - 50, node.y));
    });
  }, [dimensions]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nodes = nodesRef.current;
    const links = sampleData.links;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw links
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    links.forEach((link) => {
      const source = nodes.find((n) => n.id === link.source);
      const target = nodes.find((n) => n.id === link.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const isHovered = hoveredNode?.id === node.id;
      const size = isHovered ? 12 : 8;
      const tag = node.tags?.[0] || 'core';
      const color = tagColors[tag] || '#000000';

      // Node square (brutalist style)
      ctx.fillStyle = color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.fillRect(node.x - size, node.y - size, size * 2, size * 2);
      ctx.strokeRect(node.x - size, node.y - size, size * 2, size * 2);

      // Shadow for hovered
      if (isHovered) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(node.x - size + 4, node.y - size + 4, size * 2, size * 2);
        ctx.fillStyle = color;
        ctx.fillRect(node.x - size, node.y - size, size * 2, size * 2);
        ctx.strokeRect(node.x - size, node.y - size, size * 2, size * 2);
      }

      // Label
      ctx.fillStyle = '#000000';
      ctx.font = `${isHovered ? 'bold ' : ''}12px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(node.title, node.x, node.y + size + 6);
    });
  }, [hoveredNode]);

  const animate = useCallback(() => {
    simulate();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [simulate, draw]);

  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging.current && draggedNode.current) {
      draggedNode.current.x = x;
      draggedNode.current.y = y;
      draggedNode.current.vx = 0;
      draggedNode.current.vy = 0;
      return;
    }

    const nodes = nodesRef.current;
    const hovered = nodes.find((node) => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    });
    setHoveredNode(hovered || null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nodes = nodesRef.current;
    const clicked = nodes.find((node) => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    });

    if (clicked) {
      isDragging.current = true;
      draggedNode.current = clicked;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    draggedNode.current = null;
  };

  return (
    <div className="relative w-full h-[500px] border-3 border-brutal-black bg-brutal-white shadow-brutal">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 px-3 py-2 bg-brutal-white border-2 border-brutal-black">
        <span className="font-mono text-xs uppercase tracking-wider">
          System Map // v1.0
        </span>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 px-3 py-2 bg-brutal-white border-2 border-brutal-black">
        <div className="flex flex-wrap gap-2">
          {Object.entries(tagColors).slice(0, 4).map(([tag, color]) => (
            <div key={tag} className="flex items-center gap-1">
              <div
                className="w-3 h-3 border border-brutal-black"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-[10px] uppercase">{tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Tooltip */}
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 px-4 py-2 bg-brutal-black text-brutal-white border-3 border-brutal-black"
        >
          <p className="font-display font-bold text-sm">{hoveredNode.title}</p>
          <p className="font-mono text-xs text-gray-400 uppercase">
            Click to explore →
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default KnowledgeGraph;
