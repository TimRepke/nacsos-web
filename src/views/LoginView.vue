<template>
  <div class="wrapper">
    <NacsosLogo :width="200" class="position-absolute top-0 start-50 translate-middle-x mt-5"/>
    <div
      class="bg-body bg-opacity-75 rounded position-absolute top-50 start-50
             translate-middle p-5 col-lg-4 col-md-6 col-sm-8 col-12">
      <div class="form-floating mb-3">
        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating mb-3">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
        <label for="floatingPassword">Password</label>
      </div>
      <button type="button" class="btn btn-outline-dark w-100">LOGIN</button>
    </div>
    <div class="license">
      Picture:
      <a href="https://creativecommons.org/licenses/by/3.0" target="_blank">CC BY 3.0</a>
      (<a href="https://commons.wikimedia.org/wiki/File:Portara_Naxos_26.jpg" target="_blank">Olaf Tausch</a>)
    </div>
  </div>
</template>

<script>
import NacsosLogo from '@/components/NacsosLogo.vue';

export default {
  name: 'LoginView',
  components: { NacsosLogo },
};
</script>

<style scoped>
input {
  --bs-bg-opacity: 0.9;
}
.wrapper {
  background-image: url('@/assets/img/Portara_Naxos_26.jpg');
  height: 100vh;
  width: 100vw;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center
}

.license {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: #ffffff73;
  padding: 0.25rem;
  font-size: 0.7rem;
}
</style>
