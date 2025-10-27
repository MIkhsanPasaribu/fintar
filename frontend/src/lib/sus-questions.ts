/**
 * Standard System Usability Scale (SUS) Questions
 * 10 pertanyaan standar dengan Likert scale 1-5
 * (1 = Strongly Disagree, 5 = Strongly Agree)
 */

export interface SUSQuestion {
  id: number;
  questionKey: keyof SUSResponses;
  questionEn: string;
  questionId: string;
  isPositive: boolean; // true = odd questions, false = even questions
}

export interface SUSResponses {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
}

export const SUS_QUESTIONS: SUSQuestion[] = [
  {
    id: 1,
    questionKey: "q1",
    questionEn: "I think that I would like to use this system frequently",
    questionId: "Saya ingin menggunakan sistem ini secara rutin",
    isPositive: true,
  },
  {
    id: 2,
    questionKey: "q2",
    questionEn: "I found the system unnecessarily complex",
    questionId: "Saya merasa sistem ini terlalu rumit tanpa alasan jelas",
    isPositive: false,
  },
  {
    id: 3,
    questionKey: "q3",
    questionEn: "I thought the system was easy to use",
    questionId: "Saya merasa sistem ini mudah digunakan",
    isPositive: true,
  },
  {
    id: 4,
    questionKey: "q4",
    questionEn:
      "I think that I would need the support of a technical person to be able to use this system",
    questionId:
      "Saya membutuhkan bantuan orang teknis untuk bisa menggunakan sistem ini",
    isPositive: false,
  },
  {
    id: 5,
    questionKey: "q5",
    questionEn:
      "I found the various functions in this system were well integrated",
    questionId:
      "Saya merasa berbagai fitur dalam sistem ini terintegrasi dengan baik",
    isPositive: true,
  },
  {
    id: 6,
    questionKey: "q6",
    questionEn: "I thought there was too much inconsistency in this system",
    questionId:
      "Saya merasa ada terlalu banyak ketidakkonsistenan dalam sistem ini",
    isPositive: false,
  },
  {
    id: 7,
    questionKey: "q7",
    questionEn:
      "I would imagine that most people would learn to use this system very quickly",
    questionId:
      "Saya yakin kebanyakan orang bisa belajar menggunakan sistem ini dengan cepat",
    isPositive: true,
  },
  {
    id: 8,
    questionKey: "q8",
    questionEn: "I found the system very cumbersome to use",
    questionId: "Saya merasa sistem ini sangat merepotkan untuk digunakan",
    isPositive: false,
  },
  {
    id: 9,
    questionKey: "q9",
    questionEn: "I felt very confident using the system",
    questionId: "Saya merasa sangat percaya diri menggunakan sistem ini",
    isPositive: true,
  },
  {
    id: 10,
    questionKey: "q10",
    questionEn:
      "I needed to learn a lot of things before I could get going with this system",
    questionId:
      "Saya perlu belajar banyak hal dulu sebelum bisa menggunakan sistem ini",
    isPositive: false,
  },
];

export const LIKERT_SCALE_LABELS = {
  1: "Sangat Tidak Setuju",
  2: "Tidak Setuju",
  3: "Netral",
  4: "Setuju",
  5: "Sangat Setuju",
};

export const LIKERT_SCALE_LABELS_EN = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree",
};

/**
 * Calculate SUS Score from responses
 * Same algorithm as backend for validation
 */
export function calculateSUSScore(responses: SUSResponses): number {
  // Odd questions (positive): score = response - 1
  const oddScore =
    responses.q1 -
    1 +
    (responses.q3 - 1) +
    (responses.q5 - 1) +
    (responses.q7 - 1) +
    (responses.q9 - 1);

  // Even questions (negative): score = 5 - response
  const evenScore =
    5 -
    responses.q2 +
    (5 - responses.q4) +
    (5 - responses.q6) +
    (5 - responses.q8) +
    (5 - responses.q10);

  // Total SUS score = sum × 2.5 (converts to 0-100 scale)
  const totalScore = (oddScore + evenScore) * 2.5;

  return Math.round(totalScore * 10) / 10;
}

/**
 * Get SUS grade based on score
 */
export function getSUSGrade(score: number): string {
  if (score >= 93) return "A+";
  if (score >= 86) return "A";
  if (score >= 79) return "B";
  if (score >= 69) return "C";
  if (score >= 51) return "D";
  return "F";
}

/**
 * Get grade color for visual display
 */
export function getSUSGradeColor(grade: string): string {
  switch (grade) {
    case "A+":
    case "A":
      return "text-green-600 bg-green-50 border-green-200";
    case "B":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "C":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "D":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "F":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

/**
 * Get grade description
 */
export function getSUSGradeDescription(grade: string): string {
  switch (grade) {
    case "A+":
      return "Excellent - Best Imaginable";
    case "A":
      return "Very Good - Excellent Usability";
    case "B":
      return "Good - Good Usability";
    case "C":
      return "Okay - Marginal Usability";
    case "D":
      return "Poor - Below Average";
    case "F":
      return "Awful - Worst Imaginable";
    default:
      return "";
  }
}
