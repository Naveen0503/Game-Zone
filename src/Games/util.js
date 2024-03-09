import { useEffect } from "react";

export const useEvent = (event, handler, passive = false) => {
  useEffect(() => {
    // initiate the event handler
    window.addEventListener(event, handler, passive);

    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      window.removeEventListener(event, handler);
    };
  });
};


export const getColors = (num,gameoverrr) => {
  if(gameoverrr) {
    return `url("./images/game-over.gif")`
  }
  else {
    switch (num) {
      case 2:
        return `url("./images/2.gif")`;
      case 4:
        return `url("./images/4.gif")`;
      case 8:
        return `url("./images/8.gif")`;
      case 16:
        return `url("./images/16.gif")`;
      case 32:
        return `url("./images/32.gif")`;
      case 64:
        return `url("./images/64.gif")`;
      case 128:
        return `url("./images/128.gif")`;
      case 256:
        return `url("./images/256.gif")`;
      case 512:
        return `url("./images/512.gif")`;
      case 1024:
        return `url("./images/1024.gif")`;
      case 2048:
        return `url("./images/2048.gif")`;
      default:
        return "#3d2963";
    }
  }
  };
  