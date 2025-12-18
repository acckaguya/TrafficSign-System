import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Camera } from 'lucide-react';

const VideoTelemetry = forwardRef(({ src, onFileSelect }, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    
    captureFrame: () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas) return null;
      
      if (video.videoWidth === 0 || video.videoHeight === 0) return null;

      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      

      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      return canvas.toDataURL('image/jpeg', 1.0);
    }
  }));

  return (
    <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl">
      {src ? (
        <video 
          ref={videoRef} 
          src={src} 
          className="w-full h-full object-cover opacity-90" 
          muted 
          loop 
          playsInline 
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg hover:scale-105 transform">
            <Camera className="w-5 h-5" /> 上传路况视频 (1080P)
            <input type="file" className="hidden" accept="video/*" onChange={onFileSelect} />
          </label>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
});

export default VideoTelemetry;