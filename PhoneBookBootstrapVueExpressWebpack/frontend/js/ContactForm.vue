<script>
export default {
  name: "ContactForm",

  props: {
    inputNameValue: String,
    inputPhoneValue: String,
    inputFamilyValue: String,

    isEditingMode: Boolean,
    contacts: Array,
    editedContact: {}
  },

  data() {
    return {
      isFormSubmitted: false,
      invalidNameMessage: "Введите имя",
      invalidFamilyMessage: "Введите фамилию",
      invalidPhoneMessage: "Введите телефон"
    }
  },

  computed: {
    inputNameClass() {
      return this.getTextInputClass(this.inputNameValue);
    },

    inputFamilyClass() {
      return this.getTextInputClass(this.inputFamilyValue);
    },

    inputPhoneClass() {
      return this.getPhoneInputClass(this.inputPhoneValue);
    }
  },

  methods: {
    onSubmit(event) {
      this.isFormSubmitted = true;

      if (this.inputNameClass === "is-valid" &&
          this.inputFamilyClass === "is-valid" &&
          this.inputPhoneClass === "is-valid") {
        this.$emit("submitted", event);
        this.isFormSubmitted = false;
      }
    },

    updateName(event) {
      this.$emit("update:inputNameValue", event.target.value);
    },

    updateFamily(event) {
      this.$emit("update:inputFamilyValue", event.target.value);
    },

    updatePhone(event) {
      this.$emit("update:inputPhoneValue", event.target.value);
    },

    getTextInputClass(inputValue) {
      if (this.isFormSubmitted) {
        return inputValue.trim() !== "" ? "is-valid" : "is-invalid";
      }

      return "";
    },

    getPhoneInputClass(inputValue) {
      if (this.isFormSubmitted) {
        if (this.isPhoneAlreadyExist(inputValue) && this.editedContact.phone !== inputValue) {
          this.invalidPhoneMessage = "Такой телефон уже есть"
          return "is-invalid";
        }

        this.invalidPhoneMessage = "Введите телефон."
        return inputValue.trim() !== "" ? "is-valid" : "is-invalid";
      }

      return "";
    },

    isPhoneAlreadyExist(phone) {
      return this.contacts.find(contact => contact.phone.trim() === phone);
    },

    clearContactForm() {
      this.$emit("update:inputNameValue", "");
      this.$emit("update:inputFamilyValue", "");
      this.$emit("update:inputPhoneValue", "");
      this.$emit("update:isEditingMode", false);
      this.isFormSubmitted = false;
    }
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="mb-3">
    <div class="row">
      <div class="col-md-3">
        <input id="name" type="text" class="form-control" placeholder="Имя"
               @input="updateName"
               :value="inputNameValue"
               :class="inputNameClass"
        />
        <div class="invalid-feedback" v-text="invalidNameMessage"></div>
      </div>
      <div class="col-md-3">
        <input id="family" type="text" class="form-control" placeholder="Фамилия"
               @input="updateFamily"
               :value="inputFamilyValue"
               :class="inputFamilyClass"
        />
        <div class="invalid-feedback" v-text="invalidFamilyMessage"></div>
      </div>
      <div class="col-md-3">
        <input id="phone" type="text" class="form-control" placeholder="Телефон"
               @input="updatePhone"
               :value="inputPhoneValue"
               :class="inputPhoneClass"
        />
        <div class="invalid-feedback" v-text="invalidPhoneMessage"></div>
      </div>
      <div v-if="!isEditingMode" class="col-md-3">
        <div v-if="this.inputNameValue.trim().length !== 0 ||
                           this.inputFamilyValue.trim().length !== 0 ||
                           this.inputPhoneValue.trim().length !== 0 ||
                           this.isFormSubmitted">
          <button type="button" class="btn btn-secondary me-1" @click="clearContactForm">Отмена</button>
          <button name="add" class="btn btn-primary">Создать</button>
        </div>
        <div v-else>
          <button name="add" class="btn btn-primary">Создать</button>
        </div>
      </div>
      <div v-else class="col-md-3">
        <div v-if="this.inputNameValue.trim().length !== 0 ||
                           this.inputFamilyValue.trim().length !== 0 ||
                           this.inputPhoneValue.trim().length !== 0 ||
                           this.isFormSubmitted">
          <button type="button" class="btn btn-secondary me-1" @click="clearContactForm">Отмена</button>
          <button name="save" class="btn btn-primary">Сохранить</button>
        </div>
        <div v-else>
          <button name="save" class="btn btn-primary">Сохранить</button>
        </div>
      </div>
    </div>
  </form>
</template>