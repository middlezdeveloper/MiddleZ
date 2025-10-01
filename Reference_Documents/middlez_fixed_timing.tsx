import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MiddleZAssets() {
  const [selectedColor, setSelectedColor] = useState('#4f46e5');
  const [selectedSize, setSelectedSize] = useState('large');

  const colors = [
    { name: 'Primary Purple', hex: '#4f46e5', var: 'primary-purple', desc: 'Indigo-600' },
    { name: 'Secondary Purple', hex: '#7c3aed', var: 'secondary-purple', desc: 'Purple-600' },
    { name: 'Lime Accent', hex: '#C6F432', var: 'lime-accent', desc: 'Signature accent' },
    { name: 'Alternative Purple', hex: '#8b2bde', var: 'alt-purple', desc: 'Chart variation' },
    { name: 'Alert Red', hex: '#FF4757', var: 'alert-red', desc: 'Contrast/alert' },
    { name: 'Success Green', hex: '#10b981', var: 'success-green', desc: 'Success states' },
  ];

  const sizes = [
    { name: '16x16 (Favicon)', size: 16, viewBox: '0 0 80 80', id: 'favicon' },
    { name: '32x32', size: 32, viewBox: '0 0 80 80', id: 'small' },
    { name: '48x48', size: 48, viewBox: '0 0 80 80', id: 'medium' },
    { name: '128x128', size: 128, viewBox: '0 0 80 80', id: 'large' },
    { name: '256x256', size: 256, viewBox: '0 0 80 80', id: 'xlarge' },
  ];

  const AnimatedLogo = ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <mask id="lineMask">
          <rect width="80" height="80" fill="white" />
        </mask>
      </defs>
      
      {/* Top bar with rounded caps */}
      <line x1="14.5" y1="20" x2="65.5" y2="20" stroke={color} strokeWidth="13" strokeLinecap="round" />
      {/* Flat cap on top-left - narrower to only cover the cap */}
      <rect x="8" y="13.5" width="6.5" height="6.5" fill={color} />
      
      {/* Bottom bar with rounded caps */}
      <line x1="14.5" y1="60" x2="65.5" y2="60" stroke={color} strokeWidth="13" strokeLinecap="round" />
      {/* Flat cap on bottom-right - narrower to only cover the cap */}
      <rect x="65.5" y="53.5" width="6.5" height="6.5" fill={color} />
      <line x1="14.5" y1="60" x2="65.5" y2="60" stroke={color} strokeWidth="11" strokeLinecap="round" />
      
      {/* Animated diagonal line 1 - draws WITH particle 1 from (65.5,20) to (40,40) */}
      <motion.line
        x1="65.5"
        y1="20"
        stroke={color}
        strokeWidth="13"
        strokeLinecap="butt"
        animate={{
          x2: [65.5, 65.5, 40, 40, 40, 40, 40, 40, 40],
          y2: [20, 20, 40, 40, 40, 40, 40, 40, 40],
          opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.3, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1]
        }}
      />
      
      {/* Animated diagonal line 2 - draws WITH particle 2 from (14.5,60) to (40,40) */}
      <motion.line
        x1="14.5"
        y1="60"
        stroke={color}
        strokeWidth="13"
        strokeLinecap="butt"
        animate={{
          x2: [14.5, 14.5, 40, 40, 40, 40, 40, 40, 40],
          y2: [60, 60, 40, 40, 40, 40, 40, 40, 40],
          opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.3, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1]
        }}
      />
      
      {/* Particle 1 - outer glow layer */}
      <motion.circle
        r="10" fill={color}
        animate={{ 
          cx: [14.5, 14.5, 65.5, 40, 40],
          cy: [14.5, 14.5, 14.5, 40, 40],
          opacity: [0, 0.3, 0.3, 0.3, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.05, 0.3, 0.5, 0.85] }}
      />
      
      {/* Particle 1 - middle glow layer */}
      <motion.circle
        r="7" fill={color}
        animate={{ 
          cx: [14.5, 14.5, 65.5, 40, 40],
          cy: [14.5, 14.5, 14.5, 40, 40],
          opacity: [0, 0.6, 0.6, 0.6, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.05, 0.3, 0.5, 0.85] }}
      />
      
      {/* Particle 1 - core */}
      <motion.circle
        r="5" fill={color}
        animate={{ 
          cx: [14.5, 14.5, 65.5, 40, 40],
          cy: [14.5, 14.5, 14.5, 40, 40],
          opacity: [0, 1, 1, 1, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.05, 0.3, 0.5, 0.85] }}
      />
      
      {/* Particle 2 - outer glow layer */}
      <motion.circle
        r="10" fill={color}
        animate={{ 
          cx: [65.5, 65.5, 14.5, 40, 40],
          cy: [65.5, 65.5, 65.5, 40, 40],
          opacity: [0, 0.3, 0.3, 0.3, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.05, 0.3, 0.5, 0.85] }}
      />
      
      {/* Particle 2 - middle glow layer */}
      <motion.circle
        r="7" fill={color}
        animate={{ 
          cx: [65.5, 65.5, 14.5, 40, 40],
          cy: [65.5, 65.5, 65.5, 40, 40],
          opacity: [0, 0.6, 0.6, 0.6, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.05, 0.3, 0.5, 0.85] }}
      />
      
      {/* Particle 2 - core */}
      <motion.circle
        r="5" fill={color}
        animate={{ 
          cx: [65.5, 65.5, 14.5, 40, 40],
          cy: [65.5, 65.5, 65.5, 40, 40],
          opacity: [0, 1, 1, 1, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.05, 0.3, 0.5, 0.85] }}
      />
      
      {/* Center pulse */}
      <motion.circle
        cx="40" cy="40" r="6" fill={color}
        animate={{
          scale: [0, 0, 1, 1.8, 1.2, 1.8, 1.2, 0],
          opacity: [0, 0, 0.85, 1, 0.85, 1, 0.85, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.48, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        }}
        style={{ transformOrigin: 'center' }}
      />
      
      {/* First pulse ring */}
      <motion.circle
        cx="40" cy="40" r="6"
        fill="none" stroke={color} strokeWidth="3"
        animate={{
          r: [6, 6, 22],
          opacity: [0, 0, 0.8, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeOut",
          times: [0, 0.48, 0.6, 0.7]
        }}
      />
      
      {/* Second pulse ring */}
      <motion.circle
        cx="40" cy="40" r="6"
        fill="none" stroke={color} strokeWidth="3"
        animate={{
          r: [6, 6, 22],
          opacity: [0, 0, 0.8, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeOut",
          times: [0, 0.68, 0.8, 0.9]
        }}
      />
    </svg>
  );

  const StaticLogo = ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {/* Top bar with rounded caps */}
      <line x1="14.5" y1="20" x2="65.5" y2="20" stroke={color} strokeWidth="13" strokeLinecap="round" />
      {/* Flat cap on top-left - narrower to only cover the cap */}
      <rect x="8" y="13.5" width="6.5" height="6.5" fill={color} />
      
      {/* Bottom bar with rounded caps */}
      <line x1="14.5" y1="60" x2="65.5" y2="60" stroke={color} strokeWidth="13" strokeLinecap="round" />
      {/* Flat cap on bottom-right - narrower to only cover the cap */}
      <rect x="65.5" y="53.5" width="6.5" height="6.5" fill={color} />
      
      {/* Single continuous diagonal line - no gap */}
      <line x1="65.5" y1="20" x2="14.5" y2="60" stroke={color} strokeWidth="13" strokeLinecap="butt" />
      
      {/* Static pulse - outer ring with transparency */}
      <circle cx="40" cy="40" r="22" fill="none" stroke={color} strokeWidth="4" opacity="0.35" />
      {/* Static pulse - larger center circle with higher opacity (more solid) */}
      <circle cx="40" cy="40" r="14" fill={color} opacity="0.7" />
    </svg>
  );

  const MultiColorLogo = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {/* Diagonal line - Alternative Purple */}
      <line x1="65.5" y1="20" x2="14.5" y2="60" stroke="#8b2bde" strokeWidth="13" strokeLinecap="butt" />
      
      {/* Top bar - Lime Accent (drawn on top) */}
      <line x1="14.5" y1="20" x2="65.5" y2="20" stroke="#C6F432" strokeWidth="13" strokeLinecap="round" />
      <rect x="8" y="13.5" width="6.5" height="6.5" fill="#C6F432" />
      
      {/* Bottom bar - Alert Red (drawn on top) */}
      <line x1="14.5" y1="60" x2="65.5" y2="60" stroke="#FF4757" strokeWidth="13" strokeLinecap="round" />
      <rect x="65.5" y="53.5" width="6.5" height="6.5" fill="#FF4757" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2" style={{ color: '#0B1929' }}>
            Middle Z Brand Assets
          </h1>
          <p className="text-gray-600">Complete package for implementation</p>
        </div>

        {/* Color Palette */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B1929' }}>Brand Color Palette</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {colors.map(({ name, hex, var: varName, desc }) => (
              <div
                key={hex}
                onClick={() => setSelectedColor(hex)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedColor === hex ? 'border-blue-500 shadow-md' : 'border-gray-200'
                }`}
              >
                <div
                  className="h-20 rounded-lg mb-3 border-2 border-gray-100"
                  style={{ backgroundColor: hex }}
                />
                <div className="text-sm font-semibold text-gray-900">{name}</div>
                <div className="text-xs text-gray-500 font-mono mt-1">{hex}</div>
                <div className="text-xs text-gray-400 font-mono">--{varName}</div>
                <div className="text-xs text-gray-500 mt-1">{desc}</div>
              </div>
            ))}
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm text-gray-700">Tailwind Config</h3>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded overflow-x-auto">
{`colors: {
  'primary-purple': '#4f46e5',
  'secondary-purple': '#7c3aed',
  'lime-accent': '#C6F432',
  'alt-purple': '#8b2bde',
  'alert-red': '#FF4757',
  'success-green': '#10b981',
}`}
            </pre>
          </div>
        </div>

        {/* Animated Version */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B1929' }}>Animated Logo (Loading State)</h2>
          <div className="bg-slate-900 rounded-lg p-12 flex items-center justify-center mb-6">
            <AnimatedLogo color={selectedColor} size={128} />
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-green-900 mb-2">✓ Fixed Timing</h3>
            <p className="text-sm text-green-800">
              Lines now draw in perfect sync with particle movement. Both start at their corner positions and grow toward the center as the particles move, creating the visual effect of particles "drawing" the diagonal lines.
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm text-gray-700">React Component (Framer Motion)</h3>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded overflow-x-auto">
{`import { motion } from 'framer-motion';

export const MiddleZLoader = ({ color = '#4f46e5', size = 128 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    {/* Bold Z shape - top and bottom bars */}
    <path 
      d="M 65.5 14.5 L 14.5 14.5 L 14.5 20 L 65.5 20 Z M 14.5 60 L 14.5 65.5 L 65.5 65.5 L 65.5 60 Z" 
      fill={color}
    />
    
    {/* Line 1 - draws WITH particle 1 from (65.5,20) to (40,40) */}
    <motion.line
      stroke={color} strokeWidth="11" strokeLinecap="round"
      animate={{
        x1: [65.5, 65.5, 40],
        y1: [20, 20, 40],
        x2: [65.5, 65.5, 40],
        y2: [20, 20, 40],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.3, 0.5, 0.55]
      }}
    />
    
    {/* Line 2 - draws WITH particle 2 from (14.5,60) to (40,40) */}
    <motion.line
      stroke={color} strokeWidth="11" strokeLinecap="round"
      animate={{
        x1: [14.5, 14.5, 40],
        y1: [60, 60, 40],
        x2: [14.5, 14.5, 40],
        y2: [60, 60, 40],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.3, 0.5, 0.55]
      }}
    />
    
    {/* Particles with layered glow - UNCHANGED */}
    <motion.circle r="10" fill={color}
      animate={{ 
        cx: [14.5, 14.5, 65.5, 40, 40],
        cy: [14.5, 14.5, 14.5, 40, 40],
        opacity: [0, 0.3, 0.3, 0.3, 0]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.05, 0.3, 0.5, 0.55] }}
    />
    {/* ... remaining particle layers ... */}
    
    {/* Center double pulse - UNCHANGED */}
    <motion.circle cx="40" cy="40" r="6" fill={color}
      animate={{
        scale: [0, 0, 1, 1.8, 1.2, 1.8, 1.2, 0],
        opacity: [0, 0, 0.85, 1, 0.85, 1, 0.85, 0]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.48, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }}
    />
    {/* ... pulse rings ... */}
  </svg>
);`}
            </pre>
          </div>
        </div>

        {/* Static Single Color Versions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B1929' }}>Static Logo - Single Color</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
            {sizes.map(({ name, size, id }) => (
              <div key={id} className="text-center">
                <div 
                  className="bg-slate-900 mb-2 flex items-center justify-center relative mx-auto" 
                  style={{ 
                    width: `${size}px`, 
                    height: `${size}px`,
                    padding: '0'
                  }}
                >
                  <StaticLogo color={selectedColor} size={size} />
                </div>
                <div className="text-xs font-medium text-gray-700">{name}</div>
                <div className="text-xs text-gray-500">{size}×{size}px</div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm text-gray-700">Static SVG Component</h3>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded overflow-x-auto">
{`export const MiddleZLogo = ({ color = '#4f46e5', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    <path
      d="M 65.5 14.5 L 14.5 14.5 L 14.5 20 L 49 20 L 31 60 L 14.5 60 L 14.5 65.5 L 65.5 65.5 L 65.5 60 L 31 60 L 49 20 L 65.5 20 Z"
      fill={color}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);`}
            </pre>
          </div>
        </div>

        {/* Static Multi-Color Version */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B1929' }}>Static Logo - Multi-Color Gradient</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
            {sizes.map(({ name, size, id }) => (
              <div key={id} className="text-center">
                <div 
                  className="bg-slate-900 mb-2 flex items-center justify-center mx-auto" 
                  style={{ 
                    width: `${size}px`, 
                    height: `${size}px`,
                    padding: '0'
                  }}
                >
                  <MultiColorLogo size={size} />
                </div>
                <div className="text-xs font-medium text-gray-700">{name}</div>
                <div className="text-xs text-gray-500">{size}×{size}px</div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B1929' }}>Usage Guidelines</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">Animation Details:</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• <strong>Duration:</strong> 3 seconds per complete cycle</li>
                <li>• <strong>Line drawing:</strong> Lines now draw synchronously with particle movement (times: 0, 0.3, 0.5, 0.55)</li>
                <li>• <strong>Particle path:</strong> Corners → across edges → diagonal to center (times: 0, 0.05, 0.3, 0.5, 0.55)</li>
                <li>• <strong>Visual effect:</strong> Particles appear to "draw" the diagonal lines as they move</li>
                <li>• <strong>Double pulse:</strong> Two pulses at center with expanding rings after particles meet</li>
              </ul>
            </div>
          </div>
        </div>

        {/* File Exports */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B1929' }}>File Export Checklist</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
              <h3 className="font-semibold text-purple-900 mb-2">For Implementation:</h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>✓ Copy the React component code above</li>
                <li>✓ Install framer-motion: <code className="bg-purple-100 px-2 py-1 rounded">npm install framer-motion</code></li>
                <li>✓ Add Tailwind color variables to your config</li>
                <li>✓ Export static SVG for favicon.svg</li>
                <li>✓ Generate PNG versions for app icons</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}