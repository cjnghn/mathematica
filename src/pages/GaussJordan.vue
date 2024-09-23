<template>
  <div class="solver-container">
    <h2>Gauss-Jordan Method Solver</h2>
    <p>Enter the number of equations (n):</p>
    <div class="input-container">
      <label for="rows">Equations (n): </label>
      <input type="number" v-model.number="rows" min="1" />
      <button @click="createEquations">Create Equations</button>
      <button @click="fillExample">Fill Example</button>
    </div>

    <!-- 방정식 입력 영역 -->
    <div v-if="equations.length > 0">
      <h3>Enter the coefficients for each equation:</h3>
      <div class="equation-inputs">
        <div v-for="(equation, i) in equations" :key="i" class="equation-row">
          <span>Equation {{ i + 1 }}:</span>
          <div class="coefficients">
            <input
              v-for="(coef, j) in equation.coefficients"
              :key="j"
              v-model.number="equations[i].coefficients[j]"
              type="number"
              placeholder="a{{j+1}}"
            />
            <span>=</span>
            <input
              v-model.number="equations[i].constant"
              type="number"
              placeholder="b"
            />
          </div>
        </div>
      </div>
      <button @click="solveEquations">Solve</button>
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
    <div v-if="solution && solution.length > 0 && !errorMessage">
      <h3>Solution:</h3>
      <div v-for="(sol, index) in solution" :key="index" class="solution">
        x{{ index + 1 }} = {{ sol !== "free" ? sol.toFixed(2) : "free" }}
      </div>
    </div>
  </div>
</template>

<script>
import { solveGaussJordan } from "../lib/gaussJordan";

export default {
  data() {
    return {
      rows: 3, // 기본 방정식의 수
      equations: [], // 방정식 입력을 위한 배열
      steps: [],
      currentStep: 0,
      errorMessage: "",
      solution: [],
    };
  },
  methods: {
    // 방정식 생성 함수
    createEquations() {
      this.equations = Array.from({ length: this.rows }, () => ({
        coefficients: Array(this.rows).fill(0),
        constant: 0,
      }));
      this.steps = [];
      this.currentStep = 0;
      this.errorMessage = "";
      this.solution = [];
    },

    // 예제 입력 함수
    fillExample() {
      this.rows = 3;
      this.equations = [
        { coefficients: [2, 1, -1], constant: 8 },
        { coefficients: [-3, -1, 2], constant: -11 },
        { coefficients: [-2, 1, 2], constant: -3 },
      ];
    },

    // 방정식을 풀기 위해 행렬로 변환하고 Gauss-Jordan 적용
    solveEquations() {
      try {
        // 입력된 방정식을 행렬로 변환
        const matrix = this.equations.map((eq) => [
          ...eq.coefficients,
          eq.constant,
        ]);

        const result = solveGaussJordan(matrix);
        this.steps = result.steps;
        this.solution = result.solution;
        this.errorMessage = result.errorMessage;
        this.currentStep = 0;
      } catch (error) {
        // 예기치 않은 오류 처리
        this.errorMessage = error.message;
        this.steps = [];
        this.solution = [];
        this.currentStep = 0;
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

<style>
.solver-container {
  max-width: 700px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.input-container {
  margin-bottom: 20px;
}

.equation-inputs {
  margin-bottom: 20px;
}

.equation-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.coefficients {
  display: flex;
  align-items: center;
}

.coefficients input {
  width: 60px;
  margin: 0 5px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.coefficients span {
  margin: 0 5px;
  font-weight: bold;
}

.matrix-table {
  margin: 20px auto;
  border-collapse: collapse;
}

.matrix-table td {
  border: 1px solid #ccc;
  padding: 8px;
  width: 60px;
  text-align: center;
}

.error-message {
  color: red;
  margin-top: 20px;
}

.solution {
  margin-bottom: 5px;
  color: #333;
}

button {
  padding: 8px 16px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}

h2,
h3 {
  color: #333;
}

p {
  font-size: 1em;
  color: #555;
}
</style>
