import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from "util";
import { File, Blob } from "buffer";

(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;
(globalThis as any).File = File;
(globalThis as any).Blob = Blob;