import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trophy, Star, PartyPopper, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface Question {
  question: string;
  answer: string;
  options: string[];
  explanation: string;
}

interface QuizSet {
  title: string;
  questions: Question[];
}

const quizData: Record<string, Record<string, QuizSet>> = {
  math: {
    numbers: {
      title: 'Numbers & Counting Quiz',
      questions: [
        { question: 'What comes after 5?', answer: '6', options: ['4', '6', '7', '8'], explanation: 'Numbers go 1, 2, 3, 4, 5, 6... so 6 comes after 5!' },
        { question: 'Count: ⭐⭐⭐⭐', answer: '4', options: ['3', '4', '5', '6'], explanation: 'There are 4 stars! Count them one by one.' },
        { question: 'Which number is biggest?', answer: '9', options: ['5', '7', '3', '9'], explanation: '9 is the biggest single-digit number!' },
        { question: 'How many fingers on both hands?', answer: '10', options: ['8', '9', '10', '12'], explanation: '5 fingers on each hand, 5 + 5 = 10!' },
        { question: 'What comes before 8?', answer: '7', options: ['6', '7', '9', '10'], explanation: '7 comes right before 8 in the number line!' },
        { question: 'Count: 🍎🍎🍎🍎🍎🍎', answer: '6', options: ['5', '6', '7', '8'], explanation: 'Count each apple: 1, 2, 3, 4, 5, 6!' },
        { question: 'Which number is smallest?', answer: '2', options: ['5', '9', '2', '7'], explanation: '2 is the smallest number in this group!' },
        { question: 'What number comes between 6 and 8?', answer: '7', options: ['5', '7', '9', '6'], explanation: '6, 7, 8 — seven is between 6 and 8!' },
        { question: 'How many tens are in 30?', answer: '3', options: ['1', '2', '3', '30'], explanation: '30 = 3 tens + 0 ones. Three tens make thirty!' },
        { question: 'What is the value of 0?', answer: 'Nothing', options: ['1', '10', 'Nothing', '100'], explanation: 'Zero means nothing — no objects at all!' },
        { question: 'Which number is even?', answer: '4', options: ['1', '3', '4', '7'], explanation: 'Even numbers can be divided by 2 equally. 4 ÷ 2 = 2!' },
        { question: 'Which number is odd?', answer: '5', options: ['2', '4', '5', '6'], explanation: 'Odd numbers cannot be split equally in two. 5 is odd!' },
        { question: 'Count backwards from 10. What comes after 10, 9, 8?', answer: '7', options: ['6', '7', '8', '5'], explanation: 'Counting back: 10, 9, 8, 7... seven comes next!' },
        { question: 'What is the number one hundred written as?', answer: '100', options: ['10', '1000', '100', '110'], explanation: 'One hundred is written as 100 — 1 followed by two zeros!' },
        { question: 'Skip count by 2: 2, 4, 6, __?', answer: '8', options: ['7', '8', '9', '10'], explanation: 'Adding 2 each time: 2, 4, 6, 8!' },
        { question: 'What is 10 more than 25?', answer: '35', options: ['15', '26', '35', '30'], explanation: '25 + 10 = 35. We add 10 to the tens digit!' },
        { question: 'Which is the largest 2-digit number?', answer: '99', options: ['89', '90', '99', '100'], explanation: '99 is the largest 2-digit number — just before 100!' },
        { question: 'What number has 3 tens and 5 ones?', answer: '35', options: ['305', '53', '35', '350'], explanation: '3 tens = 30, plus 5 ones = 35!' },
        { question: 'How many hundreds in 500?', answer: '5', options: ['50', '5', '500', '1'], explanation: '500 = 5 hundreds. Five hundreds make five hundred!' },
        { question: 'What is the smallest 3-digit number?', answer: '100', options: ['99', '100', '101', '111'], explanation: '100 is the smallest 3-digit number!' },
      ],
    },
    addition: {
      title: 'Addition Quiz',
      questions: [
        { question: '1 + 1 = ?', answer: '2', options: ['1', '2', '3', '4'], explanation: '1 apple + 1 apple = 2 apples!' },
        { question: '3 + 2 = ?', answer: '5', options: ['4', '5', '6', '7'], explanation: 'Three plus two equals five!' },
        { question: '4 + 1 = ?', answer: '5', options: ['4', '5', '6', '7'], explanation: 'Four plus one equals five!' },
        { question: '2 + 6 = ?', answer: '8', options: ['6', '7', '8', '9'], explanation: 'Two plus six equals eight!' },
        { question: '5 + 5 = ?', answer: '10', options: ['8', '9', '10', '11'], explanation: 'Five plus five equals ten!' },
        { question: '7 + 2 = ?', answer: '9', options: ['8', '9', '10', '11'], explanation: 'Seven plus two equals nine!' },
        { question: '6 + 3 = ?', answer: '9', options: ['7', '8', '9', '10'], explanation: 'Six plus three equals nine!' },
        { question: '4 + 4 = ?', answer: '8', options: ['6', '7', '8', '9'], explanation: 'Four plus four equals eight!' },
        { question: '8 + 1 = ?', answer: '9', options: ['8', '9', '10', '7'], explanation: 'Eight plus one equals nine!' },
        { question: '3 + 7 = ?', answer: '10', options: ['8', '9', '10', '11'], explanation: 'Three plus seven equals ten!' },
        { question: '9 + 6 = ?', answer: '15', options: ['13', '14', '15', '16'], explanation: 'Nine plus six equals fifteen!' },
        { question: '12 + 8 = ?', answer: '20', options: ['18', '19', '20', '22'], explanation: 'Twelve plus eight equals twenty!' },
        { question: '15 + 5 = ?', answer: '20', options: ['18', '20', '21', '25'], explanation: 'Fifteen plus five equals twenty!' },
        { question: '11 + 9 = ?', answer: '20', options: ['19', '20', '21', '22'], explanation: 'Eleven plus nine equals twenty!' },
        { question: '7 + 8 = ?', answer: '15', options: ['14', '15', '16', '17'], explanation: 'Seven plus eight equals fifteen!' },
        { question: '13 + 7 = ?', answer: '20', options: ['17', '18', '20', '21'], explanation: 'Thirteen plus seven equals twenty!' },
        { question: '6 + 9 = ?', answer: '15', options: ['13', '14', '15', '16'], explanation: 'Six plus nine equals fifteen!' },
        { question: '25 + 5 = ?', answer: '30', options: ['28', '29', '30', '31'], explanation: 'Twenty-five plus five equals thirty!' },
        { question: '18 + 2 = ?', answer: '20', options: ['19', '20', '21', '22'], explanation: 'Eighteen plus two equals twenty!' },
        { question: '14 + 6 = ?', answer: '20', options: ['18', '19', '20', '21'], explanation: 'Fourteen plus six equals twenty!' },
      ],
    },
    subtraction: {
      title: 'Subtraction Quiz',
      questions: [
        { question: '5 - 2 = ?', answer: '3', options: ['2', '3', '4', '5'], explanation: 'Five minus two equals three!' },
        { question: '4 - 1 = ?', answer: '3', options: ['2', '3', '4', '5'], explanation: 'Four minus one equals three!' },
        { question: '6 - 3 = ?', answer: '3', options: ['2', '3', '4', '5'], explanation: 'Six minus three equals three!' },
        { question: '9 - 4 = ?', answer: '5', options: ['4', '5', '6', '7'], explanation: 'Nine minus four equals five!' },
        { question: '10 - 5 = ?', answer: '5', options: ['4', '5', '6', '7'], explanation: 'Ten minus five equals five!' },
        { question: '8 - 3 = ?', answer: '5', options: ['4', '5', '6', '7'], explanation: 'Eight minus three equals five!' },
        { question: '7 - 2 = ?', answer: '5', options: ['3', '4', '5', '6'], explanation: 'Seven minus two equals five!' },
        { question: '10 - 3 = ?', answer: '7', options: ['6', '7', '8', '9'], explanation: 'Ten minus three equals seven!' },
        { question: '6 - 1 = ?', answer: '5', options: ['4', '5', '6', '7'], explanation: 'Six minus one equals five!' },
        { question: '9 - 9 = ?', answer: '0', options: ['0', '1', '2', '9'], explanation: 'Any number minus itself equals zero!' },
        { question: '20 - 8 = ?', answer: '12', options: ['10', '11', '12', '13'], explanation: 'Twenty minus eight equals twelve!' },
        { question: '15 - 7 = ?', answer: '8', options: ['6', '7', '8', '9'], explanation: 'Fifteen minus seven equals eight!' },
        { question: '13 - 5 = ?', answer: '8', options: ['7', '8', '9', '10'], explanation: 'Thirteen minus five equals eight!' },
        { question: '18 - 9 = ?', answer: '9', options: ['8', '9', '10', '11'], explanation: 'Eighteen minus nine equals nine!' },
        { question: '25 - 10 = ?', answer: '15', options: ['14', '15', '16', '10'], explanation: 'Twenty-five minus ten equals fifteen!' },
        { question: '30 - 15 = ?', answer: '15', options: ['10', '12', '15', '20'], explanation: 'Thirty minus fifteen equals fifteen!' },
        { question: '17 - 8 = ?', answer: '9', options: ['7', '8', '9', '10'], explanation: 'Seventeen minus eight equals nine!' },
        { question: '11 - 4 = ?', answer: '7', options: ['6', '7', '8', '9'], explanation: 'Eleven minus four equals seven!' },
        { question: '14 - 6 = ?', answer: '8', options: ['6', '7', '8', '9'], explanation: 'Fourteen minus six equals eight!' },
        { question: '100 - 50 = ?', answer: '50', options: ['40', '50', '60', '150'], explanation: 'One hundred minus fifty equals fifty!' },
      ],
    },
    multiplication: {
      title: 'Multiplication Quiz',
      questions: [
        { question: '2 × 2 = ?', answer: '4', options: ['3', '4', '5', '6'], explanation: 'Two groups of two = four!' },
        { question: '3 × 2 = ?', answer: '6', options: ['5', '6', '7', '8'], explanation: 'Three groups of two = six!' },
        { question: '2 × 4 = ?', answer: '8', options: ['6', '8', '10', '12'], explanation: 'Two groups of four = eight!' },
        { question: '5 × 2 = ?', answer: '10', options: ['8', '9', '10', '11'], explanation: 'Five groups of two = ten!' },
        { question: '3 × 3 = ?', answer: '9', options: ['6', '7', '8', '9'], explanation: 'Three groups of three = nine!' },
        { question: '4 × 2 = ?', answer: '8', options: ['6', '7', '8', '9'], explanation: 'Four groups of two = eight!' },
        { question: '2 × 5 = ?', answer: '10', options: ['8', '9', '10', '12'], explanation: 'Two groups of five = ten!' },
        { question: '1 × 6 = ?', answer: '6', options: ['5', '6', '7', '8'], explanation: 'One group of six = six!' },
        { question: '3 × 4 = ?', answer: '12', options: ['10', '11', '12', '13'], explanation: 'Three groups of four = twelve!' },
        { question: '5 × 5 = ?', answer: '25', options: ['20', '23', '25', '30'], explanation: 'Five groups of five = twenty-five!' },
        { question: '6 × 3 = ?', answer: '18', options: ['15', '16', '18', '21'], explanation: 'Six groups of three = eighteen!' },
        { question: '4 × 4 = ?', answer: '16', options: ['12', '14', '16', '20'], explanation: 'Four groups of four = sixteen!' },
        { question: '7 × 2 = ?', answer: '14', options: ['12', '13', '14', '15'], explanation: 'Seven groups of two = fourteen!' },
        { question: '5 × 3 = ?', answer: '15', options: ['12', '13', '15', '20'], explanation: 'Five groups of three = fifteen!' },
        { question: '6 × 6 = ?', answer: '36', options: ['30', '34', '36', '40'], explanation: 'Six times six = thirty-six!' },
        { question: '8 × 2 = ?', answer: '16', options: ['14', '16', '18', '20'], explanation: 'Eight groups of two = sixteen!' },
        { question: '4 × 5 = ?', answer: '20', options: ['15', '18', '20', '25'], explanation: 'Four groups of five = twenty!' },
        { question: '7 × 3 = ?', answer: '21', options: ['18', '20', '21', '24'], explanation: 'Seven groups of three = twenty-one!' },
        { question: '9 × 2 = ?', answer: '18', options: ['16', '17', '18', '19'], explanation: 'Nine groups of two = eighteen!' },
        { question: '10 × 5 = ?', answer: '50', options: ['40', '45', '50', '55'], explanation: 'Ten groups of five = fifty!' },
      ],
    },
    division: {
      title: 'Division Quiz',
      questions: [
        { question: '6 ÷ 2 = ?', answer: '3', options: ['2', '3', '4', '5'], explanation: 'Share 6 into 2 groups = 3 each!' },
        { question: '8 ÷ 2 = ?', answer: '4', options: ['3', '4', '5', '6'], explanation: 'Share 8 into 2 groups = 4 each!' },
        { question: '10 ÷ 2 = ?', answer: '5', options: ['4', '5', '6', '7'], explanation: 'Share 10 into 2 groups = 5 each!' },
        { question: '9 ÷ 3 = ?', answer: '3', options: ['2', '3', '4', '5'], explanation: 'Share 9 into 3 groups = 3 each!' },
        { question: '12 ÷ 4 = ?', answer: '3', options: ['2', '3', '4', '6'], explanation: 'Share 12 into 4 groups = 3 each!' },
        { question: '4 ÷ 2 = ?', answer: '2', options: ['1', '2', '3', '4'], explanation: 'Share 4 into 2 groups = 2 each!' },
        { question: '10 ÷ 5 = ?', answer: '2', options: ['1', '2', '3', '4'], explanation: 'Share 10 into 5 groups = 2 each!' },
        { question: '15 ÷ 3 = ?', answer: '5', options: ['4', '5', '6', '7'], explanation: 'Share 15 into 3 groups = 5 each!' },
        { question: '8 ÷ 4 = ?', answer: '2', options: ['1', '2', '3', '4'], explanation: 'Share 8 into 4 groups = 2 each!' },
        { question: '20 ÷ 4 = ?', answer: '5', options: ['4', '5', '6', '7'], explanation: 'Share 20 into 4 groups = 5 each!' },
        { question: '18 ÷ 3 = ?', answer: '6', options: ['5', '6', '7', '9'], explanation: 'Share 18 into 3 groups = 6 each!' },
        { question: '16 ÷ 4 = ?', answer: '4', options: ['2', '3', '4', '8'], explanation: 'Share 16 into 4 groups = 4 each!' },
        { question: '25 ÷ 5 = ?', answer: '5', options: ['4', '5', '6', '7'], explanation: 'Share 25 into 5 groups = 5 each!' },
        { question: '24 ÷ 6 = ?', answer: '4', options: ['3', '4', '5', '6'], explanation: 'Share 24 into 6 groups = 4 each!' },
        { question: '30 ÷ 5 = ?', answer: '6', options: ['5', '6', '7', '8'], explanation: 'Share 30 into 5 groups = 6 each!' },
        { question: '14 ÷ 2 = ?', answer: '7', options: ['6', '7', '8', '9'], explanation: 'Share 14 into 2 groups = 7 each!' },
        { question: '21 ÷ 7 = ?', answer: '3', options: ['2', '3', '4', '5'], explanation: 'Share 21 into 7 groups = 3 each!' },
        { question: '36 ÷ 6 = ?', answer: '6', options: ['4', '5', '6', '7'], explanation: 'Share 36 into 6 groups = 6 each!' },
        { question: '40 ÷ 8 = ?', answer: '5', options: ['4', '5', '6', '7'], explanation: 'Share 40 into 8 groups = 5 each!' },
        { question: '100 ÷ 10 = ?', answer: '10', options: ['8', '9', '10', '12'], explanation: 'Share 100 into 10 groups = 10 each!' },
      ],
    },
    fractions: {
      title: 'Fractions Quiz',
      questions: [
        { question: 'Half of 10 = ?', answer: '5', options: ['4', '5', '6', '7'], explanation: 'Half means divide by 2. 10 ÷ 2 = 5!' },
        { question: 'What is ½ of 8?', answer: '4', options: ['2', '3', '4', '6'], explanation: 'Half of 8 is 4!' },
        { question: 'Which fraction is bigger: ½ or ¼?', answer: '½', options: ['¼', '½', 'Same', 'Neither'], explanation: 'Half is bigger than a quarter!' },
        { question: '¼ of 16 = ?', answer: '4', options: ['2', '4', '6', '8'], explanation: 'One quarter of 16 = 16 ÷ 4 = 4!' },
        { question: 'How many halves make a whole?', answer: '2', options: ['1', '2', '3', '4'], explanation: 'Two halves make a whole!' },
        { question: 'How many quarters in a whole?', answer: '4', options: ['2', '3', '4', '5'], explanation: 'Four quarters make a whole!' },
        { question: '½ of 20 = ?', answer: '10', options: ['5', '8', '10', '12'], explanation: 'Half of 20 is 10!' },
        { question: 'What fraction is shaded if 1 of 4 parts is coloured?', answer: '¼', options: ['½', '¼', '¾', '⅓'], explanation: 'One part out of four = one quarter!' },
        { question: '¾ means?', answer: '3 out of 4', options: ['3 out of 4', '4 out of 3', '3 and 4', '34'], explanation: 'Three quarters = 3 parts out of 4!' },
        { question: '½ + ½ = ?', answer: '1 whole', options: ['1 whole', '½', '¼', '2'], explanation: 'One half plus one half equals one whole!' },
        { question: 'What is ⅓ of 12?', answer: '4', options: ['3', '4', '5', '6'], explanation: 'One third of 12 = 12 ÷ 3 = 4!' },
        { question: '½ of 100 = ?', answer: '50', options: ['25', '50', '75', '100'], explanation: 'Half of 100 is 50!' },
        { question: 'Which is smallest: ½, ¼, or ¾?', answer: '¼', options: ['½', '¼', '¾', 'Same'], explanation: 'One quarter is the smallest fraction here!' },
        { question: '¼ + ¼ = ?', answer: '½', options: ['¼', '½', '¾', '1'], explanation: 'Two quarters make one half!' },
        { question: '¾ + ¼ = ?', answer: '1 whole', options: ['½', '¾', '1 whole', '1¼'], explanation: 'Three quarters plus one quarter = one whole!' },
        { question: 'What is ½ of 50?', answer: '25', options: ['20', '25', '30', '50'], explanation: 'Half of 50 is 25!' },
        { question: '⅓ means?', answer: '1 out of 3', options: ['1 out of 2', '1 out of 3', '3 out of 1', '1 and 3'], explanation: 'One third = one part out of three equal parts!' },
        { question: 'How many thirds make a whole?', answer: '3', options: ['2', '3', '4', '6'], explanation: 'Three thirds (3/3) make one whole!' },
        { question: 'Which fraction equals ½?', answer: '2/4', options: ['1/3', '2/4', '3/4', '1/4'], explanation: '2/4 = ½ because both equal half!' },
        { question: 'A pizza is cut into 8 slices. You eat 4. What fraction did you eat?', answer: '½', options: ['¼', '½', '¾', '⅛'], explanation: '4 out of 8 slices = 4/8 = ½!' },
      ],
    },
    shapes: {
      title: 'Shapes & Geometry Quiz',
      questions: [
        { question: 'How many sides does a triangle have?', answer: '3', options: ['2', '3', '4', '5'], explanation: 'A triangle has 3 sides and 3 corners!' },
        { question: 'How many sides does a square have?', answer: '4', options: ['3', '4', '5', '6'], explanation: 'A square has 4 equal sides!' },
        { question: 'What shape is a wheel?', answer: 'Circle', options: ['Square', 'Circle', 'Triangle', 'Rectangle'], explanation: 'Wheels are round circles!' },
        { question: 'How many corners does a rectangle have?', answer: '4', options: ['2', '3', '4', '5'], explanation: 'A rectangle has 4 corners!' },
        { question: 'A shape with 5 sides is called?', answer: 'Pentagon', options: ['Hexagon', 'Pentagon', 'Octagon', 'Square'], explanation: 'Pentagon = 5 sides (penta = 5)!' },
        { question: 'What is a 3D version of a circle?', answer: 'Sphere', options: ['Cube', 'Cone', 'Sphere', 'Cylinder'], explanation: 'A sphere is a 3D ball shape!' },
        { question: 'How many faces does a cube have?', answer: '6', options: ['4', '5', '6', '8'], explanation: 'A cube has 6 faces — like a dice!' },
        { question: 'What shape has no corners?', answer: 'Circle', options: ['Triangle', 'Square', 'Circle', 'Rectangle'], explanation: 'A circle is perfectly round with no corners!' },
        { question: 'A hexagon has how many sides?', answer: '6', options: ['5', '6', '7', '8'], explanation: 'Hexa means 6 — a hexagon has 6 sides!' },
        { question: 'Which shape looks like a box?', answer: 'Cuboid', options: ['Cube', 'Cuboid', 'Cone', 'Sphere'], explanation: 'A cuboid is a 3D rectangle, like a box!' },
        { question: 'How many sides does an octagon have?', answer: '8', options: ['6', '7', '8', '9'], explanation: 'Octa means 8 — octagon has 8 sides!' },
        { question: 'What 3D shape is an ice cream cone?', answer: 'Cone', options: ['Cylinder', 'Cone', 'Pyramid', 'Prism'], explanation: 'An ice cream cone is a cone shape!' },
        { question: 'How many edges does a cube have?', answer: '12', options: ['6', '8', '10', '12'], explanation: 'A cube has 12 edges — try counting on a dice!' },
        { question: 'A rectangle and a square both have how many sides?', answer: '4', options: ['3', '4', '5', '6'], explanation: 'Both rectangle and square have 4 sides!' },
        { question: 'What is the shape of a football?', answer: 'Sphere', options: ['Circle', 'Oval', 'Sphere', 'Cylinder'], explanation: 'A football is spherical — a 3D rounded ball!' },
        { question: 'A triangle with 3 equal sides is called?', answer: 'Equilateral', options: ['Scalene', 'Isosceles', 'Equilateral', 'Right-angled'], explanation: 'Equilateral triangle = all 3 sides equal!' },
        { question: 'How many vertices does a square have?', answer: '4', options: ['3', '4', '5', '6'], explanation: 'A square has 4 vertices (corners)!' },
        { question: 'What shape is a door?', answer: 'Rectangle', options: ['Square', 'Triangle', 'Rectangle', 'Circle'], explanation: 'Most doors are rectangular — taller than wide!' },
        { question: 'A shape with all sides equal and 4 right angles is a?', answer: 'Square', options: ['Rectangle', 'Rhombus', 'Square', 'Diamond'], explanation: 'A square has 4 equal sides and 4 right angles!' },
        { question: 'How many flat faces does a cylinder have?', answer: '2', options: ['1', '2', '3', '4'], explanation: 'A cylinder has 2 flat circular faces (top and bottom)!' },
      ],
    },
    measurement: {
      title: 'Measurement Quiz',
      questions: [
        { question: 'We measure length in?', answer: 'Centimetres', options: ['Litres', 'Kilograms', 'Centimetres', 'Hours'], explanation: 'Length is measured in centimetres or metres!' },
        { question: 'We measure weight in?', answer: 'Kilograms', options: ['Litres', 'Kilograms', 'Metres', 'Seconds'], explanation: 'Weight is measured in grams and kilograms!' },
        { question: 'We measure liquid in?', answer: 'Litres', options: ['Metres', 'Litres', 'Kilograms', 'Hours'], explanation: 'Liquid volume is measured in litres or millilitres!' },
        { question: 'Which is longer: 100cm or 50cm?', answer: '100cm', options: ['50cm', '100cm', 'Same', 'Neither'], explanation: '100 centimetres is twice as long as 50!' },
        { question: 'How many cm in 1 metre?', answer: '100', options: ['10', '100', '1000', '50'], explanation: 'One metre = 100 centimetres!' },
        { question: 'Which is heavier: 3kg or 5kg?', answer: '5kg', options: ['3kg', '5kg', 'Same', 'Cannot tell'], explanation: '5 kilograms is heavier than 3!' },
        { question: 'A ruler usually measures up to?', answer: '30cm', options: ['10cm', '20cm', '30cm', '100cm'], explanation: 'Most school rulers are 30 centimetres long!' },
        { question: 'Temperature is measured in?', answer: 'Degrees', options: ['Metres', 'Litres', 'Degrees', 'Kilograms'], explanation: 'Temperature is measured in degrees Celsius!' },
        { question: '1 kilometre = ?', answer: '1000 metres', options: ['10 metres', '100 metres', '1000 metres', '500 metres'], explanation: 'Kilo means 1000 — one kilometre = 1000 metres!' },
        { question: 'Which tool do we use to measure length?', answer: 'Ruler', options: ['Weighing scale', 'Ruler', 'Thermometer', 'Clock'], explanation: 'A ruler measures length or distance!' },
        { question: 'How many grams in 1 kilogram?', answer: '1000', options: ['10', '100', '1000', '500'], explanation: '1 kilogram = 1000 grams!' },
        { question: 'How many millilitres in 1 litre?', answer: '1000', options: ['10', '100', '1000', '500'], explanation: '1 litre = 1000 millilitres!' },
        { question: 'Which is shorter: 20cm or 25cm?', answer: '20cm', options: ['20cm', '25cm', 'Same', 'Cannot tell'], explanation: '20 cm is shorter than 25 cm!' },
        { question: 'We use a thermometer to measure?', answer: 'Temperature', options: ['Length', 'Weight', 'Temperature', 'Volume'], explanation: 'A thermometer measures how hot or cold something is!' },
        { question: 'Which is bigger: 500ml or 1 litre?', answer: '1 litre', options: ['500ml', '1 litre', 'Same', 'Neither'], explanation: '1 litre = 1000ml, which is bigger than 500ml!' },
        { question: 'How many metres in 1 kilometre?', answer: '1000', options: ['10', '100', '1000', '500'], explanation: 'There are 1000 metres in 1 kilometre!' },
        { question: 'A baby weighs 3 kg. A bag weighs 5 kg. Which is heavier?', answer: 'The bag', options: ['The baby', 'The bag', 'Same', 'Cannot tell'], explanation: '5 kg is heavier than 3 kg!' },
        { question: 'What unit measures very small lengths?', answer: 'Millimetre', options: ['Kilometre', 'Metre', 'Millimetre', 'Centimetre'], explanation: 'Millimetres (mm) are the smallest common length unit!' },
        { question: 'If a pencil is 15cm and a pen is 18cm, which is longer?', answer: 'The pen', options: ['The pencil', 'The pen', 'Same', 'Cannot tell'], explanation: '18 cm is more than 15 cm — the pen is longer!' },
        { question: 'A swimming pool holds 50,000 litres. This is a measure of?', answer: 'Volume', options: ['Weight', 'Length', 'Volume', 'Temperature'], explanation: 'Litres measure volume — how much liquid fits!' },
      ],
    },
    time: {
      title: 'Time & Clocks Quiz',
      questions: [
        { question: 'How many minutes in an hour?', answer: '60', options: ['30', '60', '100', '24'], explanation: 'One hour = 60 minutes!' },
        { question: 'How many hours in a day?', answer: '24', options: ['12', '24', '48', '60'], explanation: 'One day = 24 hours!' },
        { question: 'How many days in a week?', answer: '7', options: ['5', '6', '7', '8'], explanation: 'One week = 7 days!' },
        { question: 'How many months in a year?', answer: '12', options: ['10', '11', '12', '13'], explanation: 'One year = 12 months!' },
        { question: 'What is the short hand on a clock?', answer: 'Hour hand', options: ['Second hand', 'Minute hand', 'Hour hand', 'Day hand'], explanation: 'The short hand points to the hour!' },
        { question: 'Half past 3 on a clock = ?', answer: '3:30', options: ['3:00', '3:30', '3:15', '3:45'], explanation: 'Half past means 30 minutes past the hour!' },
        { question: 'How many seconds in a minute?', answer: '60', options: ['30', '60', '100', '120'], explanation: 'One minute = 60 seconds!' },
        { question: 'Which comes first: morning or evening?', answer: 'Morning', options: ['Evening', 'Morning', 'Night', 'Afternoon'], explanation: 'Morning comes first, then afternoon, then evening!' },
        { question: 'How many weeks in a year?', answer: '52', options: ['12', '52', '7', '365'], explanation: 'One year = 52 weeks!' },
        { question: 'Quarter past 4 = ?', answer: '4:15', options: ['4:15', '4:30', '4:45', '4:05'], explanation: 'Quarter past means 15 minutes past the hour!' },
        { question: 'How many days in a year?', answer: '365', options: ['52', '100', '365', '360'], explanation: 'One year = 365 days (366 in a leap year)!' },
        { question: 'Quarter to 5 = ?', answer: '4:45', options: ['4:15', '4:30', '4:45', '5:15'], explanation: 'Quarter to 5 means 15 minutes before 5 = 4:45!' },
        { question: 'Which month has only 28 or 29 days?', answer: 'February', options: ['January', 'February', 'March', 'April'], explanation: 'February is the shortest month!' },
        { question: 'What does "a.m." stand for?', answer: 'Before midday', options: ['After midday', 'Before midday', 'All morning', 'At midnight'], explanation: 'a.m. means ante meridiem — before 12 noon!' },
        { question: '2 hours after 3:00 PM = ?', answer: '5:00 PM', options: ['4:00 PM', '5:00 PM', '1:00 PM', '6:00 PM'], explanation: '3:00 + 2 hours = 5:00 PM!' },
        { question: 'How many minutes in half an hour?', answer: '30', options: ['15', '30', '45', '60'], explanation: 'Half an hour = 30 minutes!' },
        { question: 'Which is longer: 90 minutes or 1 hour?', answer: '90 minutes', options: ['1 hour', '90 minutes', 'Same', 'Cannot tell'], explanation: '90 minutes = 1 hour 30 minutes — longer than 1 hour!' },
        { question: 'The big hand on a clock pointing to 12 means?', answer: 'O\'clock', options: ['30 minutes', 'O\'clock', '15 minutes', '45 minutes'], explanation: 'When the big hand is at 12, it is exactly o\'clock!' },
        { question: 'How many hours in 2 days?', answer: '48', options: ['24', '36', '48', '60'], explanation: '2 days × 24 hours = 48 hours!' },
        { question: 'School starts at 8:00 AM and ends at 3:00 PM. How long is the school day?', answer: '7 hours', options: ['5 hours', '6 hours', '7 hours', '8 hours'], explanation: 'From 8 AM to 3 PM = 7 hours!' },
      ],
    },
    money: {
      title: 'Money & Currency Quiz',
      questions: [
        { question: 'How many paise in one rupee?', answer: '100', options: ['10', '50', '100', '1000'], explanation: 'One rupee = 100 paise!' },
        { question: 'Which coin is worth more: 1₹ or 5₹?', answer: '5₹', options: ['1₹', '5₹', 'Same', 'Cannot tell'], explanation: 'Five rupees is worth more than one rupee!' },
        { question: 'If you have 10₹ and spend 3₹, how much is left?', answer: '7₹', options: ['5₹', '6₹', '7₹', '8₹'], explanation: '10 - 3 = 7 rupees left!' },
        { question: '2₹ + 3₹ = ?', answer: '5₹', options: ['4₹', '5₹', '6₹', '7₹'], explanation: 'Two rupees plus three rupees = five rupees!' },
        { question: 'If a toy costs 15₹ and you have 20₹, change = ?', answer: '5₹', options: ['5₹', '10₹', '15₹', '20₹'], explanation: '20 - 15 = 5 rupees change!' },
        { question: 'Three 5₹ coins = ?', answer: '15₹', options: ['10₹', '15₹', '20₹', '25₹'], explanation: '3 × 5 = 15 rupees!' },
        { question: 'If a pencil costs 2₹, 4 pencils cost?', answer: '8₹', options: ['6₹', '8₹', '10₹', '4₹'], explanation: '4 × 2 = 8 rupees!' },
        { question: 'You buy something for 18₹ and give 20₹. Change = ?', answer: '2₹', options: ['1₹', '2₹', '3₹', '5₹'], explanation: '20 - 18 = 2 rupees change!' },
        { question: 'Which is the highest: 10₹, 50₹, or 100₹?', answer: '100₹', options: ['10₹', '50₹', '100₹', 'Same'], explanation: '100 rupees is the highest amount!' },
        { question: '50₹ + 50₹ = ?', answer: '100₹', options: ['50₹', '75₹', '100₹', '125₹'], explanation: '50 plus 50 equals one hundred!' },
        { question: 'You have 200₹ and spend 75₹. How much is left?', answer: '125₹', options: ['100₹', '115₹', '125₹', '175₹'], explanation: '200 - 75 = 125 rupees!' },
        { question: 'Five 10₹ notes = ?', answer: '50₹', options: ['15₹', '40₹', '50₹', '60₹'], explanation: '5 × 10 = 50 rupees!' },
        { question: 'A book costs 45₹. You give 50₹. Change = ?', answer: '5₹', options: ['5₹', '10₹', '15₹', '45₹'], explanation: '50 - 45 = 5 rupees change!' },
        { question: 'What does "budget" mean?', answer: 'A plan for spending', options: ['Free money', 'A plan for spending', 'A type of coin', 'Saving all money'], explanation: 'A budget is a plan for how to spend your money!' },
        { question: 'If you save 10₹ each day for 7 days, you save?', answer: '70₹', options: ['17₹', '40₹', '70₹', '100₹'], explanation: '10 × 7 = 70 rupees saved!' },
        { question: 'Two 50₹ notes and one 20₹ note = ?', answer: '120₹', options: ['100₹', '120₹', '70₹', '150₹'], explanation: '50 + 50 + 20 = 120 rupees!' },
        { question: 'A mango costs 8₹. Three mangoes cost?', answer: '24₹', options: ['11₹', '20₹', '24₹', '28₹'], explanation: '3 × 8 = 24 rupees!' },
        { question: 'Which is NOT a way to pay for things?', answer: 'Singing a song', options: ['Cash', 'Credit card', 'Singing a song', 'UPI payment'], explanation: 'You can pay with cash, cards, or UPI — not by singing!' },
        { question: 'If you earn 500₹ and spend 350₹, how much is saved?', answer: '150₹', options: ['100₹', '150₹', '200₹', '350₹'], explanation: '500 - 350 = 150 rupees saved!' },
        { question: '4 × 25₹ = ?', answer: '100₹', options: ['75₹', '100₹', '125₹', '50₹'], explanation: '4 × 25 = 100 rupees!' },
      ],
    },
  },
  science: {
    plants: {
      title: 'Plants & Trees Quiz',
      questions: [
        { question: 'What do plants need to make food?', answer: 'Sunlight & Water', options: ['Only water', 'Sunlight & Water', 'Sand', 'Nothing'], explanation: 'Plants use sunlight, water, and air to make their food!' },
        { question: 'Which part of a plant drinks water?', answer: 'Roots', options: ['Leaves', 'Roots', 'Flowers', 'Seeds'], explanation: 'Roots absorb water from the soil!' },
        { question: 'What part of a plant makes food?', answer: 'Leaves', options: ['Roots', 'Leaves', 'Stem', 'Flower'], explanation: 'Green leaves make food using sunlight — called photosynthesis!' },
        { question: 'What do seeds grow into?', answer: 'New plants', options: ['Flowers only', 'New plants', 'Fruits only', 'Roots only'], explanation: 'Seeds sprout and grow into new plants!' },
        { question: 'Which part holds a plant upright?', answer: 'Stem', options: ['Leaves', 'Roots', 'Stem', 'Flower'], explanation: 'The stem supports the plant and carries water up!' },
        { question: 'Plants give us?', answer: 'Oxygen', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Fire'], explanation: 'Plants breathe in CO₂ and give out oxygen for us to breathe!' },
        { question: 'A cactus grows in?', answer: 'Desert', options: ['Ocean', 'Forest', 'Desert', 'Mountain'], explanation: 'Cacti store water and thrive in hot, dry deserts!' },
        { question: 'A sunflower turns towards?', answer: 'The Sun', options: ['The Moon', 'The Sun', 'Water', 'Wind'], explanation: 'Sunflowers follow the sun — this is called heliotropism!' },
        { question: 'The green pigment in leaves is called?', answer: 'Chlorophyll', options: ['Melanin', 'Chlorophyll', 'Protein', 'Sugar'], explanation: 'Chlorophyll makes leaves green and helps make food!' },
        { question: 'Flowers help plants to?', answer: 'Reproduce', options: ['Drink water', 'Reproduce', 'Make soil', 'Store food'], explanation: 'Flowers help plants make seeds so new plants can grow!' },
        { question: 'What is photosynthesis?', answer: 'Making food from sunlight', options: ['Drinking water', 'Growing roots', 'Making food from sunlight', 'Losing leaves'], explanation: 'Photosynthesis is how plants make food using sunlight!' },
        { question: 'Which plants don\'t have roots, stems, or leaves?', answer: 'Algae', options: ['Rose', 'Algae', 'Mango tree', 'Grass'], explanation: 'Algae are simple plants found in water with no proper roots!' },
        { question: 'Trees lose their leaves in which season?', answer: 'Autumn', options: ['Spring', 'Summer', 'Autumn', 'Winter'], explanation: 'Some trees (deciduous) lose their leaves in autumn!' },
        { question: 'Which part of a plant produces seeds?', answer: 'Fruit', options: ['Leaf', 'Root', 'Fruit', 'Stem'], explanation: 'Fruits contain seeds that can grow into new plants!' },
        { question: 'Water moves from roots to leaves through the?', answer: 'Stem', options: ['Flower', 'Leaf veins', 'Stem', 'Roots'], explanation: 'The stem acts like a pipe, carrying water from roots to leaves!' },
        { question: 'Which tree gives us rubber?', answer: 'Rubber tree', options: ['Oak', 'Pine', 'Rubber tree', 'Mango'], explanation: 'Natural rubber comes from the sap of rubber trees!' },
        { question: 'A plant with no green colour cannot?', answer: 'Make its own food', options: ['Grow tall', 'Make its own food', 'Absorb water', 'Flower'], explanation: 'Without chlorophyll, a plant cannot photosynthesise!' },
        { question: 'The process of seeds beginning to grow is called?', answer: 'Germination', options: ['Pollination', 'Germination', 'Photosynthesis', 'Evaporation'], explanation: 'Germination is when a seed sprouts and starts to grow!' },
        { question: 'Bees help plants by?', answer: 'Pollination', options: ['Watering them', 'Pollination', 'Cutting leaves', 'Making soil'], explanation: 'Bees carry pollen from flower to flower, helping plants reproduce!' },
        { question: 'A plant that lives for more than two years is called?', answer: 'Perennial', options: ['Annual', 'Perennial', 'Biennial', 'Seasonal'], explanation: 'Perennial plants come back year after year!' },
      ],
    },
    animals: {
      title: 'Animals & Wildlife Quiz',
      questions: [
        { question: 'What is the biggest animal in the world?', answer: 'Blue Whale', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'], explanation: 'The blue whale is the largest animal ever known!' },
        { question: 'What do herbivores eat?', answer: 'Plants only', options: ['Meat only', 'Plants only', 'Both', 'Nothing'], explanation: 'Herbivores only eat plants — like rabbits and cows!' },
        { question: 'What do carnivores eat?', answer: 'Meat', options: ['Plants', 'Meat', 'Both', 'Fruits only'], explanation: 'Carnivores eat meat — like lions and tigers!' },
        { question: 'Birds that cannot fly include?', answer: 'Penguin', options: ['Eagle', 'Parrot', 'Penguin', 'Sparrow'], explanation: 'Penguins cannot fly but are excellent swimmers!' },
        { question: 'Which animal is called the "King of the Jungle"?', answer: 'Lion', options: ['Tiger', 'Lion', 'Elephant', 'Gorilla'], explanation: 'Lions are called the king of the jungle!' },
        { question: 'How do fish breathe?', answer: 'Through gills', options: ['Lungs', 'Through gills', 'Nose', 'Skin'], explanation: 'Fish have gills to breathe oxygen from water!' },
        { question: 'A young frog is called?', answer: 'Tadpole', options: ['Cub', 'Kitten', 'Tadpole', 'Foal'], explanation: 'Baby frogs start as tadpoles in water!' },
        { question: 'Bats are active mostly at?', answer: 'Night', options: ['Morning', 'Noon', 'Night', 'Evening'], explanation: 'Bats are nocturnal — they come out at night!' },
        { question: 'The fastest land animal is?', answer: 'Cheetah', options: ['Horse', 'Cheetah', 'Leopard', 'Greyhound'], explanation: 'Cheetahs can run up to 120 km per hour!' },
        { question: 'Which animal has the longest neck?', answer: 'Giraffe', options: ['Elephant', 'Camel', 'Giraffe', 'Ostrich'], explanation: 'Giraffes have extremely long necks to reach tall trees!' },
        { question: 'Animals that eat both plants and meat are called?', answer: 'Omnivores', options: ['Herbivores', 'Carnivores', 'Omnivores', 'Predators'], explanation: 'Omnivores eat both plants and animals — like humans and bears!' },
        { question: 'A snake moves by?', answer: 'Slithering', options: ['Walking', 'Flying', 'Slithering', 'Jumping'], explanation: 'Snakes have no legs and move by slithering on their bodies!' },
        { question: 'Which animal builds a dam?', answer: 'Beaver', options: ['Ant', 'Beaver', 'Rabbit', 'Bear'], explanation: 'Beavers build dams in rivers using sticks and mud!' },
        { question: 'The young one of a dog is called?', answer: 'Puppy', options: ['Cub', 'Kitten', 'Puppy', 'Calf'], explanation: 'A baby dog is called a puppy!' },
        { question: 'Which is the only mammal that can fly?', answer: 'Bat', options: ['Eagle', 'Bat', 'Butterfly', 'Bee'], explanation: 'Bats are the only mammals capable of true flight!' },
        { question: 'Amphibians can live?', answer: 'On land and in water', options: ['Only in water', 'Only on land', 'On land and in water', 'In air only'], explanation: 'Amphibians like frogs live both on land and in water!' },
        { question: 'The largest land animal is?', answer: 'Elephant', options: ['Hippopotamus', 'Giraffe', 'Elephant', 'Rhino'], explanation: 'African elephants are the largest land animals on Earth!' },
        { question: 'A caterpillar becomes a?', answer: 'Butterfly', options: ['Bee', 'Moth', 'Butterfly', 'Dragonfly'], explanation: 'Caterpillars go through metamorphosis to become butterflies!' },
        { question: 'Dolphins communicate using?', answer: 'Clicks and whistles', options: ['Barking', 'Clicks and whistles', 'Roaring', 'Singing'], explanation: 'Dolphins use echolocation — clicking and whistling to communicate!' },
        { question: 'Which bird can mimic human speech?', answer: 'Parrot', options: ['Eagle', 'Parrot', 'Penguin', 'Ostrich'], explanation: 'Parrots can mimic (copy) human speech sounds!' },
      ],
    },
    'human-body': {
      title: 'Human Body Quiz',
      questions: [
        { question: 'What does the heart do?', answer: 'Pumps blood', options: ['Digests food', 'Pumps blood', 'Helps us think', 'Filters air'], explanation: 'The heart pumps blood all around your body!' },
        { question: 'Which organ do we use to think?', answer: 'Brain', options: ['Heart', 'Lungs', 'Brain', 'Stomach'], explanation: 'The brain controls all our thinking and body functions!' },
        { question: 'We breathe using our?', answer: 'Lungs', options: ['Heart', 'Liver', 'Lungs', 'Kidneys'], explanation: 'Lungs take in oxygen and release carbon dioxide!' },
        { question: 'How many senses do humans have?', answer: '5', options: ['3', '4', '5', '6'], explanation: 'We have 5 senses: sight, hearing, smell, taste, and touch!' },
        { question: 'We taste food using our?', answer: 'Tongue', options: ['Nose', 'Tongue', 'Eyes', 'Ears'], explanation: 'The tongue has taste buds to sense different flavours!' },
        { question: 'The bones in our body form the?', answer: 'Skeleton', options: ['Muscles', 'Skeleton', 'Skin', 'Nerves'], explanation: 'The skeleton gives our body shape and protects organs!' },
        { question: 'How many bones does an adult human have?', answer: '206', options: ['100', '150', '206', '300'], explanation: 'Adults have 206 bones — babies have more!' },
        { question: 'What does food become in the stomach?', answer: 'Digested', options: ['Blood', 'Air', 'Digested', 'Energy directly'], explanation: 'The stomach digests food by breaking it down!' },
        { question: 'We see with our?', answer: 'Eyes', options: ['Ears', 'Nose', 'Eyes', 'Mouth'], explanation: 'Eyes collect light to help us see the world!' },
        { question: 'Muscles help us?', answer: 'Move', options: ['Breathe air', 'Think', 'Move', 'See'], explanation: 'Muscles contract and relax to move our body!' },
        { question: 'The outer covering of the body is called?', answer: 'Skin', options: ['Muscle', 'Bone', 'Skin', 'Hair'], explanation: 'Skin is the largest organ and protects our body!' },
        { question: 'Which organ removes waste from blood?', answer: 'Kidneys', options: ['Lungs', 'Heart', 'Kidneys', 'Liver'], explanation: 'Kidneys filter blood and produce urine to remove waste!' },
        { question: 'Food is digested and nutrients absorbed in the?', answer: 'Intestines', options: ['Stomach only', 'Lungs', 'Intestines', 'Brain'], explanation: 'The intestines absorb nutrients from digested food!' },
        { question: 'Which vitamin do we get from sunlight?', answer: 'Vitamin D', options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], explanation: 'Sunlight on our skin makes Vitamin D for strong bones!' },
        { question: 'What carries messages from the brain to the body?', answer: 'Nerves', options: ['Blood', 'Muscles', 'Nerves', 'Bones'], explanation: 'Nerves carry electrical signals between the brain and body!' },
        { question: 'The number of teeth adults have is?', answer: '32', options: ['20', '28', '32', '36'], explanation: 'Adults have 32 teeth including wisdom teeth!' },
        { question: 'Red blood cells carry?', answer: 'Oxygen', options: ['Food', 'Oxygen', 'Waste', 'Hormones'], explanation: 'Red blood cells transport oxygen around the body!' },
        { question: 'Which part of the eye controls how much light enters?', answer: 'Pupil', options: ['Iris', 'Pupil', 'Retina', 'Lens'], explanation: 'The pupil is the black hole that controls light entry!' },
        { question: 'We hear sounds through our?', answer: 'Ears', options: ['Eyes', 'Nose', 'Ears', 'Mouth'], explanation: 'Ears pick up sound waves and send them to the brain!' },
        { question: 'Exercise keeps the body?', answer: 'Healthy and strong', options: ['Tired only', 'Sick', 'Healthy and strong', 'Hungry'], explanation: 'Regular exercise keeps muscles strong and the body healthy!' },
      ],
    },
    'earth-space': {
      title: 'Earth & Space Quiz',
      questions: [
        { question: 'What gives us light during the day?', answer: 'The Sun', options: ['The Moon', 'The Sun', 'Stars', 'Clouds'], explanation: 'The Sun is a star that provides light and heat!' },
        { question: 'How many planets are in our solar system?', answer: '8', options: ['7', '8', '9', '10'], explanation: 'There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune!' },
        { question: 'What orbits around Earth?', answer: 'The Moon', options: ['The Sun', 'The Moon', 'Mars', 'Stars'], explanation: 'The Moon orbits (travels around) Earth!' },
        { question: 'The biggest planet is?', answer: 'Jupiter', options: ['Saturn', 'Jupiter', 'Mars', 'Uranus'], explanation: 'Jupiter is the largest planet in our solar system!' },
        { question: 'Earth is covered mostly by?', answer: 'Water', options: ['Land', 'Water', 'Ice', 'Rocks'], explanation: 'About 71% of Earth is covered by water — mostly oceans!' },
        { question: 'Stars are?', answer: 'Huge balls of hot gas', options: ['Rocks', 'Huge balls of hot gas', 'Ice', 'Planets'], explanation: 'Stars are massive, extremely hot balls of gas!' },
        { question: 'The planet closest to the Sun is?', answer: 'Mercury', options: ['Venus', 'Mercury', 'Mars', 'Earth'], explanation: 'Mercury is the closest planet to the Sun!' },
        { question: 'A shooting star is actually?', answer: 'A meteor', options: ['A falling star', 'A meteor', 'A comet', 'A planet'], explanation: 'Shooting stars are meteors burning up in Earth\'s atmosphere!' },
        { question: 'Earth completes one full rotation in?', answer: '24 hours', options: ['12 hours', '24 hours', '48 hours', '365 days'], explanation: 'Earth spins once every 24 hours — that\'s one day!' },
        { question: 'Earth takes how long to orbit the Sun?', answer: '365 days', options: ['30 days', '12 months', '365 days', '24 hours'], explanation: 'Earth takes 365 days (one year) to orbit the Sun!' },
        { question: 'The planet with rings is?', answer: 'Saturn', options: ['Jupiter', 'Mars', 'Saturn', 'Neptune'], explanation: 'Saturn is famous for its spectacular ring system!' },
        { question: 'Which planet is called the Red Planet?', answer: 'Mars', options: ['Venus', 'Mars', 'Jupiter', 'Mercury'], explanation: 'Mars looks red because of iron oxide (rust) on its surface!' },
        { question: 'A group of stars forming a pattern is called?', answer: 'Constellation', options: ['Galaxy', 'Constellation', 'Solar system', 'Nebula'], explanation: 'Constellations are star patterns — like Orion and the Big Dipper!' },
        { question: 'Our solar system is in the Milky Way?', answer: 'Galaxy', options: ['Planet', 'Galaxy', 'Moon', 'Comet'], explanation: 'The Milky Way is a galaxy — our solar system is just a tiny part of it!' },
        { question: 'Gravity is the force that?', answer: 'Pulls things down', options: ['Pushes things up', 'Pulls things down', 'Makes things float', 'Creates heat'], explanation: 'Gravity pulls everything towards Earth — that\'s why we don\'t float!' },
        { question: 'Which planet is farthest from the Sun?', answer: 'Neptune', options: ['Uranus', 'Saturn', 'Neptune', 'Jupiter'], explanation: 'Neptune is the 8th and farthest planet from the Sun!' },
        { question: 'Day and night are caused by?', answer: 'Earth spinning', options: ['Moon moving', 'Earth spinning', 'Sun moving', 'Clouds forming'], explanation: 'Earth\'s rotation causes day on one side and night on the other!' },
        { question: 'Astronauts travel to space in?', answer: 'Rockets', options: ['Planes', 'Rockets', 'Helicopters', 'Balloons'], explanation: 'Rockets are powerful enough to escape Earth\'s gravity!' },
        { question: 'The Moon\'s surface has?', answer: 'Craters', options: ['Oceans', 'Forests', 'Craters', 'Cities'], explanation: 'The Moon has many craters caused by asteroid impacts!' },
        { question: 'Which is NOT a planet in our solar system?', answer: 'Pluto (now a dwarf planet)', options: ['Earth', 'Mars', 'Pluto (now a dwarf planet)', 'Saturn'], explanation: 'Pluto was reclassified as a dwarf planet in 2006!' },
      ],
    },
    weather: {
      title: 'Weather Quiz',
      questions: [
        { question: 'What falls from clouds as rain?', answer: 'Water droplets', options: ['Ice', 'Water droplets', 'Dust', 'Smoke'], explanation: 'Rain is water droplets falling from clouds!' },
        { question: 'What is evaporation?', answer: 'Water turning to vapour', options: ['Rain falling', 'Water turning to vapour', 'Ice melting', 'Wind blowing'], explanation: 'When water heats up, it becomes invisible water vapour!' },
        { question: 'Clouds are made of?', answer: 'Tiny water droplets', options: ['Smoke', 'Cotton', 'Tiny water droplets', 'Air'], explanation: 'Clouds form from millions of tiny water droplets!' },
        { question: 'Which instrument measures temperature?', answer: 'Thermometer', options: ['Barometer', 'Thermometer', 'Ruler', 'Scale'], explanation: 'A thermometer measures how hot or cold it is!' },
        { question: 'Thunder comes after?', answer: 'Lightning', options: ['Rain', 'Lightning', 'Wind', 'Snow'], explanation: 'Light travels faster than sound — lightning before thunder!' },
        { question: 'Wind is?', answer: 'Moving air', options: ['Moving water', 'Moving air', 'Moving fire', 'Moving clouds'], explanation: 'Wind is air that is moving from one place to another!' },
        { question: 'Snow forms when?', answer: 'Temperature drops very low', options: ['It is hot', 'Temperature drops very low', 'There is wind', 'It is autumn'], explanation: 'When temperatures drop below freezing, water freezes into snow!' },
        { question: 'A rainbow appears after?', answer: 'Rain and sunshine', options: ['Only rain', 'Only sunshine', 'Rain and sunshine', 'Wind'], explanation: 'Sunlight passes through raindrops to create a rainbow!' },
        { question: 'Fog is?', answer: 'Cloud at ground level', options: ['Heavy rain', 'Smoke', 'Cloud at ground level', 'Dust'], explanation: 'Fog is basically a very low cloud near the ground!' },
        { question: 'Which season is hottest?', answer: 'Summer', options: ['Spring', 'Summer', 'Autumn', 'Winter'], explanation: 'Summer is the warmest season of the year!' },
        { question: 'A scientist who studies weather is called?', answer: 'Meteorologist', options: ['Biologist', 'Astronomer', 'Meteorologist', 'Geologist'], explanation: 'A meteorologist studies and forecasts weather!' },
        { question: 'Hail is?', answer: 'Balls of ice falling from clouds', options: ['Heavy rain', 'Dust storm', 'Balls of ice falling from clouds', 'Foggy rain'], explanation: 'Hail forms when water droplets freeze into balls of ice!' },
        { question: 'A tornado is?', answer: 'A spinning column of air', options: ['Heavy rain', 'A spinning column of air', 'A big wave', 'A snowstorm'], explanation: 'Tornadoes are fast-spinning funnels of air that touch the ground!' },
        { question: 'Which instrument measures wind speed?', answer: 'Anemometer', options: ['Barometer', 'Thermometer', 'Anemometer', 'Rain gauge'], explanation: 'An anemometer spins in the wind to measure its speed!' },
        { question: 'How many colours are in a rainbow?', answer: '7', options: ['5', '6', '7', '8'], explanation: 'A rainbow has 7 colours: Red, Orange, Yellow, Green, Blue, Indigo, Violet!' },
        { question: 'Dew forms on grass because?', answer: 'Air cools at night', options: ['It rains lightly', 'Air cools at night', 'Plants sweat', 'Fog falls'], explanation: 'Cool night air causes water vapour to condense as dew on surfaces!' },
        { question: 'A drought occurs when?', answer: 'There is very little rain', options: ['There is too much rain', 'There is very little rain', 'It is too cold', 'The wind is strong'], explanation: 'A drought is a long period of very little or no rainfall!' },
        { question: 'Which cloud type is fluffy and white?', answer: 'Cumulus', options: ['Stratus', 'Cumulus', 'Nimbus', 'Cirrus'], explanation: 'Cumulus clouds look like fluffy cotton balls in a fair sky!' },
        { question: 'Which weather is dangerous for swimming outdoors?', answer: 'Lightning storm', options: ['Windy', 'Cloudy', 'Lightning storm', 'Cool'], explanation: 'Lightning can strike water — never swim during a thunderstorm!' },
        { question: 'Seasons change because?', answer: 'Earth orbits the Sun', options: ['The Sun changes size', 'Earth orbits the Sun', 'The Moon moves', 'Clouds form'], explanation: 'As Earth orbits the Sun at an angle, we experience different seasons!' },
      ],
    },
  },
  english: {
    alphabet: {
      title: 'Alphabet Quiz',
      questions: [
        { question: 'How many letters in the English alphabet?', answer: '26', options: ['24', '26', '28', '30'], explanation: 'The English alphabet has 26 letters from A to Z!' },
        { question: 'Which letter comes after B?', answer: 'C', options: ['A', 'C', 'D', 'E'], explanation: 'A, B, C... C comes after B!' },
        { question: 'What is the first letter of the alphabet?', answer: 'A', options: ['A', 'B', 'Z', 'E'], explanation: 'The alphabet starts with A!' },
        { question: 'What is the last letter of the alphabet?', answer: 'Z', options: ['X', 'Y', 'Z', 'W'], explanation: 'The alphabet ends with Z!' },
        { question: 'How many vowels are there?', answer: '5', options: ['3', '4', '5', '6'], explanation: 'There are 5 vowels: A, E, I, O, U!' },
        { question: 'Which of these is a vowel?', answer: 'E', options: ['B', 'E', 'K', 'P'], explanation: 'E is a vowel. The vowels are A, E, I, O, U!' },
        { question: 'Which letter comes before M?', answer: 'L', options: ['K', 'L', 'N', 'O'], explanation: '...K, L, M... so L comes before M!' },
        { question: 'Capital letter of "b" is?', answer: 'B', options: ['b', 'B', 'D', 'P'], explanation: 'The capital (uppercase) of b is B!' },
        { question: 'Which letter does "sun" start with?', answer: 'S', options: ['S', 'U', 'N', 'C'], explanation: 'Sun starts with the letter S!' },
        { question: 'How many consonants in the alphabet?', answer: '21', options: ['18', '20', '21', '24'], explanation: '26 letters minus 5 vowels = 21 consonants!' },
        { question: 'Which letter comes after P?', answer: 'Q', options: ['O', 'Q', 'R', 'S'], explanation: '...N, O, P, Q... Q comes after P!' },
        { question: 'What is the 10th letter of the alphabet?', answer: 'J', options: ['H', 'I', 'J', 'K'], explanation: 'A, B, C, D, E, F, G, H, I, J — J is the 10th letter!' },
        { question: 'Which of these is NOT a vowel?', answer: 'K', options: ['A', 'O', 'K', 'I'], explanation: 'K is a consonant! The vowels are A, E, I, O, U only.' },
        { question: 'The letter "Y" is sometimes used as a?', answer: 'Vowel', options: ['Consonant always', 'Vowel', 'Number', 'Symbol'], explanation: 'Y sometimes acts as a vowel, like in the word "gym"!' },
        { question: 'Which two letters look similar when lowercase?', answer: 'b and d', options: ['a and e', 'b and d', 'k and t', 'p and q'], explanation: 'Lowercase b and d are mirror images — easy to confuse!' },
        { question: 'The letter Q is usually followed by?', answer: 'U', options: ['A', 'U', 'E', 'I'], explanation: 'Q is almost always followed by U in English words (queen, quiz)!' },
        { question: 'How many letters are in the word ELEPHANT?', answer: '8', options: ['7', '8', '9', '10'], explanation: 'E-L-E-P-H-A-N-T — 8 letters!' },
        { question: 'Lowercase of A is?', answer: 'a', options: ['A', 'a', 'B', 'Aa'], explanation: 'The lowercase version of A is a!' },
        { question: 'Which letter is in the middle of the alphabet?', answer: 'M and N', options: ['K and L', 'M and N', 'O and P', 'J and K'], explanation: 'With 26 letters, M (13th) and N (14th) are in the middle!' },
        { question: 'The word "CAT" has how many letters?', answer: '3', options: ['2', '3', '4', '5'], explanation: 'C-A-T — 3 letters! Cat is a short word.' },
      ],
    },
    nouns: {
      title: 'Nouns Quiz',
      questions: [
        { question: 'Which word is a noun?', answer: 'Cat', options: ['Run', 'Cat', 'Happy', 'Quickly'], explanation: 'A noun names a person, place, or thing. Cat is a thing!' },
        { question: '"School" is a noun that names a?', answer: 'Place', options: ['Person', 'Place', 'Thing', 'Action'], explanation: 'School is a place — somewhere you go!' },
        { question: 'Which is a proper noun?', answer: 'London', options: ['City', 'Book', 'London', 'Dog'], explanation: 'London is a specific place — proper nouns have capital letters!' },
        { question: '"Happiness" is an example of?', answer: 'Abstract noun', options: ['Common noun', 'Proper noun', 'Abstract noun', 'Verb'], explanation: 'Abstract nouns name things we can\'t touch — like feelings!' },
        { question: 'Which word is a noun?', answer: 'Table', options: ['Jump', 'Beautiful', 'Table', 'Quickly'], explanation: 'Table is a thing — that makes it a noun!' },
        { question: '"Teacher" is a noun naming a?', answer: 'Person', options: ['Place', 'Thing', 'Person', 'Action'], explanation: 'A teacher is a person — nouns can name people!' },
        { question: 'The plural of "child" is?', answer: 'Children', options: ['Childs', 'Childrens', 'Children', 'Childies'], explanation: 'The plural of child is children — an irregular plural!' },
        { question: 'Which is a collective noun?', answer: 'Flock', options: ['Bird', 'Fly', 'Flock', 'Wing'], explanation: 'Flock is a collective noun for a group of birds!' },
        { question: '"Apple" is a?', answer: 'Common noun', options: ['Proper noun', 'Common noun', 'Abstract noun', 'Verb'], explanation: 'Apple is a common noun — a general name for a thing!' },
        { question: 'Nouns can be replaced by?', answer: 'Pronouns', options: ['Verbs', 'Adjectives', 'Pronouns', 'Adverbs'], explanation: 'Pronouns like he, she, it replace nouns!' },
        { question: 'The plural of "mouse" is?', answer: 'Mice', options: ['Mouses', 'Mousees', 'Mice', 'Mices'], explanation: 'Mouse has the irregular plural: mice!' },
        { question: 'Which is a proper noun?', answer: 'India', options: ['Country', 'Mountain', 'India', 'River'], explanation: 'India is a specific country — proper nouns are always capitalised!' },
        { question: 'A noun that you cannot see or touch is?', answer: 'Abstract noun', options: ['Common noun', 'Concrete noun', 'Abstract noun', 'Proper noun'], explanation: 'Abstract nouns are ideas and feelings like love, joy, fear!' },
        { question: 'A pack of wolves is a?', answer: 'Collective noun', options: ['Proper noun', 'Abstract noun', 'Common noun', 'Collective noun'], explanation: '"Pack" is a collective noun — it names a group of wolves!' },
        { question: 'Which sentence has a proper noun?', answer: 'Tom is my friend', options: ['The dog ran', 'Tom is my friend', 'Cats are cute', 'Birds fly high'], explanation: '"Tom" is a proper noun — a specific person\'s name!' },
        { question: 'The plural of "tooth" is?', answer: 'Teeth', options: ['Tooths', 'Teeths', 'Teeth', 'Toothes'], explanation: 'Tooth has the irregular plural: teeth!' },
        { question: 'Which word is a noun?', answer: 'Freedom', options: ['Run', 'Happy', 'Freedom', 'Quickly'], explanation: 'Freedom is an abstract noun — you can feel it but not touch it!' },
        { question: 'A noun naming something you can touch is?', answer: 'Concrete noun', options: ['Abstract noun', 'Concrete noun', 'Proper noun', 'Collective noun'], explanation: 'Concrete nouns are physical things you can see or touch!' },
        { question: 'Which is a collective noun for a group of fish?', answer: 'School', options: ['Pack', 'Herd', 'School', 'Flock'], explanation: 'A group of fish is called a school of fish!' },
        { question: 'Nouns that name general things (not specific) are?', answer: 'Common nouns', options: ['Proper nouns', 'Common nouns', 'Abstract nouns', 'Collective nouns'], explanation: 'Common nouns name general things: dog, city, book!' },
      ],
    },
    verbs: {
      title: 'Verbs Quiz',
      questions: [
        { question: 'Which word is a verb?', answer: 'Jump', options: ['Book', 'Jump', 'Blue', 'Table'], explanation: 'Jump is an action word — that makes it a verb!' },
        { question: 'Birds can?', answer: 'Fly', options: ['Happy', 'Fly', 'Sky', 'Big'], explanation: 'Fly is a verb — it describes the action birds do!' },
        { question: 'Which is an action word?', answer: 'Run', options: ['Red', 'Run', 'Tree', 'Slow'], explanation: 'Run describes movement — it is an action verb!' },
        { question: '"Is eating" is in which tense?', answer: 'Present continuous', options: ['Past', 'Present continuous', 'Future', 'Present simple'], explanation: 'Is eating = happening right now = present continuous!' },
        { question: 'The verb in "She sings beautifully" is?', answer: 'Sings', options: ['She', 'Beautifully', 'Sings', 'Beautiful'], explanation: 'Sings is the action — the verb!' },
        { question: 'Which sentence has a verb?', answer: 'The dog barks loudly', options: ['A big dog', 'Blue sky', 'The dog barks loudly', 'Red flowers'], explanation: 'Barks is the verb — the action the dog does!' },
        { question: '"Ate" is the past tense of?', answer: 'Eat', options: ['Eating', 'Eat', 'Eats', 'Eaten'], explanation: 'Ate is the past tense form of the verb eat!' },
        { question: 'Helping verbs include?', answer: 'Is, are, was', options: ['Cat, dog', 'Big, small', 'Is, are, was', 'Run, jump'], explanation: 'Is, are, was help form sentences — they are helping verbs!' },
        { question: 'A verb always describes?', answer: 'An action or state', options: ['A colour', 'A place', 'An action or state', 'A size'], explanation: 'Verbs describe actions (run) or states (is, feels)!' },
        { question: '"Will play" is which tense?', answer: 'Future tense', options: ['Past tense', 'Present tense', 'Future tense', 'No tense'], explanation: 'Will play = will happen later = future tense!' },
        { question: 'Identify the verb: "I write a letter."', answer: 'Write', options: ['I', 'Letter', 'A', 'Write'], explanation: 'Write is the action being done — it is the verb!' },
        { question: 'Past tense of "swim" is?', answer: 'Swam', options: ['Swimmed', 'Swam', 'Swum', 'Swimming'], explanation: 'Swim is irregular — its past tense is swam!' },
        { question: 'Which of these is NOT a verb?', answer: 'Beautiful', options: ['Sing', 'Dance', 'Beautiful', 'Eat'], explanation: 'Beautiful is an adjective — it describes, not acts!' },
        { question: 'The "to" form of a verb is called?', answer: 'Infinitive', options: ['Gerund', 'Infinitive', 'Participle', 'Clause'], explanation: 'To run, to eat, to sleep — these are infinitive forms!' },
        { question: 'A verb that ends in -ing used as a noun is called?', answer: 'Gerund', options: ['Verb', 'Gerund', 'Adverb', 'Adjective'], explanation: '"Swimming is fun" — swimming is a gerund, used as a noun!' },
        { question: '"Could", "would", "should" are?', answer: 'Modal verbs', options: ['Action verbs', 'Helping verbs', 'Modal verbs', 'Linking verbs'], explanation: 'Modal verbs show possibility or obligation — could, would, should!' },
        { question: 'Find the verb: "The birds chirped happily."', answer: 'Chirped', options: ['Birds', 'Happily', 'Chirped', 'The'], explanation: 'Chirped is what the birds did — it is the verb!' },
        { question: 'Linking verbs connect the subject to?', answer: 'A description', options: ['An object', 'A place', 'A description', 'Another verb'], explanation: '"She is tall" — is links she to the description tall!' },
        { question: 'The base form "to run" — "run" is in which form?', answer: 'Infinitive', options: ['Past tense', 'Infinitive', 'Gerund', 'Participle'], explanation: 'The base/infinitive form is how verbs appear in dictionaries!' },
        { question: 'Past tense of "break" is?', answer: 'Broke', options: ['Breaked', 'Broken', 'Broke', 'Breaks'], explanation: 'Break is irregular — its simple past tense is broke!' },
      ],
    },
    adjectives: {
      title: 'Adjectives Quiz',
      questions: [
        { question: 'Which word is an adjective?', answer: 'Beautiful', options: ['Run', 'Beautiful', 'Book', 'Sing'], explanation: 'Beautiful describes something — that makes it an adjective!' },
        { question: 'The ___ flower is red. (Fill in)', answer: 'Pretty', options: ['Jump', 'Pretty', 'Table', 'Eat'], explanation: 'Pretty describes the flower — adjectives describe nouns!' },
        { question: 'Which word describes size?', answer: 'Big', options: ['Walk', 'Big', 'Cat', 'Slowly'], explanation: 'Big is an adjective describing how large something is!' },
        { question: 'In "a blue car", blue is a?', answer: 'Adjective', options: ['Noun', 'Verb', 'Adjective', 'Adverb'], explanation: 'Blue describes the car — so it is an adjective!' },
        { question: 'Adjectives describe?', answer: 'Nouns', options: ['Verbs', 'Nouns', 'Adjectives', 'Adverbs'], explanation: 'Adjectives always describe or modify nouns!' },
        { question: '"Cold", "hot", "warm" are all?', answer: 'Adjectives', options: ['Nouns', 'Verbs', 'Adjectives', 'Adverbs'], explanation: 'Cold, hot, warm describe temperature — they are adjectives!' },
        { question: 'Find the adjective: "The tall building"', answer: 'Tall', options: ['The', 'Building', 'Tall', 'A'], explanation: 'Tall describes the building — so it\'s the adjective!' },
        { question: 'Opposite of "happy" is?', answer: 'Sad', options: ['Glad', 'Sad', 'Excited', 'Joyful'], explanation: 'Happy and sad are adjectives that are opposites!' },
        { question: 'Which is NOT an adjective?', answer: 'Running', options: ['Clever', 'Tired', 'Running', 'Pretty'], explanation: 'Running is a verb (action). Clever, tired, and pretty describe things!' },
        { question: 'Comparative form of "big" is?', answer: 'Bigger', options: ['More big', 'Biggest', 'Bigger', 'Bigest'], explanation: 'We add -er to make big into bigger for comparisons!' },
        { question: 'Superlative form of "fast" is?', answer: 'Fastest', options: ['Faster', 'More fast', 'Fastest', 'Most fast'], explanation: 'Superlative means the most — fastest means the most fast!' },
        { question: 'In "a shiny red apple", how many adjectives are there?', answer: '2', options: ['1', '2', '3', '4'], explanation: 'Shiny and red both describe the apple — 2 adjectives!' },
        { question: 'Which describes a colour?', answer: 'Golden', options: ['Quickly', 'Golden', 'Run', 'Table'], explanation: 'Golden is an adjective that describes a shiny yellow colour!' },
        { question: 'An adjective that shows a number is?', answer: 'Numeral adjective', options: ['Proper adjective', 'Numeral adjective', 'Possessive adjective', 'Demonstrative'], explanation: '"Three cats" — three is a numeral adjective showing how many!' },
        { question: '"My", "your", "his" are what type of adjective?', answer: 'Possessive', options: ['Proper', 'Numeral', 'Possessive', 'Demonstrative'], explanation: 'My, your, his show ownership — they are possessive adjectives!' },
        { question: '"This", "that", "these" are?', answer: 'Demonstrative adjectives', options: ['Possessive adjectives', 'Proper adjectives', 'Demonstrative adjectives', 'Numeral adjectives'], explanation: 'Demonstrative adjectives point to specific nouns — this, that, these, those!' },
        { question: 'Find the adjective: "She has a kind heart."', answer: 'Kind', options: ['She', 'Heart', 'Kind', 'Has'], explanation: 'Kind describes the heart — kind is the adjective!' },
        { question: 'Comparative form of "beautiful" is?', answer: 'More beautiful', options: ['Beautifuler', 'Most beautiful', 'More beautiful', 'Beautifulest'], explanation: 'Long adjectives use more/most: more beautiful, most beautiful!' },
        { question: 'Which adjective describes shape?', answer: 'Circular', options: ['Loud', 'Sweet', 'Circular', 'Quickly'], explanation: 'Circular describes the shape of something — round like a circle!' },
        { question: '"Ancient" and "new" are?', answer: 'Opposite adjectives', options: ['Synonyms', 'Opposite adjectives', 'Adverbs', 'Verbs'], explanation: 'Ancient means very old, new means recent — they are adjective opposites!' },
      ],
    },
    sentences: {
      title: 'Sentences Quiz',
      questions: [
        { question: 'Which is a complete sentence?', answer: 'I love apples.', options: ['Love apples', 'I love apples.', 'Apples red', 'The apple'], explanation: 'A complete sentence needs a subject, verb, and punctuation!' },
        { question: 'A sentence ends with?', answer: 'Punctuation mark', options: ['A letter', 'Punctuation mark', 'A space', 'Nothing'], explanation: 'Sentences end with a full stop, question mark, or exclamation mark!' },
        { question: 'A sentence must have at least?', answer: 'A subject and verb', options: ['Only nouns', 'A subject and verb', 'Three words', 'An adjective'], explanation: 'Every sentence needs a subject (who/what) and a verb (action)!' },
        { question: 'Which sentence asks a question?', answer: 'Are you happy?', options: ['I am happy.', 'Are you happy?', 'Be happy!', 'So happy'], explanation: 'Questions end with a question mark and ask something!' },
        { question: 'An exclamatory sentence shows?', answer: 'Strong feeling', options: ['A question', 'A statement', 'Strong feeling', 'A command'], explanation: 'Exclamatory sentences show excitement, surprise or joy!' },
        { question: 'A command sentence ends with?', answer: '. or !', options: ['?', '. or !', 'Nothing', 'A comma'], explanation: 'Commands end with a full stop or exclamation mark!' },
        { question: 'The "subject" in a sentence is?', answer: 'Who or what the sentence is about', options: ['The action', 'The describing word', 'Who or what the sentence is about', 'The ending'], explanation: 'The subject tells us who or what is doing the action!' },
        { question: 'Find the subject: "The dog ran fast."', answer: 'The dog', options: ['Ran', 'Fast', 'The dog', 'Dog ran'], explanation: 'The dog is doing the running — it\'s the subject!' },
        { question: 'Capital letters are used at the?', answer: 'Start of sentences', options: ['End of sentences', 'Start of sentences', 'Middle', 'Random places'], explanation: 'Every sentence begins with a capital letter!' },
        { question: 'A paragraph contains?', answer: 'Multiple sentences', options: ['One word', 'One sentence', 'Multiple sentences', 'No punctuation'], explanation: 'A paragraph is a group of sentences about one topic!' },
      ],
    },
    phonics: {
      title: 'Phonics Quiz',
      questions: [
        { question: 'What sound does "sh" make?', answer: 'Like in "ship"', options: ['Like in "cat"', 'Like in "ship"', 'Like in "dog"', 'Like in "run"'], explanation: 'SH makes the sound you hear in "ship", "shop", and "fish"!' },
        { question: 'The word "cat" rhymes with?', answer: 'Hat', options: ['Dog', 'Hat', 'Sun', 'Big'], explanation: 'Cat and hat rhyme because they both end in -at!' },
        { question: 'Which word starts with a vowel sound?', answer: 'Apple', options: ['Ball', 'Apple', 'Cat', 'Dog'], explanation: 'Apple starts with A, which is a vowel!' },
        { question: '"Ch" makes the sound heard in?', answer: 'Chair', options: ['Car', 'Chair', 'Cake', 'Can'], explanation: 'Ch makes a special sound as in chair, cheese, chip!' },
        { question: 'Blend the sounds: /c/ /a/ /t/ = ?', answer: 'cat', options: ['cap', 'cat', 'can', 'cab'], explanation: 'Put c, a, t together and you get the word cat!' },
        { question: 'The "silent e" rule: "hop" becomes?', answer: 'hope', options: ['hopp', 'hope', 'hops', 'hoppe'], explanation: 'Adding a silent e makes the vowel say its long name: hop → hope!' },
        { question: '"Th" as in "this" is a?', answer: 'Consonant blend', options: ['Vowel', 'Consonant blend', 'Rhyme', 'Syllable'], explanation: 'Th combines two letters making one new sound!' },
        { question: 'How many syllables in "butterfly"?', answer: '3', options: ['1', '2', '3', '4'], explanation: 'But-ter-fly = 3 syllables! Clap each part to count!' },
        { question: '"Oo" as in "moon" makes which sound?', answer: 'A long "oo" sound', options: ['Short "o"', 'A long "oo" sound', '"u" sound', '"ow" sound'], explanation: 'The oo in moon and food makes a long, round sound!' },
        { question: 'Words that start the same way are called?', answer: 'Alliteration', options: ['Rhyme', 'Alliteration', 'Blend', 'Phoneme'], explanation: 'When words start with the same sound it\'s called alliteration!' },
      ],
    },
    tenses: {
      title: 'Tenses Quiz',
      questions: [
        { question: '"I play football" is which tense?', answer: 'Present simple', options: ['Past', 'Present simple', 'Future', 'Continuous'], explanation: 'I play = happening now or regularly = present simple!' },
        { question: '"I played football" is which tense?', answer: 'Past simple', options: ['Past simple', 'Present', 'Future', 'Continuous'], explanation: 'Played is past tense — it already happened!' },
        { question: '"I will play football" is which tense?', answer: 'Future', options: ['Past', 'Present', 'Future', 'Conditional'], explanation: 'Will play = happening later = future tense!' },
        { question: 'Past tense of "go" is?', answer: 'Went', options: ['Goed', 'Goes', 'Went', 'Gone'], explanation: 'Go is irregular — its past tense is went!' },
        { question: 'Past tense of "see" is?', answer: 'Saw', options: ['Seed', 'Seen', 'Saw', 'Sees'], explanation: 'See is irregular — its past tense is saw!' },
        { question: '"She is reading" — what tense?', answer: 'Present continuous', options: ['Past', 'Present continuous', 'Future', 'Present simple'], explanation: 'Is + verb-ing = happening right now = present continuous!' },
        { question: 'Which is future tense?', answer: 'He will sing', options: ['He sang', 'He sings', 'He will sing', 'He is singing'], explanation: 'Will + verb = future tense!' },
        { question: 'Past tense of "run" is?', answer: 'Ran', options: ['Runned', 'Runs', 'Ran', 'Running'], explanation: 'Run is irregular — its past tense is ran!' },
        { question: '"They have eaten" is which tense?', answer: 'Present perfect', options: ['Past simple', 'Present perfect', 'Future', 'Present simple'], explanation: 'Have + past participle = present perfect — an action just completed!' },
        { question: 'Regular verbs add ___ in past tense?', answer: '-ed', options: ['-ing', '-ed', '-s', '-er'], explanation: 'Regular verbs add -ed: walk → walked, jump → jumped!' },
      ],
    },
    vocabulary: {
      title: 'Vocabulary Quiz',
      questions: [
        { question: 'What does "enormous" mean?', answer: 'Very large', options: ['Very small', 'Very large', 'Very fast', 'Very slow'], explanation: 'Enormous means extremely big or huge!' },
        { question: 'Opposite of "ancient" is?', answer: 'Modern', options: ['Old', 'Modern', 'Big', 'Dark'], explanation: 'Ancient means very old — the opposite is modern or new!' },
        { question: '"Brave" means?', answer: 'Courageous', options: ['Afraid', 'Courageous', 'Sad', 'Angry'], explanation: 'Brave means having courage to face danger or difficulty!' },
        { question: 'A word with the same meaning is called?', answer: 'Synonym', options: ['Antonym', 'Synonym', 'Homonym', 'Prefix'], explanation: 'Synonyms are words with similar meanings — happy/joyful!' },
        { question: 'A word with opposite meaning is called?', answer: 'Antonym', options: ['Synonym', 'Antonym', 'Phoneme', 'Prefix'], explanation: 'Antonyms are opposites — hot and cold, big and small!' },
        { question: '"Gigantic" is a synonym for?', answer: 'Huge', options: ['Tiny', 'Huge', 'Fast', 'Quiet'], explanation: 'Gigantic and huge both mean extremely large!' },
        { question: 'What does "curious" mean?', answer: 'Wanting to learn', options: ['Angry', 'Wanting to learn', 'Tired', 'Bored'], explanation: 'Curious means eager to know and learn about things!' },
        { question: '"Swift" means?', answer: 'Fast', options: ['Slow', 'Fast', 'Big', 'Dark'], explanation: 'Swift means moving quickly — like a swift bird!' },
        { question: 'What is a "habitat"?', answer: 'A home for animals', options: ['A type of food', 'A home for animals', 'A kind of plant', 'The weather'], explanation: 'A habitat is the natural home or environment of an animal!' },
        { question: '"Delicious" describes?', answer: 'Taste', options: ['Sound', 'Colour', 'Taste', 'Touch'], explanation: 'Delicious means something tastes very good!' },
        { question: 'What does "transparent" mean?', answer: 'See-through', options: ['Dark', 'See-through', 'Heavy', 'Loud'], explanation: 'Transparent means you can see through it, like glass!' },
        { question: '"Ferocious" means?', answer: 'Very fierce or violent', options: ['Gentle', 'Very fierce or violent', 'Playful', 'Quiet'], explanation: 'Ferocious means extremely fierce — a ferocious lion!' },
        { question: 'A word that sounds the same but means something different is?', answer: 'Homophone', options: ['Synonym', 'Antonym', 'Homophone', 'Prefix'], explanation: 'Homophones sound the same but have different meanings: there/their!' },
        { question: '"Benevolent" means?', answer: 'Kind and generous', options: ['Angry', 'Sad', 'Kind and generous', 'Afraid'], explanation: 'Benevolent means well-meaning and kind to others!' },
        { question: 'What does "illuminate" mean?', answer: 'To light up', options: ['To darken', 'To light up', 'To hide', 'To eat'], explanation: 'Illuminate means to light up or make bright!' },
        { question: 'A "prefix" is?', answer: 'Letters added to the front of a word', options: ['Letters at the end', 'Letters at the start', 'Letters added to the front of a word', 'A full word'], explanation: '"Un" in "unhappy" is a prefix that changes the meaning!' },
        { question: 'What does "exhausted" mean?', answer: 'Very tired', options: ['Excited', 'Very tired', 'Happy', 'Angry'], explanation: 'Exhausted means extremely tired — you\'ve used all your energy!' },
        { question: '"Vibrant" means?', answer: 'Full of colour and energy', options: ['Dull and quiet', 'Full of colour and energy', 'Broken', 'Silent'], explanation: 'Vibrant means bright, lively, and full of energy!' },
        { question: 'The opposite of "generous" is?', answer: 'Selfish', options: ['Kind', 'Selfish', 'Happy', 'Brave'], explanation: 'Generous means giving freely — the opposite is selfish!' },
        { question: '"Peculiar" means?', answer: 'Strange or unusual', options: ['Normal', 'Beautiful', 'Strange or unusual', 'Very fast'], explanation: 'Peculiar means odd or different from usual — peculiar behaviour!' },
      ],
    },
  },
};

const GENERIC_QUESTIONS = (title: string): Question[] => [
  { question: `This topic is about "${title}". Learning is?`, answer: 'Fun!', options: ['Boring', 'Fun!', 'Hard', 'Easy'], explanation: 'Learning is always fun and exciting!' },
  { question: 'How many colours in a rainbow?', answer: '7', options: ['5', '6', '7', '8'], explanation: 'ROYGBIV — Red, Orange, Yellow, Green, Blue, Indigo, Violet!' },
  { question: 'The Earth is shaped like a?', answer: 'Sphere', options: ['Cube', 'Flat circle', 'Sphere', 'Square'], explanation: 'Earth is roughly spherical — like a slightly squashed ball!' },
  { question: 'What does a caterpillar become?', answer: 'Butterfly', options: ['Bee', 'Butterfly', 'Ant', 'Worm'], explanation: 'Caterpillars transform into beautiful butterflies!' },
  { question: 'Plants breathe in?', answer: 'Carbon dioxide', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Steam'], explanation: 'Plants take in CO₂ and give out oxygen!' },
  { question: 'How many legs does a spider have?', answer: '8', options: ['6', '8', '10', '4'], explanation: 'Spiders are arachnids and have 8 legs!' },
  { question: 'The Sun is a?', answer: 'Star', options: ['Planet', 'Moon', 'Star', 'Asteroid'], explanation: 'Our Sun is a medium-sized star!' },
  { question: 'Largest ocean on Earth?', answer: 'Pacific Ocean', options: ['Indian Ocean', 'Pacific Ocean', 'Atlantic Ocean', 'Arctic Ocean'], explanation: 'The Pacific Ocean is the largest and deepest ocean!' },
  { question: 'Ice is water in which state?', answer: 'Solid', options: ['Liquid', 'Gas', 'Solid', 'Plasma'], explanation: 'When water freezes, it becomes solid ice!' },
  { question: 'A baby cat is called a?', answer: 'Kitten', options: ['Cub', 'Pup', 'Kitten', 'Foal'], explanation: 'A baby cat is called a kitten — so cute!' },
];

export function Quiz() {
  const navigate = useNavigate();
  const { subject, topic } = useParams();
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<{ correct: boolean; selected: string; expected: string }[]>([]);

  const quizSet = subject && topic ? quizData[subject]?.[topic] : null;
  const questions = quizSet?.questions ?? GENERIC_QUESTIONS(topic || 'General');
  const quizTitle = quizSet?.title ?? `${topic} Quiz`;

  useEffect(() => {
    const progress = localStorage.getItem(`${subject}_progress`);
    if (!progress) {
      localStorage.setItem(`${subject}_progress`, JSON.stringify({ completed: 0, total: 20 }));
    }
  }, [subject]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].answer;
    setIsCorrect(correct);
    const newAnswers = [...answers, { correct, selected: answer, expected: questions[currentQuestion].answer }];
    setAnswers(newAnswers);
    if (correct) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        const finalScore = newAnswers.filter(a => a.correct).length;
        const stars = finalScore >= questions.length * 0.8 ? 3 : finalScore >= questions.length * 0.5 ? 2 : 1;

        const alreadyCompleted = localStorage.getItem(`${subject}_${topic}_quiz_completed`) === 'true';
        if (!alreadyCompleted) {
          const progress = JSON.parse(localStorage.getItem(`${subject}_progress`) || '{"completed":0,"total":20}');
          progress.completed = Math.min(progress.completed + 1, progress.total);
          localStorage.setItem(`${subject}_progress`, JSON.stringify(progress));
        }

        localStorage.setItem(`${subject}_${topic}_quiz_completed`, 'true');
        localStorage.setItem(`${subject}_${topic}_quiz_stars`, stars.toString());
        localStorage.setItem(`${subject}_${topic}_completed`, 'true');
        localStorage.setItem(`${subject}_${topic}_stars`, stars.toString());
        localStorage.setItem('daily_quiz_taken', 'true');

        if (finalScore >= questions.length * 0.8) {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }

        setScore(finalScore);
        setShowResult(true);
      }
    }, 1800);
  };

  const subjectColors: Record<string, { from: string; to: string; bg: string; text: string }> = {
    math: { from: 'from-blue-500', to: 'to-indigo-600', bg: 'bg-blue-500', text: 'text-blue-600' },
    science: { from: 'from-emerald-500', to: 'to-green-600', bg: 'bg-emerald-500', text: 'text-emerald-600' },
    english: { from: 'from-purple-500', to: 'to-pink-600', bg: 'bg-purple-500', text: 'text-purple-600' },
  };
  const colors = subjectColors[subject || 'math'] ?? subjectColors.math;

  if (showResult) {
    const stars = score >= questions.length * 0.8 ? 3 : score >= questions.length * 0.5 ? 2 : 1;
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #FFF9C4, #FFD6E0, #C3B1E1)' }}>
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.7 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
            <Trophy className="w-28 h-28 text-yellow-500 mx-auto mb-5" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
          </motion.div>

          <h2 className="text-4xl font-black text-transparent bg-clip-text mb-3" style={{ backgroundImage: 'linear-gradient(135deg, #7C3AED, #DB2777)', fontFamily: 'var(--font-playful)' }}>
            {t.quizComplete}
          </h2>

          <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #F3E8FF, #FCE7F3)' }}>
            <p className="text-5xl font-black text-gray-800 mb-1" style={{ fontFamily: 'var(--font-playful)' }}>{score}/{questions.length}</p>
            <p className="text-2xl font-bold text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>{percentage}% Correct!</p>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2].map(i => (
              <motion.div key={i} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                <Star className={`w-14 h-14 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
              </motion.div>
            ))}
          </div>

          {percentage === 100 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }}
              className="bg-yellow-50 border-4 border-yellow-400 rounded-2xl p-4 mb-5">
              <PartyPopper className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
              <p className="text-lg font-black text-yellow-800" style={{ fontFamily: 'var(--font-playful)' }}>Perfect Score! You are Amazing! 🎉</p>
            </motion.div>
          )}

          {/* Answer review */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-5 text-left max-h-40 overflow-y-auto">
            <p className="font-black text-gray-700 mb-2 text-sm" style={{ fontFamily: 'var(--font-playful)' }}>Answer Review:</p>
            {answers.map((a, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm py-1 ${a.correct ? 'text-green-700' : 'text-red-600'}`} style={{ fontFamily: 'var(--font-body)' }}>
                <span>{a.correct ? '✅' : '❌'}</span>
                <span>Q{i + 1}: {a.correct ? 'Correct!' : `You said "${a.selected}" — Answer: "${a.expected}"`}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button onClick={() => navigate(`/${subject}/${topic}`)}
              className={`w-full bg-gradient-to-r ${colors.from} ${colors.to} text-white font-black text-lg py-4 rounded-2xl hover:shadow-xl transition-all`}
              style={{ fontFamily: 'var(--font-playful)' }}>
              {t.reviewLesson} 📚
            </button>
            <button onClick={() => navigate(`/${subject}`)}
              className="w-full bg-gradient-to-r from-gray-400 to-gray-600 text-white font-black text-lg py-4 rounded-2xl hover:shadow-xl transition-all"
              style={{ fontFamily: 'var(--font-playful)' }}>
              {t.moreTopics} 🎯
            </button>
            <button onClick={() => navigate('/dashboard')}
              className="w-full bg-white border-3 border-gray-200 text-gray-700 font-black text-lg py-4 rounded-2xl hover:bg-gray-50 transition-all"
              style={{ fontFamily: 'var(--font-playful)', borderWidth: '3px' }}>
              🏠 Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 50%, #FCE7F3 100%)' }}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.from} ${colors.to} text-white p-5 shadow-xl`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate(`/${subject}`)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all font-bold text-sm"
              style={{ fontFamily: 'var(--font-body)' }}>
              <ArrowLeft className="w-4 h-4" /> Exit Quiz
            </button>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className="font-black text-lg">{score}</span>
            </div>
          </div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-playful)' }}>{quizTitle} 📝</h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-yellow-400 rounded-full"
              />
            </div>
            <span className="text-white font-black text-sm">{currentQuestion + 1}/{questions.length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="flex items-start justify-between mb-6 gap-3">
              <h2 className="text-2xl font-black text-gray-800 flex-1" style={{ fontFamily: 'var(--font-playful)' }}>
                {question.question}
              </h2>
              <button onClick={() => speakText(question.question)}
                className={`flex-shrink-0 p-3 rounded-2xl ${colors.bg} bg-opacity-10 hover:bg-opacity-20 transition-all`}>
                <Volume2 className={`w-5 h-5 ${colors.text}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((option) => {
                let cls = 'p-4 rounded-2xl font-black text-lg transition-all text-center border-3 ';
                if (!selectedAnswer) {
                  cls += `bg-gradient-to-r ${colors.from} ${colors.to} text-white border-transparent hover:scale-102 hover:shadow-lg cursor-pointer`;
                } else if (option === question.answer) {
                  cls += 'bg-green-500 text-white border-green-600 scale-105';
                } else if (option === selectedAnswer) {
                  cls += 'bg-red-500 text-white border-red-600';
                } else {
                  cls += 'bg-gray-100 text-gray-400 border-gray-200 opacity-60';
                }
                return (
                  <button
                    key={option}
                    onClick={() => !selectedAnswer && handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={cls}
                    style={{ fontFamily: 'var(--font-playful)', borderWidth: '3px' }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {isCorrect !== null && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`mt-6 p-4 rounded-2xl text-center font-bold ${isCorrect ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-red-50 text-red-700 border-2 border-red-200'}`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <p className="text-lg font-black mb-1">{isCorrect ? '🎉 ' + t.correct : '❌ ' + t.wrong}</p>
                <p className="text-sm">{question.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
