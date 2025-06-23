
import { useState, useEffect } from "react";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState([]);

  useEffect(() => {
    fetch("/question_bank.json")
      .then((res) => res.json())
      .then((data) => {
        const cats = [...new Set(data.map(q => q.category))];
        setCategories(cats);
        setQuestions(data);
      });
  }, []);

  const startCategory = (cat) => {
    setSelectedCategory(cat);
    setCurrent(0);
    setSelected([]);
    setShowAnswer(false);
    setCorrectCount(0);
    setMistakes([]);
  };

  const filtered = questions.filter(q => q.category === selectedCategory);
  const q = filtered[current];

  const toggleOption = (option) => {
    if (q.type === "single" || q.type === "judge") {
      setSelected([option]);
    } else {
      setSelected((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option]
      );
    }
  };

  const checkAnswer = () => {
    setShowAnswer(true);
    const correct = selected.sort().join("") === q.answer.sort().join("");
    if (correct) {
      setCorrectCount((c) => c + 1);
    } else {
      setMistakes((m) => [...m, q]);
    }
  };

  const nextQuestion = () => {
    setSelected([]);
    setShowAnswer(false);
    setCurrent((prev) => (prev + 1) % filtered.length);
  };

  if (!selectedCategory) {
    return (
      <div style={{ padding: 20 }}>
        <h2>请选择题库分类：</h2>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => startCategory(cat)}
            style={{
              display: 'block',
              margin: '10px 0',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>{current + 1}. {q.question}</h2>
      <div style={{ margin: '1em 0' }}>
        {Object.entries(q.options).map(([key, value]) => (
          <label key={key} style={{ display: 'block', marginBottom: 8 }}>
            <input
              type={q.type === "single" || q.type === "judge" ? "radio" : "checkbox"}
              name="option"
              value={key}
              checked={selected.includes(key)}
              onChange={() => toggleOption(key)}
            />
            {` ${key}. ${value}`}
          </label>
        ))}
      </div>
      {!showAnswer ? (
        <button onClick={checkAnswer}>提交答案</button>
      ) : (
        <>
          <div>✅ 正确答案：{q.answer.join(', ')}</div>
          <button onClick={nextQuestion} style={{ marginTop: 10 }}>下一题</button>
        </>
      )}
      <div style={{ marginTop: 20 }}>
        得分：{correctCount} / {filtered.length}
        <br />
        分类：{selectedCategory}
      </div>

      {mistakes.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>❌ 错题本：</h3>
          <ul>
            {mistakes.map((m, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {m.question}（答案：{m.answer.join(', ')}）
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
