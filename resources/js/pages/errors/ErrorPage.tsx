import { useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FaRocket, FaHome, FaExclamationTriangle } from 'react-icons/fa';

export default function ErrorPage({ status, statusText, message }: { status: number, statusText: string, message: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Space animation variables
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      twinkle: number;
    }> = [];

    const meteors: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
    }> = [];

    const planets: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      orbit: number;
    }> = [];

    // Initialize stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2
      });
    }

    // Initialize meteors
    for (let i = 0; i < 3; i++) {
      meteors.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 80 + 20,
        speed: Math.random() * 3 + 2,
        angle: Math.random() * Math.PI / 4 + Math.PI / 4,
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    // Initialize planets
    const planetColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#fecca7'];
    for (let i = 0; i < 5; i++) {
      planets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 10,
        color: planetColors[i],
        speed: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2,
        orbit: Math.random() * 100 + 50
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create space gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, 'rgba(25, 25, 112, 0.3)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animate and draw stars
      stars.forEach((star) => {
        star.y += star.speed;
        star.twinkle += 0.1;
        
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        const twinkleEffect = Math.sin(star.twinkle) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkleEffect})`;
        ctx.fill();

        // Add star glow
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.1 * twinkleEffect})`;
        ctx.fill();
      });

      // Animate and draw meteors
      meteors.forEach((meteor) => {
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;

        if (meteor.x > canvas.width + 100 || meteor.y > canvas.height + 100) {
          meteor.x = -100;
          meteor.y = Math.random() * canvas.height / 2;
        }

        // Draw meteor trail
        const gradient = ctx.createLinearGradient(
          meteor.x, meteor.y,
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
        gradient.addColorStop(0.5, `rgba(100, 200, 255, ${meteor.opacity * 0.6})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length
        );
        ctx.stroke();
      });

      // Animate and draw planets
      planets.forEach((planet) => {
        planet.angle += planet.speed * 0.01;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        planet.x = centerX + Math.cos(planet.angle) * planet.orbit;
        planet.y = centerY + Math.sin(planet.angle) * planet.orbit;

        // Draw planet glow
        const glowGradient = ctx.createRadialGradient(
          planet.x, planet.y, 0,
          planet.x, planet.y, planet.size * 2
        );
        glowGradient.addColorStop(0, planet.color + '80');
        glowGradient.addColorStop(1, planet.color + '00');
        
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Draw planet
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.fill();

        // Add planet highlight
        ctx.beginPath();
        ctx.arc(planet.x - planet.size * 0.3, planet.y - planet.size * 0.3, planet.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      });

      // Add nebula effect
      let time = 0;
      time += 0.01;
      for (let i = 0; i < 3; i++) {
        const x = canvas.width / 2 + Math.cos(time + i) * 200;
        const y = canvas.height / 2 + Math.sin(time + i * 2) * 150;
        
        const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, 100);
        nebulaGradient.addColorStop(0, `rgba(${100 + i * 50}, ${50 + i * 30}, 255, 0.05)`);
        nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, 100, 0, Math.PI * 2);
        ctx.fillStyle = nebulaGradient;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []); // Remove animationId from dependency array since it's managed internally

  const title = `${status} - ${statusText}`;

  // Get error icon and color based on status
  const getErrorConfig = (status: number) => {
    if (status >= 500) {
      return { icon: FaExclamationTriangle, color: 'from-red-500 to-orange-500', glow: 'shadow-red-500/20' };
    } else if (status >= 400) {
      return { icon: FaRocket, color: 'from-blue-500 to-purple-500', glow: 'shadow-blue-500/20' };
    }
    return { icon: FaExclamationTriangle, color: 'from-yellow-500 to-orange-500', glow: 'shadow-yellow-500/20' };
  };

  const errorConfig = getErrorConfig(status);

  return (
    <>
      <Head title={title}>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      
      {/* Animated space background canvas */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)' }}
      />

      {/* Content overlay */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 text-center z-10">
        
        {/* Floating error container */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.6, -0.05, 0.01, 0.99],
            type: "spring",
            stiffness: 100
          }}
          className="relative max-w-2xl w-full"
        >
          {/* Main error card */}
          <div className="relative bg-black/40 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl">
            
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl animate-pulse"></div>
            
            {/* Error icon with animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              className="relative mb-8"
            >
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${errorConfig.color} flex items-center justify-center ${errorConfig.glow} shadow-2xl`}>
                <errorConfig.icon className="w-12 h-12 text-white animate-pulse" />
              </div>
              
              {/* Orbiting particles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 w-2 h-2 bg-pink-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-0 w-2 h-2 bg-cyan-400 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              </motion.div>
            </motion.div>

            {/* Error code with glitch effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="relative mb-6"
            >
              <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2 relative">
                {status}
                {/* Glitch overlay */}
                <span className="absolute inset-0 text-8xl sm:text-9xl font-bold text-red-400 opacity-0 animate-ping" style={{ animationDuration: '3s' }}>
                  {status}
                </span>
              </h1>
            </motion.div>

            {/* Status text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              {statusText}
            </motion.h2>

            {/* Error message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-lg text-gray-300 mb-8 leading-relaxed"
            >
              {message}
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.a
                href="/"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-3"
              >
                <FaHome className="w-5 h-5" />
                <span>Return to Earth</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </motion.a>

              <motion.button
                onClick={() => window.history.back()}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-transparent border-2 border-blue-400/50 text-blue-400 px-8 py-4 rounded-full font-semibold hover:bg-blue-400/10 transition-all duration-300 flex items-center space-x-3"
              >
                <FaRocket className="w-5 h-5 transform group-hover:-rotate-45 transition-transform duration-300" />
                <span>Previous Galaxy</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Floating cosmic debris */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-10 -right-10 w-20 h-20 opacity-30"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-xl"></div>
          </motion.div>

          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 0.8, 1]
            }}
            transition={{ 
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -bottom-10 -left-10 w-16 h-16 opacity-30"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-pink-400 to-red-400 blur-xl"></div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 text-gray-400 text-sm"
        >
          <p>&copy; {new Date().getFullYear()} NexusShop. Lost in space but not in service.</p>
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, particleIndex) => (
            <motion.div
              key={particleIndex}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{ 
                y: [null, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
