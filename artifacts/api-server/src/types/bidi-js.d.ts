declare module "bidi-js" {
  type Direction = "rtl" | "ltr";

  interface EmbeddingLevels {
    levels: Uint8Array;
    paragraphs: Array<{ start: number; end: number; level: number }>;
  }

  interface Bidi {
    getEmbeddingLevels(text: string, direction?: Direction): EmbeddingLevels;
  }

  export default function bidiFactory(): Bidi;
}