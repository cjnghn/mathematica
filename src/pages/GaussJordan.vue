<template>
  <div class="solver-container">
    <h2>Gauss-Jordan Method Solver</h2>
    <p>Enter the size of the matrix (n x m):</p>
    <div class="input-container">
      <label for="rows">Rows (n): </label>
      <input type="number" v-model="rows" min="1" />
      <label for="cols">Columns (m): </label>
      <input type="number" v-model="cols" min="1" />
      <button @click="createMatrix">Create Matrix</button>
    </div>

    <!-- 행렬 입력 영역 -->
    <div v-if="matrix.length > 0">
      <h3>Matrix (n x m)</h3>
      <table class="matrix-table">
        <tr v-for="(row, i) in matrix" :key="i">
          <td v-for="(cell, j) in row" :key="j">
            <input v-model.number="matrix[i][j]" type="number" />
          </td>
        </tr>
      </table>
      <button @click="solveGaussJordan">Solve</button>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="errorMessage" class="error-message">
      <h3>Error: {{ errorMessage }}</h3>
    </div>

    <!-- 스텝별 설명과 결과 -->
    <div v-if="steps.length > 0">
      <h3>Step {{ currentStep + 1 }} of {{ steps.length }}</h3>
      <p>{{ steps[currentStep].action }}</p>
      <table class="matrix-table">
        <tr v-for="(row, i) in steps[currentStep].matrix" :key="i">
          <td v-for="(cell, j) in row" :key="j">{{ cell.toFixed(2) }}</td>
        </tr>
      </table>
      <button @click="prevStep" :disabled="currentStep === 0">Previous</button>
      <button @click="nextStep" :disabled="currentStep === steps.length - 1">
        Next
      </button>
    </div>

    <!-- 해 결과 -->
    <div v-if="solution && solution.length > 0">
      <h3>Solution:</h3>
      <div v-for="(sol, index) in solution" :key="index" class="solution">
        x{{ index + 1 }} = {{ sol !== "free" ? sol.toFixed(2) : "free" }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rows: 3, // 기본 행의 수
      cols: 4, // 기본 열의 수
      matrix: [],
      steps: [],
      currentStep: 0,
      errorMessage: "", // 에러 메시지 저장
      solution: [], // 최종 해 저장
    };
  },
  methods: {
    // 행렬 생성 함수
    createMatrix() {
      this.matrix = Array.from({ length: this.rows }, () =>
        Array(this.cols).fill(0)
      );
      this.steps = [];
      this.currentStep = 0;
      this.errorMessage = ""; // 에러 메시지 초기화
      this.solution = []; // 해 초기화
    },

    // 가우스-조던 소거법을 통해 행렬 풀기
    solveGaussJordan() {
      let matrix = JSON.parse(JSON.stringify(this.matrix)); // 행렬 복사
      let n = matrix.length;
      let m = matrix[0].length;

      let stepSnapshots = [];
      let freeVariables = new Set(); // 자유 변수 추적

      // 수치 정확도를 위해 0에 가까운 수는 0으로 처리
      const isZero = (value) => Math.abs(value) < 1e-10;

      // 상태 저장 함수: 현재 행렬 상태와 수행된 작업을 저장
      const saveStep = (action) => {
        stepSnapshots.push({
          matrix: JSON.parse(JSON.stringify(matrix)),
          action: action,
        });
      };

      for (let i = 0; i < n; i++) {
        // 대각선 원소를 0이 아닌 값으로 만들어야 함
        if (isZero(matrix[i][i])) {
          // 0이면 아래쪽 행과 교환 시도
          let found = false;
          for (let k = i + 1; k < n; k++) {
            if (!isZero(matrix[k][i])) {
              [matrix[i], matrix[k]] = [matrix[k], matrix[i]]; // 행 교환
              found = true;
              saveStep(`Row ${i + 1} and Row ${k + 1} swapped.`);
              break;
            }
          }
          if (!found) {
            // 대각선 원소가 0이면 해당 변수가 자유 변수임
            freeVariables.add(i);
            saveStep(`Variable x${i + 1} is a free variable.`);
            continue;
          }
        }

        // 대각선 원소를 1로 만들기
        let divisor = matrix[i][i];
        if (!isZero(divisor)) {
          for (let j = 0; j < m; j++) {
            matrix[i][j] /= divisor;
          }
          saveStep(
            `Row ${i + 1} divided by ${divisor.toFixed(2)} to make leading 1.`
          );
        }

        // 다른 행들의 i번째 열을 0으로 만듦
        for (let k = 0; k < n; k++) {
          if (k !== i && !isZero(matrix[k][i])) {
            let factor = matrix[k][i];
            for (let j = 0; j < m; j++) {
              matrix[k][j] -= factor * matrix[i][j];
            }
            saveStep(
              `Row ${k + 1} updated to eliminate variable x${
                i + 1
              } (multiplied by ${factor.toFixed(2)}).`
            );
          }
        }
      }

      this.steps = stepSnapshots; // 최종 스텝 저장
      this.currentStep = 0;

      // 해가 무수히 많은 경우 또는 유일한 해를 처리
      this.solution = [];
      for (let i = 0; i < n; i++) {
        if (freeVariables.has(i)) {
          this.solution.push("free"); // 자유 변수
        } else if (isZero(matrix[i][i])) {
          // 해가 없는 경우를 처리
          if (!isZero(matrix[i][m - 1])) {
            this.errorMessage = "No solutions exist for this system.";
            return;
          }
        } else {
          this.solution.push(matrix[i][m - 1]); // 유일한 해
        }
      }
      if (freeVariables.size > 0) {
        this.errorMessage =
          "The system has infinitely many solutions due to free variables.";
      }
    },

    // 이전 스텝 보기
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },

    // 다음 스텝 보기
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    },
  },
};
</script>
