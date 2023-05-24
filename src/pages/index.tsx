import { type NextPage } from "next";
import Head from "next/head";

import { useState } from "react";
import { type Character } from "@prisma/client";
import { CharacterSheet } from "~/components/CharacterSheet";
import { PromptForm } from "~/components/PromptForm";

const Home: NextPage = () => {
  const [loadingState, setLoadingState] = useState("idle");
  const [character, setCharacter] = useState<Character | null>();

  const handleFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    let url = "/api/generate/character";
    const form = e.target as HTMLFormElement;
    const elements = form.elements as typeof form.elements & {
      prompt: { value: string };
    };

    if (elements.prompt.value != "") {
      const params = { prompt: elements.prompt.value };
      url += "?" + new URLSearchParams(params).toString();
    }

    setLoadingState("loading");

    // QUESTION:
    // This throws some ESLint error @typescript-eslint/no-misused-promises and
    // checksVoidReturn ... I disabled the ESLint rule for now.
    const response = await fetch(url);
    const data = (await response.json()) as Character;

    setLoadingState("done");

    setCharacter(data);
  };

  return (
    <>
      <Head>
        <title>Mythweaver</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://use.typekit.net/myw3kls.css" />
      </Head>
      <main className="flex min-h-[100vh] flex-col items-center justify-center">
        <div className="py-4 text-center font-heading text-2xl uppercase text-stone-700">
          Mythweaver
        </div>
        <div className="flex flex-grow flex-col items-center justify-center">
          {loadingState == "idle" && (
            <PromptForm handleFormSubmit={handleFormSubmit} />
          )}

          {loadingState == "loading" && <div>Loading...</div>}

          {character && <CharacterSheet character={character} />}
        </div>
      </main>
    </>
  );
};

export default Home;
