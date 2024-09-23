import { test, expect } from "vitest";
import { solveGaussJordan } from "./gaussJordan";

test("유일한 해를 가지는 시스템을 해결한다.", () => {
  const matrix = [
    [2, 1, -1, 8],
    [-3, -1, 2, -11],
    [-2, 1, 2, -3],
  ];
  const result = solveGaussJordan(matrix);

  expect(result.errorMessage).toBeNull();
  expect(result.solution).toEqual([2, 3, -1]);
});

test("무수히 많은 해를 가지는 시스템을 처리한다.", () => {
  const matrix = [
    [1, 2, -1, 8],
    [2, 4, -2, 16],
    [-1, -2, 1, -8],
  ];
  const result = solveGaussJordan(matrix);

  expect(result.errorMessage).toBe(
    "The system has infinitely many solutions due to free variables."
  );

  // 이 경우에는 하나는 고정되고 나머지는 자유 변수로 표현된다.
  expect(result.solution.filter((x) => x === "free").length).toBe(2);
});

test("해가 존재하지 않는 시스템을 감지한다.", () => {
  const matrix = [
    [1, -1, 2, 9],
    [2, -2, 4, 12],
    [3, -3, 6, -1],
  ];
  const result = solveGaussJordan(matrix);

  expect(result.errorMessage).toBe("No solutions exist for this system.");
  expect(result.solution).toBeNull();
});

test("잘못된 입력에 대해 예외를 발생시킨다.", () => {
  expect(() => {
    solveGaussJordan(null);
  }).toThrow("Input must be a non-empty 2D array.");

  expect(() => {
    solveGaussJordan([[1, 2], [3]]);
  }).toThrow("All rows must have the same number of columns.");
});
