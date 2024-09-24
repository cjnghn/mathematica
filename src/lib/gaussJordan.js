const EPSILON = 1e-10;

/**
 * 입력 행렬의 유효성을 검사합니다.
 * @param {number[][]} matrix 검사할 행렬
 * @throws {Error} 유효하지 않은 행렬일 경우 오류를 던집니다.
 */
function validateInput(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new Error("Input must be a non-empty 2D array.");
  }
  const columnCount = matrix[0].length;
  if (
    !matrix.every((row) => Array.isArray(row) && row.length === columnCount)
  ) {
    throw new Error("All rows must have the same number of columns.");
  }
}

/**
 * 값이 거의 0에 가까운지 확인합니다.
 * @param {number} value 검사할 값
 * @returns {boolean} 값이 0에 가까우면 true, 그렇지 않으면 false를 반환합니다.
 */
function isApproximatelyZero(value) {
  return Math.abs(value) < EPSILON;
}

/**
 * 현재 행렬 상태와 작업을 기록하여 스냅샷을 저장합니다.
 * @param {Object[]} stepSnapshots 스냅샷을 저장할 배열
 * @param {number[][]} matrix 현재 상태의 행렬
 * @param {string} action 수행된 작업에 대한 설명
 */
function recordStepSnapshot(stepSnapshots, matrix, action) {
  stepSnapshots.push({
    matrix: JSON.parse(JSON.stringify(matrix)),
    action,
  });
}

/**
 * 두 행을 교환합니다.
 * @param {number[][]} matrix 교환할 행이 포함된 행렬
 * @param {number} row1 교환할 첫 번째 행의 인덱스
 * @param {number} row2 교환할 두 번째 행의 인덱스
 */
function swapRows(matrix, row1, row2) {
  [matrix[row1], matrix[row2]] = [matrix[row2], matrix[row1]];
}

/**
 * 가우스-조던 소거법을 사용하여 연립 방정식을 풉니다.
 * @param {number[][]} matrixInput 연립 방정식을 표현한 2차원 배열
 * @returns {{steps: Object[], solution: (number[]|null), errorMessage: (string|null)}} 단계별 스냅샷, 해, 오류 메시지를 포함한 객체를 반환합니다.
 */
export function solveGaussJordan(matrixInput) {
  validateInput(matrixInput);

  const matrix = JSON.parse(JSON.stringify(matrixInput));
  const stepSnapshots = [];
  const pivotColumns = new Set();

  const n = matrix.length;
  const m = matrix[0].length;

  for (let i = 0; i < n && i < m - 1; i++) {
    let pivotRow = i;

    while (pivotRow < n && isApproximatelyZero(matrix[pivotRow][i])) {
      pivotRow++;
    }

    if (pivotRow === n) continue;

    if (pivotRow !== i) {
      swapRows(matrix, i, pivotRow);
      recordStepSnapshot(
        stepSnapshots,
        matrix,
        `Row ${i + 1} and Row ${pivotRow + 1} swapped.`
      );
    }

    let pivot = matrix[i][i];
    if (!isApproximatelyZero(pivot)) {
      for (let j = i; j < m; j++) {
        matrix[i][j] /= pivot;
      }
      recordStepSnapshot(
        stepSnapshots,
        matrix,
        `Row ${i + 1} divided by ${pivot.toFixed(4)} to make leading 1.`
      );
    }

    pivotColumns.add(i);

    for (let k = 0; k < n; k++) {
      if (k !== i && !isApproximatelyZero(matrix[k][i])) {
        let factor = matrix[k][i];
        for (let j = i; j < m; j++) {
          matrix[k][j] -= factor * matrix[i][j];
        }
        recordStepSnapshot(
          stepSnapshots,
          matrix,
          `Row ${k + 1} updated to eliminate variable x${
            i + 1
          } (multiplied by ${factor.toFixed(4)}).`
        );
      }
    }
  }

  let errorMessage = null;
  const solution = calculateSolution(matrix, n, m, pivotColumns);

  // 해가 존재하지 않는 경우에 대한 처리
  for (let i = 0; i < n; i++) {
    const allZero = matrix[i].slice(0, -1).every(isApproximatelyZero);
    if (allZero && !isApproximatelyZero(matrix[i][m - 1])) {
      errorMessage = "No solutions exist for this system.";
      return { steps: stepSnapshots, solution: null, errorMessage };
    }
  }

  if (solution.freeVariables.length > 0) {
    errorMessage =
      "The system has infinitely many solutions due to free variables.";
  }

  return { steps: stepSnapshots, solution: solution.values, errorMessage };
}

/**
 * 기약행사다리꼴 형태로 변환된 행렬에서 해를 계산합니다.
 * 이 함수는 주어진 행렬이 기약행사다리꼴(RREF) 형태라고 가정합니다.
 *
 * @param {number[][]} matrix 해를 계산할 기약행사다리꼴(RREF) 행렬
 * @param {number} n 행의 수
 * @param {number} m 열의 수
 * @param {Set<number>} pivotColumns 피벗 열의 인덱스를 포함하는 Set
 * @returns {{values: (number[]|null), freeVariables: number[]}} 해와 자유 변수를 포함한 객체를 반환합니다.
 *  null인 values는 해가 없음을 의미합니다.
 */
function calculateSolution(matrix, n, m, pivotColumns) {
  const solution = new Array(m - 1).fill(null);
  const freeVariables = [];

  // 해가 존재하지 않는 경우 감지
  for (let i = 0; i < n; i++) {
    const allZero = matrix[i].slice(0, -1).every(isApproximatelyZero);
    if (allZero && !isApproximatelyZero(matrix[i][m - 1])) {
      return { values: null, freeVariables: [] };
    }
  }

  // 자유 변수 및 해 계산
  for (let j = 0; j < m - 1; j++) {
    if (!pivotColumns.has(j)) {
      // 해당 열에서 피벗이 존재하지 않는 경우
      freeVariables.push(j);
      solution[j] = "free";
    } else {
      // 해당 열에서 피벗이 존재하는 경우
      const pivotRow = matrix.findIndex((row) => !isApproximatelyZero(row[j]));
      if (pivotRow !== -1) {
        solution[j] = matrix[pivotRow][m - 1];
      }
    }
  }

  return { values: solution, freeVariables };
}
