<script>
import { Modal } from "bootstrap"

export default {
  name: "ModalDialog",

  props: {
    header: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      dialog: null
    }
  },

  mounted() {
    this.dialog = new Modal(this.$refs.modal);
  },

  methods: {
    show() {
      this.dialog.show();
    },

    hide() {
      this.dialog.hide();
    }
  }
}
</script>

<template>
  <div class="modal fade" ref="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modal_label">{{ header }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="modal_body" class="modal-body" v-html="message"></div>
        <div class="modal-footer">
          <button ref="abort_button" id="abort_button" type="button" class="btn btn-secondary"
                  data-bs-dismiss="modal">Нет
          </button>
          <button ref="confirm_button" id="confirm_button" type="button" class="btn btn-danger">Да</button>
        </div>
      </div>
    </div>
  </div>
</template>