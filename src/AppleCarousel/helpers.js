export const getPosition = (e) => {
  const posX = (e.touches !== undefined && e.touches[0]) ? e.touches[0].pageX : e.clientX;
  const posY = (e.touches !== undefined && e.touches[0]) ? e.touches[0].pageY : e.clientY;
  return { posX, posY };    
}

export const getCurrentMillis = () => new Date().getTime();
