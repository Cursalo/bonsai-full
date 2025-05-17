import React from 'react';
import { Box, SvgIcon, Typography, useTheme, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

interface BonsaiTreeProps {
  progress: number; // e.g., number of skills mastered, range 0-15 (adjust max as needed)
}

// Styled group for hover effects
const GrowthStageGroup = styled('g')(({ theme }) => ({
  transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
  '&:hover': {
    opacity: 0.8,
    transform: 'scale(1.03)', // Slight zoom on hover
    cursor: 'pointer', // Indicate interactivity
  },
}));

// Revised SVG attempt with more organic shapes
const BonsaiSvg = ({ progress }: BonsaiTreeProps) => {
  const theme = useTheme();
  const primaryLeafColor = theme.palette.primary.main; 
  const trunkColor = '#7a4a3a'; // Darker, less reddish brown
  const potColor = '#886a5e';   // Muted terracotta
  const potRimColor = '#a08478'; // Lighter rim

  // Define leaf colors - slightly muted greens + primary
  const leafColors = ['#556B2F', '#6B8E23', primaryLeafColor, '#2E8B57', '#3CB371']; 
  const getLeafColor = (index: number) => leafColors[index % leafColors.length];

  // --- Adjusted LeafCluster with Ellipses ---
  const LeafCluster = ({ cx, cy, scale = 1, colorIndex = 0 }: { cx: number; cy: number; scale?: number; colorIndex?: number }) => (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      {/* Using ellipses for a more leaf-like shape */}
      <ellipse transform="rotate(-15 0 -6)" cx="0" cy="-6" rx="5" ry="3.5" fill={getLeafColor(colorIndex)} />
      <ellipse transform="rotate(10 -6 -1)" cx="-6" cy="-1" rx="6" ry="4" fill={getLeafColor(colorIndex + 1)} />
      <ellipse transform="rotate(-5 6 -1)" cx="6" cy="-1" rx="5" ry="3" fill={getLeafColor(colorIndex + 2)} />
      <ellipse transform="rotate(20 0 4)" cx="0" cy="4" rx="4.5" ry="3" fill={getLeafColor(colorIndex + 3)} />
    </g>
  );

  return (
    <SvgIcon 
      viewBox="0 0 100 100" 
      sx={{ 
        width: '100%', 
        height: 'auto', 
        maxHeight: 300, 
      }}
      titleAccess="Bonsai Tree Progress"
    >
      {/* Pot */}
      <path d="M20,95 C20,99 80,99 80,95 L78,88 L22,88 Z" fill={potColor} />
      <path d="M22,88 C22,90 78,90 78,88 L76,85 L24,85 Z" fill={potRimColor} />
      <ellipse cx="50" cy="85" rx="26" ry="1.5" fill={potColor} opacity="0.4" />

      {/* --- Base Trunk --- */}
      <path 
        d="M50,87 C 50,80 45,70 48,60 C 52,48 45,40 50,30 C 55,20 52,15 55,10" 
        stroke={trunkColor} 
        strokeWidth="10" 
        strokeLinejoin="round" 
        strokeLinecap="round" 
        fill="none"
      />

      {/* --- Growth Stages with Tooltips and Hover Effects --- */}
      
      {/* Stage 1 & 2: Lower right branch + leaves -> Basic Punctuation */}
      {progress >= 1 && (
        <Tooltip title="Mastered: Basic Punctuation" placement="right" arrow>
          <GrowthStageGroup>
            <path d="M48,65 C 55,63 60,60 65,55" stroke={trunkColor} strokeWidth="6" strokeLinecap="round" fill="none" />
            {progress >= 2 && <LeafCluster cx={65} cy={55} scale={0.8} colorIndex={0} />} 
          </GrowthStageGroup>
        </Tooltip>
      )}

      {/* Stage 3 & 4: Lower left branch + leaves -> Linear Equations Lvl 1 */}
      {progress >= 3 && (
        <Tooltip title="Mastered: Linear Equations Lvl 1" placement="left" arrow>
          <GrowthStageGroup>
            <path d="M47,58 C 40,55 35,50 30,47" stroke={trunkColor} strokeWidth="5" strokeLinecap="round" fill="none" />
            {progress >= 4 && <LeafCluster cx={30} cy={47} scale={0.7} colorIndex={1} />}
          </GrowthStageGroup>
        </Tooltip>
      )}

      {/* Stage 5 & 7: Mid-upper right branch + leaves -> Reading: Main Idea */}
      {progress >= 5 && (
        <Tooltip title="Mastered: Reading - Main Idea" placement="right" arrow>
          <GrowthStageGroup>
            <path d="M50,35 C 58,33 65,30 72,28" stroke={trunkColor} strokeWidth="5" strokeLinecap="round" fill="none" />
            {progress >= 7 && <LeafCluster cx={72} cy={28} scale={0.9} colorIndex={2} />}
          </GrowthStageGroup>
        </Tooltip>
      )}

      {/* Stage 10 & 12: Top left branch + leaves -> Geometry: Circles */}
      {progress >= 10 && (
        <Tooltip title="Mastered: Geometry - Circles" placement="left" arrow>
          <GrowthStageGroup>
             <path d="M52,20 C 45,18 40,15 35,15" stroke={trunkColor} strokeWidth="4" strokeLinecap="round" fill="none" />
             {progress >= 12 && <LeafCluster cx={35} cy={15} scale={0.8} colorIndex={3} />}
          </GrowthStageGroup>
        </Tooltip>
      )}

      {/* Stage 15: Top canopy leaves -> Advanced Functions */}
      {progress >= 15 && (
        <Tooltip title="Mastered: Advanced Functions" placement="top" arrow>
          <GrowthStageGroup>
            <LeafCluster cx={55} cy={10} scale={1} colorIndex={4} />
          </GrowthStageGroup>
        </Tooltip>
      )}

    </SvgIcon>
  );
};

const BonsaiTree: React.FC<BonsaiTreeProps> = ({ progress }) => {
  // Adjust max progress if needed, based on the stages defined above
  const maxProgress = 15; 
  const clampedProgress = Math.min(progress, maxProgress); 

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" gutterBottom color="text.secondary">
        Your Growth Tree
      </Typography>
      <BonsaiSvg progress={clampedProgress} />
    </Box>
  );
};

export default BonsaiTree; 