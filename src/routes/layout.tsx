import { component$, Slot, useClientEffect$, useStore } from '@builder.io/qwik';
import Header from '../components/header/header';
import * as rawData$ from '../candidates.json';

export default component$(() => {
  const data$: Record<string, string> = (rawData$ as any).default;
  const store = useStore({
    char: "",
  })
  useClientEffect$(() => {
    const keys = Object.keys(data$);
    const char = data$[keys[Math.floor(keys.length * Math.random())]];
    store.char = char;
  });
  return (
    <>
      <main>
        <Header />
        <section>
          <Slot />
        </section>
      </main>
      <footer>
        <a href="https://www.builder.io/" target="_blank">
          Made with ♡ by Builder.io {store.char}
        </a>
      </footer>
    </>
  );
});
