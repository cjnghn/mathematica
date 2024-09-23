// 피벗(Pivot): 각 행에서 가장 왼쪽에 위치한 0이 아닌 원소를 피벗이라고 합니다.

export function solveGaussJordan(matrixInput) {
  if (!Array.isArray(matrixInput) || matrixInput.length === 0) {
    throw new Error("Input must be a non-empty 2D array.");
  }

  /** @type {number[][]} */
  let matrix = JSON.parse(JSON.stringify(matrixInput));

  let n = matrix.length;
  let m = matrix[0].length;

  if (!matrix.every((row) => Array.isArray(row) && row.length === m)) {
    throw new Error("All rows must have the same number of columns.");
  }

  let stepSnapshots = [];
  let pivotColumns = new Set();

  const isZero = (value) => Math.abs(value) < 1e-10;

  const saveStep = (action) => {
    stepSnapshots.push({
      matrix: JSON.parse(JSON.stringify(matrix)),
      action: action,
    });
  };

  for (let i = 0; i < n && i < m - 1; i++) {
    let pivotRow = i;

    // 피봇이 0인 경우, 피봇이 0이 아닌 행을 찾아서 피봇으로 설정
    // 피봇은 리딩 1을 만들기 위한 값
    while (pivotRow < n && isZero(matrix[pivotRow][i])) {
      pivotRow++;
    }

    if (pivotRow === n) {
      continue;
    }

    if (pivotRow !== i) {
      [matrix[i], matrix[pivotRow]] = [matrix[pivotRow], matrix[i]];
      saveStep(`Row ${i + 1} and Row ${pivotRow + 1} swapped.`);
    }

    let pivot = matrix[i][i];
    if (!isZero(pivot)) {
      for (let j = i; j < m; j++) {
        matrix[i][j] /= pivot;
      }
      saveStep(
        `Row ${i + 1} divided by ${pivot.toFixed(4)} to make leading 1.`
      );
    }

    pivotColumns.add(i);

    for (let k = 0; k < n; k++) {
      if (k !== i && !isZero(matrix[k][i])) {
        let factor = matrix[k][i];
        for (let j = i; j < m; j++) {
          matrix[k][j] -= factor * matrix[i][j];
        }
        saveStep(
          `Row ${k + 1} updated to eliminate variable x${
            i + 1
          } (multiplied by ${factor.toFixed(4)}).`
        );
      }
    }
  }

  let errorMessage = null;
  let solution = new Array(m - 1).fill(null);

  for (let i = 0; i < n; i++) {
    let allZero = matrix[i].slice(0, -1).every(isZero);
    // 상수항은 0이 아닌데 계수항이 모두 0인 경우 == 해가 존재하지 않는 경우
    if (allZero && !isZero(matrix[i][m - 1])) {
      errorMessage = "No solutions exist for this system.";
      return { steps: stepSnapshots, solution: null, errorMessage };
    }
  }

  // 자유 변수 판단하는 법
  // : 피봇이 있는 열이 아닌 열은 자유 변수
  let freeVariables = [];
  for (let j = 0; j < m - 1; j++) {
    if (!pivotColumns.has(j)) {
      freeVariables.push(j);
      solution[j] = "free";
    } else {
      let pivotRow = matrix.findIndex((row) => !isZero(row[j]));
      if (pivotRow !== -1) {
        solution[j] = matrix[pivotRow][m - 1];
      }
    }
  }

  if (freeVariables.length > 0) {
    errorMessage =
      "The system has infinitely many solutions due to free variables.";
  }

  return { steps: stepSnapshots, solution, errorMessage };
}
