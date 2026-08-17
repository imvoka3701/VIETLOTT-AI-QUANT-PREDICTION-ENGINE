import React from 'react';

export default function LotteryBall({
  number,
  size = 'md',
  isBonus = false,
  isMatched = false,
  onClick = null,
  isSelected = false
}) {
  const num = parseInt(number, 10);

  // Size mapping
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-14 h-14 text-lg font-black'
  };

  // Color mapping based on number range
  let colorClass = 'ball-blue';
  if (isBonus) {
    colorClass = 'ball-bonus';
  } else if (num <= 10) {
    colorClass = 'ball-red';
  } else if (num <= 20) {
    colorClass = 'ball-blue';
  } else if (num <= 30) {
    colorClass = 'ball-gold';
  } else if (num <= 40) {
    colorClass = 'ball-green';
  } else {
    colorClass = 'ball-purple';
  }

  const matchedStyle = isMatched
    ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-slate-900 scale-110 shadow-lg shadow-yellow-500/50 animate-bounce'
    : '';

  const selectedStyle = isSelected
    ? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-slate-900 scale-105 shadow-md shadow-cyan-500/40'
    : '';

  const clickableStyle = onClick ? 'cursor-pointer hover:scale-110 hover:brightness-110' : '';

  return (
    <div
      onClick={onClick ? () => onClick(num) : undefined}
      className={`ball ${sizeClasses[size] || sizeClasses.md} ${colorClass} ${matchedStyle} ${selectedStyle} ${clickableStyle}`}
      title={`Bóng số ${num}${isBonus ? ' (Bóng đặc biệt)' : ''}`}
    >
      <span className="relative z-10 font-mono tracking-tight drop-shadow-md">
        {String(num).padStart(2, '0')}
      </span>
    </div>
  );
}
