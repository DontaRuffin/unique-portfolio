import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  index?: number;
}

export function ProjectCard({
  title,
  description,
  tags,
  image,
  liveUrl,
  githubUrl,
  featured = false,
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "group relative border-3 border-brutal-black bg-brutal-white",
        "shadow-brutal transition-all duration-200",
        "hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-hover",
        featured && "md:col-span-2"
      )}
    >
      {/* Image */}
      {image && (
        <div className="relative aspect-video border-b-3 border-brutal-black overflow-hidden bg-brutal-cream">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-brutal-black/0 group-hover:bg-brutal-black/20 transition-colors duration-300" />
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider border-2 border-brutal-black bg-brutal-cream"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Title */}
        <h3 className="font-display font-bold text-xl mb-2 group-hover:text-brutal-orange transition-colors">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {description}
        </p>
        
        {/* Links */}
        <div className="flex items-center gap-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider hover:text-brutal-orange transition-colors"
            >
              <span>View Live</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider hover:text-brutal-violet transition-colors"
            >
              <Github className="w-3 h-3" />
              <span>Code</span>
            </a>
          )}
        </div>
      </div>
      
      {/* Featured badge */}
      {featured && (
        <div className="absolute -top-3 -right-3 px-3 py-1 bg-brutal-orange text-white font-mono text-xs uppercase tracking-wider border-3 border-brutal-black shadow-brutal-sm rotate-brutal-2">
          Featured
        </div>
      )}
    </motion.article>
  );
}

export default ProjectCard;
