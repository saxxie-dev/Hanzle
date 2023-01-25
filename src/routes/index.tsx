import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import App from '~/components/app/App';
import Input from '~/components/input/input';

export default component$(() => {
  return <App />;
});

export const head: DocumentHead = {
  title: '汉字le ideograph guessing game',
  meta: [
    {
      name: 'description',
      content: 'wordle-knockoff for guessing chinese characters',
    },
  ],
};
