import { useEffect, useState } from 'react';
import './App.css';
const INITIAL_COUNT = 60;
const QUESTIONS = [
  'If you could visit any place in the world, where would you go and why?',
  "What is one skill or hobby you've always wanted to learn, but haven't had the chance to yet?",
  'What book has had the biggest impact on your life?',
  'If you could have dinner with any historical figure, who would it be and why?',
  'What is your favorite way to relax and unwind?',
  'If you could only eat one cuisine for the rest of your life, what would it be?',
  'What is something youre passionate about?',
  'If you could have any superpower, what would it be and why?',
  'What is a goal you want to accomplish in the next year?',
  'What is your favorite movie of all time and why?',
  'If you could go back in time and change one thing, what would it be?',
  'What is your favorite season and why?',
  'If you could meet any fictional character, who would it be and why?',
  'What is the best piece of advice you have ever received?',
  'What is your favorite childhood memory?',
  'If you could live in any time period, past or future, when would it be and why?',
  'What is a skill you wish you were better at?',
  'What is your favorite thing about yourself?',
  'If you could have any job in the world, what would it be?',
  'What is a place youve always wanted to travel to?',
  'What is the most interesting place you have ever been?',
  'What is your favorite way to spend a day off?',
  'What is your favorite holiday and why?',
  'If you could learn any language fluently, which would it be and why?',
  'What is your favorite type of music?',
  'What is a cause you feel strongly about?',
  'What is your favorite thing to do with friends?',
  'If you could have any animal as a pet, what would it be?',
  'What is your favorite quote and why?',
  'What is a talent you wish you had?',
  'What is the best trip you have ever taken?',
  'If you could have dinner with any celebrity, who would it be and why?',
  'What is your favorite outdoor activity?',
  'What is something that always makes you smile?',
  'If you could witness any event in history, what would it be?',
  'What is your favorite book genre?',
  'What is your favorite board game or card game?',
  'What is the most beautiful place you have ever seen?',
  'If you could live anywhere in the world, where would it be?',
  'What is a hobby you enjoy in your free time?',
  'What is something youre looking forward to in the future?',
  'If you could have any vehicle, what would it be and why?',
  'What is your favorite dessert?',
  'What is a movie or TV show you could watch over and over again?',
  'What is something youve always wanted to try but havent yet?',
  'If you could have any technology from a sci-fi movie, what would it be?',
  'What is your favorite way to exercise?',
  'If you could be known for one thing, what would it be?',
];

function App() {
  const [timer, setTimer] = useState<number>(INITIAL_COUNT);
  const [timerBar, setTimerBar] = useState<number>(INITIAL_COUNT);
  const [alert, setAlert] = useState<boolean>(false);
  const [actualQuestion, setActualQuestion] = useState(0);

  const handlerNextQuestions = () => {
    setActualQuestion(actualQuestion + 1);
    setTimer(INITIAL_COUNT);
    setTimerBar(INITIAL_COUNT);
  };
  const handlerPrevQuestions = () => {
    setActualQuestion(actualQuestion - 1);
    setTimer(INITIAL_COUNT);
    setTimerBar(INITIAL_COUNT);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if ((prevTimer * 100) / INITIAL_COUNT <= 50 && prevTimer > 0) {
          setAlert(true);
        }
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          setAlert(false);
          return 0;
        }
      });
    }, 1000);
    const intervalIdBar = setInterval(() => {
      setTimerBar((prevTimer) => {
        if ((prevTimer * 100) / INITIAL_COUNT <= 50 && prevTimer > 0) {
          setAlert(true);
          return prevTimer - 1;
        }
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          setAlert(false);
          return 0;
        }
      });
    }, 1000);
    return () => {
      clearInterval(intervalId);
      clearInterval(intervalIdBar);
    };
  }, []);

  return (
    <div className={`main-container`}>
      <div
        style={{ top: timer === 0 ? '0px' : '-100vh' }}
        className="next-question"
      >
        <h1>
          {QUESTIONS.length === actualQuestion
            ? 'Game Over 😒'
            : "I'm ready for the next question 😎"}
          <br />
        </h1>

        <button onClick={handlerNextQuestions}>Next question</button>
      </div>

      {actualQuestion < QUESTIONS.length && (
        <div className="nex-question-button">
          <button onClick={handlerNextQuestions}>{'Next'}</button>
        </div>
      )}

      {actualQuestion > 0 && (
        <div className="before-question-button">
          <button onClick={handlerPrevQuestions}>{'Prev'}</button>
        </div>
      )}

      <div className="question-box">
        <h1>{QUESTIONS[actualQuestion]}</h1>
      </div>
      <div className="timer-box">
        <h2 className={`${alert && 'alert'}`}>{timer} s</h2>
      </div>
      <div className="questions-box">
        <h2>
          {actualQuestion + 1} / {QUESTIONS.length + 1}
        </h2>
      </div>
      <div className="progres-container">
        <div
          style={{ width: `${(timerBar * 100) / INITIAL_COUNT}%` }}
          className={`${alert && 'progres-bar-warning'} progres-bar`}
        ></div>
      </div>
    </div>
  );
}

export default App;
