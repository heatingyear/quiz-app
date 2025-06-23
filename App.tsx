import { useEffect, useState } from "react";
import QuizCard from "./components/QuizCard";

function App() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("/data/questions.json")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">题库练习</h1>
      {questions.map((q, index) => (
        <QuizCard key={index} question={q} index={index} />
      ))}
    </div>
  );
}

export default App;
