import React, { useState } from "react";

function QuizCard({ question, index }) {
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    setShowAnswer(true);
  };

  return (
    <div className="mb-6 p-4 border rounded shadow">
      <h2 className="font-medium mb-2">
        {index + 1}. {question.question}
      </h2>
      <ul>
        {Object.entries(question.options).map(([key, val]) => {
          const isCorrect = key === question.answer;
          const isSelected = selected === key;
          const highlight =
            showAnswer && (isCorrect ? "bg-green-200" : isSelected ? "bg-red-200" : "");

          return (
            <li
              key={key}
              className={`p-2 mb-1 rounded cursor-pointer border ${highlight} hover:bg-gray-100`}
              onClick={() => handleSelect(key)}
            >
              {key}. {val}
            </li>
          );
        })}
      </ul>
      {showAnswer && (
        <p className="mt-2 text-sm text-gray-500">正确答案: {question.answer}</p>
      )}
    </div>
  );
}

export default QuizCard;
