<script setup></script>

<template>
  <div class="app-container">
    <nav>
      <h1>Mathematica</h1>
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
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
