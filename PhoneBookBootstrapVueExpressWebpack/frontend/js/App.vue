<script>
import "bootstrap/dist/js/bootstrap.bundle";
import PhoneBookService from "./phonebookService";
import ContactForm from "./ContactForm.vue";
import SearchForm from "./SearchForm.vue";
import ContactList from "./ContactList.vue";
import ModalDialog from "./ModalDialog.vue";


export default {
  name: "App",

  components: {
    ContactForm,
    SearchForm,
    ContactList,
    ModalDialog
  },

  data() {
    return {
      contacts: [],
      name: "",
      family: "",
      phone: "",
      searchString: "",
      service: new PhoneBookService(),

      isEditingMode: false,
      editedContact: {},
      editedContactId: "",

      confirmModal: null,
      dialogTitle: "",
      dialogMessage: ""
    }
  },

  // Подгружаем контакты в момент создания компонента.
  created() {
    this.loadContacts();
  },

  mounted() {
    this.confirmModal = this.$refs.confirmModal;
  },

  methods: {
    onSubmitted(event) {
      const submitButton = event.submitter.name;

      if (submitButton === "add") {
        this.createContact();
      } else if (submitButton === "save") {
        // Просит .then()...
        this.saveContact();
      }
    },

    createContact() {
      const contact = {
        name: this.name,
        family: this.family,
        phone: this.phone
      };

      this.service.createContact(contact).then(response => {
        if (!response.success) {
          alert(response.message);
          return;
        }

        this.name = "";
        this.family = "";
        this.phone = "";

        this.loadContacts();
      }).catch(() => alert("Не удалось создать контакт."));
    },

    editContact(contact) {
      this.isEditingMode = true;
      this.editedContact = contact;
      this.editedContactId = contact.id;

      this.name = contact.name;
      this.family = contact.family;
      this.phone = contact.phone;
    },

    async saveContact() {
      this.dialogTitle = "Сохранить изменения?"
      this.dialogMessage = this.name + " " + this.family + "</br> Телефон: " + this.phone;

      const isDialogConfirmed = await this.showModalDialog(this.confirmModal);

      if (isDialogConfirmed) {
        this.confirmModal.hide();
        const contact = {
          name: this.name,
          family: this.family,
          phone: this.phone
        };

        this.service.saveContact(this.editedContactId, contact).then(response => {
          if (!response.success) {
            alert(response.message);
            return;
          }

          this.name = "";
          this.family = "";
          this.phone = "";
          this.isEditingMode = false;

          this.loadContacts();
        }).catch(() => alert("Не удалось сохранить контакт."));
      }
    },

    async deleteContact(contact) {
      this.dialogTitle = "Удалить контакт?"
      this.dialogMessage = contact.name + " " + contact.family + "</br> Телефон: " + contact.phone;

      const isDialogConfirmed = await this.showModalDialog(this.confirmModal);

      if (isDialogConfirmed) {
        this.confirmModal.hide();

        this.service.deleteContact(contact.id).then(response => {
          if (!response.success) {
            alert(response.message);
            return;
          }

          this.searchString = "";
          this.loadContacts();
        }).catch(() => alert("Не удалось удалить контакт."));
      }
    },

    // Передаем строку запроса, получаем контакты, в случае успеха кладем их в поле contacts [].
    loadContacts(searchString) {
      this.service.getContacts(searchString).then(contacts => {
        this.contacts = contacts;
      }).catch(() => alert("Не удалось загрузить контакты."));
    },

    showModalDialog(dialog) {
      return new Promise(function (resolve) {
        dialog.show();

        const confirmButton = document.getElementById("confirm_button");
        const abortButton = document.getElementById("abort_button");

        // onclick - выполняется единожды, поэтому удалять его после выполнения не надо.
        confirmButton.onclick = function () {
          resolve(true);
        };

        abortButton.onclick = function () {
          resolve(false);
        };
      });
    }
  }
}
</script>

<template>
  <div id="app" class="container my-2" v-cloak>
    <modal-dialog
        ref="confirmModal"
        :header="dialogTitle"
        :message="dialogMessage"
    />

    <h1>Телефонная книга</h1>

    <div v-if="!isEditingMode">
      <h2 class="h5">Добавить контакт</h2>
    </div>
    <div v-else>
      <h2 class="h5">Редактировать контакт</h2>
    </div>
    <contact-form
        @submitted="onSubmitted"
        :contacts
        :editedContact
        v-model:inputNameValue="name"
        v-model:inputFamilyValue="family"
        v-model:inputPhoneValue="phone"
        v-model:isEditingMode="isEditingMode"
    />

    <h2 class="h5">Поиск:</h2>
    <search-form
        @updateSearchString="loadContacts"
        v-model:inputSearchingStringValue="searchString"
    />

    <div class="table-responsive">
      <contacts-list
          :contacts
          @delete="deleteContact"
          @edit="editContact"
      />
    </div>
  </div>
</template>