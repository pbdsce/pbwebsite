declare global{
    interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (
        element: string,
        options: { sitekey: string; callback: (token: string | null) => void }
      ) => void;
      execute: (siteKey: string, options?: { action?: string }) => Promise<string>;
      reset: () => void;
      getResponse: () => string;
    };
  }
}
export{};
