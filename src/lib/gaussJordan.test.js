import { test, expect } from "vitest";
import { solveGaussJordan } from "./gaussJordan";

/**
 * 유일한 해를 가지는 연립 방정식 시스템을 해결하는 테스트입니다.
 */
test("유일한 해를 가지는 시스템을 해결한다.", () => {
  const matrix = [
    [2, 1, -1, 8],
    [-3, -1, 2, -11],
    [-2, 1, 2, -3],
  ];
  const result = solveGaussJordan(matrix);

  // 에러 메시지가 없고, 해가 올바르게 계산되는지 확인합니다.
  expect(result.errorMessage).toBeNull();
  expect(result.solution).toEqual([2, 3, -1]);
});

/**
 * 무수히 많은 해를 가지는 연립 방정식 시스템을 처리하는 테스트입니다.
 */
test("무수히 많은 해를 가지는 시스템을 처리한다.", () => {
  const matrix = [
    [1, 2, -1, 8],
    [2, 4, -2, 16],
    [-1, -2, 1, -8],
  ];
  const result = solveGaussJordan(matrix);

  // 자유 변수가 있는 경우의 에러 메시지를 확인합니다.
  expect(result.errorMessage).toBe(
    "The system has infinitely many solutions due to free variables."
  );

  // 결과에서 자유 변수가 몇 개인지 확인합니다.
  expect(result.solution.filter((x) => x === "free").length).toBe(2);
});

/**
 * 해가 존재하지 않는 연립 방정식 시스템을 감지하는 테스트입니다.
 */
test("해가 존재하지 않는 시스템을 감지한다.", () => {
  const matrix = [
    [1, -1, 2, 9],
    [2, -2, 4, 12],
    [3, -3, 6, -1],
  ];
  const result = solveGaussJordan(matrix);

  // 해가 없는 시스템의 에러 메시지를 확인합니다.
  expect(result.errorMessage).toBe("No solutions exist for this system.");
  expect(result.solution).toBeNull();
});

/**
 * 잘못된 입력이 주어졌을 때 예외를 발생시키는지 확인하는 테스트입니다.
 */
test("잘못된 입력에 대해 예외를 발생시킨다.", () => {
  // null 입력 시 예외가 발생하는지 확인합니다.
  expect(() => {
    solveGaussJordan(null);
  }).toThrow("Input must be a non-empty 2D array.");

  // 모든 행의 열 개수가 일치하지 않을 경우 예외가 발생하는지 확인합니다.
  expect(() => {
    solveGaussJordan([[1, 2], [3]]);
  }).toThrow("All rows must have the same number of columns.");
});
