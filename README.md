Online Examination System
Pariksha — Online Examination System 

A fully functional online examination portal featuring student login, 20 multiple-choice questions (MCQs), a 20-minute countdown timer, question palette, automatic submission, detailed result analysis with ranking, and a reattempt option. The entire application runs directly in the browser—no backend or server is required.

Folder Structure
pariksha/
├── index.html   → Page structure (Login, Instructions, Exam, Result screens)
├── style.css    → Styling, animations, and responsive design
├── script.js    → Exam logic (Login, Timer, Navigation, Scoring, Local Storage)
└── README.md    → Project documentation

Log in using any of the demo accounts below:
Username	Password
demo	demo123
priya	priya123
rahul	rahul123
anita	anita123


Features

Feature	Description
Student Login	Validates username and password using a predefined list of students.
20 MCQs	Includes 20 multiple-choice questions covering General Knowledge and Computer Fundamentals.
Timer	A 20-minute real-time countdown based on Date.now(), ensuring accuracy even if the browser tab is minimized.
Navigation	Navigate using Previous/Next buttons or directly jump to any question through the question palette.
Mark for Review	Flag questions to revisit before submitting the exam.
Question Palette	Color-coded question status: Answered (Green), Not Answered (Red), Not Visited (Gray), Marked for Review (Purple).
Submit Confirmation	Displays the number of answered, unanswered, and marked questions before final submission.
Auto Submit	Automatically submits the exam when the timer reaches 00:00 without any confirmation prompt.
Result Summary	Displays Total Questions, Attempted, Unattempted, Correct Answers, Wrong Answers, Score, and Percentage.
Percentage Ring	Animated circular progress indicator showing the final percentage score.
Rank	Calculates the current attempt's rank among all previously saved attempts.
Leaderboard	Displays a leaderboard of top attempts with the current attempt highlighted.
Reattempt	Allows users to start a fresh exam with a new timer and cleared responses.
Resume on Refresh	Restores the exam if the browser is accidentally refreshed or closed (provided time remains).
Keyboard Navigation	Navigate between questions using the Left and Right Arrow keys.
Concepts Covered

This project demonstrates the following JavaScript concepts:

Arrays
QUESTIONS array containing 20 question objects.
STUDENTS array containing student credentials.
Objects

Each question is represented as an object:

{
  id,
  q,
  options,
  answer
}
Each exam result is also stored as an object.
Timers
Real-time countdown using setInterval().
Accurate timing implemented with Date.now().
Automatic submission when the timer expires.
Local Storage
pariksha_results stores all previous exam attempts.
pariksha_active_exam stores the current exam state to enable resume functionality.
DOM Manipulation
Dynamically renders Login, Instructions, Exam, and Result screens.
Functions
Modular functions such as:
renderQuestion()
startTimer()
finishExam()
saveResult()
Event Handling
Form submission
Button click events
Keyboard navigation
Event delegation for question palette and answer options
Customization
Add More Questions

Add a new object inside the QUESTIONS array in script.js.

{
  id: 21,
  q: "Your question here?",
  options: ["A", "B", "C", "D"],
  answer: 2
}

The answer value represents the correct option index:

0 = A
1 = B
2 = C
3 = D
Add a New Student

Insert a new object into the STUDENTS array.

{
  username: "newuser",
  password: "pass123",
  name: "Student Name"
}
Change Exam Duration

Modify the EXAM_DURATION_MS constant in script.js.

Example:

15 * 60 * 1000

This sets the exam duration to 15 minutes.

