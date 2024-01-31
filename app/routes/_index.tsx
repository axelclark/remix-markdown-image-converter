import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Markdown Image Converter" },
    { name: "description", content: "A Remix App Image Converter!" },
  ];
};

export default function Index() {
  const [markdownInput, setMarkdownInput] = useState("");
  const [markdownOutput, setMarkdownOutput] = useState([]);
  const outputParagraphs = markdownOutput.map((line) => <p>{line}</p>);

  function handleInputChange(event) {
    setMarkdownInput(event.target.value);
  }

  function handleSubmit(event: Event) {
    console.log(event);
    // updateOutput();
    event.preventDefault();
    console.log("Input Value:", markdownInput);
    const updatedLines = processLines(markdownInput);
    setMarkdownOutput(updatedLines);
  }

  function processLines(input: String) {
    const lines = input.split("\n").filter((line) => line !== "");

    const updatedLines = lines.map((line) => {
      if (line.startsWith("![")) {
        const remaining = line.replace("![", "");
        const [alt_text, src] = remaining.split("](");
        const [url, _rest] = src.split(")");
        return `<img src="${url}" alt="${alt_text}" width="300"><br/>\n`;
      } else return line;
    });

    return updatedLines;
  }

  function resetValues() {
    setMarkdownInput("");
    setMarkdownOutput([]);
  }

  function toggleState(el) {
    el.querySelector(".before-copied").classList.toggle("hidden");
    el.querySelector(".after-copied").classList.toggle("hidden");
  }

  function copyToClipboard(event: Event) {
    const el = event.currentTarget;

    if ("clipboard" in navigator) {
      const trimmedText = markdownOutput.join("\n");

      navigator.clipboard.writeText(trimmedText);
      toggleState(el);
      setTimeout(() => {
        toggleState(el);
      }, 3000);
    } else {
      alert("Sorry, your browser does not support clipboard copy.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="py-24 mx-auto max-w-4xl sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Convert Markdown Image Tags to HTML
          </h2>
        </div>
        <form id="form" onSubmit={handleSubmit} className="mt-8">
          <div className="space-y-12">
            <div className="border-b border-white/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="markdown"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Paste Markdown
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="markdown"
                      value={markdownInput}
                      onChange={handleInputChange}
                      name="about"
                      rows={3}
                      className="block w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    ></textarea>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Paste markdown with image tags to convert images to html
                    with mobile width
                  </p>
                </div>
                <div className="w-full flex items-center gap-x-4">
                  <button
                    type="submit"
                    className="flex-shrink-0 w-32 rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  >
                    Submit
                  </button>
                  <button
                    id="reset"
                    type="button"
                    className="flex-shrink-0 w-32 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={resetValues}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-10">
          <h3 className="text-lg font-bold leading-7 text-white sm:truncate sm:text-xl sm:tracking-tight">
            Results:
          </h3>
          <div
            id="results"
            className="mt-2 px-3 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
          >
            {outputParagraphs}
          </div>
          <button
            id="copy"
            type="button"
            onClick={copyToClipboard}
            className="w-32 mt-4 rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            <div className="before-copied">Copy</div>
            <div className="after-copied hidden">Copied!</div>
          </button>
        </div>
      </div>
    </div>
  );
}
