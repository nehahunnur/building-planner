import '@testing-library/jest-dom'

// Mock canvas context for tests
HTMLCanvasElement.prototype.getContext = () => {
  return {
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    rect: () => {},
    arc: () => {},
    fillRect: () => {},
    fillText: () => {},
    closePath: () => {},
  };
};

// Mock window.polygonPoints for polygon drawing tests
global.window.polygonPoints = [];
