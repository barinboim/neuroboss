"use client";

import React, { useState, useEffect } from "react";

// Little helper: inject Google Fonts into <head>
function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800;900&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
}

export default function App() {
  const [project, setProject] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<
    | null
    | {
        frameworks: { name: string; steps: string[]; why: string }[];
        quote: { text: string; author: string };
      }
  >(null);

  async function onGenerate(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setData(null);

    const trimmed = project.trim();
    if (!trimmed) {
      setError("Сначала опиши, какой проект делаешь ✍️");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/neuroboss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: trimmed }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Server error");
      }

      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      // Friendly fallback when API route isn't set up yet
      setData({
        frameworks: [
          {
            name: "AIDA контент‑воронка",
            steps: [
              "Attention: крючок в первом экране",
              "Interest: боль аудитории в 3 фактах",
              "Desire: мини‑кейсы и выгоды",
              "Action: один чёткий призыв",
            ],
            why: "Простая структура, быстро собирается под любой проект",
          },
          {
            name: "JTBD (работы, ради которых нанимают продукт)",
            steps: [
              "Определи задачу, которую ‘нанимает’ твой продукт",
              "Опиши контекст и триггеры использования",
              "Сформулируй барьеры и альтернативы",
              "Собери оффер под ключевую ‘работу’",
            ],
            why: "Даёт чёткий фокус на реальную ценность для пользователя",
          },
          {
            name: "Диалектика Гегеля",
            steps: [
              "Тезис: позиция ‘за’",
              "Антитезис: позиция ‘против’",
              "Синтез: примирение и практический вывод",
              "CTA: что читатель делает дальше",
            ],
            why: "Всегда получается цельный и ‘умный’ материал без воды",
          },
        ],
        quote: {
          text: "Успех — это сумма маленьких усилий, повторяющихся изо дня в день.",
          author: "Роберт Колльер",
        },
      });
      setError(
        "Похоже, серверный маршрут пока не настроен. Показал демо‑пример; см. комментарий внизу файла, как подключить OpenAI."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#2A2A36" }}
    >
      <FontLoader />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-black tracking-tight"
            style={{ color: "#E7FF71", fontFamily: "Montserrat, sans-serif" }}
          >
            🤖 Нейробосс
          </h1>
          <p
            className="mt-2 text-base/7 md:text-lg/7 text-white/90"
            style={{ fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Arial" }}
          >
            Подскажу 3 фреймворка под твой проект и добавлю ободряющую цитату
          </p>
        </header>

        <form
          onSubmit={onGenerate}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
        >
          <label
            htmlFor="project"
            className="block text-sm font-medium mb-2 text-white/90"
            style={{ fontFamily: "Inter, system-ui" }}
          >
            Какой ты делаешь проект?
          </label>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              id="project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="Напр.: ТГ‑канал для дизайнеров, онлайн‑курс по ИИ, MVP‑сервис…"
              className="flex-1 rounded-xl px-4 py-3 bg-white/10 text-white placeholder-white/50 outline-none border border-white/10 focus:border-white/30"
              style={{ fontFamily: "Inter, system-ui" }}
            />
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#2A2A36] transition active:scale-[.98] disabled:opacity-60"
              style={{ backgroundColor: "#E7FF71", fontFamily: "Inter, system-ui" }}
            >
              {loading ? "Генерирую…" : "Сгенерировать"}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-300" style={{ fontFamily: "Inter" }}>
              {error}
            </p>
          )}
        </form>

        {data && (
          <main className="mt-8 space-y-6">
            <section className="grid md:grid-cols-3 gap-4">
              {data.frameworks.map((fw, i) => (
                <article
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white"
                  style={{ fontFamily: "Inter, system-ui" }}
                >
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: "#E7FF71", fontFamily: "Montserrat, sans-serif" }}
                  >
                    {fw.name}
                  </h3>
                  <ul className="list-disc pl-4 text-white/90 text-sm space-y-1">
                    {fw.steps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-white/80 text-sm">{fw.why}</p>
                </article>
              ))}
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-white text-base md:text-lg" style={{ fontFamily: "Inter" }}>
                <span className="opacity-80">✦ Цитата дня:</span>
                <br />
                <em className="opacity-95">“{data.quote.text}”</em>
                <span className="opacity-80"> — {data.quote.author}</span>
              </p>
            </section>
          </main>
        )}

        <footer className="mt-10 text-xs text-white/50" style={{ fontFamily: "Inter" }}>
          © {new Date().getFullYear()} Нейробосс. Сделано с ❤️ и OpenAI.
        </footer>
      </div>
    </div>
  );
}

