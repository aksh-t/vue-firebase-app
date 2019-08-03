<template>
  <div class="chatView">
    <Chat />
  </div>
</template>

<script>
// @ is an alias to /src
import Chat from "@/components/Chat.vue";

export default {
  name: "chatView",
  components: {
    Chat
  }
};
</script>
