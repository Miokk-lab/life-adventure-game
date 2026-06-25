/// <reference types="vite/client" />

declare module '*.png' {
  const src: string;
  export default src;
}

declare module 'animal-island-ui/items/*.png' {
  const src: string;
  export default src;
}
