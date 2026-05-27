<script setup>

</script>

<template>
  <footer>
    <div class="footer-left">
      <p>Time-Clipboard, Hackathon 2026</p>
    </div>
    <div class="footer-right">
      <a href="https://www.hs-harz.de/datenschutzerklaerung">Datenschutz</a>
      <a href="https://www.hs-harz.de/impressum">Impressum</a>
    </div>
  </footer>
</template>

<style scoped>
  footer {
    width: 100%;
    height: 1rem;
    padding: 2rem;
    box-sizing: border-box;

    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-left, .footer-right {
    gap: 2rem;
    display: flex;
    align-items: center;
  }
</style>