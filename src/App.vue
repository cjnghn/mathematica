<template>
  <div class="app-container">
    <!-- 사이드 네비게이션 -->
    <nav class="sidebar">
      <h2>Tools</h2>
      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/gauss-jordan">Gauss-Jordan Solver</router-link>
        </li>
      </ul>
    </nav>

    <!-- 메인 콘텐츠 -->
    <div class="main-content">
      <!-- 현재 라우터에 의해 선택된 페이지를 로드 -->
      <router-view />
    </div>

    <!-- 푸터 -->
    <footer>
      <!-- github 레포지토리 -->
      <a
        href="https://github.com/cjnghn/mathematica"
        target="_blank"
        rel="noopener noreferrer"
        >GitHub Repository</a
      >
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
