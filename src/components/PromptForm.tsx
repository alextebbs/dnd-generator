import type { Character } from "~/utils/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { FaDiceD20 } from "react-icons/fa";

import Image from "next/image";
import { LoadingSpinner } from "./LoadingSpinner";

const EXAMPLES = [
  "the wayward heir of a tyrant queen",
  "the last of a long line of sorcerers",
  "the inventor of arcane magic",
  "a devout worshipper of a forgotten god",
  "a former slave of a powerful warlord",
  "an introverted ranger from a frostbitten realm",
  "a diviner who is terrified of the future",
  "a charismatic bard who is secretly a foreign spy",
  "a changeling searching for their true identity",
  "a barbarian haunted by the ghost of their dead lover",
  "a benign ruler of a kingdom of undead",
];

export const PromptForm: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const contentEditableRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [examples, setExamples] = useState<string[] | null>(null);

  const shuffle = (array: string[]) => {
    const shuffled = array.sort(() => Math.random() - 0.5);
    setExamples(shuffled.slice(0, 3));
  };

  useEffect(() => {
    shuffle(EXAMPLES);
  }, []);

  const handleExampleClick = (example: string) => {
    const input = inputRef.current as HTMLInputElement;
    input.value = example;

    const contentEditable = contentEditableRef.current as HTMLSpanElement;
    contentEditable.innerText = example;
  };

  const handleFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const form = e.target as HTMLFormElement;
    const elements = form.elements as typeof form.elements & {
      prompt: { value: string };
    };

    let url = `/api/character/generate`;

    if (elements.prompt.value) {
      url += `?prompt=${elements.prompt.value}`;
    }

    try {
      const response = await fetch(url);
      const character = (await response.json()) as Character;
      router.push(`/character/${character.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromptInput = (e: React.SyntheticEvent<HTMLSpanElement>) => {
    const span = e.target as HTMLSpanElement;
    const input = inputRef.current as HTMLInputElement;
    input.value = span.innerText;
  };

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="mx-auto max-w-[50rem] p-4 text-center">
          {!isLoading ? (
            <>
              <div className="mb-8 flex justify-center">
                <Image
                  quality={100}
                  src="/book-2.png"
                  width={256}
                  height={186}
                  alt="An Old Book"
                />
              </div>

              <p className="mb-2 text-sm">
                Complete the sentence below to generate a character.
              </p>

              <p className="text-xs italic text-stone-500">
                (or leave it empty to generate a random character)
              </p>

              <form onSubmit={handleFormSubmit}>
                <div className="my-8 font-heading text-3xl">
                  The character is{" "}
                  <span
                    contentEditable
                    ref={contentEditableRef}
                    onInput={handlePromptInput}
                    className="inline-block min-w-[200px] border-b text-left focus:outline-none"
                  ></span>
                  .
                </div>

                <input ref={inputRef} type="hidden" name="prompt" />

                <div>
                  <button
                    className="inline-flex rounded border border-red-600 p-3 px-8 font-heading text-2xl tracking-[0.05em] text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                    type="submit"
                  >
                    Roll
                    <FaDiceD20 className="relative top-[0.2rem] ml-4" />
                  </button>
                </div>
              </form>

              <p className="mt-12 text-xs text-stone-400">For example...</p>

              <ul className="mb-4 mt-2 text-xs text-stone-400">
                {examples?.map((example) => (
                  <li
                    key={example}
                    className="mb-2 cursor-pointer hover:text-stone-600"
                    onClick={() => handleExampleClick(example)}
                  >
                    &ldquo;<span>The character is {example}.</span>&rdquo;
                  </li>
                ))}
              </ul>

              <button
                onClick={() => shuffle(EXAMPLES)}
                className="inline-flex rounded px-4 py-2 text-xs uppercase tracking-[0.15em] text-stone-600 hover:bg-stone-900 hover:text-red-600"
              >
                Reroll these
                <FaDiceD20 className="relative top-[0.1rem] ml-2" />
              </button>
            </>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </main>
  );
};
